import { expect } from 'chai'
import 'mocha'
import * as React from 'react'
import {
	EntityListDataProvider,
	Field,
	SingleEntityDataProvider,
	ToMany,
	ToOne
} from '../../../../src/binding/coreComponents'
import { MarkerTreeGenerator } from '../../../../src/binding/model'

describe('Marker tree generator', () => {
	it('should reject empty trees', () => {
		const generator = new MarkerTreeGenerator(<></>)

		expect(() => generator.generate()).throws(/empty/i)
	})

	it('should reject top-level fields and relations', () => {
		const topOne = (
			<ToOne field="foo">
				<></>
			</ToOne>
		)
		const topMany = (
			<ToMany field="foo">
				<></>
			</ToMany>
		)
		const topField = <Field name="foo" />

		for (const faultyTop of [topOne, topMany, topField]) {
			expect(() => new MarkerTreeGenerator(faultyTop).generate()).throws(/top\-level/i)
		}
	})

	it('should enforce mandatory children', () => {
		const single = <SingleEntityDataProvider where={{ foo: '' }} name="Foo" />
		const list = <EntityListDataProvider where={{ foo: {} }} name="Foo" />
		const toOne = (
			<SingleEntityDataProvider where={{ foo: '' }} name="Foo">
				<ToOne field="foo" />
			</SingleEntityDataProvider>
		)
		const toMany = (
			<SingleEntityDataProvider where={{ foo: '' }} name="Foo">
				<ToMany field="foo" />
			</SingleEntityDataProvider>
		)

		for (const faultyChildren of [single, list, toOne, toMany]) {
			expect(() => new MarkerTreeGenerator(faultyChildren).generate()).throws(/children/i)
		}
	})
})
