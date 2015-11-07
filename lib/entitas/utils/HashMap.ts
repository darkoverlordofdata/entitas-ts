module entitas.utils {

  /**
   * For documenting where Function refers to a class definition
   */
  export interface Class extends Function {}

  /**
   * Gets Class Metadata - Name
   *
   * @param klass
   * @return {string}
   */
  export function getClassName(klass) {
    return klass.className || klass.name;
  }

  /**
   * Decode HashMap key
   *
   * When the key is an object, we generate a unique uuid and use that as the actual key.
   */
  function decode(key) {
    switch (typeof key) {
      case 'boolean':
        return '' + key;
      case 'number':
        return '' + key;
      case 'string':
        return '' + key;
      case 'function':
        return getClassName(key);
      default:
        key.uuid = key.uuid ? key.uuid : UUID.randomUUID();
        return key.uuid
    }
  }

  /**
   * HashMap
   *
   * Allow object as key.
   */
  export class HashMap<K,V> implements Map<K,V> {

    private map_;
    private keys_;

    constructor() {
      this.clear();
    }

    clear() {
      this.map_ = {};
      this.keys_ = {};
    }

    values() {
      var result = [];
      var map = this.map_;

      for (var key in map) {
        result.push(map[key]);
      }
      return result;
    }


    contains(value):boolean {
      var map = this.map_;

      for (var key in map) {
        if (value === map[key]) {
          return true;
        }
      }
      return false;
    }

    containsKey(key):boolean {
      return decode(key) in this.map_;
    }

    containsValue(value):boolean {
      var map = this.map_;

      for (var key in map) {
        if (value === map[key]) {
          return true;
        }
      }
      return false;
    }


    get(key) {
      return this.map_[decode(key)];
    }

    isEmpty():boolean {
      return Object.keys(this.map_).length === 0;
    }

    keys() {
      var keys = this.map_;

      var result = [];
      for (var key in keys) {
        result.push(keys[key]);
      }
      return result;
    }

    /**
     * if key is a string, use as is, else use key.id_ or key.name
     */
    put(key, value) {
      var k = decode(key);
      this.map_[k] = value;
      this.keys_[k] = key;
    }

    remove(key) {
      var map = this.map_;
      var k = decode(key);
      var value = map[k];
      delete map[k];
      delete this.keys_[k];
      return value;
    }

    size():number {
      return Object.keys(this.map_).length;
    }

  }
}
