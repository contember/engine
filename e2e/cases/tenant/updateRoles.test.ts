import { assert, test } from 'vitest'
import { createTester, gql, rand } from '../../src/tester'
import { emptySchema } from '@contember/schema-utils'
import { TenantRole } from '@contember/engine-tenant-api'


test('manage global roles', async () => {
	const tester = await createTester(emptySchema)
	const result = await tester(
		gql`mutation($email: String!, $password: String!) {
		signUp(email: $email password: $password) {
			ok
			errors {
				code
			}
			result {
				person {
					id
					identity {
						id
						roles
					}
				}
			}
		}
	}`,
		{
			path: '/tenant',
			variables: {
				email: `foo+${rand()}@example.com`,
				password: 'abcdxy',
			},
		},
	)
		.expect(200)
	assert.isOk(result.body.data.signUp.ok)
	const identity = result.body.data.signUp.result.person.identity.id
	assert.deepStrictEqual(result.body.data.signUp.result.person.identity.roles, [TenantRole.PERSON])

	await tester(gql`
			mutation($identityId: String!) {
				addGlobalIdentityRoles(identityId: $identityId roles: ["project_admin", "super_admin"]) {
					ok
					result {
						identity {
							roles
						}
					}
				}
			}
		`, {
		variables: { identityId: identity },
		path: '/tenant',
	})
		.expect(200)
		.expect({
			data: {
				addGlobalIdentityRoles: {
					ok: true,
					result: {
						identity: {
							roles: [TenantRole.PERSON, TenantRole.PROJECT_ADMIN, TenantRole.SUPER_ADMIN],
						},
					},
				},
			},
		})


	await tester(gql`
        mutation($identityId: String!) {
				removeGlobalIdentityRoles(identityId: $identityId, roles: ["project_admin", "super_admin"]) {
					ok
					result {
						identity {
							roles
						}
					}
				}
			}
		`, {
		variables: { identityId: identity },
		path: '/tenant',
	})
		.expect(200)
		.expect({
			data: {
				removeGlobalIdentityRoles: {
					ok: true,
					result: {
						identity: {
							roles: [TenantRole.PERSON],
						},
					},
				},
			},
		})
})
