import { useClassName, useClassNameFactory, useComposeRef, useElementSize, useReferentiallyStableCallback } from '@contember/react-utils'
import { PolymorphicRef, assert, isNonNegativeNumber, isNotNullish, isSlugString, px } from '@contember/utilities'
import { ElementType, forwardRef, memo, useCallback, useRef } from 'react'
import { MenuAutoCloseProvider } from '../menu-auto-close-provider'
import { GetLayoutPanelsStateContext, LayoutPanelContext, Panel, PanelBehavior, PanelBody, PanelFooter, PanelHeader, PanelState, PanelVisibility, isComponentClassName, useClosePanelOnEscape, useGetLayoutPanelsStateContext, useSetLayoutPanelsStateContext } from '../primitives'
import { SidebarComponentType, SidebarProps } from './Types'

const BASIS = 256
const MIN_WIDTH = 256
const MAX_WIDTH = 256

export function createLayoutSidebarComponent({
	defaultAs,
	defaultBehavior = 'collapsible',
	defaultComponentClassName = 'layout-sidebar',
	defaultVisibility = 'visible',
	displayName,
	name,
}: {
	defaultAs: ElementType;
	defaultBehavior?: PanelBehavior;
	defaultComponentClassName?: string | string[];
	defaultVisibility?: PanelVisibility;
	displayName: string;
	name: string;
}): SidebarComponentType {
	assert('name is a slug string', name, isSlugString)
	assert('defaultAs is defined', defaultAs, isNotNullish)
	assert(
		'componentClassName is either a non-empty string or an array of non-empty strings',
		defaultComponentClassName,
		isComponentClassName,
	)

	const Component: SidebarComponentType = memo(forwardRef(<C extends ElementType = 'aside'>({
		as,
		basis = BASIS,
		body,
		className: classNameProp,
		componentClassName = defaultComponentClassName,
		footer,
		header,
		keepVisible = false,
		maxWidth = MAX_WIDTH,
		minWidth = MIN_WIDTH,
		onBehaviorChange: onBehaviorChangeProp,
		onKeyPress: onKeyPressProp,
		onVisibilityChange,
		priority,
		style,
		...props
	}: SidebarProps<C>,
		forwardedRef: PolymorphicRef<C>,
	) => {
		const keepVisibleBehavior = useReferentiallyStableCallback(({ behavior }: PanelState) => {
			if (keepVisible && behavior !== 'modal') {
				return { visibility: 'visible' } as const
			}
		})

		const onEscapePress = useClosePanelOnEscape()

		const { hide } = useSetLayoutPanelsStateContext()
		const panelState = useGetLayoutPanelsStateContext().panels.get(name)

		const visibility = panelState?.visibility
		const behavior = panelState?.behavior

		const hideModal = useReferentiallyStableCallback(() => {
			if (behavior === 'modal' && visibility === 'visible') {
				hide(name)
			}
		})

		const elementRef = useRef<HTMLElement>(null)
		const composeRef = useComposeRef(forwardedRef, elementRef)
		const className = useClassNameFactory(componentClassName)
		const headerRef = useRef<HTMLDivElement>(null)
		const footerRef = useRef<HTMLDivElement>(null)
		const { height: headerHeight } = useElementSize(headerRef)
		const { height: footerHeight } = useElementSize(footerRef)

		const onKeyPress = useCallback((event: KeyboardEvent, state: PanelState) => ({
			...onEscapePress(event, state),
			...onKeyPressProp?.(event, state),
		}), [onEscapePress, onKeyPressProp])

		const onBehaviorChange = useCallback((state: PanelState) => ({
			...keepVisibleBehavior(state),
			...onBehaviorChangeProp?.(state),
		}), [keepVisibleBehavior, onBehaviorChangeProp])

		return (
			<Panel<ElementType>
				ref={composeRef}
				as={as ?? defaultAs}
				basis={isNonNegativeNumber(basis) ? basis : undefined}
				className={useClassName(componentClassName, classNameProp)}
				defaultBehavior={defaultBehavior}
				defaultVisibility={defaultVisibility}
				maxWidth={isNonNegativeNumber(maxWidth) ? maxWidth : undefined}
				minWidth={isNonNegativeNumber(minWidth) ? minWidth : undefined}
				name={name}
				onBehaviorChange={onBehaviorChange}
				onKeyPress={onKeyPress}
				onVisibilityChange={onVisibilityChange}
				priority={priority}
				{...props}
				style={{
					...style,
					'--panel-header-height': px(headerHeight),
					'--panel-footer-height': px(footerHeight),
				}}
			>
				<MenuAutoCloseProvider onAutoClose={hideModal}>
					<GetLayoutPanelsStateContext.Consumer>
						{panelsState => (
							<LayoutPanelContext.Consumer>
								{state => {
									const headerContent = typeof header === 'function' ? header(state, panelsState) : header
									const bodyContent = typeof body === 'function' ? body(state, panelsState) : body
									const footerContent = typeof footer === 'function' ? footer(state, panelsState) : footer

									return (
										<>
											{headerContent !== false && (
												<PanelHeader ref={headerRef} className={className('header')}>
													{headerContent}
												</PanelHeader>
											)}

											{bodyContent !== false && (
												<PanelBody className={className('body')}>
													{bodyContent}
												</PanelBody>
											)}

											{footerContent !== false && (
												<PanelFooter ref={footerRef} className={className('footer')}>
													{footerContent}
												</PanelFooter>
											)}
										</>
									)
								}}
							</LayoutPanelContext.Consumer>
						)}
					</GetLayoutPanelsStateContext.Consumer>
				</MenuAutoCloseProvider>
			</Panel>
		)
	})) as unknown as SidebarComponentType
	Component.displayName = `Layout.Kit.${displayName}`
	Component.NAME = name
	Component.BASIS = BASIS
	Component.MIN_WIDTH = MIN_WIDTH
	Component.MAX_WIDTH = MAX_WIDTH

	return Component
}
