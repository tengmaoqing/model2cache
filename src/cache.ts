import { CacheOperator } from './interface'

export enum StoreType {
    localStorage = 1,
    sessionStorage,
    memory
}
const Mem = {}

const storages = {
    [StoreType.localStorage]: window.localStorage,
    [StoreType.sessionStorage]: window.sessionStorage,
    [StoreType.memory]: {
        setItem (key: string, value: any) {
            Mem[key] = value
        },
        getItem (key: string) {
            return Mem[key]
        },
        removeItem (key: string) {
            Mem[key] = null
            delete Mem[key]
        }
    }
}

export class Store implements CacheOperator {
    private storage
    constructor(storage: Storage, storeType: StoreType) {
        if (storage) {
            this.storage = storage
            return
        }
        this.storage = storages[storeType]
    }
	set(key: string, value: any) {
		this.storage.setItem(key, JSON.stringify(value))
	}
	get(key: string) {
		return JSON.parse(this.storage.getItem(key))
	}
	delete(key: string) {
		return this.storage.removeItem(key)
	}
}
