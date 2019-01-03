class Container<M extends Container.ServiceTypeMap> {
	private readonly services: Partial<M> = {}
	private readonly accessors: Readonly<M> = {} as any

	constructor(private factories: Container.ServiceFactoryMap<M>) {
		Object.keys(this.factories).forEach(name => {
			Object.defineProperty(this.accessors, name, {
				get: this.get.bind(this, name),
			})
		})
	}

	get<N extends keyof M>(name: N): M[N] {
		const service: M[N] | undefined = this.services[name]

		if (service === undefined) {
			return (this.services[name] = this.factories[name](this.accessors))
		}

		return service
	}
}

namespace Container {
	export type ServiceName = string
	export type ServiceType = any

	export type ServiceTypeMap = { [N in ServiceName]: ServiceType | undefined }

	export type ServiceFactory<M extends ServiceTypeMap, T> = (accessors: Readonly<M>) => T

	export type ServiceFactoryMap<M extends ServiceTypeMap> = { [N in keyof M]: ServiceFactory<M, M[N]> }

	export class Builder<M extends ServiceTypeMap> {
		constructor(private factories: ServiceFactoryMap<M>) {}

		addService<N extends ServiceName, T extends ServiceType>(
			name: N,
			factory: ServiceFactory<M, T>
		): Builder<M & { [K in N]: T }> {
			type TypeMapA = M
			type TypeMapB = { [K in N]: T }
			type TypeMapC = TypeMapA & TypeMapB

			type FactoryMapA = ServiceFactoryMap<TypeMapA>
			type FactoryMapB = ServiceFactoryMap<TypeMapB>
			type FactoryMapC = ServiceFactoryMap<TypeMapC>

			const factoryMapA: FactoryMapA = this.factories
			const factoryMapB: FactoryMapB = ({ [name]: factory } as any) as FactoryMapB
			const factoryMapC = (Object.assign(factoryMapB, factoryMapA) as any) as FactoryMapC

			return new Builder(factoryMapC)
		}

		build(): Container<M> {
			return new Container(this.factories)
		}
	}
}

export default Container
