import { BindingError } from '../../BindingError'
import type {
	EntityListSubTreeMarker,
	EntitySubTreeMarker,
	HasManyRelationMarker,
	HasOneRelationMarker,
} from '../../markers'
import type { RawMarkerPath } from './RawMarkerPath'

export class LocalizedBindingError extends BindingError {
	public constructor(message: string, public readonly markerPath: RawMarkerPath) {
		super(message)
	}

	public nestedIn(
		wrapper: EntitySubTreeMarker | EntityListSubTreeMarker | HasOneRelationMarker | HasManyRelationMarker,
	): LocalizedBindingError {
		return new LocalizedBindingError(this.message, [wrapper, ...this.markerPath])
	}
}
