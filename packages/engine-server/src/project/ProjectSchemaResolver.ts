import { ProjectSchemaResolver as ProjectSchemaResolverInterface } from '@contember/engine-tenant-api'
import { SchemaVersionBuilder } from '@contember/engine-system-api'
import { ProjectContainerResolver } from '@contember/engine-http'
import { Schema } from '@contember/schema'

export class ProjectSchemaResolver implements ProjectSchemaResolverInterface {
	constructor(
		private readonly projectContainerResolver: ProjectContainerResolver,
		private readonly schemaVersionBuilder: SchemaVersionBuilder,
	) {}

	async getSchema(slug: string) {
		const container = await this.projectContainerResolver.getProjectContainer(slug)
		if (!container) {
			return undefined
		}
		const db = container.systemDatabaseContextFactory.create()
		return await this.schemaVersionBuilder.buildSchema(db)
	}
}

export class ProjectSchemaResolverProxy implements ProjectSchemaResolverInterface {
	private resolver: ProjectSchemaResolver | undefined

	setResolver(resolver: ProjectSchemaResolver): void {
		this.resolver = resolver
	}

	getSchema(projectSlug: string): Promise<Schema | undefined> {
		if (!this.resolver) {
			throw new Error('Resolved is not set')
		}
		return this.resolver.getSchema(projectSlug)
	}
}