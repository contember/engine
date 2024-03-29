import { UpdateInputProcessor } from '../../inputProcessing'
import { Input, Model } from '@contember/schema'
import { Mapper } from '../Mapper'
import { MutationResultType } from '../Result'

export class OneHasManyInputProcessor {
	constructor(
		private readonly mapper: Mapper,
	) {
	}

	public async connect(
		{ entity, targetEntity, targetRelation, input }: Model.OneHasManyContext & { input: Input.UniqueWhere },
		primary: Input.PrimaryValue,
	) {
		return await this.mapper.update(targetEntity, input, {
			[targetRelation.name]: { connect: { [entity.primary]: primary } },
		})
	}

	public async create(
		{ entity, targetEntity, targetRelation, input }: Model.OneHasManyContext & { input: Input.CreateDataInput },
		primary: Input.PrimaryValue,
	) {
		return await this.mapper.insert(targetEntity, {
			...input,
			[targetRelation.name]: { connect: { [entity.primary]: primary } },
		})
	}

	public async connectOrCreate(
		{ entity, targetRelation, targetEntity, input: { connect, create } }: Model.OneHasManyContext & { input: Input.ConnectOrCreateInput },
		primary: Input.PrimaryValue,
	) {
		const connectData = {
			[targetRelation.name]: {
				connect: { [entity.primary]: primary },
			},
		}
		return await this.mapper.upsert(targetEntity, connect, connectData, {
			...create,
			...connectData,
		})
	}

	public async update(
		{ entity, targetEntity, targetRelation, input: { data, where } }: Model.OneHasManyContext & { input: UpdateInputProcessor.UpdateManyInput },
		primary: Input.PrimaryValue,
	) {
		return await this.mapper.update(
			targetEntity,
			{ ...where, [targetRelation.name]: { [entity.primary]: primary } },
			{
				...data,
				// [targetRelation.name]: {connect: thisPrimary}
			},
		)
	}

	public async upsert(
		{ entity, targetEntity, targetRelation, input: { create, update, where } }: Model.OneHasManyContext & { input: UpdateInputProcessor.UpsertManyInput },
		primary: Input.PrimaryValue,
	) {
		const result = await this.mapper.update(
			targetEntity,
			{ ...where, [targetRelation.name]: { [entity.primary]: primary } },
			{
				...update,
				// [targetRelation.name]: {connect: thisPrimary}
			},
		)
		if (result[0].result === MutationResultType.notFoundError) {
			return await this.mapper.insert(targetEntity, {
				...create,
				[targetRelation.name]: { connect: { [entity.primary]: primary } },
			})
		}
		return result
	}

	public async disconnect(
		{ entity, targetEntity, relation, targetRelation, input }: Model.OneHasManyContext & { input: Input.UniqueWhere },
		primary: Input.PrimaryValue,
	) {
		return await this.mapper.update(
			targetEntity,
			{ ...input, [targetRelation.name]: { [entity.primary]: primary } },
			{ [targetRelation.name]: { disconnect: true } },
		)
	}

	public async delete(
		{ entity, targetEntity, relation, targetRelation, input }: Model.OneHasManyContext & { input: Input.UniqueWhere },
		primary: Input.PrimaryValue,
	) {
		return await this.mapper.delete(targetEntity, {
			...input,
			[targetRelation.name]: { [entity.primary]: primary },
		})
	}
}
