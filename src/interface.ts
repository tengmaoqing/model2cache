
export interface CacheOperator {
	set: (key: string, value: any) => void
	get: (key: string) => any
	delete: (key: string) => any
}
