import type { Environment } from '@contember/binding'
import { ActionableBox, Box, Dropdown, Icon, Justification, TableHeaderCell } from '@contember/ui'
import { ComponentType, createElement, ReactElement, ReactNode } from 'react'
import type { FilterRendererProps } from './DataGridColumn'
import type { DataGridFilterArtifact } from './DataGridFilterArtifact'
import { cycleOrderDirection, DataGridOrderDirection } from './DataGridOrderDirection'
import type { DataGridSetFilter } from './DataGridSetFilter'
import type { DataGridSetOrderBy } from './DataGridSetOrderBy'

export interface DataGridHeaderCellPublicProps {
	header?: ReactNode
	shrunk?: boolean
	headerJustification?: Justification
	ascOrderIcon?: ReactNode
	descOrderIcon?: ReactNode
}

export interface DataGridHeaderCellInternalProps {
	environment: Environment
	hasFilter: boolean
	emptyFilterArtifact: DataGridFilterArtifact
	filterArtifact: DataGridFilterArtifact
	orderDirection: DataGridOrderDirection
	setFilter: DataGridSetFilter
	setOrderBy: DataGridSetOrderBy
	filterRenderer: ComponentType<FilterRendererProps<DataGridFilterArtifact>> | undefined
}

export interface DataGridHeaderCellProps extends DataGridHeaderCellInternalProps, DataGridHeaderCellPublicProps {}

export function DataGridHeaderCell({
	ascOrderIcon,
	descOrderIcon,
	emptyFilterArtifact,
	environment,
	filterArtifact,
	filterRenderer,
	hasFilter,
	header,
	headerJustification,
	orderDirection,
	setFilter,
	setOrderBy,
	shrunk,
}: DataGridHeaderCellProps): ReactElement {
	return (
		<TableHeaderCell scope="col" justification={headerJustification} shrunk={shrunk}>
			<span style={{ display: 'flex', justifyContent: 'flex-start', gap: '.25em' }}>
				<span onClick={() => setOrderBy(cycleOrderDirection(orderDirection))} style={{ cursor: 'pointer' }}>
					{header}
					&nbsp;
					{orderDirection &&
						{
							asc: ascOrderIcon ?? defaultAscIcon,
							desc: descOrderIcon ?? defaultDescIcon,
						}[orderDirection]}
				</span>
				{filterRenderer && (
					<Dropdown
						buttonProps={{
							intent: hasFilter ? 'primary' : 'default',
							distinction: 'seamless',
							size: 'small',
							children: (
								<Icon
									blueprintIcon="filter"
									alignWithLowercase
									style={{
										opacity: hasFilter ? '1' : '0.5',
									}}
								/>
							),
						}}
						renderContent={({ requestClose }) => (
							<ActionableBox
								onRemove={() => {
									setFilter(undefined)
									requestClose()
								}}
							>
								<Box heading={<>Filter: {header}</>}>
									{createElement(filterRenderer, {
										filter: filterArtifact === undefined ? emptyFilterArtifact : filterArtifact,
										setFilter: setFilter,
										environment: environment,
									})}
								</Box>
							</ActionableBox>
						)}
					/>
				)}
			</span>
		</TableHeaderCell>
	)
}

const defaultAscIcon = <Icon blueprintIcon="caret-up" size="small" alignWithLowercase />
const defaultDescIcon = <Icon blueprintIcon="caret-down" size="small" alignWithLowercase />
