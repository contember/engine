import { FieldsVisitor } from './FieldsVisitor'
import { RelationFetcher } from '../RelationFetcher'
import { Mapper } from '../../Mapper'
import { SelectExecutionHandlerContext } from '../SelectExecutionHandler'
import { PredicateFactory } from '../../../acl'
import { Settings } from '@contember/schema'

export class FieldsVisitorFactory {
	constructor(
		private readonly relationFetcher: RelationFetcher,
		private readonly predicateFactory: PredicateFactory,
		private readonly settings: Settings.ContentSettings,
	) {}

	create(mapper: Mapper, context: SelectExecutionHandlerContext): FieldsVisitor {
		return new FieldsVisitor(
			this.relationFetcher,
			this.predicateFactory,
			mapper,
			context,
			context.relationPath,
			this.settings,
		)
	}
}
