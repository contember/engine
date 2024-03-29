import { DisableIdpResponse, MutationDisableIdpArgs, MutationResolvers } from '../../../schema'
import { PermissionActions } from '../../../model'
import { IDPManager } from '../../../model/service/idp/IDPManager'
import { createErrorResponse } from '../../errorUtils'
import { TenantResolverContext } from '../../TenantResolverContext'

export class DisableIDPMutationResolver implements MutationResolvers {
	constructor(private readonly idpManager: IDPManager) {
	}

	async disableIDP(parent: any, args: MutationDisableIdpArgs, context: TenantResolverContext): Promise<DisableIdpResponse> {
		await context.requireAccess({
			action: PermissionActions.IDP_DISABLE,
			message: 'You are not allowed to disable IDP',
		})
		const result = await this.idpManager.disableIDP(context.db, args.identityProvider)
		if (!result.ok) {
			return createErrorResponse(result.error, result.errorMessage)
		}

		return { ok: true }
	}
}
