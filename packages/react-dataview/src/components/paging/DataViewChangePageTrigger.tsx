import { forwardRef, useCallback, useMemo } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { useDataViewPagingInfo, useDataViewPagingMethods, useDataViewPagingState } from '../../contexts'

export interface DataViewChangePageTriggerProps {
	page: number | 'first' | 'last' | 'next' | 'previous'
	children: React.ReactNode
}

export const DataViewChangePageTrigger = forwardRef<HTMLElement, DataViewChangePageTriggerProps>(({ page, ...props }, ref) => {
	const { goToPage } = useDataViewPagingMethods()
	const { pagesCount } = useDataViewPagingInfo()
	const { pageIndex } = useDataViewPagingState()

	const disabled = useMemo(() => {
		if (typeof page === 'number') {
			return page === pageIndex
		}
		switch (page) {
			case 'last':
				return pagesCount === undefined ||  pagesCount === 0 || pageIndex === pagesCount - 1
			case 'next':
				return pagesCount !== undefined && pageIndex === Math.max(pagesCount - 1, 0)
			case 'first':
			case 'previous':
				return pageIndex === 0
		}
		return false
	}, [page, pageIndex, pagesCount])

	const goTo = useCallback(() => {
		goToPage(page)
	}, [goToPage, page])

	return (
		<Slot
			onClick={goTo}
			ref={ref}
			{...{ disabled: disabled ? '1' : undefined }}
			{...props}
		/>
	)
})
