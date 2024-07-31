import type { ElementType } from 'react'
import { ChildrenAnalyzerError } from '../ChildrenAnalyzerError'
import type { BranchNodeOptions } from './BranchNodeOptions'
import type { ChildrenRepresentationReducer, UseSiteBranchNodeRepresentationFactory, ValidFactoryName } from './types'

class BranchNode<
	Props extends {} = {},
	StaticContext = undefined,
	FactoryMethodName extends ValidFactoryName = string,
	ChildrenRepresentation = any,
	ReducedChildrenRepresentation = any,
	Representation = any,
> {
	private static defaultOptions: BranchNodeOptions = {
		childrenAreOptional: false,
		childrenAbsentErrorMessage: 'Component must have children!',
	}

	public readonly specification: BranchNode.Specification<
		Props,
		StaticContext,
		FactoryMethodName,
		ChildrenRepresentation,
		ReducedChildrenRepresentation,
		Representation
	>

	public readonly options: BranchNodeOptions

	public constructor(
		factoryMethodName: FactoryMethodName,
		childrenRepresentationReducer: ChildrenRepresentationReducer<ChildrenRepresentation, ReducedChildrenRepresentation>,
		options?: Partial<BranchNodeOptions>,
	)
	public constructor(
		useSiteFactory: UseSiteBranchNodeRepresentationFactory<
			Props,
			ChildrenRepresentation,
			Representation,
			StaticContext
		>,
		ComponentType?: ElementType<Props>,
		options?: Partial<BranchNodeOptions>,
	)
	public constructor(
		factory:
			| FactoryMethodName
			| UseSiteBranchNodeRepresentationFactory<Props, ChildrenRepresentation, Representation, StaticContext>,
		componentOrReducer?:
			| ChildrenRepresentationReducer<ChildrenRepresentation, ReducedChildrenRepresentation>
			| ElementType<Props>,
		options?: Partial<BranchNodeOptions>,
	) {
		if (typeof factory !== 'function') {
			this.specification = {
				type: 'declarationSite',
				factoryMethodName: factory,
				childrenRepresentationReducer: componentOrReducer as ChildrenRepresentationReducer<
					ChildrenRepresentation,
					ReducedChildrenRepresentation
				>,
			}
		} else if (typeof factory === 'function') {
			this.specification = {
				type: 'useSite',
				factory,
				ComponentType: componentOrReducer as ElementType<Props>,
			}
		} else {
			throw new ChildrenAnalyzerError('Invalid arguments')
		}
		this.options = {
			...BranchNode.defaultOptions,
			...options,
		}
	}
}

namespace BranchNode {
	export type Specification<
		Props extends {} = {},
		StaticContext = any,
		FactoryMethodName extends ValidFactoryName = string,
		ChildrenRepresentation = any,
		ReducedChildrenRepresentation = any,
		Representation = any,
	> =
		| {
			type: 'declarationSite'
			factoryMethodName: FactoryMethodName
			childrenRepresentationReducer: ChildrenRepresentationReducer<
					ChildrenRepresentation,
					ReducedChildrenRepresentation
				>
		  }
		| {
			type: 'useSite'
			factory: UseSiteBranchNodeRepresentationFactory<Props, ChildrenRepresentation, Representation, StaticContext>
			ComponentType?: ElementType<Props>
		  }
}

export { BranchNode }
