import classNames from 'classnames'
import { ChangeEvent, forwardRef, memo, Ref, useCallback, useEffect, useRef, useState } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { Divider } from '../../Divider'
import { Stack } from '../../Stack'
import { assertDatetimeString, splitDatetime } from '../Types'
import { VisuallyDependententControlProps } from '../Types/ControlProps'
import { useInputClassName } from '../useInputClassName'
import { useNativeInput } from '../useNativeInput'
import { DateTimeInputProps } from './Types'

function joinDatetime(date?: string | null, time?: string | null) {
	return `${date}T${time}`
}

export const DateTimeInputFallback = memo(
	forwardRef(({
		className,
		max,
		min,
		onChange,
		onValidationStateChange,
		value: _value,
		withTopToolbar,
		...outerProps
	}: DateTimeInputProps, forwardedRef: Ref<HTMLInputElement>) => {
		const value = _value ?? ''

		if (value) {
			assertDatetimeString(value)
		}

		if (max) {
			assertDatetimeString(max)
		}

		if (min) {
			assertDatetimeString(min)
		}

		const [state, setState] = useState(value)
		const [date, time] = splitDatetime(state)

		useEffect(() => {
			setState(value)
		}, [value])

		useEffect(() => {
			onChange?.(state)
		}, [state, onChange])

		const onDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
			setState(joinDatetime(event.target.value, time))
		}, [time])

		const onTimeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
			setState(joinDatetime(date, event.target.value))
		}, [date])

		const dateError = useRef<string | undefined>(undefined)
		const timeError = useRef<string | undefined>(undefined)

		const changeValidationState = useCallback(() => {
			onValidationStateChange?.([dateError.current, timeError.current].filter(Boolean).join(' '))
		}, [onValidationStateChange])

		const { props: dateInputProps } = useNativeInput<HTMLInputElement>({
			...outerProps,
			distinction: 'seamless',
			className: classNames(
				useComponentClassName('input'),
				className,
			),
			onValidationStateChange: useCallback((error: string | undefined) => {
				dateError.current = error
				changeValidationState()
			}, [changeValidationState]),
			value: date,
		}, forwardedRef)

		const timeInputRef = useRef<HTMLInputElement>(null)
		const { props: timeInputProps } = useNativeInput<HTMLInputElement>({
			...outerProps,
			distinction: 'seamless',
			className: classNames(
				useComponentClassName('input'),
				className,
			),
			onValidationStateChange: useCallback((error: string | undefined) => {
				timeError.current = error
				changeValidationState()
			}, [changeValidationState]),
			value: time,
		},
		timeInputRef)

		const [maxDate, maxTime] = splitDatetime(max)
		const [minDate, minTime] = splitDatetime(min)

		return <Stack gap="large" direction="horizontal" className={useInputClassName<VisuallyDependententControlProps>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('datetime-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		})}>
			<input
				{...dateInputProps}
				max={maxDate}
				min={minDate}
				onChange={onDateChange}
				placeholder={outerProps.placeholder ?? undefined}
				type="date"
			/>
			<Divider gap="none" />
			<input
				{...timeInputProps}
				max={date && date === maxDate ? maxTime : ''}
				min={date && date === minDate ? minTime : ''}
				onChange={onTimeChange}
				placeholder={undefined}
				type="time"
			/>
		</Stack>
	}),
)
DateTimeInputFallback.displayName = 'DateTimeInputFallback'
