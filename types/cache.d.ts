import Vue from 'vue/types/index'
import { Options, Model2Cache } from '../src/model2cache'

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {
		cache?: Options | Options[]
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		$model2cache?: Model2Cache
	}
}
