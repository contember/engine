import { DatabaseCredentials } from '@contember/database'

export type ProjectConfig = {
	readonly slug: string
	readonly alias?: string[]
	readonly name: string
	readonly stages: StageConfig[]
	readonly db: DatabaseCredentials
} & Record<string, unknown>

export interface StageConfig {
	readonly slug: string
	readonly name: string
}

export type ProjectSecrets = Record<string, string>
export type ProjectConfigResolver = (
	slug: string,
	additionalConfig: any,
	secrets: ProjectSecrets,
) => ProjectConfig
