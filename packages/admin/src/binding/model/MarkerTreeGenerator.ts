import { BranchNode, ChildrenAnalyzer, Leaf, RawNodeRepresentation } from '@contember/react-multipass-rendering'
import { assertNever } from '@contember/utils'
import * as React from 'react'
import { MarkerProvider } from '../coreComponents'
import { DataBindingError, Environment } from '../dao'
import { ConnectionMarker, EntityFields, FieldMarker, Marker, MarkerTreeRoot, ReferenceMarker } from '../markers'
import { FieldName } from '../treeParameters'
import { Hashing } from '../utils'

type Fragment = EntityFields
type Terminals = FieldMarker | ConnectionMarker | Fragment
type Nonterminals = MarkerTreeRoot | ReferenceMarker | Fragment

type NodeResult = Terminals | Nonterminals
type DataMarker = MarkerProvider &
	(React.ComponentClass<unknown> | React.FunctionComponent<unknown> | React.NamedExoticComponent<unknown>)

export class MarkerTreeGenerator {
	private static childrenAnalyzer = MarkerTreeGenerator.initializeChildrenAnalyzer()

	public constructor(private sourceTree: React.ReactNode, private environment: Environment = Environment.create()) {}

	public generate(): MarkerTreeRoot {
		const processed = MarkerTreeGenerator.childrenAnalyzer.processChildren(this.sourceTree, this.environment)

		if (processed.length === 1) {
			const result = processed[0]

			if (result instanceof MarkerTreeRoot) {
				return result
			}
		}

		return this.reportInvalidTreeError(processed)
	}

	private static mapNodeResultToEntityFields(result: RawNodeRepresentation<Terminals, Nonterminals>): EntityFields {
		const fields: EntityFields = {}

		if (!result) {
			return fields
		}

		if (!Array.isArray(result)) {
			result = [result]
		}

		for (const marker of result) {
			if (
				marker instanceof FieldMarker ||
				marker instanceof ReferenceMarker ||
				marker instanceof ConnectionMarker ||
				marker instanceof MarkerTreeRoot
			) {
				const placeholderName = marker.placeholderName

				fields[placeholderName] =
					placeholderName in fields ? MarkerTreeGenerator.mergeMarkers(fields[placeholderName], marker) : marker
			} else {
				for (const placeholderName in marker) {
					fields[placeholderName] =
						placeholderName in fields
							? MarkerTreeGenerator.mergeMarkers(fields[placeholderName], marker[placeholderName])
							: marker[placeholderName]
				}
			}
		}

		return fields
	}

	// This method assumes their placeholder names are the same
	private static mergeMarkers(original: Marker, fresh: Marker): Marker {
		if (original instanceof FieldMarker) {
			if (fresh instanceof FieldMarker) {
				return original
			} else if (fresh instanceof ReferenceMarker) {
				return MarkerTreeGenerator.rejectRelationScalarCombo(original.fieldName)
			} else if (fresh instanceof MarkerTreeRoot) {
				throw new DataBindingError('Merging fields and tree roots is an undefined operation.')
			} else if (fresh instanceof ConnectionMarker) {
				return MarkerTreeGenerator.rejectConnectionMarkerCombo(fresh)
			}
			assertNever(fresh)
		} else if (original instanceof ReferenceMarker) {
			if (fresh instanceof FieldMarker) {
				return MarkerTreeGenerator.rejectRelationScalarCombo(original.fieldName)
			} else if (fresh instanceof ReferenceMarker) {
				const newReferences = { ...original.references }
				for (const placeholderName in fresh.references) {
					const namePresentInOriginal = placeholderName in newReferences

					if (!namePresentInOriginal) {
						newReferences[placeholderName] = {
							placeholderName,
							fields: {},
							filter: fresh.references[placeholderName].filter,
							reducedBy: fresh.references[placeholderName].reducedBy,
							expectedCount: fresh.references[placeholderName].expectedCount,
							preferences: fresh.references[placeholderName].preferences,
						}
					}

					// TODO what to do with preferences?
					newReferences[placeholderName].fields = namePresentInOriginal
						? MarkerTreeGenerator.mergeEntityFields(
								newReferences[placeholderName].fields,
								fresh.references[placeholderName].fields,
						  )
						: fresh.references[placeholderName].fields
				}
				return new ReferenceMarker(original.fieldName, newReferences)
			} else if (fresh instanceof ConnectionMarker) {
				return MarkerTreeGenerator.rejectConnectionMarkerCombo(fresh)
			} else if (fresh instanceof MarkerTreeRoot) {
				throw new DataBindingError('MarkerTreeGenerator merging: error code bb') // TODO msg
			}
			assertNever(fresh)
		} else if (original instanceof ConnectionMarker) {
			if (
				fresh instanceof ConnectionMarker &&
				fresh.fieldName === original.fieldName &&
				JSON.stringify(fresh.target) === JSON.stringify(original.target)
			) {
				return original
			}
			return MarkerTreeGenerator.rejectConnectionMarkerCombo(original)
		} else if (original instanceof MarkerTreeRoot) {
			if (fresh instanceof MarkerTreeRoot) {
				if (
					Hashing.hashMarkerTreeParameters(original.parameters) === Hashing.hashMarkerTreeParameters(fresh.parameters)
				) {
					return original
				}
				throw new DataBindingError('MarkerTreeGenerator merging: error code cc') // TODO msg
			} else {
				throw new DataBindingError('MarkerTreeGenerator merging: error code aa') // TODO msg
			}
		}
		assertNever(original)
	}

