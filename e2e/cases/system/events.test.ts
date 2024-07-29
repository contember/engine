import { assert, test } from 'vitest'
import { createTester, gql } from '../../src/tester'
import { createSchema, SchemaDefinition as def } from '@contember/schema-definition'

namespace ArticleModel {
	export class Article {
		slug = def.stringColumn().unique()
		tags = def.manyHasMany(Tag, 'articles')
	}

	export class Tag {
		slug = def.stringColumn().unique()
		articles = def.manyHasManyInverse(Article, 'tags')
	}
}

test('System API: events query by part of tuple', async () => {
	const tester = await createTester(createSchema(ArticleModel))

	const result = await tester(
		gql`
			mutation {
				createTag(data: { slug: "graphql" }) {
					ok
				}
                createArticle(data: { slug: "hello-world", tags: [{ connect: { slug: "graphql" } }] }) {
                    ok
					node {
						id
					}
                }
			}
		`,
	)
		.expect(200)
	const articleId = result.body.data.createArticle.node.id

	await tester(
		gql`
			query($args: EventsArgs) {
				events(args: $args) {
					id
					type
					tableName
                }
			}
		`,
		{
			path: '/system/' + tester.projectSlug,
			variables: {
				args: {
					filter: {
						rows: [
							{
								tableName: 'article_tags',
								primaryKey: [articleId, null],
							},
						],
					},
				},
			},
		},
	)
		.expect(response => {
			assert.isArray(response.body.data.events)
			assert.equal(response.body.data.events.length, 1)
			assert.equal(response.body.data.events[0].tableName, 'article_tags')
		})
		.expect(200)
})
