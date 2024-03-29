import { Command, CommandConfiguration, Input } from '@contember/cli-common'
import { Workspace, validateProjectName } from '@contember/cli-common'

type Args = {
	project: string
}

type Options = {
	template: string
}

export class ProjectCreateCommand extends Command<Args, Options> {
	constructor(
		private readonly workspace: Workspace,
	) {
		super()
	}

	protected configure(configuration: CommandConfiguration<Args, Options>): void {
		configuration.description('Creates a new Contember project')
		configuration.argument('project')
		configuration.option('template').valueRequired()
	}

	protected async execute(input: Input<Args, Options>): Promise<void> {
		const [projectName] = [input.getArgument('project')]
		validateProjectName(projectName)
		const workspace = this.workspace

		const template = input.getOption('template')
		await workspace.projects.createProject(projectName, { template })

		console.log(`Project ${projectName} created`)
	}
}
