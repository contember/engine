export interface DevErrorBadgeProps {
	onOpen: () => void
	errorCount: number
}


const className = (cls?: string | null) => cls ? `cui-devErrorBadge-${cls}` : 'cui-devErrorBadge'

export function DevErrorBadge({ errorCount, onOpen }: DevErrorBadgeProps) {
	return (
		<div className={className()}>
			<a className={className('button')} onClick={onOpen}>
				{errorCount} {errorCount > 1 ? 'errors' : 'error'}
			</a>
		</div>
	)
}
