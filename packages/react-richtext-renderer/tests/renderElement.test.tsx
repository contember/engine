import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { BuiltinElements, RichText } from '../src'

describe('paragraph rendering', () => {
	const createBlock = (el: BuiltinElements) => ({
		content: {
			formatVersion: 1,
			children: [el],
		},
		id: '1',
		references: undefined,
	})

	test('render paragraph', () => {
		expect(render(<RichText blocks={[createBlock({
			type: 'paragraph',
			children: [{
				text: 'Hello',
				isBold: true,
			}],
		})]} />).container.firstChild)
			.toMatchInlineSnapshot(`
				<p
				  data-contember-type="paragraph"
				>
				  <b>
				    Hello
				  </b>
				</p>
			`)
	})

	test('render table', () => {
		expect(render(<RichText blocks={[createBlock({
			type: 'table',
			children: [{
				type: 'tableRow',
				children: [{
					type: 'tableCell',
					children: [{
						text: 'Hello',
					}],
				}],
			}],
		})]} />).container.firstChild)
			.toMatchInlineSnapshot(`
				<table
				  data-contember-type="table"
				>
				  <tbody>
				    <tr
				      data-contember-type="tableRow"
				    >
				      <td
				        data-contember-type="tableCell"
				      >
				        Hello
				      </td>
				    </tr>
				  </tbody>
				</table>
			`)
	})

	test('render table with header', () => {
		expect(render(<RichText blocks={[createBlock({
			type: 'table',
			children: [{
				type: 'tableRow',
				headerScope: 'table',
				children: [{
					type: 'tableCell',
					children: [{
						text: 'Hello',
					}],
				}],
			}],
		})]} />).container.firstChild)
			.toMatchInlineSnapshot(`
				<table
				  data-contember-type="table"
				>
				  <thead>
				    <tr
				      data-contember-headerscope="table"
				      data-contember-type="tableRow"
				    >
				      <td
				        data-contember-type="tableCell"
				      >
				        Hello
				      </td>
				    </tr>
				  </thead>
				  <tbody />
				</table>
			`)
	})

	test('render heading', () => {
		expect(render(<RichText blocks={[createBlock({
			type: 'heading',
			level: 1,
			children: [{
				text: 'Hello',
			}],
		})]} />).container.firstChild)
			.toMatchInlineSnapshot(`
				<h1
				  data-contember-level="1"
				  data-contember-type="heading"
				>
				  Hello
				</h1>
			`)
	})

	test('render list', () => {
		expect(render(<RichText blocks={[createBlock({
			type: 'unorderedList',
			children: [{
				type: 'listItem',
				children: [{
					text: 'Hello',
				}],
			}],
		})]} />).container.firstChild)
			.toMatchInlineSnapshot(`
				<ul
				  data-contember-type="unorderedList"
				>
				  <li
				    data-contember-type="listItem"
				  >
				    Hello
				  </li>
				</ul>
			`)
	})

	test('render ordered list', () => {
		expect(render(<RichText blocks={[createBlock({
			type: 'orderedList',
			children: [{
				type: 'listItem',
				children: [{
					text: 'Hello',
				}],
			}],
		})]} />).container.firstChild)
			.toMatchInlineSnapshot(`
				<ol
				  data-contember-type="orderedList"
				>
				  <li
				    data-contember-type="listItem"
				  >
				    Hello
				  </li>
				</ol>
			`)
	})

	test('custom element', () => {
		expect(render(<RichText blocks={[{
			content: {
				formatVersion: 1,
				children: [{
					type: 'blockquote',
					children: [
						{
							type: 'heading',
							level: 1,
							children: [{
								text: 'Hello',
							}],
						},
						{
							text: 'Hello',
						},
					],
				}],
			},
			id: '1',
			references: undefined,
		}]} renderElement={it => {
			if (it.element.type === 'blockquote') {
				return <blockquote data-contember-type="blockquote">{it.children}</blockquote>
			}
			return it.fallback
		}} />).container.firstChild)
			.toMatchInlineSnapshot(`
				<blockquote
				  data-contember-type="blockquote"
				>
				  <h1
				    data-contember-level="1"
				    data-contember-type="heading"
				  >
				    Hello
				  </h1>
				  Hello
				</blockquote>
			`)
	})
})
