import { Config } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-koa'
import { ResolverContext, ResolverContextFactory, Schema, typeDefs } from '@contember/engine-tenant-api'
import { AuthMiddlewareFactory } from '../AuthMiddlewareFactory'
import { ErrorContextProvider, ErrorHandlerExtension } from '../../core/graphql/ErrorHandlerExtension'

type ExtendedGraphqlContext = ResolverContext & {
	errorContextProvider: ErrorContextProvider
}

class TenantApolloServerFactory {
	constructor(
		private readonly resolvers: Schema.Resolvers,
		private readonly resolverContextFactory: ResolverContextFactory,
	) {}

	create(): ApolloServer {
		return new ApolloServer({
			typeDefs,
			introspection: true,
			tracing: true,
			extensions: [() => new ErrorHandlerExtension(undefined, 'tenant')],
			resolvers: this.resolvers as Config['resolvers'],
			context: ({ ctx }: { ctx: AuthMiddlewareFactory.ContextWithAuth }): ExtendedGraphqlContext => {
				return {
					...this.resolverContextFactory.create(ctx.state.authResult),
					errorContextProvider: () => ({
						body: ctx.request.body,
						url: ctx.request.originalUrl,
						user: ctx.state.authResult.identityId,
					}),
				}
			},
		})
	}
}

export { TenantApolloServerFactory }
