import { MigrationBuilder } from '@contember/database-migrations'
import { TenantMigrationArgs } from './types'
import { createCredentials } from './tenantCredentials'

export default async function (builder: MigrationBuilder, args: TenantMigrationArgs) {
	await createCredentials(builder, args)
}