	private static mergeEntityFields(original: EntityFields, fresh: EntityFields): EntityFields {
		for (const placeholderName in fresh) {
			original[placeholderName] =
				placeholderName in original
					? MarkerTreeGenerator.mergeMarkers(original[placeholderName], fresh[placeholderName])
					: fresh[placeholderName]
		}
		return original
	}

	private reportInvalidTreeError(markers: NodeResult[]): never {
		if (markers.length) {
			if (markers.length > 1) {
				throw new DataBindingError(`Multi-root data trees are not supported.`) // TODO this is planned to chane
			}
			const marker = markers[0]

			const kind =
				marker instanceof FieldMarker ? 'field' : marker instanceof ReferenceMarker ? 'relation' : 'connection'

			throw new DataBindingError(
				`Top-level ${kind} discovered. Any repeaters or similar components need to be used from within a data provider.`,
			)
		}
		throw new DataBindingError('Empty data tree discovered. Try adding some fields…')
	}

	private static rejectRelationScalarCombo(fieldName: FieldName): never {
		throw new DataBindingError(`Cannot combine a relation with a scalar field '${fieldName}'.`)
	}

	private static rejectConnectionMarkerCombo(connectionMarker: ConnectionMarker): never {
		throw new DataBindingError(
			`Attempting to combine a connection reference for field '${connectionMarker.fieldName}'.`,
		)
	}

	private static initializeChildrenAnalyzer(): ChildrenAnalyzer<Terminals, Nonterminals, Environment> {
		const fieldMarkerLeaf = new Leaf<Environment>('generateFieldMarker')
		const connectionMarkerLeaf = new Leaf<Environment>('generateConnectionMarker')

		const markerTreeRootBranchNode = new BranchNode<Environment>(
			'generateMarkerTreeRoot',
			MarkerTreeGenerator.mapNodeResultToEntityFields,
			{
				childrenAbsentErrorMessage: 'All data providers must have children',
			},
		)

		const referenceMarkerBranchNode = new BranchNode<Environment>(
			'generateReferenceMarker',
			MarkerTreeGenerator.mapNodeResultToEntityFields,
			{
				childrenAbsentErrorMessage: 'All references must have children',
			},
		)

		return new ChildrenAnalyzer(
			[fieldMarkerLeaf, connectionMarkerLeaf],
			[markerTreeRootBranchNode, referenceMarkerBranchNode],
			{
				syntheticChildrenFactoryName: 'generateSyntheticChildren',
				renderPropsErrorMessage:
					`Render props (functions as React component children) are not supported within the schema. ` +
					`You have likely used a bare custom component as opposed to wrapping in with \`Component\` ` +
					`from the \`@contember/admin\` package. Please refer to the documentation.`,
				ignoreRenderProps: false,
				environmentFactoryName: 'generateEnvironment',
			},
		)
	}
}