import { MigrationBuilder } from '@contember/database-migrations'
import { Model, Schema } from '@contember/schema'
import { SchemaUpdater, updateEntity, updateField, updateModel } from '../utils/schemaUpdateUtils'
import { ModificationHandlerStatic } from '../ModificationHandler'
import { isIt } from '../../utils/isIt'
import { updateRelations } from '../utils/diffUtils'
import { acceptRelationTypeVisitor } from '@contember/schema-utils'
import { addForeignKeyConstraint } from './helpers'

export const UpdateRelationOnDeleteModification: ModificationHandlerStatic<UpdateRelationOnDeleteModificationData> = class {
	static id = 'updateRelationOnDelete'
	constructor(private readonly data: UpdateRelationOnDeleteModificationData, private readonly schema: Schema) {}

	public createSql(builder: MigrationBuilder): void {
		const entity = this.schema.model.entities[this.data.entityName]
		if (entity.view) {
			return
		}
		acceptRelationTypeVisitor(this.schema.model, entity, this.data.fieldName, {
			visitManyHasOne: (entity, relation, targetEntity) => {
				addForeignKeyConstraint({ builder, entity, targetEntity, relation, recreate: true })
			},
			visitOneHasOneOwning: (entity, relation, targetEntity) => {
				addForeignKeyConstraint({ builder, entity, targetEntity, relation, recreate: true })
			},
			visitOneHasMany: () => {},
			visitOneHasOneInverse: () => {},
			visitManyHasManyOwning: () => {},
			visitManyHasManyInverse: () => {},
		})
	}

	public getSchemaUpdater(): SchemaUpdater {
		const { entityName, fieldName, onDelete } = this.data
		return updateModel(
			updateEntity(
				entityName,
				updateField<Model.AnyRelation & Model.JoiningColumnRelation>(fieldName, ({ field }) => ({
					...field,
					joiningColumn: { ...field.joiningColumn, onDelete },
				})),
			),
		)
	}

	describe() {
		return { message: `Change on-delete policy of relation ${this.data.entityName}.${this.data.fieldName}` }
	}

	static createModification(data: UpdateRelationOnDeleteModificationData) {
		return { modification: this.id, ...data }
	}

	static createDiff(originalSchema: Schema, updatedSchema: Schema) {
		return updateRelations(originalSchema, updatedSchema, ({ originalRelation, updatedRelation, updatedEntity }) => {
			if (
				originalRelation.type === updatedRelation.type &&
				isIt<Model.JoiningColumnRelation>(updatedRelation, 'joiningColumn') &&
				isIt<Model.JoiningColumnRelation>(originalRelation, 'joiningColumn') &&
				updatedRelation.joiningColumn.onDelete !== originalRelation.joiningColumn.onDelete
			) {
				return UpdateRelationOnDeleteModification.createModification({
					entityName: updatedEntity.name,
					fieldName: updatedRelation.name,
					onDelete: updatedRelation.joiningColumn.onDelete,
				})
			}
			return undefined
		})
	}
}

export interface UpdateRelationOnDeleteModificationData {
	entityName: string
	fieldName: string
	onDelete: Model.OnDelete
}
