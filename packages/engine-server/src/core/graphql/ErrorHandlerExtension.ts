import { AuthenticationError } from 'apollo-server-koa'
import { ApolloError } from 'apollo-server-errors'
import { ApolloError as ApolloCoreError } from 'apollo-server-core'
import { UserError } from '@contember/engine-content-api'
import { GraphQLError } from 'graphql'
import { extractOriginalError } from './errorExtract'
import { GraphQLExtension, GraphQLResponse } from 'graphql-extensions'
import { logSentryError } from '../../utils/sentry'

export interface ErrorContext {
	url: string
	body: string
	user: string
}

export type ErrorContextProvider = () => ErrorContext

export class ErrorHandlerExtension extends GraphQLExtension {
	constructor(private readonly projectSlug: string | undefined, private readonly module: string) {
		super()
	}

	processError(error: any, errorContextProvider: ErrorContextProvider): any {
		if (error instanceof AuthenticationError) {
			return { message: error.message, locations: undefined, path: undefined }
		}
		if (error instanceof ApolloError) {
			return error
		}
		const originalError = extractOriginalError(error)
		if (
			originalError instanceof GraphQLError ||
			originalError instanceof ApolloError ||
			originalError instanceof ApolloCoreError
		) {
			return error
		}
		if (originalError instanceof UserError) {
			return { message: error.message, locations: error.locations, path: error.path }
		}
		console.error(originalError || error)
		logSentryError(originalError || error, {
			project: this.projectSlug,
			module: this.module,
			...errorContextProvider(),
		})

		return { message: 'Internal server error', locations: undefined, path: undefined }
	}

	willSendResponse({
		graphqlResponse,
		context,
	}: {
		graphqlResponse: GraphQLResponse
		context: { errorContextProvider: ErrorContextProvider }
	}): { graphqlResponse: GraphQLResponse; context: any } {
		if (graphqlResponse.errors) {
			graphqlResponse.errors = graphqlResponse.errors.map((it: any) =>
				this.processError(it, context.errorContextProvider),
			)
		}
		return { graphqlResponse, context }
	}
}
