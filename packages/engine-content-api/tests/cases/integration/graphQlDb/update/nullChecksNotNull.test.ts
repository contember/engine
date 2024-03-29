import { SchemaBuilder } from '@contember/schema-definition'
import { Model } from '@contember/schema'
import { test } from 'vitest'
import { executeDbTest } from '@contember/engine-api-tester'
import { GQL } from '../../../../src/tags'
import { testUuid } from '../../../../src/testUuid'

const model = new SchemaBuilder()
	.entity('Site', e =>
		e
			.column('slug', c => c.unique().type(Model.ColumnType.String))

			.oneHasOne('contactPage', r => r.target('ContactPage').inversedBy('site').inverseNotNull()),
	)
	.entity('ContactPage', e => e.column('title'))
	.buildSchema()

test('update site & create contact page', async () => {
	await executeDbTest({
		schema: { model },
		seed: [
			{
				query: GQL`mutation {
                createSite(data: {slug: "en"}) {
                  ok
                }
              }`,
			},
		],
		query: GQL`mutation {
            updateSite(by: { slug: "en" }, data: { contactPage: { create: { title: "Test" } } }) {
              ok
            }
          }`,
		return: {
			updateSite: {
				ok: true,
			},
		},
		expectDatabase: {
			site: [{ id: testUuid(3), slug: 'en', contact_page_id: testUuid(5) }],
			contact_page: [{ id: testUuid(5), title: 'Test' }],
		},
	})
})

test('update site & try to create contact page which however exists', async () => {
	await executeDbTest({
		schema: { model },
		seed: [
			{
				query: GQL`mutation {
                createSite(data: {slug: "en", contactPage: { create: { title: "Test" } } }) {
                  ok
                }
              }`,
			},
		],
		query: GQL`mutation {
            updateSite(by: { slug: "en" }, data: { contactPage: { create: { title: "Test 2" } } }) {
              ok
	            errors {
		            type
	            }
            }
          }`,
		return: {
			updateSite: {
				ok: false,
				errors: [
					{
						type: 'NotNullConstraintViolation',
					},
				],
			},
		},
		expectDatabase: {
			site: [{ id: testUuid(3), slug: 'en', contact_page_id: testUuid(4) }],
			contact_page: [{ id: testUuid(4), title: 'Test' }],
		},
	})
})

