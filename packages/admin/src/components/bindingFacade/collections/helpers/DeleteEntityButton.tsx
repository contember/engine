import { EntityAccessor, useEntity, useMutationState } from '@contember/binding'
import { Button, ButtonOwnProps, ButtonProps, Icon, toThemeClass } from '@contember/ui'
import { listClassName } from '@contember/utilities'
import { ReactNode, memo, useCallback } from 'react'
import { usePersistWithFeedback } from '../../../ui'

const defaultProps: ButtonOwnProps = {
	size: 'small',
	flow: 'circular',
	distinction: 'seamless',
	bland: true,
}

export type DeleteEntityButtonProps =
	& {
		immediatePersist?: true
		children?: ReactNode
	}
	& ButtonProps

/**
 * Renders a button which deletes an entity in current binding context.
 *
 * @example
 * ```
 * <DeleteEntityButton />
 * ```
 *
 * @group Action buttons
 */
export const DeleteEntityButton = memo((props: DeleteEntityButtonProps) => {
	const { children, immediatePersist, className, ...rest } = props
	const parentEntity = useEntity()
	const triggerPersist = usePersistWithFeedback()
	const isMutating = useMutationState()
	const onClick = useCallback(() => {
		if (props.immediatePersist && !confirm('Really?')) {
			return
		}
		parentEntity.deleteEntity()

		if (props.immediatePersist && triggerPersist) {
			triggerPersist().catch(() => { })
		}
	}, [triggerPersist, props.immediatePersist, parentEntity])

	if (!(parentEntity instanceof EntityAccessor)) {
		return null
	}

	return (
		<Button
			distinction="primary"
			{...defaultProps}
			{...rest}
			className={listClassName([
				className,
				toThemeClass(null, 'danger', ':hover'),
			])}
			disabled={isMutating || rest.disabled}
			onClick={onClick}
		>
			{children || <Icon blueprintIcon="trash" />}
		</Button>
	)
})
DeleteEntityButton.displayName = 'DeleteEntityButton'
