import { Input, Model } from '@contember/schema'
import { ConditionOptimizer } from './ConditionOptimizer'
import { acceptFieldVisitor } from '@contember/schema-utils'
import { optimizeAnd, optimizeJunction } from './helpers'

export class WhereOptimizer {
	constructor(
		private readonly model: Model.Schema,
		private readonly conditionOptimizer: ConditionOptimizer,
	) {
	}

	public optimize(where: Input.OptionalWhere, entity: Model.Entity): Input.Where {
		const result = this.optimizeWhere(where, entity)
		if (typeof result === 'boolean') {
			return { [entity.primary]: { [result ? 'always' : 'never']: true } }
		}
		return result
	}

	private optimizeWhere(where: Input.OptionalWhere, entity: Model.Entity): Input.Where | boolean {
		return optimizeAnd(
			Object.entries(where).map(([key, value]) => {
				if (value === undefined || value === null) {
					return undefined
				} else if (key === 'or' || key === 'and') {
					const parts = (value as readonly Input.Where[]).map(it => this.optimizeWhere(it, entity))
					return optimizeJunction<Input.Where>(key, parts)
				} else if (key === 'not') {
					const resolved = this.optimizeWhere(value as Input.Where, entity)
					return typeof resolved === 'boolean' ? !resolved : { not: resolved }
				} else {
					return this.resolveFieldValue(entity, key, value)
				}
			}),
		)
	}

	private resolveFieldValue(entity: Model.Entity, key: string, value: Input.OptionalWhere[string]) {
		return acceptFieldVisitor<Input.Where | boolean>(this.model, entity, key, {
			visitColumn: () => {
				const optimizedCondition = this.conditionOptimizer.optimize(value as Input.Condition)

				if (typeof optimizedCondition === 'boolean') {
					return optimizedCondition
				}

				return { [key]: optimizedCondition }
			},
			visitRelation: (entity, relation, targetEntity) => {
				const optimizedWhere = this.optimizeWhere(value as Input.Where, targetEntity)

				if (typeof optimizedWhere === 'boolean') {
					return optimizedWhere
				}

				return { [key]: optimizedWhere }
			},
		})
	}
}
