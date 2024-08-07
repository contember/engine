import * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { FieldAccessor, useEntityBeforePersist } from '@contember/react-binding'

export const useFormInputValidationHandler = (field: FieldAccessor<any>) => {
	const accessorGetter = field.getAccessor
	const validationMessage = useRef<string>()
	const [focus, setFocus] = React.useState(false)
	const inputRef = React.useRef<HTMLInputElement>(null)
	useEntityBeforePersist(useCallback(() => {
		if (validationMessage.current) {
			accessorGetter().addError(validationMessage.current)
		}
	}, [accessorGetter]))

	useEffect(() => {
		if (!inputRef.current) {
			return
		}

		const input = inputRef.current
		const valid = input.validity?.valid

		const message = valid ? undefined : input?.validationMessage
		const previousMessage = validationMessage.current
		validationMessage.current = message

		const accessor = accessorGetter()
		// if there is no message, we want to clear the error
		if (!message) {
			if (previousMessage) {
				clearSpecificError(accessor, previousMessage)
			}
			return
		}
		if (message === previousMessage) {
			return
		}
		// if the input is not touched, we don't want to show the error message
		if (!field.isTouched) {
			return
		}

		// if the input is not focused, we want to show the error message
		// also, even the input is focused, we want to replace the previous message
		if (!focus || !!previousMessage) {
			accessor.clearErrors()
			accessor.addError(message)
		}
	})

	return {
		ref: inputRef,
		onFocus: useCallback(() => {
			setFocus(true)
		}, []),
		onBlur: useCallback(() => {
			setFocus(false)
			accessorGetter().clearErrors()
			if (validationMessage.current) {
				accessorGetter().addError(validationMessage.current)
			}
		}, [accessorGetter]),
	}
}

const clearSpecificError = (field: FieldAccessor<any>, message: string) => {
	const errors = field.errors?.errors ?? []
	const error = errors.filter(e => !(e.type === 'validation' && e.message === message))
	field.clearErrors()
	error.forEach(e => field.addError(e))
}
