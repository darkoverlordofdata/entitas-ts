module entitas.utils {

	export interface Map<K,V> {

		clear();
		containsKey(key):boolean;
		containsValue(value):boolean;
		get(key);
		isEmpty():boolean;
		put(key, value);
		remove(key);
		size():number;
		values();
	}
}
