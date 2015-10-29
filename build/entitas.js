var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        /**
         * Collection type a bit like ArrayList but does not preserve the order of its
         * entities, speedwise it is very good, especially suited for games.
         */
        var Bag = (function (_super) {
            __extends(Bag, _super);
            /**
             * Constructs an empty Bag with the specified initial capacity.
             * Constructs an empty Bag with an initial capacity of 64.
             *
             * @param capacity
             *            the initial capacity of Bag
             */
            function Bag(capacity) {
                if (capacity === void 0) { capacity = 64; }
                _super.call(this);
                this.size_ = 0;
                this.length = capacity;
            }
            /**
             * Removes the element at the specified position in this Bag. does this by
             * overwriting it was last element then removing last element
             *
             * @param index
             *            the index of element to be removed
             * @return element that was removed from the Bag
             */
            Bag.prototype.removeAt = function (index) {
                var e = this[index]; // make copy of element to remove so it can be returned
                this[index] = this[--this.size_]; // overwrite item to remove with last element
                this[this.size_] = null; // null last element, so gc can do its work
                return e;
            };
            /**
             * Removes the first occurrence of the specified element from this Bag, if
             * it is present. If the Bag does not contain the element, it is unchanged.
             * does this by overwriting it was last element then removing last element
             *
             * @param e
             *            element to be removed from this list, if present
             * @return <tt>true</tt> if this list contained the specified element
             */
            Bag.prototype.remove = function (e) {
                var i;
                var e2;
                var size = this.size_;
                for (i = 0; i < size; i++) {
                    e2 = this[i];
                    if (e == e2) {
                        this[i] = this[--this.size_]; // overwrite item to remove with last element
                        this[this.size_] = null; // null last element, so gc can do its work
                        return true;
                    }
                }
                return false;
            };
            /**
             * Remove and return the last object in the bag.
             *
             * @return the last object in the bag, null if empty.
             */
            Bag.prototype.removeLast = function () {
                if (this.size_ > 0) {
                    var e = this[--this.size_];
                    this[this.size_] = null;
                    return e;
                }
                return null;
            };
            /**
             * Check if bag contains this element.
             *
             * @param e
             * @return
             */
            Bag.prototype.contains = function (e) {
                var i;
                var size;
                for (i = 0, size = this.size_; size > i; i++) {
                    if (e === this[i]) {
                        return true;
                    }
                }
                return false;
            };
            /**
             * Removes from this Bag all of its elements that are contained in the
             * specified Bag.
             *
             * @param bag
             *            Bag containing elements to be removed from this Bag
             * @return {@code true} if this Bag changed as a result of the call
             */
            Bag.prototype.removeAll = function (bag) {
                var modified = false;
                var i;
                var j;
                var l;
                var e1;
                var e2;
                for (i = 0, l = bag.size(); i < l; i++) {
                    e1 = bag.get(i);
                    for (j = 0; j < this.size_; j++) {
                        e2 = this[j];
                        if (e1 === e2) {
                            this.removeAt(j);
                            j--;
                            modified = true;
                            break;
                        }
                    }
                }
                return modified;
            };
            /**
             * Returns the element at the specified position in Bag.
             *
             * @param index
             *            index of the element to return
             * @return the element at the specified position in bag
             *
             * @throws ArrayIndexOutOfBoundsException
             */
            Bag.prototype.get = function (index) {
                if (index >= this.length) {
                    throw new Error('ArrayIndexOutOfBoundsException');
                }
                return this[index];
            };
            /**
             * Returns the element at the specified position in Bag. This method
             * ensures that the bag grows if the requested index is outside the bounds
             * of the current backing array.
             *
             * @param index
             *      index of the element to return
             *
             * @return the element at the specified position in bag
             *
             */
            Bag.prototype.safeGet = function (index) {
                if (index >= this.length) {
                    this.grow((index * 7) / 4 + 1);
                }
                return this[index];
            };
            /**
             * Returns the number of elements in this bag.
             *
             * @return the number of elements in this bag
             */
            Bag.prototype.size = function () {
                return this.size_;
            };
            /**
             * Returns the number of elements the bag can hold without growing.
             *
             * @return the number of elements the bag can hold without growing.
             */
            Bag.prototype.getCapacity = function () {
                return this.length;
            };
            /**
             * Checks if the internal storage supports this index.
             *
             * @param index
             * @return
             */
            Bag.prototype.isIndexWithinBounds = function (index) {
                return index < this.getCapacity();
            };
            /**
             * Returns true if this list contains no elements.
             *
             * @return true if this list contains no elements
             */
            Bag.prototype.isEmpty = function () {
                return this.size_ == 0;
            };
            /**
             * Adds the specified element to the end of this bag. if needed also
             * increases the capacity of the bag.
             *
             * @param e
             *            element to be added to this list
             */
            Bag.prototype.add = function (e) {
                // is size greater than capacity increase capacity
                if (this.size_ === this.length) {
                    this.grow();
                }
                this[this.size_++] = e;
            };
            /**
             * Set element at specified index in the bag.
             *
             * @param index position of element
             * @param e the element
             */
            Bag.prototype.set = function (index, e) {
                if (index >= this.length) {
                    this.grow(index * 2);
                }
                this.size_ = index + 1;
                this[index] = e;
            };
            Bag.prototype.grow = function (newCapacity) {
                if (newCapacity === void 0) { newCapacity = ~~((this.length * 3) / 2) + 1; }
                this.length = ~~newCapacity;
            };
            Bag.prototype.ensureCapacity = function (index) {
                if (index >= this.length) {
                    this.grow(index * 2);
                }
            };
            /**
             * Removes all of the elements from this bag. The bag will be empty after
             * this call returns.
             */
            Bag.prototype.clear = function () {
                var i;
                var size;
                // null all elements so gc can clean up
                for (i = 0, size = this.size_; i < size; i++) {
                    this[i] = null;
                }
                this.size_ = 0;
            };
            /**
             * Add all items into this bag.
             * @param items
             */
            Bag.prototype.addAll = function (items) {
                var i;
                for (i = 0; items.size() > i; i++) {
                    this.add(items.get(i));
                }
            };
            return Bag;
        })(Array);
        utils.Bag = Bag;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        /*
         * BitSets are packed into arrays of "words."  Currently a word
         * consists of 32 bits, requiring 5 address bits.
         */
        var ADDRESS_BITS_PER_WORD = 5;
        var BITS_PER_WORD = 1 << ADDRESS_BITS_PER_WORD; // 32
        var WORD_MASK = 0xffffffff;
        /**
         * @see http://stackoverflow.com/questions/6506356/java-implementation-of-long-numberoftrailingzeros
         */
        function numberOfTrailingZeros(i) {
            if (i == 0)
                return 64;
            var x = i;
            var y;
            var n = 63;
            y = x << 32;
            if (y != 0) {
                n -= 32;
                x = y;
            }
            y = x << 16;
            if (y != 0) {
                n -= 16;
                x = y;
            }
            y = x << 8;
            if (y != 0) {
                n -= 8;
                x = y;
            }
            y = x << 4;
            if (y != 0) {
                n -= 4;
                x = y;
            }
            y = x << 2;
            if (y != 0) {
                n -= 2;
                x = y;
            }
            return (n - ((x << 1) >>> 63));
        }
        var BitSet = (function () {
            function BitSet(nbits) {
                if (nbits === void 0) { nbits = 0; }
                if (nbits < 0) {
                    throw RangeError("Negative Array Size: [" + nbits + ']');
                }
                else if (nbits === 0) {
                    this.words_ = [];
                }
                else {
                    var words = this.words_ = new Array(((nbits - 1) >> ADDRESS_BITS_PER_WORD) + 1);
                    for (var i = 0, l = words.length; i < l; i++) {
                        words[i] = 0;
                    }
                }
            }
            BitSet.prototype.nextSetBit = function (fromIndex) {
                var u = fromIndex >> ADDRESS_BITS_PER_WORD;
                var words = this.words_;
                var wordsInUse = words.length;
                var word = words[u] & (WORD_MASK << fromIndex);
                while (true) {
                    if (word !== 0)
                        return (u * BITS_PER_WORD) + numberOfTrailingZeros(word);
                    if (++u === wordsInUse)
                        return -1;
                    word = words[u];
                }
            };
            BitSet.prototype.intersects = function (set) {
                var words = this.words_;
                var wordsInUse = words.length;
                for (var i = Math.min(wordsInUse, set.words_.length) - 1; i >= 0; i--)
                    if ((words[i] & set.words_[i]) != 0)
                        return true;
                return false;
            };
            BitSet.prototype.hasAll = function (set) {
                var words = this.words_;
                var wordsInUse = words.length;
                for (var i = Math.min(wordsInUse, set.words_.length) - 1; i >= 0; i--)
                    if ((words[i] & set.words_[i]) != set.words_[i])
                        return false;
                return true;
            };
            // length():number {
            // 	return this.length_;
            // }
            // and(set:BitSet):BitSet {
            // }
            // or(set:BitSet):BitSet {
            // }
            // nand(set:BitSet):BitSet {
            // }
            // nor(set:BitSet):BitSet {
            // }
            // not(set:BitSet):BitSet {
            // }
            // xor(set:BitSet):BitSet {
            // }
            // equals(set:BitSet):boolean {
            // }
            // clone():BitSet {
            // }
            BitSet.prototype.isEmpty = function () {
                return this.words_.length === 0;
            };
            // toString():string {
            // }
            // cardinality():number {
            // }
            // msb():number {
            // }
            BitSet.prototype.set = function (bitIndex, value) {
                if (value === void 0) { value = true; }
                var wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
                var words = this.words_;
                var wordsInUse = words.length;
                var wordsRequired = wordIndex + 1;
                if (wordsInUse < wordsRequired) {
                    words.length = Math.max(2 * wordsInUse, wordsRequired);
                    for (var i = wordsInUse, l = words.length; i < l; i++) {
                        words[i] = 0;
                    }
                }
                if (value) {
                    return words[wordIndex] |= (1 << bitIndex);
                }
                else {
                    return words[wordIndex] &= ~(1 << bitIndex);
                }
            };
            // setRange(from:number, to:number, value:number):number {
            // }
            BitSet.prototype.get = function (bitIndex) {
                var wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
                var words = this.words_;
                var wordsInUse = words.length;
                return (wordIndex < wordsInUse) && ((words[wordIndex] & (1 << bitIndex)) != 0);
            };
            // getRange(from:number, to:number):number {
            // }
            BitSet.prototype.clear = function (bitIndex) {
                if (bitIndex === null) {
                    var words = this.words_;
                    var wordsInUse = words.length;
                    while (wordsInUse > 0) {
                        words[--wordsInUse] = 0;
                    }
                    return;
                }
                var wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
                this.words_[wordIndex] &= ~(1 << bitIndex);
            };
            return BitSet;
        })();
        utils.BitSet = BitSet;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        /**
         * Gets Class Metadata - Name
         *
         * @param {Function} klass
         * @return {string}
         */
        function getClassName(klass) {
            return klass.className || klass.name;
        }
        utils.getClassName = getClassName;
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
                    key.uuid = key.uuid ? key.uuid : utils.UUID.randomUUID();
                    return key.uuid;
            }
        }
        /**
         * HashMap
         *
         * Allow object as key.
         */
        var HashMap = (function () {
            function HashMap() {
                this.clear();
            }
            HashMap.prototype.clear = function () {
                this.map_ = {};
                this.keys_ = {};
            };
            HashMap.prototype.values = function () {
                var result = [];
                var map = this.map_;
                for (var key in map) {
                    result.push(map[key]);
                }
                return result;
            };
            HashMap.prototype.contains = function (value) {
                var map = this.map_;
                for (var key in map) {
                    if (value === map[key]) {
                        return true;
                    }
                }
                return false;
            };
            HashMap.prototype.containsKey = function (key) {
                return decode(key) in this.map_;
            };
            HashMap.prototype.containsValue = function (value) {
                var map = this.map_;
                for (var key in map) {
                    if (value === map[key]) {
                        return true;
                    }
                }
                return false;
            };
            HashMap.prototype.get = function (key) {
                return this.map_[decode(key)];
            };
            HashMap.prototype.isEmpty = function () {
                return Object.keys(this.map_).length === 0;
            };
            HashMap.prototype.keys = function () {
                var keys = this.map_;
                var result = [];
                for (var key in keys) {
                    result.push(keys[key]);
                }
                return result;
            };
            /**
             * if key is a string, use as is, else use key.id_ or key.name
             */
            HashMap.prototype.put = function (key, value) {
                var k = decode(key);
                this.map_[k] = value;
                this.keys_[k] = key;
            };
            HashMap.prototype.remove = function (key) {
                var map = this.map_;
                var k = decode(key);
                var value = map[k];
                delete map[k];
                delete this.keys_[k];
                return value;
            };
            HashMap.prototype.size = function () {
                return Object.keys(this.map_).length;
            };
            return HashMap;
        })();
        utils.HashMap = HashMap;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        var Bag = entitas.utils.Bag;
        var Signal = (function () {
            /**
             *
             * @param context
             * @param alloc
             */
            function Signal(context, alloc) {
                if (alloc === void 0) { alloc = 16; }
                this._listeners = new Bag();
                this._context = context;
                this._alloc = alloc;
                this.active = false;
            }
            /**
             * Dispatch event
             *
             * @param $0
             * @param $1
             * @param $2
             * @param $3
             * @param $4
             */
            Signal.prototype.dispatch = function ($0, $1, $2, $3, $4) {
                var listeners = this._listeners;
                var size = listeners.size();
                if (size <= 0)
                    return; // bail early
                var context = this._context;
                for (var i = 0; i < size; i++) {
                    listeners[i].call(context, $0, $1, $2, $3, $4);
                }
            };
            /**
             * Add event listener
             * @param listener
             */
            Signal.prototype.add = function (listener) {
                this._listeners.add(listener);
                this.active = true;
            };
            /**
             * Remove event listener
             * @param listener
             */
            Signal.prototype.remove = function (listener) {
                var listeners = this._listeners;
                listeners.remove(listener);
                this.active = listeners.size() > 0;
            };
            /**
             * Clear and reset to original alloc
             */
            Signal.prototype.clear = function () {
                this._listeners.clear();
                this.active = false;
            };
            return Signal;
        })();
        utils.Signal = Signal;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        var Stopwatch = (function () {
            function Stopwatch() {
                Stopwatch.isHighRes = performance ? true : false;
                this.reset();
            }
            Object.defineProperty(Stopwatch.prototype, "isRunning", {
                get: function () {
                    return this._isRunning;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stopwatch.prototype, "startTimeStamp", {
                get: function () {
                    return this._startTimeStamp;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stopwatch.prototype, "elapsed", {
                get: function () {
                    return this._elapsed;
                },
                enumerable: true,
                configurable: true
            });
            Stopwatch.prototype.start = function () {
                if (!this._isRunning) {
                    this._startTimeStamp = Stopwatch.getTimeStamp();
                    this._isRunning = true;
                }
            };
            Stopwatch.prototype.stop = function () {
                if (this._isRunning) {
                    this._elapsed += (Stopwatch.getTimeStamp() - this._startTimeStamp);
                    this._isRunning = false;
                }
            };
            Stopwatch.prototype.reset = function () {
                this._elapsed = 0;
                this._startTimeStamp = 0;
                this._isRunning = false;
            };
            Stopwatch.getTimeStamp = function () {
                return Stopwatch.isHighRes ? performance.now() : Date.now();
            };
            Stopwatch.isHighRes = false;
            return Stopwatch;
        })();
        utils.Stopwatch = Stopwatch;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        var hex = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f",
            "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f",
            "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f",
            "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f",
            "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f",
            "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f",
            "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f",
            "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f",
            "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f",
            "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f",
            "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af",
            "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf",
            "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf",
            "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df",
            "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef",
            "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"
        ];
        var UUID = (function () {
            function UUID() {
            }
            //static check = {};
            /**
             * Fast UUID generator, RFC4122 version 4 compliant
             * format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
             *
             * @author Jeff Ward (jcward.com).
             * @license MIT license
             * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
             **/
            UUID.randomUUID = function () {
                var d0 = Math.random() * 0xffffffff | 0;
                var d1 = Math.random() * 0xffffffff | 0;
                var d2 = Math.random() * 0xffffffff | 0;
                var d3 = Math.random() * 0xffffffff | 0;
                return hex[d0 & 0xff] + hex[d0 >> 8 & 0xff] + hex[d0 >> 16 & 0xff] + hex[d0 >> 24 & 0xff] + '-' +
                    hex[d1 & 0xff] + hex[d1 >> 8 & 0xff] + '-' + hex[d1 >> 16 & 0x0f | 0x40] + hex[d1 >> 24 & 0xff] + '-' +
                    hex[d2 & 0x3f | 0x80] + hex[d2 >> 8 & 0xff] + '-' + hex[d2 >> 16 & 0xff] + hex[d2 >> 24 & 0xff] +
                    hex[d3 & 0xff] + hex[d3 >> 8 & 0xff] + hex[d3 >> 16 & 0xff] + hex[d3 >> 24 & 0xff];
            };
            return UUID;
        })();
        utils.UUID = UUID;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var MatcherException = entitas.MatcherException;
    var Matcher = (function () {
        function Matcher() {
            this._id = Matcher.uniqueId++;
        }
        Object.defineProperty(Matcher.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matcher.prototype, "indices", {
            get: function () {
                if (!this._indices) {
                    this._indices = this.mergeIndices();
                }
                return this._indices;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matcher.prototype, "allOfIndices", {
            get: function () { return this._allOfIndices; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matcher.prototype, "anyOfIndices", {
            get: function () { return this._anyOfIndices; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matcher.prototype, "noneOfIndices", {
            get: function () { return this._noneOfIndices; },
            enumerable: true,
            configurable: true
        });
        Matcher.prototype.anyOf = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                this._anyOfIndices = Matcher.distinctIndices(args);
                this._indices = undefined;
                return this;
            }
            else {
                return this.anyOf.apply(this, Matcher.mergeIndices(args));
            }
        };
        Matcher.prototype.noneOf = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                this._noneOfIndices = Matcher.distinctIndices(args);
                this._indices = undefined;
                return this;
            }
            else {
                return this.noneOf.apply(this, Matcher.mergeIndices(args));
            }
        };
        Matcher.prototype.matches = function (entity) {
            var matchesAllOf = this._allOfIndices === undefined ? true : entity.hasComponents(this._allOfIndices);
            var matchesAnyOf = this._anyOfIndices === undefined ? true : entity.hasAnyComponent(this._anyOfIndices);
            var matchesNoneOf = this._noneOfIndices === undefined ? true : !entity.hasAnyComponent(this._noneOfIndices);
            return matchesAllOf && matchesAnyOf && matchesNoneOf;
        };
        Matcher.prototype.mergeIndices = function () {
            //var totalIndices = (this._allOfIndices !== undefined ? this._allOfIndices.length : 0)
            //  + (this._anyOfIndices !== undefined ? this._anyOfIndices.length : 0)
            //  + (this._noneOfIndices !== undefined ? this._noneOfIndices.length : 0);
            var indicesList = [];
            if (this._allOfIndices !== undefined) {
                indicesList = indicesList.concat(this._allOfIndices);
            }
            if (this._anyOfIndices !== undefined) {
                indicesList = indicesList.concat(this._anyOfIndices);
            }
            if (this._noneOfIndices !== undefined) {
                indicesList = indicesList.concat(this._noneOfIndices);
            }
            return Matcher.distinctIndices(indicesList);
        };
        Matcher.prototype.toString = function () {
            if (this._toStringCache === undefined) {
                var sb = [];
                if (this._allOfIndices !== undefined) {
                    Matcher.appendIndices(sb, "AllOf", this._allOfIndices);
                }
                if (this._anyOfIndices !== undefined) {
                    if (this._allOfIndices !== undefined) {
                        sb[sb.length] = '.';
                    }
                    Matcher.appendIndices(sb, "AnyOf", this._anyOfIndices);
                }
                if (this._noneOfIndices !== undefined) {
                    Matcher.appendIndices(sb, ".NoneOf", this._noneOfIndices);
                }
                this._toStringCache = sb.join('');
            }
            return this._toStringCache;
        };
        Matcher.prototype.equals = function (obj) {
            if (obj == null || obj === undefined)
                return false;
            var matcher = obj;
            if (!Matcher.equalIndices(matcher.allOfIndices, this._allOfIndices)) {
                return false;
            }
            if (!Matcher.equalIndices(matcher.anyOfIndices, this._anyOfIndices)) {
                return false;
            }
            if (!Matcher.equalIndices(matcher.noneOfIndices, this._noneOfIndices)) {
                return false;
            }
            return true;
        };
        Matcher.equalIndices = function (i1, i2) {
            if ((i1 === undefined) != (i2 === undefined)) {
                return false;
            }
            if (i1 === undefined) {
                return true;
            }
            if (i1.length !== i2.length) {
                return false;
            }
            for (var i = 0, indicesLength = i1.length; i < indicesLength; i++) {
                /** compare coerced values so we can compare string type to number type */
                if (i1[i] != i2[i]) {
                    return false;
                }
            }
            return true;
        };
        Matcher.distinctIndices = function (indices) {
            var indicesSet = {};
            for (var i = 0, l = indices.length; i < l; i++) {
                var k = '' + indices[i];
                indicesSet[k] = i;
            }
            return [].concat(Object.keys(indicesSet));
        };
        Matcher.mergeIndices = function (matchers) {
            var indices = [];
            for (var i = 0, matchersLength = matchers.length; i < matchersLength; i++) {
                var matcher = matchers[i];
                if (matcher.indices.length !== 1) {
                    throw new MatcherException(matcher);
                }
                indices[i] = matcher.indices[0];
            }
            return indices;
        };
        Matcher.allOf = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                var matcher = new Matcher();
                var indices = matcher._allOfIndices = Matcher.distinctIndices(args);
                return matcher;
            }
            else {
                return Matcher.allOf.apply(this, Matcher.mergeIndices(args));
            }
        };
        Matcher.anyOf = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                var matcher = new Matcher();
                var indices = matcher._anyOfIndices = Matcher.distinctIndices(args);
                return matcher;
            }
            else {
                return Matcher.anyOf.apply(this, Matcher.mergeIndices(args));
            }
        };
        Matcher.appendIndices = function (sb, prefix, indexArray) {
            var SEPERATOR = ", ";
            var j = sb.length;
            sb[j++] = prefix;
            sb[j++] = '(';
            var lastSeperator = indexArray.length - 1;
            for (var i = 0, indicesLength = indexArray.length; i < indicesLength; i++) {
                sb[j++] = '' + indexArray[i];
                if (i < lastSeperator) {
                    sb[j++] = SEPERATOR;
                }
            }
            sb[j++] = ')';
        };
        Matcher.uniqueId = 0;
        return Matcher;
    })();
    entitas.Matcher = Matcher;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var TriggerOnEvent = (function () {
        function TriggerOnEvent(trigger, eventType) {
            this.trigger = trigger;
            this.eventType = eventType;
        }
        return TriggerOnEvent;
    })();
    entitas.TriggerOnEvent = TriggerOnEvent;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var extensions;
    (function (extensions) {
        var Exception = entitas.Exception;
        var Collection = (function (_super) {
            __extends(Collection, _super);
            function Collection($0) {
                _super.call(this, $0);
            }
            Collection.prototype.singleEntity = function () {
                if (this.length !== 1) {
                    throw new Exception("Expected exactly one entity but found " + this.length);
                }
                return this[0];
            };
            return Collection;
        })(Array);
        extensions.Collection = Collection;
    })(extensions = entitas.extensions || (entitas.extensions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var extensions;
    (function (extensions) {
        var GroupEventType = entitas.GroupEventType;
        var GroupObserver = entitas.GroupObserver;
        entitas.Group.prototype.createObserver = function (eventType) {
            if (eventType === void 0) { eventType = GroupEventType.OnEntityAdded; }
            return new GroupObserver(this, eventType);
        };
    })(extensions = entitas.extensions || (entitas.extensions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var extensions;
    (function (extensions) {
        var Matcher = entitas.Matcher;
        var GroupEventType = entitas.GroupEventType;
        var TriggerOnEvent = entitas.TriggerOnEvent;
        Matcher.prototype.onEntityAdded = function () {
            return new TriggerOnEvent(this, GroupEventType.OnEntityAdded);
        };
        Matcher.prototype.onEntityRemoved = function () {
            return new TriggerOnEvent(this, GroupEventType.OnEntityRemoved);
        };
        Matcher.prototype.onEntityAddedOrRemoved = function () {
            return new TriggerOnEvent(this, GroupEventType.OnEntityAddedOrRemoved);
        };
    })(extensions = entitas.extensions || (entitas.extensions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var extensions;
    (function (extensions) {
        function as(obj, method1) {
            return method1 in obj ? obj : null;
        }
        entitas.Pool.prototype.getEntities = function (matcher) {
            if (matcher) {
                /** PoolExtension::getEntities */
                return this.getGroup(matcher).getEntities();
            }
            else {
                if (this._entitiesCache === undefined) {
                    var entities = this._entities;
                    var keys = Object.keys(entities);
                    var length = keys.length;
                    var entitiesCache = this._entitiesCache = new Array(length);
                    for (var i = 0; i < length; i++) {
                        entitiesCache[i] = entities[keys[i]];
                    }
                }
                return this._entitiesCache;
            }
        };
        entitas.Pool.prototype.createSystem = function (system) {
            if ('function' === typeof system) {
                var Klass = system;
                system = new Klass();
            }
            entitas.Pool.setPool(system, this);
            var reactiveSystem = as(system, 'trigger');
            if (reactiveSystem != null) {
                return new entitas.ReactiveSystem(this, reactiveSystem);
            }
            var multiReactiveSystem = as(system, 'triggers');
            if (multiReactiveSystem != null) {
                return new entitas.ReactiveSystem(this, multiReactiveSystem);
            }
            return system;
        };
        entitas.Pool.setPool = function (system, pool) {
            var poolSystem = as(system, 'setPool');
            if (poolSystem != null) {
                poolSystem.setPool(pool);
            }
        };
    })(extensions = entitas.extensions || (entitas.extensions = {}));
})(entitas || (entitas = {}));
/**
 * Inspired by Unity
 */
var entitas;
(function (entitas) {
    var browser;
    (function (browser) {
        var Systems = entitas.Systems;
        var VisualDebugging = (function () {
            function VisualDebugging() {
            }
            VisualDebugging.init = function (pool) {
                if (location.search === "?debug=true" && window['dat']) {
                    browser.gui = new dat.GUI({ height: 5 * 32 - 1, width: 300 });
                    var observer = new PoolObserver(pool);
                    VisualDebugging._controllers = {};
                    VisualDebugging._entities = browser.gui.addFolder('Entities');
                    VisualDebugging._pools = browser.gui.addFolder('Pools');
                    VisualDebugging._systems = browser.gui.addFolder('Systems');
                    VisualDebugging._entities.open();
                    VisualDebugging._pools.open();
                    VisualDebugging._systems.open();
                    VisualDebugging._pools.add(observer, 'entities').listen();
                    VisualDebugging._pools.add(observer, 'reusable').listen();
                    pool.onEntityCreated.add(function (pool, entity) {
                        var proxy = new EntityBehavior(entity);
                        VisualDebugging._controllers[entity.id] = VisualDebugging._entities.add(proxy, proxy.name).listen();
                    });
                    pool.onEntityDestroyed.add(function (pool, entity) {
                        var controller = VisualDebugging._controllers[entity.id];
                        delete VisualDebugging._controllers[entity.id];
                        VisualDebugging._entities.remove(controller);
                    });
                    Systems.prototype.initialize = function () {
                        for (var i = 0, initializeSysCount = this._initializeSystems.length; i < initializeSysCount; i++) {
                            this._initializeSystems[i].initialize();
                        }
                        var sys = new SystemObserver(this);
                        VisualDebugging._systems.add(sys, 'initialize').listen();
                        VisualDebugging._systems.add(sys, 'execute').listen();
                    };
                    function get_Systems() {
                        return "Systems " + " (" +
                            this._initializeSystems.length + " init, " +
                            this._executeSystems.length + " exe ";
                    }
                    Object.defineProperty(Systems.prototype, 'name', { get: function () { return 'Systems'; } });
                    Object.defineProperty(Systems.prototype, 'Systems', { get: get_Systems });
                }
            };
            return VisualDebugging;
        })();
        browser.VisualDebugging = VisualDebugging;
        /**
         * Profiler class for Entities
         */
        var EntityBehavior = (function () {
            function EntityBehavior(obj) {
                var _this = this;
                this.obj = obj;
                if (this.obj.name) {
                    this._name = this.obj.name;
                }
                else {
                    this._name = "Entity_" + this.obj._creationIndex;
                }
                Object.defineProperty(this, this._name, { get: function () { return _this.obj.toString(); } });
            }
            Object.defineProperty(EntityBehavior.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            return EntityBehavior;
        })();
        browser.EntityBehavior = EntityBehavior;
        /**
         * Profiler class for Systems
         */
        var SystemObserver = (function () {
            function SystemObserver(_systems) {
                this._systems = _systems;
            }
            Object.defineProperty(SystemObserver.prototype, "name", {
                get: function () {
                    return "Systems";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemObserver.prototype, "Systems", {
                get: function () {
                    return "Systems " + " (" +
                        this._systems._initializeSystems.length + " init, " +
                        this._systems._executeSystems.length + " exe ";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemObserver.prototype, "initialize", {
                get: function () {
                    return this._systems._initializeSystems.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemObserver.prototype, "execute", {
                get: function () {
                    return this._systems._executeSystems.length;
                },
                enumerable: true,
                configurable: true
            });
            return SystemObserver;
        })();
        browser.SystemObserver = SystemObserver;
        /**
         * Profiler class for Pools
         */
        var PoolObserver = (function () {
            function PoolObserver(_pool) {
                this._pool = _pool;
                this._groups = this._pool._groups;
            }
            Object.defineProperty(PoolObserver.prototype, "name", {
                get: function () {
                    return "Pool";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PoolObserver.prototype, "Pool", {
                get: function () {
                    return "Pool " + " (" +
                        this._pool.count + " entities, " +
                        this._pool.reusableEntitiesCount + " reusable, " +
                        Object.keys(this._groups).length + " groups)";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PoolObserver.prototype, "entities", {
                get: function () {
                    return this._pool.count;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PoolObserver.prototype, "reusable", {
                get: function () {
                    return this._pool.reusableEntitiesCount;
                },
                enumerable: true,
                configurable: true
            });
            return PoolObserver;
        })();
        browser.PoolObserver = PoolObserver;
    })(browser = entitas.browser || (entitas.browser = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var Exception = (function () {
        function Exception(message) {
            this.message = message;
        }
        Exception.prototype.toString = function () {
            return this.message;
        };
        return Exception;
    })();
    entitas.Exception = Exception;
    var EntityAlreadyHasComponentException = (function (_super) {
        __extends(EntityAlreadyHasComponentException, _super);
        function EntityAlreadyHasComponentException(message, index) {
            _super.call(this, message + "\nEntity already has a component at index " + index);
        }
        return EntityAlreadyHasComponentException;
    })(Exception);
    entitas.EntityAlreadyHasComponentException = EntityAlreadyHasComponentException;
    var EntityDoesNotHaveComponentException = (function (_super) {
        __extends(EntityDoesNotHaveComponentException, _super);
        function EntityDoesNotHaveComponentException(message, index) {
            _super.call(this, message + "\nEntity does not have a component at index " + index);
        }
        return EntityDoesNotHaveComponentException;
    })(Exception);
    entitas.EntityDoesNotHaveComponentException = EntityDoesNotHaveComponentException;
    var EntityIsNotEnabledException = (function (_super) {
        __extends(EntityIsNotEnabledException, _super);
        function EntityIsNotEnabledException(message) {
            _super.call(this, message + "\nEntity is not enabled");
        }
        return EntityIsNotEnabledException;
    })(Exception);
    entitas.EntityIsNotEnabledException = EntityIsNotEnabledException;
    var EntityIsAlreadyReleasedException = (function (_super) {
        __extends(EntityIsAlreadyReleasedException, _super);
        function EntityIsAlreadyReleasedException() {
            _super.call(this, "Entity is already released!");
        }
        return EntityIsAlreadyReleasedException;
    })(Exception);
    entitas.EntityIsAlreadyReleasedException = EntityIsAlreadyReleasedException;
    var SingleEntityException = (function (_super) {
        __extends(SingleEntityException, _super);
        function SingleEntityException(matcher) {
            _super.call(this, "Multiple entities exist matching " + matcher);
        }
        return SingleEntityException;
    })(Exception);
    entitas.SingleEntityException = SingleEntityException;
    var GroupObserverException = (function (_super) {
        __extends(GroupObserverException, _super);
        function GroupObserverException(message) {
            _super.call(this, message);
        }
        return GroupObserverException;
    })(Exception);
    entitas.GroupObserverException = GroupObserverException;
    var PoolDoesNotContainEntityException = (function (_super) {
        __extends(PoolDoesNotContainEntityException, _super);
        function PoolDoesNotContainEntityException(entity, message) {
            _super.call(this, message + "\nPool does not contain entity " + entity);
        }
        return PoolDoesNotContainEntityException;
    })(Exception);
    entitas.PoolDoesNotContainEntityException = PoolDoesNotContainEntityException;
    var EntityIsNotDestroyedException = (function (_super) {
        __extends(EntityIsNotDestroyedException, _super);
        function EntityIsNotDestroyedException(message) {
            _super.call(this, message + "\nEntity is not destroyed yet!");
        }
        return EntityIsNotDestroyedException;
    })(Exception);
    entitas.EntityIsNotDestroyedException = EntityIsNotDestroyedException;
    var MatcherException = (function (_super) {
        __extends(MatcherException, _super);
        function MatcherException(matcher) {
            _super.call(this, "matcher.indices.length must be 1 but was " + matcher.indices.length);
        }
        return MatcherException;
    })(Exception);
    entitas.MatcherException = MatcherException;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var Signal = entitas.utils.Signal;
    var EntityIsNotEnabledException = entitas.EntityIsNotEnabledException;
    var EntityIsAlreadyReleasedException = entitas.EntityIsAlreadyReleasedException;
    var EntityAlreadyHasComponentException = entitas.EntityAlreadyHasComponentException;
    var EntityDoesNotHaveComponentException = entitas.EntityDoesNotHaveComponentException;
    var Entity = (function () {
        function Entity(componentsEnum, totalComponents) {
            if (totalComponents === void 0) { totalComponents = 16; }
            this._creationIndex = 0;
            this._isEnabled = true;
            this._refCount = 0;
            this.onEntityReleased = new Signal(this);
            this.onComponentAdded = new Signal(this);
            this.onComponentRemoved = new Signal(this);
            this.onComponentReplaced = new Signal(this);
            this._componentsEnum = componentsEnum;
            this._components = new Array(totalComponents);
        }
        Object.defineProperty(Entity.prototype, "creationIndex", {
            get: function () { return this._creationIndex; },
            enumerable: true,
            configurable: true
        });
        Entity.prototype.addComponent = function (index, component) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot add component!");
            }
            if (this.hasComponent(index)) {
                var errorMsg = "Cannot add component at index " + index + " to " + this;
                throw new EntityAlreadyHasComponentException(errorMsg, index);
            }
            this._components[index] = component;
            this._componentsCache = undefined;
            this._componentIndicesCache = undefined;
            this._toStringCache = undefined;
            var onComponentAdded = this.onComponentAdded;
            if (onComponentAdded.active)
                onComponentAdded.dispatch(this, index, component);
            return this;
        };
        Entity.prototype.removeComponent = function (index) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot remove component!");
            }
            if (!this.hasComponent(index)) {
                var errorMsg = "Cannot remove component at index " + index + " from " + this;
                throw new EntityDoesNotHaveComponentException(errorMsg, index);
            }
            this._replaceComponent(index, undefined);
            return this;
        };
        Entity.prototype.replaceComponent = function (index, component) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot replace component!");
            }
            if (this.hasComponent(index)) {
                this._replaceComponent(index, component);
            }
            else if (component !== undefined) {
                this.addComponent(index, component);
            }
            return this;
        };
        Entity.prototype._replaceComponent = function (index, replacement) {
            var components = this._components;
            var previousComponent = components[index];
            if (previousComponent === replacement) {
                var onComponentReplaced = this.onComponentReplaced;
                if (onComponentReplaced.active)
                    onComponentReplaced.dispatch(this, index, previousComponent, replacement);
            }
            else {
                components[index] = replacement;
                this._componentsCache = undefined;
                if (replacement === undefined) {
                    delete components[index];
                    this._componentIndicesCache = undefined;
                    this._toStringCache = undefined;
                    var onComponentRemoved = this.onComponentRemoved;
                    if (onComponentRemoved.active)
                        onComponentRemoved.dispatch(this, index, previousComponent);
                }
                else {
                    var onComponentReplaced = this.onComponentReplaced;
                    if (onComponentReplaced.active)
                        onComponentReplaced.dispatch(this, index, previousComponent, replacement);
                }
            }
        };
        Entity.prototype.getComponent = function (index) {
            if (!this.hasComponent(index)) {
                var errorMsg = "Cannot get component at index " + index + " from " + this;
                throw new EntityDoesNotHaveComponentException(errorMsg, index);
            }
            return this._components[index];
        };
        Entity.prototype.getComponents = function () {
            if (this._componentsCache === undefined) {
                var components = [];
                var _components = this._components;
                for (var i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
                    var component = _components[i];
                    if (component !== undefined) {
                        components[j++] = component;
                    }
                }
                this._componentsCache = components;
            }
            return this._componentsCache;
        };
        Entity.prototype.getComponentIndices = function () {
            if (this._componentIndicesCache === undefined) {
                var indices = [];
                var _components = this._components;
                for (var i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
                    if (_components[i] !== undefined) {
                        indices[j++] = i;
                    }
                }
                this._componentIndicesCache = indices;
            }
            return this._componentIndicesCache;
        };
        Entity.prototype.hasComponent = function (index) {
            return this._components[index] !== undefined;
        };
        Entity.prototype.hasComponents = function (indices) {
            var _components = this._components;
            for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
                if (_components[indices[i]] === undefined) {
                    return false;
                }
            }
            return true;
        };
        Entity.prototype.hasAnyComponent = function (indices) {
            var _components = this._components;
            for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
                if (_components[indices[i]] !== undefined) {
                    return true;
                }
            }
            return false;
        };
        Entity.prototype.removeAllComponents = function () {
            this._toStringCache = undefined;
            var _components = this._components;
            for (var i = 0, componentsLength = _components.length; i < componentsLength; i++) {
                if (_components[i] !== undefined) {
                    this._replaceComponent(i, undefined);
                }
            }
        };
        Entity.prototype.destroy = function () {
            this.removeAllComponents();
            this.onComponentAdded.clear();
            this.onComponentReplaced.clear();
            this.onComponentRemoved.clear();
            this._isEnabled = false;
        };
        Entity.prototype.toString = function () {
            if (this._toStringCache === undefined) {
                var sb = [];
                var seperator = ", ";
                var components = this.getComponents();
                var lastSeperator = components.length - 1;
                for (var i = 0, j = 0, componentsLength = components.length; i < componentsLength; i++) {
                    sb[j++] = components[i].constructor['name'].replace('Component', '') || i + '';
                    if (i < lastSeperator) {
                        sb[j++] = seperator;
                    }
                }
                this._toStringCache = sb.join('');
            }
            return this._toStringCache;
        };
        Entity.prototype.addRef = function () {
            this._refCount += 1;
            return this;
        };
        Entity.prototype.release = function () {
            this._refCount -= 1;
            if (this._refCount === 0) {
                var onEntityReleased = this.onEntityReleased;
                if (onEntityReleased.active)
                    onEntityReleased.dispatch(this);
            }
            else if (this._refCount < 0) {
                throw new EntityIsAlreadyReleasedException();
            }
        };
        return Entity;
    })();
    entitas.Entity = Entity;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var Signal = entitas.utils.Signal;
    var SingleEntityException = entitas.SingleEntityException;
    var Group = (function () {
        function Group(matcher) {
            this._entities = {};
            this.onEntityAdded = new Signal(this);
            this.onEntityRemoved = new Signal(this);
            this.onEntityUpdated = new Signal(this);
            this._matcher = matcher;
        }
        Object.defineProperty(Group.prototype, "count", {
            get: function () { return Object.keys(this._entities).length; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "matcher", {
            get: function () { return this._matcher; },
            enumerable: true,
            configurable: true
        });
        Group.prototype.handleEntitySilently = function (entity) {
            if (this._matcher.matches(entity)) {
                this.addEntitySilently(entity);
            }
            else {
                this.removeEntitySilently(entity);
            }
        };
        Group.prototype.handleEntity = function (entity, index, component) {
            if (this._matcher.matches(entity)) {
                this.addEntity(entity, index, component);
            }
            else {
                this.removeEntity(entity, index, component);
            }
        };
        Group.prototype.updateEntity = function (entity, index, previousComponent, newComponent) {
            if (entity.id in this._entities) {
                var onEntityRemoved = this.onEntityRemoved;
                if (onEntityRemoved.active)
                    onEntityRemoved.dispatch(this, entity, index, previousComponent);
                var onEntityAdded = this.onEntityAdded;
                if (onEntityAdded.active)
                    onEntityAdded.dispatch(this, entity, index, newComponent);
                var onEntityUpdated = this.onEntityUpdated;
                if (onEntityUpdated.active)
                    onEntityUpdated.dispatch(this, entity, index, previousComponent, newComponent);
            }
        };
        Group.prototype.addEntitySilently = function (entity) {
            if (!(entity.id in this._entities)) {
                this._entities[entity.id] = entity;
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.addRef();
            }
        };
        Group.prototype.addEntity = function (entity, index, component) {
            if (!(entity.id in this._entities)) {
                this._entities[entity.id] = entity;
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.addRef();
                var onEntityAdded = this.onEntityAdded;
                if (onEntityAdded.active)
                    onEntityAdded.dispatch(this, entity, index, component);
            }
        };
        Group.prototype.removeEntitySilently = function (entity) {
            if (entity.id in this._entities) {
                delete this._entities[entity.id];
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.release();
            }
        };
        Group.prototype.removeEntity = function (entity, index, component) {
            if (entity.id in this._entities) {
                delete this._entities[entity.id];
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                var onEntityRemoved = this.onEntityRemoved;
                if (onEntityRemoved.active)
                    onEntityRemoved.dispatch(this, entity, index, component);
                entity.release();
            }
        };
        Group.prototype.containsEntity = function (entity) {
            return entity.id in this._entities;
        };
        Group.prototype.getEntities = function () {
            if (this._entitiesCache === undefined) {
                var entities = this._entities;
                var keys = Object.keys(entities);
                var length = keys.length;
                var entitiesCache = this._entitiesCache = new Array(length);
                for (var i = 0; i < length; i++) {
                    entitiesCache[i] = entities[keys[i]];
                }
            }
            return this._entitiesCache;
        };
        Group.prototype.getSingleEntity = function () {
            if (this._singleEntityCache === undefined) {
                var enumerator = Object.keys(this._entities);
                var c = enumerator.length;
                if (c === 1) {
                    this._singleEntityCache = this._entities[enumerator[0]];
                }
                else if (c === 0) {
                    return undefined;
                }
                else {
                    throw new SingleEntityException(this._matcher);
                }
            }
            return this._singleEntityCache;
        };
        Group.prototype.toString = function () {
            if (this._toStringCache === undefined) {
                this._toStringCache = "Group(" + this._matcher + ")";
            }
            return this._toStringCache;
        };
        return Group;
    })();
    entitas.Group = Group;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var GroupObserverException = entitas.GroupObserverException;
    (function (GroupEventType) {
        GroupEventType[GroupEventType["OnEntityAdded"] = 0] = "OnEntityAdded";
        GroupEventType[GroupEventType["OnEntityRemoved"] = 1] = "OnEntityRemoved";
        GroupEventType[GroupEventType["OnEntityAddedOrRemoved"] = 2] = "OnEntityAddedOrRemoved";
    })(entitas.GroupEventType || (entitas.GroupEventType = {}));
    var GroupEventType = entitas.GroupEventType;
    var GroupObserver = (function () {
        function GroupObserver(groups, eventTypes) {
            var _this = this;
            this._collectedEntities = {};
            this.addEntity = function (group, entity, index, component) {
                if (!(entity.id in _this._collectedEntities)) {
                    _this._collectedEntities[entity.id] = entity;
                    entity.addRef();
                }
            };
            this._groups = Array.isArray(groups) ? groups : [groups];
            this._eventTypes = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
            if (groups.length !== eventTypes.length) {
                throw new GroupObserverException("Unbalanced count with groups (" + groups.length +
                    ") and event types (" + eventTypes.length + ")");
            }
            this._collectedEntities = {};
            this._addEntityCache = this.addEntity;
            this.activate();
        }
        Object.defineProperty(GroupObserver.prototype, "collectedEntities", {
            get: function () { return this._collectedEntities; },
            enumerable: true,
            configurable: true
        });
        GroupObserver.prototype.activate = function () {
            for (var i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
                var group = this._groups[i];
                var eventType = this._eventTypes[i];
                if (eventType === GroupEventType.OnEntityAdded) {
                    group.onEntityAdded.remove(this._addEntityCache);
                    group.onEntityAdded.add(this._addEntityCache);
                }
                else if (eventType === GroupEventType.OnEntityRemoved) {
                    group.onEntityRemoved.remove(this._addEntityCache);
                    group.onEntityRemoved.add(this._addEntityCache);
                }
                else if (eventType === GroupEventType.OnEntityAddedOrRemoved) {
                    group.onEntityAdded.remove(this._addEntityCache);
                    group.onEntityAdded.add(this._addEntityCache);
                    group.onEntityRemoved.remove(this._addEntityCache);
                    group.onEntityRemoved.add(this._addEntityCache);
                }
                else {
                    throw "Invalid eventType [" + typeof eventType + ":" + eventType + "] in GroupObserver::activate";
                }
            }
        };
        GroupObserver.prototype.deactivate = function () {
            var e;
            for (var i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
                var group = this._groups[i];
                group.onEntityAdded.remove(this._addEntityCache);
                group.onEntityRemoved.remove(this._addEntityCache);
                this.clearCollectedEntities();
            }
        };
        GroupObserver.prototype.clearCollectedEntities = function () {
            for (var e in this._collectedEntities) {
                this._collectedEntities[e].release();
            }
            this._collectedEntities = {};
        };
        return GroupObserver;
    })();
    entitas.GroupObserver = GroupObserver;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var UUID = entitas.utils.UUID;
    var Bag = entitas.utils.Bag;
    var Group = entitas.Group;
    var Entity = entitas.Entity;
    var Signal = entitas.utils.Signal;
    var EntityIsNotDestroyedException = entitas.EntityIsNotDestroyedException;
    var PoolDoesNotContainEntityException = entitas.PoolDoesNotContainEntityException;
    var Pool = (function () {
        function Pool(components, totalComponents, startCreationIndex) {
            var _this = this;
            if (startCreationIndex === void 0) { startCreationIndex = 0; }
            this._entities = {};
            this._groups = {};
            this._reusableEntities = new Bag();
            this._retainedEntities = {};
            this._totalComponents = 0;
            this._creationIndex = 0;
            this.updateGroupsComponentAddedOrRemoved = function (entity, index, component) {
                var groups = _this._groupsForIndex[index];
                if (groups !== undefined) {
                    for (var i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
                        groups[i].handleEntity(entity, index, component);
                    }
                }
            };
            this.updateGroupsComponentReplaced = function (entity, index, previousComponent, newComponent) {
                var groups = _this._groupsForIndex[index];
                if (groups !== undefined) {
                    for (var i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
                        groups[i].updateEntity(entity, index, previousComponent, newComponent);
                    }
                }
            };
            this.onEntityReleased = function (entity) {
                if (entity._isEnabled) {
                    throw new EntityIsNotDestroyedException("Cannot release entity.");
                }
                entity.onEntityReleased.remove(_this._cachedOnEntityReleased);
                delete _this._retainedEntities[entity.id];
                _this._reusableEntities.add(entity);
            };
            this.onGroupCreated = new Signal(this);
            this.onEntityCreated = new Signal(this);
            this.onEntityDestroyed = new Signal(this);
            this.onEntityWillBeDestroyed = new Signal(this);
            this._componentsEnum = components;
            this._totalComponents = totalComponents;
            this._creationIndex = startCreationIndex;
            this._groupsForIndex = new Bag();
            this._cachedUpdateGroupsComponentAddedOrRemoved = this.updateGroupsComponentAddedOrRemoved;
            this._cachedUpdateGroupsComponentReplaced = this.updateGroupsComponentReplaced;
            this._cachedOnEntityReleased = this.onEntityReleased;
            Pool.componentsEnum = components;
            Pool.totalComponents = totalComponents;
        }
        Object.defineProperty(Pool.prototype, "totalComponents", {
            get: function () { return this._totalComponents; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "count", {
            get: function () { return Object.keys(this._entities).length; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "reusableEntitiesCount", {
            get: function () { return this._reusableEntities.size(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "retainedEntitiesCount", {
            get: function () { return Object.keys(this._retainedEntities).length; },
            enumerable: true,
            configurable: true
        });
        /**
         * groupDesc
         *
         * expand out the group tostring for better debug info
         *
         * @param group
         * @returns {string}
         */
        Pool.groupDesc = function (group) {
            var s = group.toString();
            for (var c = Pool.totalComponents; c > -1; c--) {
                s = s.replace('' + c, Pool.componentsEnum[c]);
            }
            return s;
        };
        /**
         *
         * @param name
         */
        Pool.prototype.createEntity = function (name) {
            var entity = this._reusableEntities.size() > 0 ? this._reusableEntities.removeLast() : new Entity(this._componentsEnum, this._totalComponents);
            entity._isEnabled = true;
            entity.name = name;
            entity._creationIndex = this._creationIndex++;
            entity.id = UUID.randomUUID();
            entity.addRef();
            this._entities[entity.id] = entity;
            this._entitiesCache = undefined;
            entity.onComponentAdded.add(this._cachedUpdateGroupsComponentAddedOrRemoved);
            entity.onComponentRemoved.add(this._cachedUpdateGroupsComponentAddedOrRemoved);
            entity.onComponentReplaced.add(this._cachedUpdateGroupsComponentReplaced);
            entity.onEntityReleased.add(this._cachedOnEntityReleased);
            var onEntityCreated = this.onEntityCreated;
            if (onEntityCreated.active)
                onEntityCreated.dispatch(this, entity);
            return entity;
        };
        /**
         *
         * @param entity
         */
        Pool.prototype.destroyEntity = function (entity) {
            if (!(entity.id in this._entities)) {
                throw new PoolDoesNotContainEntityException(entity, "Could not destroy entity!");
            }
            delete this._entities[entity.id];
            this._entitiesCache = undefined;
            var onEntityWillBeDestroyed = this.onEntityWillBeDestroyed;
            if (onEntityWillBeDestroyed.active)
                onEntityWillBeDestroyed.dispatch(this, entity);
            entity.destroy();
            var onEntityDestroyed = this.onEntityDestroyed;
            if (onEntityDestroyed.active)
                onEntityDestroyed.dispatch(this, entity);
            if (entity._refCount === 1) {
                entity.onEntityReleased.remove(this._cachedOnEntityReleased);
                this._reusableEntities.add(entity);
            }
            else {
                this._retainedEntities[entity.id] = entity;
            }
            entity.release();
        };
        Pool.prototype.destroyAllEntities = function () {
            var entities = this.getEntities();
            for (var i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
                this.destroyEntity(entities[i]);
            }
        };
        Pool.prototype.hasEntity = function (entity) {
            return entity.id in this._entities;
        };
        Pool.prototype.getEntities = function () {
            if (this._entitiesCache === undefined) {
                var entities = this._entities;
                var keys = Object.keys(entities);
                var length = keys.length;
                var entitiesCache = this._entitiesCache = new Array(length);
                for (var i = 0; i < length; i++) {
                    var k = keys[i];
                    entitiesCache[i] = entities[k];
                }
            }
            return entitiesCache;
        };
        Pool.prototype.getGroup = function (matcher) {
            var group;
            if (matcher.id in this._groups) {
                group = this._groups[matcher.id];
            }
            else {
                group = new Group(matcher);
                var entities = this.getEntities();
                for (var i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
                    group.handleEntitySilently(entities[i]);
                }
                this._groups[matcher.id] = group;
                for (var i = 0, indicesLength = matcher.indices.length; i < indicesLength; i++) {
                    var index = matcher.indices[i];
                    if (this._groupsForIndex[index] === undefined) {
                        this._groupsForIndex[index] = new Bag();
                    }
                    this._groupsForIndex[index].add(group);
                }
                var onGroupCreated = this.onGroupCreated;
                if (onGroupCreated.active)
                    onGroupCreated.dispatch(this, group);
            }
            return group;
        };
        Pool.totalComponents = 0;
        return Pool;
    })();
    entitas.Pool = Pool;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var GroupObserver = entitas.GroupObserver;
    function as(obj, method1) {
        return method1 in obj ? obj : null;
    }
    var ReactiveSystem = (function () {
        function ReactiveSystem(pool, subSystem) {
            var triggers = 'triggers' in subSystem ? subSystem['triggers'] : [subSystem['trigger']];
            this._subsystem = subSystem;
            var ensureComponents = as(subSystem, 'ensureComponents');
            if (ensureComponents != null) {
                this._ensureComponents = ensureComponents.ensureComponents;
            }
            var excludeComponents = as(subSystem, 'excludeComponents');
            if (excludeComponents != null) {
                this._excludeComponents = excludeComponents.excludeComponents;
            }
            this._clearAfterExecute = as(subSystem, 'clearAfterExecute') != null;
            var triggersLength = triggers.length;
            var groups = new Array(triggersLength);
            var eventTypes = new Array(triggersLength);
            for (var i = 0; i < triggersLength; i++) {
                var trigger = triggers[i];
                groups[i] = pool.getGroup(trigger.trigger);
                eventTypes[i] = trigger.eventType;
            }
            this._observer = new GroupObserver(groups, eventTypes);
            this._buffer = [];
        }
        Object.defineProperty(ReactiveSystem.prototype, "subsystem", {
            get: function () { return this._subsystem; },
            enumerable: true,
            configurable: true
        });
        ReactiveSystem.prototype.activate = function () {
            this._observer.activate();
        };
        ReactiveSystem.prototype.deactivate = function () {
            this._observer.deactivate();
        };
        ReactiveSystem.prototype.clear = function () {
            this._observer.clearCollectedEntities();
        };
        ReactiveSystem.prototype.execute = function () {
            var collectedEntities = this._observer.collectedEntities;
            var ensureComponents = this._ensureComponents;
            var excludeComponents = this._excludeComponents;
            var buffer = this._buffer;
            var j = buffer.length;
            if (Object.keys(collectedEntities).length != 0) {
                if (ensureComponents) {
                    if (excludeComponents) {
                        for (var k in collectedEntities) {
                            var e = collectedEntities[k];
                            if (ensureComponents.matches(e) && !excludeComponents.matches(e)) {
                                buffer[j++] = e.addRef();
                            }
                        }
                    }
                    else {
                        for (var k in collectedEntities) {
                            var e = collectedEntities[k];
                            if (ensureComponents.matches(e)) {
                                buffer[j++] = e.addRef();
                            }
                        }
                    }
                }
                else if (excludeComponents) {
                    for (var k in collectedEntities) {
                        var e = collectedEntities[k];
                        if (!excludeComponents.matches(e)) {
                            buffer[j++] = e.addRef();
                        }
                    }
                }
                else {
                    for (var k in collectedEntities) {
                        var e = collectedEntities[k];
                        buffer[j++] = e.addRef();
                    }
                }
                this._observer.clearCollectedEntities();
                if (buffer.length != 0) {
                    this._subsystem.execute(buffer);
                    for (var i = 0, bufferCount = buffer.length; i < bufferCount; i++) {
                        buffer[i].release();
                    }
                    buffer.length = 0;
                    if (this._clearAfterExecute) {
                        this._observer.clearCollectedEntities();
                    }
                }
            }
        };
        return ReactiveSystem;
    })();
    entitas.ReactiveSystem = ReactiveSystem;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    function as(obj, method1) {
        return method1 in obj ? obj : null;
    }
    (function (SystemType) {
        SystemType[SystemType["IInitializeSystem"] = 1] = "IInitializeSystem";
        SystemType[SystemType["IExecuteSystem"] = 2] = "IExecuteSystem";
        SystemType[SystemType["IReactiveExecuteSystem"] = 4] = "IReactiveExecuteSystem";
        SystemType[SystemType["IMultiReactiveSystem"] = 8] = "IMultiReactiveSystem";
        SystemType[SystemType["IReactiveSystem"] = 16] = "IReactiveSystem";
        SystemType[SystemType["IEnsureComponents"] = 32] = "IEnsureComponents";
        SystemType[SystemType["IExcludeComponents"] = 64] = "IExcludeComponents";
        SystemType[SystemType["IClearReactiveSystem"] = 128] = "IClearReactiveSystem";
    })(entitas.SystemType || (entitas.SystemType = {}));
    var SystemType = entitas.SystemType;
    var Systems = (function () {
        function Systems() {
            this._initializeSystems = [];
            this._executeSystems = [];
            /**
             * Load Extensions
             */
        }
        Systems.prototype.add = function (system) {
            if ('function' === typeof system) {
                var Klass = system;
                system = new Klass();
            }
            var reactiveSystem = as(system, 'subsystem');
            var initializeSystem = reactiveSystem != null
                ? as(reactiveSystem.subsystem, 'initialize')
                : as(system, 'initialize');
            if (initializeSystem != null) {
                var _initializeSystems = this._initializeSystems;
                _initializeSystems[_initializeSystems.length] = initializeSystem;
            }
            var executeSystem = as(system, 'execute');
            if (executeSystem != null) {
                var _executeSystems = this._executeSystems;
                _executeSystems[_executeSystems.length] = executeSystem;
            }
            return this;
        };
        Systems.prototype.initialize = function () {
            for (var i = 0, initializeSysCount = this._initializeSystems.length; i < initializeSysCount; i++) {
                this._initializeSystems[i].initialize();
            }
        };
        Systems.prototype.execute = function () {
            var executeSystems = this._executeSystems;
            for (var i = 0, exeSysCount = executeSystems.length; i < exeSysCount; i++) {
                executeSystems[i].execute();
            }
        };
        Systems.prototype.clearReactiveSystems = function () {
            for (var i = 0, exeSysCount = this._executeSystems.length; i < exeSysCount; i++) {
                var reactiveSystem = as(this._executeSystems[i], 'subsystem');
                if (reactiveSystem != null) {
                    reactiveSystem.clear();
                }
                var nestedSystems = as(this._executeSystems[i], 'clearReactiveSystems');
                if (nestedSystems != null) {
                    nestedSystems.clearReactiveSystems();
                }
            }
        };
        return Systems;
    })();
    entitas.Systems = Systems;
})(entitas || (entitas = {}));
//# sourceMappingURL=entitas.js.map