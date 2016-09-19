var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        "use strict";
        const hex = [
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
        /**
         * @class UUID
         */
        class UUID {
            //static check = {}
            /**
             * Fast UUID generator, RFC4122 version 4 compliant
             * format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
             *
             * @author Jeff Ward (jcward.com).
             * @license MIT license
             * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
             **/
            static randomUUID() {
                const d0 = Math.random() * 0xffffffff | 0;
                const d1 = Math.random() * 0xffffffff | 0;
                const d2 = Math.random() * 0xffffffff | 0;
                const d3 = Math.random() * 0xffffffff | 0;
                return hex[d0 & 0xff] + hex[d0 >> 8 & 0xff] + hex[d0 >> 16 & 0xff] + hex[d0 >> 24 & 0xff] + '-' +
                    hex[d1 & 0xff] + hex[d1 >> 8 & 0xff] + '-' + hex[d1 >> 16 & 0x0f | 0x40] + hex[d1 >> 24 & 0xff] + '-' +
                    hex[d2 & 0x3f | 0x80] + hex[d2 >> 8 & 0xff] + '-' + hex[d2 >> 16 & 0xff] + hex[d2 >> 24 & 0xff] +
                    hex[d3 & 0xff] + hex[d3 >> 8 & 0xff] + hex[d3 >> 16 & 0xff] + hex[d3 >> 24 & 0xff];
            }
        }
        utils.UUID = UUID;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        "use strict";
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
/**
 * @port https://github.com/junkdog/artemis-odb/blob/master/artemis/src/main/java/com/artemis/utils/Bag.java
 * not a full implementation, mostly just what is needed by the game engine.
 */
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        "use strict";
        /**
         * Collection type a bit like ArrayList but does not preserve the order of its
         * entities, speedwise it is very good, especially suited for games.
         */
        class Bag extends Array {
            /**
             * Constructs an empty Bag with the specified initial capacity.
             * Constructs an empty Bag with an initial capacity of 64.
             *
             * @constructor
             * @param capacity the initial capacity of Bag
             */
            constructor(capacity = 64) {
                super();
                this.size_ = 0;
                this.length = capacity;
            }
            /**
             * Removes the element at the specified position in this Bag. does this by
             * overwriting it was last element then removing last element
             *
             * @param index
             *            the index of element to be removed
             * @return {Object} element that was removed from the Bag
             */
            removeAt(index) {
                const e = this[index]; // make copy of element to remove so it can be returned
                this[index] = this[--this.size_]; // overwrite item to remove with last element
                this[this.size_] = null; // null last element, so gc can do its work
                return e;
            }
            /**
             * Removes the first occurrence of the specified element from this Bag, if
             * it is present. If the Bag does not contain the element, it is unchanged.
             * does this by overwriting it was last element then removing last element
             *
             * @param e
             *            element to be removed from this list, if present
             * @return {boolean} true if this list contained the specified element
             */
            remove(e) {
                let i;
                let e2;
                const size = this.size_;
                for (i = 0; i < size; i++) {
                    e2 = this[i];
                    if (e == e2) {
                        this[i] = this[--this.size_]; // overwrite item to remove with last element
                        this[this.size_] = null; // null last element, so gc can do its work
                        return true;
                    }
                }
                return false;
            }
            /**
             * Remove and return the last object in the bag.
             *
             * @return {Object} the last object in the bag, null if empty.
             */
            removeLast() {
                if (this.size_ > 0) {
                    const e = this[--this.size_];
                    this[this.size_] = null;
                    return e;
                }
                return null;
            }
            /**
             * Check if bag contains this element.
             *
             * @param e
             * @return {boolean}
             */
            contains(e) {
                let i;
                let size;
                for (i = 0, size = this.size_; size > i; i++) {
                    if (e === this[i]) {
                        return true;
                    }
                }
                return false;
            }
            /**
             * Removes from this Bag all of its elements that are contained in the
             * specified Bag.
             *
             * @param bag
             *            Bag containing elements to be removed from this Bag
             * @return {boolean} true if this Bag changed as a result of the call
             */
            removeAll(bag) {
                let modified = false;
                let i;
                let j;
                let l;
                let e1;
                let e2;
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
            }
            /**
             * Returns the element at the specified position in Bag.
             *
             * @param index
             *            index of the element to return
             * @return {Object} the element at the specified position in bag
             */
            get(index) {
                if (index >= this.length) {
                    throw new Error('ArrayIndexOutOfBoundsException');
                }
                return this[index];
            }
            /**
             * Returns the element at the specified position in Bag. This method
             * ensures that the bag grows if the requested index is outside the bounds
             * of the current backing array.
             *
             * @param index
             *      index of the element to return
             *
             * @return {Object} the element at the specified position in bag
             *
             */
            safeGet(index) {
                if (index >= this.length) {
                    this.grow((index * 7) / 4 + 1);
                }
                return this[index];
            }
            /**
             * Returns the number of elements in this bag.
             *
             * @return {number} the number of elements in this bag
             */
            size() {
                return this.size_;
            }
            /**
             * Returns the number of elements the bag can hold without growing.
             *
             * @return {number} the number of elements the bag can hold without growing.
             */
            getCapacity() {
                return this.length;
            }
            /**
             * Checks if the internal storage supports this index.
             *
             * @param index
             * @return {boolean}
             */
            isIndexWithinBounds(index) {
                return index < this.getCapacity();
            }
            /**
             * Returns true if this list contains no elements.
             *
             * @return {boolean} true if this list contains no elements
             */
            isEmpty() {
                return this.size_ == 0;
            }
            /**
             * Adds the specified element to the end of this bag. if needed also
             * increases the capacity of the bag.
             *
             * @param e
             *            element to be added to this list
             */
            add(e) {
                // is size greater than capacity increase capacity
                if (this.size_ === this.length) {
                    this.grow();
                }
                this[this.size_++] = e;
            }
            /**
             * Set element at specified index in the bag.
             *
             * @param index position of element
             * @param e the element
             */
            set(index, e) {
                if (index >= this.length) {
                    this.grow(index * 2);
                }
                this.size_ = index + 1;
                this[index] = e;
            }
            grow(newCapacity = ~~((this.length * 3) / 2) + 1) {
                this.length = ~~newCapacity;
            }
            ensureCapacity(index) {
                if (index >= this.length) {
                    this.grow(index * 2);
                }
            }
            /**
             * Removes all of the elements from this bag. The bag will be empty after
             * this call returns.
             */
            clear() {
                let i;
                let size;
                // null all elements so gc can clean up
                for (i = 0, size = this.size_; i < size; i++) {
                    this[i] = null;
                }
                this.size_ = 0;
            }
            /**
             * Add all items into this bag.
             * @param items
             */
            addAll(items) {
                let i;
                for (i = 0; items.size() > i; i++) {
                    this.add(items.get(i));
                }
            }
        }
        utils.Bag = Bag;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        "use strict";
        var Bag = entitas.utils.Bag;
        class Signal {
            /**
             *
             * @constructor
             * @param context
             * @param alloc
             */
            constructor(context, alloc = 16) {
                this._listeners = new Bag();
                this._context = context;
                this._alloc = alloc;
                this.active = false;
            }
            /**
             * Dispatch event
             *
             * @param args list
             */
            dispatch(...args) {
                const listeners = this._listeners;
                const size = listeners.size();
                if (size <= 0)
                    return; // bail early
                const context = this._context;
                for (let i = 0; i < size; i++) {
                    listeners[i].apply(context, args);
                }
            }
            /**
             * Add event listener
             * @param listener
             */
            add(listener) {
                this._listeners.add(listener);
                this.active = true;
            }
            /**
             * Remove event listener
             * @param listener
             */
            remove(listener) {
                const listeners = this._listeners;
                listeners.remove(listener);
                this.active = listeners.size() > 0;
            }
            /**
             * Clear and reset to original alloc
             */
            clear() {
                this._listeners.clear();
                this.active = false;
            }
        }
        utils.Signal = Signal;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        "use strict";
        class Stopwatch {
            constructor() {
                Stopwatch.isHighRes = performance ? true : false;
                this.reset();
            }
            get isRunning() {
                return this._isRunning;
            }
            get startTimeStamp() {
                return this._startTimeStamp;
            }
            get elapsed() {
                return this._elapsed;
            }
            start() {
                if (!this._isRunning) {
                    this._startTimeStamp = Stopwatch.getTimeStamp();
                    this._isRunning = true;
                }
            }
            stop() {
                if (this._isRunning) {
                    this._elapsed += (Stopwatch.getTimeStamp() - this._startTimeStamp);
                    this._isRunning = false;
                }
            }
            reset() {
                this._elapsed = 0;
                this._startTimeStamp = 0;
                this._isRunning = false;
            }
            static getTimeStamp() {
                return Stopwatch.isHighRes ? performance.now() : Date.now();
            }
        }
        Stopwatch.isHighRes = false;
        utils.Stopwatch = Stopwatch;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    class Exception {
        /**
         * Base exception class
         * @constructot
         * @param message
         */
        constructor(message) {
            this.message = message;
        }
        /** @return {string} */
        toString() {
            return this.message;
        }
    }
    entitas.Exception = Exception;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class EntityAlreadyHasComponentException extends Exception {
            /**
             * Entity Already Has Component Exception
             * @constructor
             * @param message
             * @param index
             */
            constructor(message, index) {
                super(message + "\nEntity already has a component at index (" + index + ") " + entitas.Pool.componentsEnum[index]);
            }
        }
        exceptions.EntityAlreadyHasComponentException = EntityAlreadyHasComponentException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class EntityDoesNotHaveComponentException extends Exception {
            /**
             * Entity Does Not Have Component Exception
             * @constructor
             * @param message
             * @param index
             */
            constructor(message, index) {
                super(message + "\nEntity does not have a component at index (" + index + ") " + entitas.Pool.componentsEnum[index]);
            }
        }
        exceptions.EntityDoesNotHaveComponentException = EntityDoesNotHaveComponentException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class EntityIsAlreadyReleasedException extends Exception {
            /**
             * Entity Is Already Released Exception
             * @constructor
             */
            constructor() {
                super("Entity is already released!");
            }
        }
        exceptions.EntityIsAlreadyReleasedException = EntityIsAlreadyReleasedException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class EntityIsNotDestroyedException extends Exception {
            /**
             * Entity Is Not Destroyed Exception
             * @constructor
             * @param message
             */
            constructor(message) {
                super(message + "\nEntity is not destroyed yet!");
            }
        }
        exceptions.EntityIsNotDestroyedException = EntityIsNotDestroyedException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class EntityIsNotEnabledException extends Exception {
            /**
             * Entity Is Not Enabled Exception
             * @constructor
             * @param message
             */
            constructor(message) {
                super(message + "\nEntity is not enabled");
            }
        }
        exceptions.EntityIsNotEnabledException = EntityIsNotEnabledException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class GroupObserverException extends Exception {
            /**
             * Group Observer Exception
             * @constructor
             * @param message
             */
            constructor(message) {
                super(message);
            }
        }
        exceptions.GroupObserverException = GroupObserverException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class MatcherException extends Exception {
            /**
             * Matcher Exception
             * @constructor
             * @param matcher
             */
            constructor(matcher) {
                super("matcher.indices.length must be 1 but was " + matcher.indices.length);
            }
        }
        exceptions.MatcherException = MatcherException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class PoolDoesNotContainEntityException extends Exception {
            /**
             * Pool Does Not Contain Entity Exception
             * @constructor
             * @param entity
             * @param message
             */
            constructor(entity, message) {
                super(message + "\nPool does not contain entity " + entity);
            }
        }
        exceptions.PoolDoesNotContainEntityException = PoolDoesNotContainEntityException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        class SingleEntityException extends Exception {
            /**
             * Single Entity Exception
             * @constructor
             * @param matcher
             */
            constructor(matcher) {
                super("Multiple entities exist matching " + matcher);
            }
        }
        exceptions.SingleEntityException = SingleEntityException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    class TriggerOnEvent {
        /**
         * @constructor
         *
         * @param trigger
         * @param eventType
         */
        constructor(trigger, eventType) {
            this.trigger = trigger;
            this.eventType = eventType;
        }
    }
    entitas.TriggerOnEvent = TriggerOnEvent;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var MatcherException = entitas.exceptions.MatcherException;
    var TriggerOnEvent = entitas.TriggerOnEvent;
    /**
     * Event Types
     * @readonly
     * @enum {number}
     */
    (function (GroupEventType) {
        GroupEventType[GroupEventType["OnEntityAdded"] = 0] = "OnEntityAdded";
        GroupEventType[GroupEventType["OnEntityRemoved"] = 1] = "OnEntityRemoved";
        GroupEventType[GroupEventType["OnEntityAddedOrRemoved"] = 2] = "OnEntityAddedOrRemoved";
    })(entitas.GroupEventType || (entitas.GroupEventType = {}));
    var GroupEventType = entitas.GroupEventType;
    class Matcher {
        /**
         * @constructor
         *
         */
        constructor() {
            this._id = Matcher.uniqueId++;
        }
        /**
         * Get the matcher id
         * @type {number}
         * @name entitas.Matcher#id */
        get id() { return this._id; }
        /**
         * A list of the component ordinals that this matches
         * @type {Array<number>}
         * @name entitas.Matcher#indices */
        get indices() {
            if (!this._indices) {
                this._indices = this.mergeIndices();
            }
            return this._indices;
        }
        /**
         * A unique sequential index number assigned to each entity at creation
         * @type {number}
         * @name entitas.Matcher#allOfIndices */
        get allOfIndices() { return this._allOfIndices; }
        /**
         * A unique sequential index number assigned to each entity at creation
         * @type {number}
         * @name entitas.Matcher#anyOfIndices */
        get anyOfIndices() { return this._anyOfIndices; }
        /**
         * A unique sequential index number assigned to each entity at creation
         * @type {number}
         * @name entitas.Matcher#noneOfIndices */
        get noneOfIndices() { return this._noneOfIndices; }
        /**
         * Matches anyOf the components/indices specified
         * @params {Array<entitas.IMatcher>|Array<number>} args
         * @returns {entitas.Matcher}
         */
        anyOf(...args) {
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                this._anyOfIndices = Matcher.distinctIndices(args);
                this._indices = null;
                return this;
            }
            else {
                return this.anyOf.apply(this, Matcher.mergeIndices(args));
            }
        }
        /**
         * Matches noneOf the components/indices specified
         * @params {Array<entitas.IMatcher>|Array<number>} args
         * @returns {entitas.Matcher}
         */
        noneOf(...args) {
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                this._noneOfIndices = Matcher.distinctIndices(args);
                this._indices = null;
                return this;
            }
            else {
                return this.noneOf.apply(this, Matcher.mergeIndices(args));
            }
        }
        /**
         * Check if the entity matches this matcher
         * @param {entitas.Entity} entity
         * @returns {boolean}
         */
        matches(entity) {
            const matchesAllOf = this._allOfIndices == null ? true : entity.hasComponents(this._allOfIndices);
            const matchesAnyOf = this._anyOfIndices == null ? true : entity.hasAnyComponent(this._anyOfIndices);
            const matchesNoneOf = this._noneOfIndices == null ? true : !entity.hasAnyComponent(this._noneOfIndices);
            return matchesAllOf && matchesAnyOf && matchesNoneOf;
        }
        /**
         * Merge list of component indices
         * @returns {Array<number>}
         */
        mergeIndices() {
            //const totalIndices = (this._allOfIndices != null ? this._allOfIndices.length : 0)
            //  + (this._anyOfIndices != null ? this._anyOfIndices.length : 0)
            //  + (this._noneOfIndices != null ? this._noneOfIndices.length : 0)
            let indicesList = [];
            if (this._allOfIndices != null) {
                indicesList = indicesList.concat(this._allOfIndices);
            }
            if (this._anyOfIndices != null) {
                indicesList = indicesList.concat(this._anyOfIndices);
            }
            if (this._noneOfIndices != null) {
                indicesList = indicesList.concat(this._noneOfIndices);
            }
            return Matcher.distinctIndices(indicesList);
        }
        /**
         * toString representation of this matcher
         * @returns {string}
         */
        toString() {
            if (this._toStringCache == null) {
                const sb = [];
                if (this._allOfIndices != null) {
                    Matcher.appendIndices(sb, "AllOf", this._allOfIndices);
                }
                if (this._anyOfIndices != null) {
                    if (this._allOfIndices != null) {
                        sb[sb.length] = '.';
                    }
                    Matcher.appendIndices(sb, "AnyOf", this._anyOfIndices);
                }
                if (this._noneOfIndices != null) {
                    Matcher.appendIndices(sb, ".NoneOf", this._noneOfIndices);
                }
                this._toStringCache = sb.join('');
            }
            return this._toStringCache;
        }
        // /**
        //  * Check if the matchers are equal
        //  * @param {Object} obj
        //  * @returns {boolean}
        //  */
        // public equals(obj) {
        //   if (obj == null || obj == null) return false
        //   const matcher:Matcher = obj
        //   if (!Matcher.equalIndices(matcher.allOfIndices, this._allOfIndices)) {
        //     return false
        //   }
        //   if (!Matcher.equalIndices(matcher.anyOfIndices, this._anyOfIndices)) {
        //     return false
        //   }
        //   if (!Matcher.equalIndices(matcher.noneOfIndices, this._noneOfIndices)) {
        //     return false
        //   }
        //   return true
        // }
        // /**
        //  * Check if the lists of component indices are equal
        //  * @param {Array<number>} list1
        //  * @param {Array<number>} list2
        //  * @returns {boolean}
        //  */
        // public static equalIndices(i1:number[], i2:number[]):boolean {
        //   if ((i1 == null) != (i2 == null)) {
        //     return false
        //   }
        //   if (i1 == null) {
        //     return true
        //   }
        //   if (i1.length !== i2.length) {
        //     return false
        //   }
        //   for (let i = 0, indicesLength = i1.length; i < indicesLength; i++) {
        //     /** compare coerced values so we can compare string type to number type */
        //     if (i1[i] != i2[i]) {
        //       return false
        //     }
        //   }
        //   return true
        // }
        /**
         * Get the set if distinct (non-duplicate) indices from a list
         * @param {Array<number>} indices
         * @returns {Array<number>}
         */
        static distinctIndices(indices) {
            const indicesSet = {};
            for (let i = 0, l = indices.length; i < l; i++) {
                const k = '' + indices[i];
                indicesSet[k] = i;
            }
            return [].concat(Object.keys(indicesSet));
        }
        /**
         * Merge all the indices of a set of Matchers
         * @param {Array<IMatcher>} matchers
         * @returns {Array<number>}
         */
        static mergeIndices(matchers) {
            const indices = [];
            for (let i = 0, matchersLength = matchers.length; i < matchersLength; i++) {
                const matcher = matchers[i];
                if (matcher.indices.length !== 1) {
                    throw new MatcherException(matcher);
                }
                indices[i] = matcher.indices[0];
            }
            return indices;
        }
        /**
         * Matches allOf the components/indices specified
         * @params {Array<entitas.IMatcher>|Array<number>} args
         * @returns {entitas.Matcher}
         */
        static allOf(...args) {
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                const matcher = new Matcher();
                const indices = matcher._allOfIndices = Matcher.distinctIndices(args);
                return matcher;
            }
            else {
                return Matcher.allOf.apply(this, Matcher.mergeIndices(args));
            }
        }
        /**
         * Matches anyOf the components/indices specified
         * @params {Array<entitas.IMatcher>|Array<number>} args
         * @returns {entitas.Matcher}
         */
        static anyOf(...args) {
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                const matcher = new Matcher();
                const indices = matcher._anyOfIndices = Matcher.distinctIndices(args);
                return matcher;
            }
            else {
                return Matcher.anyOf.apply(this, Matcher.mergeIndices(args));
            }
        }
        static appendIndices(sb, prefix, indexArray) {
            const SEPERATOR = ", ";
            let j = sb.length;
            sb[j++] = prefix;
            sb[j++] = '(';
            const lastSeperator = indexArray.length - 1;
            for (let i = 0, indicesLength = indexArray.length; i < indicesLength; i++) {
                sb[j++] = '' + indexArray[i];
                if (i < lastSeperator) {
                    sb[j++] = SEPERATOR;
                }
            }
            sb[j++] = ')';
        }
        /**
         * Subscribe to Entity Added event
         * @returns {entitas.TriggerOnEvent}
         */
        onEntityAdded() {
            return new TriggerOnEvent(this, GroupEventType.OnEntityAdded);
        }
        /**
         * Subscribe to Entity Removed event
         * @returns {entitas.TriggerOnEvent}
         */
        onEntityRemoved() {
            return new TriggerOnEvent(this, GroupEventType.OnEntityRemoved);
        }
        /**
         * Subscribe to Entity Added or Removed event
         * @returns {entitas.TriggerOnEvent}
         */
        onEntityAddedOrRemoved() {
            return new TriggerOnEvent(this, GroupEventType.OnEntityAddedOrRemoved);
        }
    }
    /**
     * A unique sequential index number assigned to each ,atch
     * @type {number} */
    Matcher.uniqueId = 0;
    entitas.Matcher = Matcher;
})(entitas || (entitas = {}));
/**
 * entitas ecs
 * @const
 */
var entitas;
(function (entitas) {
    "use strict";
    var Signal = entitas.utils.Signal;
    var EntityIsNotEnabledException = entitas.exceptions.EntityIsNotEnabledException;
    var EntityIsAlreadyReleasedException = entitas.exceptions.EntityIsAlreadyReleasedException;
    var EntityAlreadyHasComponentException = entitas.exceptions.EntityAlreadyHasComponentException;
    var EntityDoesNotHaveComponentException = entitas.exceptions.EntityDoesNotHaveComponentException;
    class Entity {
        /**
         * The basic game object. Everything is an entity with components that
         * are added / removed as needed.
         *
         * @param {Object} componentsEnum
         * @param {number} totalComponents
         * @constructor
         */
        constructor(componentsEnum, totalComponents = 16) {
            /**
             * Subscribe to Entity Released Event
             * @type {entitas.ISignal} */
            this.onEntityReleased = null;
            /**
             * Subscribe to Component Added Event
             * @type {entitas.ISignal} */
            this.onComponentAdded = null;
            /**
             * Subscribe to Component Removed Event
             * @type {entitas.ISignal} */
            this.onComponentRemoved = null;
            /**
             * Subscribe to Component Replaced Event
             * @type {entitas.ISignal} */
            this.onComponentReplaced = null;
            /**
             * Entity name
             * @type {string} */
            this.name = '';
            /**
             *  Entity Id
             * @type {string} */
            this.id = '';
            /**
             *  Instance index
             * @type {number} */
            this.instanceIndex = 0;
            this._creationIndex = 0;
            this._isEnabled = true;
            this._components = null;
            this._componentsCache = null;
            this._componentIndicesCache = null;
            this._toStringCache = '';
            this._refCount = 0;
            this._pool = null;
            this._componentsEnum = null;
            this.onEntityReleased = new Signal(this);
            this.onComponentAdded = new Signal(this);
            this.onComponentRemoved = new Signal(this);
            this.onComponentReplaced = new Signal(this);
            this._componentsEnum = componentsEnum;
            this._pool = entitas.Pool.instance;
            this._components = this.initialize(totalComponents);
        }
        /**
         * A unique sequential index number assigned to each entity at creation
         * @type {number}
         * @name entitas.Entity#creationIndex */
        get creationIndex() { return this._creationIndex; }
        static initialize(totalComponents, options) {
            Entity.size = options.entities || 100;
        }
        /**
         * allocate entity pool
         *
         * @param count number of components
         * @param size max number of entities
         */
        static dim(count, size) {
            Entity.alloc = new Array(size);
            for (let e = 0; e < size; e++) {
                Entity.alloc[e] = new Array(count);
                for (let k = 0; k < count; k++) {
                    Entity.alloc[e][k] = null;
                }
            }
        }
        /**
         * Initialize
         * allocate the entity pool.
         *
         * @param {number} totalComponents
         * @returns {Array<entitas.IComponent>}
         */
        initialize(totalComponents) {
            let mem;
            const size = Entity.size;
            if (Entity.alloc == null)
                Entity.dim(totalComponents, size);
            const alloc = Entity.alloc;
            this.instanceIndex = Entity.instanceIndex++;
            if (mem = alloc[this.instanceIndex])
                return mem;
            console.log('Insufficient memory allocation at ', this.instanceIndex, '. Allocating ', size, ' entities.');
            for (let i = this.instanceIndex, l = i + size; i < l; i++) {
                alloc[i] = new Array(totalComponents);
                for (let k = 0; k < totalComponents; k++) {
                    alloc[i][k] = null;
                }
            }
            mem = alloc[this.instanceIndex];
            return mem;
        }
        /**
         * AddComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         * @returns {entitas.Entity}
         */
        addComponent(index, component) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot add component!");
            }
            if (this.hasComponent(index)) {
                const errorMsg = "Cannot add component at index " + index + " to " + this;
                throw new EntityAlreadyHasComponentException(errorMsg, index);
            }
            this._components[index] = component;
            this._componentsCache = null;
            this._componentIndicesCache = null;
            this._toStringCache = null;
            const onComponentAdded = this.onComponentAdded;
            if (onComponentAdded.active)
                onComponentAdded.dispatch(this, index, component);
            return this;
        }
        /**
         * RemoveComponent
         *
         * @param {number} index
         * @returns {entitas.Entity}
         */
        removeComponent(index) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot remove component!");
            }
            if (!this.hasComponent(index)) {
                const errorMsg = "Cannot remove component at index " + index + " from " + this;
                throw new EntityDoesNotHaveComponentException(errorMsg, index);
            }
            this._replaceComponent(index, null);
            return this;
        }
        /**
         * ReplaceComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         * @returns {entitas.Entity}
         */
        replaceComponent(index, component) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot replace component!");
            }
            if (this.hasComponent(index)) {
                this._replaceComponent(index, component);
            }
            else if (component != null) {
                this.addComponent(index, component);
            }
            return this;
        }
        _replaceComponent(index, replacement) {
            const components = this._components;
            const previousComponent = components[index];
            if (previousComponent === replacement) {
                let onComponentReplaced = this.onComponentReplaced;
                if (onComponentReplaced.active)
                    onComponentReplaced.dispatch(this, index, previousComponent, replacement);
            }
            else {
                components[index] = replacement;
                this._componentsCache = null;
                if (replacement == null) {
                    //delete components[index]
                    components[index] = null;
                    this._componentIndicesCache = null;
                    this._toStringCache = null;
                    const onComponentRemoved = this.onComponentRemoved;
                    if (onComponentRemoved.active)
                        onComponentRemoved.dispatch(this, index, previousComponent);
                }
                else {
                    const onComponentReplaced = this.onComponentReplaced;
                    if (onComponentReplaced.active)
                        onComponentReplaced.dispatch(this, index, previousComponent, replacement);
                }
            }
        }
        /**
         * GetComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         */
        getComponent(index) {
            if (!this.hasComponent(index)) {
                const errorMsg = "Cannot get component at index " + index + " from " + this;
                throw new EntityDoesNotHaveComponentException(errorMsg, index);
            }
            return this._components[index];
        }
        /**
         * GetComponents
         *
         * @returns {Array<entitas.IComponent>}
         */
        getComponents() {
            if (this._componentsCache == null) {
                const components = [];
                const _components = this._components;
                for (let i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
                    const component = _components[i];
                    if (component != null) {
                        components[j++] = component;
                    }
                }
                this._componentsCache = components;
            }
            return this._componentsCache;
        }
        /**
         * GetComponentIndices
         *
         * @returns {Array<number>}
         */
        getComponentIndices() {
            if (this._componentIndicesCache == null) {
                const indices = [];
                const _components = this._components;
                for (let i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
                    if (_components[i] != null) {
                        indices[j++] = i;
                    }
                }
                this._componentIndicesCache = indices;
            }
            return this._componentIndicesCache;
        }
        /**
         * HasComponent
         *
         * @param {number} index
         * @returns {boolean}
         */
        hasComponent(index) {
            return this._components[index] != null;
        }
        /**
         * HasComponents
         *
         * @param {Array<number>} indices
         * @returns {boolean}
         */
        hasComponents(indices) {
            const _components = this._components;
            for (let i = 0, indicesLength = indices.length; i < indicesLength; i++) {
                if (_components[indices[i]] == null) {
                    return false;
                }
            }
            return true;
        }
        /**
         * HasAnyComponent
         *
         * @param {Array<number>} indices
         * @returns {boolean}
         */
        hasAnyComponent(indices) {
            const _components = this._components;
            for (let i = 0, indicesLength = indices.length; i < indicesLength; i++) {
                if (_components[indices[i]] != null) {
                    return true;
                }
            }
            return false;
        }
        /**
         * RemoveAllComponents
         *
         */
        removeAllComponents() {
            this._toStringCache = null;
            const _components = this._components;
            for (let i = 0, componentsLength = _components.length; i < componentsLength; i++) {
                if (_components[i] != null) {
                    this._replaceComponent(i, null);
                }
            }
        }
        /**
         * Destroy
         *
         */
        destroy() {
            this.removeAllComponents();
            this.onComponentAdded.clear();
            this.onComponentReplaced.clear();
            this.onComponentRemoved.clear();
            this._isEnabled = false;
        }
        /**
         * ToString
         *
         * @returns {string}
         */
        toString() {
            if (this._toStringCache == null) {
                const sb = [];
                const seperator = ", ";
                const components = this.getComponents();
                const lastSeperator = components.length - 1;
                for (let i = 0, j = 0, componentsLength = components.length; i < componentsLength; i++) {
                    sb[j++] = components[i].constructor['name'].replace('Component', '') || i + '';
                    if (i < lastSeperator) {
                        sb[j++] = seperator;
                    }
                }
                this._toStringCache = sb.join('');
            }
            return this._toStringCache;
        }
        /**
         * AddRef
         *
         * @returns {entitas.Entity}
         */
        addRef() {
            this._refCount += 1;
            return this;
        }
        /**
         * Release
         *
         */
        release() {
            this._refCount -= 1;
            if (this._refCount === 0) {
                let onEntityReleased = this.onEntityReleased;
                if (onEntityReleased.active)
                    onEntityReleased.dispatch(this);
            }
            else if (this._refCount < 0) {
                throw new EntityIsAlreadyReleasedException();
            }
        }
    }
    /**
     * @static
     * @type {number} */
    Entity.instanceIndex = 0;
    /**
     * @static
     * @type {Array<Array<IComponent>>} */
    Entity.alloc = null;
    /**
     * @static
     * @type {number} */
    Entity.size = 0;
    entitas.Entity = Entity;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var Signal = entitas.utils.Signal;
    var GroupEventType = entitas.GroupEventType;
    var SingleEntityException = entitas.exceptions.SingleEntityException;
    class Group {
        /**
         * @constructor
         * @param matcher
         */
        constructor(matcher) {
            /**
             * Subscribe to Entity Addded events
             * @type {entitas.utils.ISignal} */
            this.onEntityAdded = null;
            /**
             * Subscribe to Entity Removed events
             * @type {entitas.utils.ISignal} */
            this.onEntityRemoved = null;
            /**
             * Subscribe to Entity Updated events
             * @type {entitas.utils.ISignal} */
            this.onEntityUpdated = null;
            this._entities = {};
            this._matcher = null;
            this._entitiesCache = null;
            this._singleEntityCache = null;
            this._toStringCache = '';
            this._entities = {};
            this.onEntityAdded = new Signal(this);
            this.onEntityRemoved = new Signal(this);
            this.onEntityUpdated = new Signal(this);
            this._matcher = matcher;
        }
        /**
         * Count the number of entities in this group
         * @type {number}
         * @name entitas.Group#count */
        get count() { return Object.keys(this._entities).length; }
        /**
         * Get the Matcher for this group
         * @type {entitas.IMatcher}
         * @name entitas.Group#matcher */
        get matcher() { return this._matcher; }
        /**
         * Create an Observer for the event type on this group
         * @param eventType
         */
        createObserver(eventType) {
            if (eventType === undefined)
                eventType = GroupEventType.OnEntityAdded;
            return new entitas.GroupObserver(this, eventType);
        }
        /**
         * Handle adding and removing component from the entity without raising events
         * @param entity
         */
        handleEntitySilently(entity) {
            if (this._matcher.matches(entity)) {
                this.addEntitySilently(entity);
            }
            else {
                this.removeEntitySilently(entity);
            }
        }
        /**
         * Handle adding and removing component from the entity and raisieevents
         * @param entity
         * @param index
         * @param component
         */
        handleEntity(entity, index, component) {
            if (this._matcher.matches(entity)) {
                this.addEntity(entity, index, component);
            }
            else {
                this.removeEntity(entity, index, component);
            }
        }
        /**
         * Update entity and raise events
         * @param entity
         * @param index
         * @param previousComponent
         * @param newComponent
         */
        updateEntity(entity, index, previousComponent, newComponent) {
            if (entity.id in this._entities) {
                const onEntityRemoved = this.onEntityRemoved;
                if (onEntityRemoved.active)
                    onEntityRemoved.dispatch(this, entity, index, previousComponent);
                const onEntityAdded = this.onEntityAdded;
                if (onEntityAdded.active)
                    onEntityAdded.dispatch(this, entity, index, newComponent);
                const onEntityUpdated = this.onEntityUpdated;
                if (onEntityUpdated.active)
                    onEntityUpdated.dispatch(this, entity, index, previousComponent, newComponent);
            }
        }
        /**
         * Add entity without raising events
         * @param entity
         */
        addEntitySilently(entity) {
            if (!(entity.id in this._entities)) {
                this._entities[entity.id] = entity;
                this._entitiesCache = null;
                this._singleEntityCache = null;
                entity.addRef();
            }
        }
        /**
         * Add entity and raise events
         * @param entity
         * @param index
         * @param component
         */
        addEntity(entity, index, component) {
            if (!(entity.id in this._entities)) {
                this._entities[entity.id] = entity;
                this._entitiesCache = null;
                this._singleEntityCache = null;
                entity.addRef();
                const onEntityAdded = this.onEntityAdded;
                if (onEntityAdded.active)
                    onEntityAdded.dispatch(this, entity, index, component);
            }
        }
        /**
         * Remove entity without raising events
         * @param entity
         */
        removeEntitySilently(entity) {
            if (entity.id in this._entities) {
                delete this._entities[entity.id];
                this._entitiesCache = null;
                this._singleEntityCache = null;
                entity.release();
            }
        }
        /**
         * Remove entity and raise events
         * @param entity
         * @param index
         * @param component
         */
        removeEntity(entity, index, component) {
            if (entity.id in this._entities) {
                delete this._entities[entity.id];
                this._entitiesCache = null;
                this._singleEntityCache = null;
                let onEntityRemoved = this.onEntityRemoved;
                if (onEntityRemoved.active)
                    onEntityRemoved.dispatch(this, entity, index, component);
                entity.release();
            }
        }
        /**
         * Check if group has this entity
         *
         * @param entity
         * @returns boolean
         */
        containsEntity(entity) {
            return entity.id in this._entities;
        }
        /**
         * Get a list of the entities in this group
         *
         * @returns Array<entitas.Entity>
         */
        getEntities() {
            if (this._entitiesCache == null) {
                const entities = this._entities;
                const keys = Object.keys(entities);
                const length = keys.length;
                const entitiesCache = this._entitiesCache = new Array(length);
                for (let i = 0; i < length; i++) {
                    entitiesCache[i] = entities[keys[i]];
                }
            }
            return this._entitiesCache;
        }
        /**
         * Gets an entity singleton.
         * If a group has more than 1 entity, this is an error condition.
         *
         * @returns entitas.Entity
         */
        getSingleEntity() {
            if (this._singleEntityCache == null) {
                const enumerator = Object.keys(this._entities);
                const c = enumerator.length;
                if (c === 1) {
                    this._singleEntityCache = this._entities[enumerator[0]];
                }
                else if (c === 0) {
                    return null;
                }
                else {
                    throw new SingleEntityException(this._matcher);
                }
            }
            return this._singleEntityCache;
        }
        /**
         * Create a string representation for this group:
         *
         *  ex: 'Group(Position)'
         *
         * @returns string
         */
        toString() {
            if (this._toStringCache == null) {
                this._toStringCache = "Group(" + this._matcher + ")";
            }
            return this._toStringCache;
        }
    }
    entitas.Group = Group;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var GroupEventType = entitas.GroupEventType;
    var GroupObserverException = entitas.exceptions.GroupObserverException;
    class GroupObserver {
        /**
         * @constructor
         * @param {Array<entitas.Group>} groups
         * @param {number} eventTypes
         */
        constructor(groups, eventTypes) {
            this._collectedEntities = {};
            this._groups = null;
            this._eventTypes = null;
            this._addEntityCache = null;
            /**
             * Adds an entity to this observer group
             * @param group
             * @param {entitas.Entity}entity
             * @param index
             * @param {entitas.IComponent}component
             */
            this.addEntity = (group, entity, index, component) => {
                if (!(entity.id in this._collectedEntities)) {
                    this._collectedEntities[entity.id] = entity;
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
        /**
         * Entities being observed
         * @type {Object<string,entitas.Entity>}
         * @name entitas.GroupObserver#collectedEntities */
        get collectedEntities() { return this._collectedEntities; }
        /**
         * Activate events
         */
        activate() {
            for (let i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
                const group = this._groups[i];
                const eventType = this._eventTypes[i];
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
                    throw `Invalid eventType [${typeof eventType}:${eventType}] in GroupObserver::activate`;
                }
            }
        }
        /**
         * Deavtivate events
         */
        deactivate() {
            for (let i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
                const group = this._groups[i];
                group.onEntityAdded.remove(this._addEntityCache);
                group.onEntityRemoved.remove(this._addEntityCache);
                this.clearCollectedEntities();
            }
        }
        /**
         * Clear the list of entities
         */
        clearCollectedEntities() {
            for (let e in this._collectedEntities) {
                this._collectedEntities[e].release();
            }
            this._collectedEntities = {};
        }
    }
    entitas.GroupObserver = GroupObserver;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var UUID = entitas.utils.UUID;
    var Bag = entitas.utils.Bag;
    var Group = entitas.Group;
    var Entity = entitas.Entity;
    var Signal = entitas.utils.Signal;
    var EntityIsNotDestroyedException = entitas.exceptions.EntityIsNotDestroyedException;
    var PoolDoesNotContainEntityException = entitas.exceptions.PoolDoesNotContainEntityException;
    function as(obj, method1) {
        return method1 in obj ? obj : null;
    }
    /**
     * A cached pool of entities and components.
     * The games world.
     */
    class Pool {
        /**
         * @constructor
         * @param {Object} components
         * @param {number} totalComponents
         * @param {number} startCreationIndex
         */
        constructor(components, totalComponents, debug = false, startCreationIndex = 0) {
            /**
             * Subscribe to Entity Created Event
             * @type {entitas.utils.ISignal} */
            this.onEntityCreated = null;
            /**
             * Subscribe to Entity Will Be Destroyed Event
             * @type {entitas.utils.ISignal} */
            this.onEntityWillBeDestroyed = null;
            /**
             * Subscribe to Entity Destroyed Event
             * @type {entitas.utils.ISignal} */
            this.onEntityDestroyed = null;
            /**
             * Subscribe to Group Created Event
             * @type {entitas.utils.ISignal} */
            this.onGroupCreated = null;
            /**
             * Entity name for debugging
             * @type {string} */
            this.name = '';
            this._debug = false;
            this._entities = {};
            this._groups = {};
            this._groupsForIndex = null;
            this._reusableEntities = new Bag();
            this._retainedEntities = {};
            this._componentsEnum = null;
            this._totalComponents = 0;
            this._creationIndex = 0;
            this._entitiesCache = null;
            /**
             * @param {entitas.Entity} entity
             * @param {number} index
             * @param {entitas.IComponent} component
             */
            this.updateGroupsComponentAddedOrRemoved = (entity, index, component) => {
                const groups = this._groupsForIndex[index];
                if (groups != null) {
                    for (let i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
                        groups[i].handleEntity(entity, index, component);
                    }
                }
            };
            /**
             * @param {entitas.Entity} entity
             * @param {number} index
             * @param {entitas.IComponent} previousComponent
             * @param {entitas.IComponent} newComponent
             */
            this.updateGroupsComponentReplaced = (entity, index, previousComponent, newComponent) => {
                const groups = this._groupsForIndex[index];
                if (groups != null) {
                    for (let i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
                        groups[i].updateEntity(entity, index, previousComponent, newComponent);
                    }
                }
            };
            /**
             * @param {entitas.Entity} entity
             */
            this.onEntityReleased = (entity) => {
                if (entity._isEnabled) {
                    throw new EntityIsNotDestroyedException("Cannot release entity.");
                }
                entity.onEntityReleased.remove(this._cachedOnEntityReleased);
                delete this._retainedEntities[entity.id];
                this._reusableEntities.add(entity);
            };
            Pool.instance = this;
            this.onGroupCreated = new Signal(this);
            this.onEntityCreated = new Signal(this);
            this.onEntityDestroyed = new Signal(this);
            this.onEntityWillBeDestroyed = new Signal(this);
            this._debug = debug;
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
        /**
         * The total number of components in this pool
         * @type {number}
         * @name entitas.Pool#totalComponents */
        get totalComponents() { return this._totalComponents; }
        /**
         * Count of active entities
         * @type {number}
         * @name entitas.Pool#count */
        get count() { return Object.keys(this._entities).length; }
        /**
         * Count of entities waiting to be recycled
         * @type {number}
         * @name entitas.Pool#reusableEntitiesCount */
        get reusableEntitiesCount() { return this._reusableEntities.size(); }
        /**
         * Count of entities that sill have references
         * @type {number}
         * @name entitas.Pool#retainedEntitiesCount */
        get retainedEntitiesCount() { return Object.keys(this._retainedEntities).length; }
        /**
         * Set the system pool if supported
         *
         * @static
         * @param {entitas.ISystem} system
         * @param {entitas.Pool} pool
         */
        static setPool(system, pool) {
            const poolSystem = as(system, 'setPool');
            if (poolSystem != null) {
                poolSystem.setPool(pool);
            }
        }
        /**
         * Create a new entity
         * @param {string} name
         * @returns {entitas.Entity}
         */
        createEntity(name) {
            const entity = this._reusableEntities.size() > 0 ? this._reusableEntities.removeLast() : new Entity(this._componentsEnum, this._totalComponents);
            entity._isEnabled = true;
            entity.name = name;
            entity._creationIndex = this._creationIndex++;
            entity.id = UUID.randomUUID();
            entity.addRef();
            this._entities[entity.id] = entity;
            this._entitiesCache = null;
            entity.onComponentAdded.add(this._cachedUpdateGroupsComponentAddedOrRemoved);
            entity.onComponentRemoved.add(this._cachedUpdateGroupsComponentAddedOrRemoved);
            entity.onComponentReplaced.add(this._cachedUpdateGroupsComponentReplaced);
            entity.onEntityReleased.add(this._cachedOnEntityReleased);
            const onEntityCreated = this.onEntityCreated;
            if (onEntityCreated.active)
                onEntityCreated.dispatch(this, entity);
            return entity;
        }
        /**
         * Destroy an entity
         * @param {entitas.Entity} entity
         */
        destroyEntity(entity) {
            if (!(entity.id in this._entities)) {
                throw new PoolDoesNotContainEntityException(entity, "Could not destroy entity!");
            }
            delete this._entities[entity.id];
            this._entitiesCache = null;
            const onEntityWillBeDestroyed = this.onEntityWillBeDestroyed;
            if (onEntityWillBeDestroyed.active)
                onEntityWillBeDestroyed.dispatch(this, entity);
            entity.destroy();
            const onEntityDestroyed = this.onEntityDestroyed;
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
        }
        /**
         * Destroy All Entities
         */
        destroyAllEntities() {
            const entities = this.getEntities();
            for (let i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
                this.destroyEntity(entities[i]);
            }
        }
        /**
         * Check if pool has this entity
         *
         * @param {entitas.Entity} entity
         * @returns {boolean}
         */
        hasEntity(entity) {
            return entity.id in this._entities;
        }
        /**
         * Gets all of the entities
         *
         * @returns {Array<entitas.Entity>}
         */
        getEntities(matcher) {
            if (matcher) {
                /** PoolExtension::getEntities */
                return this.getGroup(matcher).getEntities();
            }
            else {
                if (this._entitiesCache == null) {
                    const entities = this._entities;
                    const keys = Object.keys(entities);
                    const length = keys.length;
                    const entitiesCache = this._entitiesCache = new Array(length);
                    for (let i = 0; i < length; i++) {
                        entitiesCache[i] = entities[keys[i]];
                    }
                }
                return this._entitiesCache;
            }
            // if (this._entitiesCache == null) {
            //   const entities = this._entities
            //   const keys = Object.keys(entities)
            //   const length = keys.length
            //   const entitiesCache = this._entitiesCache = new Array(length)
            //   for (let i = 0; i < length; i++) {
            //     const k = keys[i]
            //     entitiesCache[i] = entities[k]
            //   }
            // }
            // return entitiesCache
        }
        /**
         * Create System
         * @param {entitas.ISystem|Function}
         * @returns {entitas.ISystem}
         */
        createSystem(system) {
            if ('function' === typeof system) {
                const Klass = system;
                system = new Klass();
            }
            Pool.setPool(system, this);
            const reactiveSystem = as(system, 'trigger');
            if (reactiveSystem != null) {
                return new entitas.ReactiveSystem(this, reactiveSystem);
            }
            const multiReactiveSystem = as(system, 'triggers');
            if (multiReactiveSystem != null) {
                return new entitas.ReactiveSystem(this, multiReactiveSystem);
            }
            return system;
        }
        /**
         * Gets all of the entities that match
         *
         * @param {entias.IMatcher} matcher
         * @returns {entitas.Group}
         */
        getGroup(matcher) {
            let group;
            if (matcher.id in this._groups) {
                group = this._groups[matcher.id];
            }
            else {
                group = new Group(matcher);
                const entities = this.getEntities();
                for (let i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
                    group.handleEntitySilently(entities[i]);
                }
                this._groups[matcher.id] = group;
                for (let i = 0, indicesLength = matcher.indices.length; i < indicesLength; i++) {
                    const index = matcher.indices[i];
                    if (this._groupsForIndex[index] == null) {
                        this._groupsForIndex[index] = new Bag();
                    }
                    this._groupsForIndex[index].add(group);
                }
                const onGroupCreated = this.onGroupCreated;
                if (onGroupCreated.active)
                    onGroupCreated.dispatch(this, group);
            }
            return group;
        }
    }
    /**
     * An enum of valid component types
     * @type {Object<string,number>} */
    Pool.componentsEnum = null;
    /**
     * Count of components
     * @type {number} */
    Pool.totalComponents = 0;
    /**
     * Global reference to pool instance
     * @type {entitas.Pool} */
    Pool.instance = null;
    entitas.Pool = Pool;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var GroupObserver = entitas.GroupObserver;
    /**
     * As
     * Retuns the object if it implements the interface, else null
     *
     * @param object
     * @param method
     * @returns Object
     */
    function as(object, method) {
        return method in object ? object : null;
    }
    class ReactiveSystem {
        /**
         * @constructor
         *
         * @param pool
         * @param subSystem
         */
        constructor(pool, subSystem) {
            const triggers = 'triggers' in subSystem ? subSystem['triggers'] : [subSystem['trigger']];
            this._subsystem = subSystem;
            const ensureComponents = as(subSystem, 'ensureComponents');
            if (ensureComponents != null) {
                this._ensureComponents = ensureComponents.ensureComponents;
            }
            const excludeComponents = as(subSystem, 'excludeComponents');
            if (excludeComponents != null) {
                this._excludeComponents = excludeComponents.excludeComponents;
            }
            this._clearAfterExecute = as(subSystem, 'clearAfterExecute') != null;
            const triggersLength = triggers.length;
            const groups = new Array(triggersLength);
            const eventTypes = new Array(triggersLength);
            for (let i = 0; i < triggersLength; i++) {
                const trigger = triggers[i];
                groups[i] = pool.getGroup(trigger.trigger);
                eventTypes[i] = trigger.eventType;
            }
            this._observer = new GroupObserver(groups, eventTypes);
            this._buffer = [];
        }
        /**
         * Get subsystems
         * @type {entitas.IReactiveExecuteSystem}
         * @name entitas.Pool#subsystem */
        get subsystem() { return this._subsystem; }
        activate() {
            this._observer.activate();
        }
        deactivate() {
            this._observer.deactivate();
        }
        clear() {
            this._observer.clearCollectedEntities();
        }
        /**
         * execute
         */
        execute() {
            const collectedEntities = this._observer.collectedEntities;
            const ensureComponents = this._ensureComponents;
            const excludeComponents = this._excludeComponents;
            const buffer = this._buffer;
            let j = buffer.length;
            if (Object.keys(collectedEntities).length != 0) {
                if (ensureComponents) {
                    if (excludeComponents) {
                        for (let k in collectedEntities) {
                            const e = collectedEntities[k];
                            if (ensureComponents.matches(e) && !excludeComponents.matches(e)) {
                                buffer[j++] = e.addRef();
                            }
                        }
                    }
                    else {
                        for (let k in collectedEntities) {
                            const e = collectedEntities[k];
                            if (ensureComponents.matches(e)) {
                                buffer[j++] = e.addRef();
                            }
                        }
                    }
                }
                else if (excludeComponents) {
                    for (let k in collectedEntities) {
                        const e = collectedEntities[k];
                        if (!excludeComponents.matches(e)) {
                            buffer[j++] = e.addRef();
                        }
                    }
                }
                else {
                    for (let k in collectedEntities) {
                        const e = collectedEntities[k];
                        buffer[j++] = e.addRef();
                    }
                }
                this._observer.clearCollectedEntities();
                if (buffer.length != 0) {
                    this._subsystem.execute(buffer);
                    for (let i = 0, bufferCount = buffer.length; i < bufferCount; i++) {
                        buffer[i].release();
                    }
                    buffer.length = 0;
                    if (this._clearAfterExecute) {
                        this._observer.clearCollectedEntities();
                    }
                }
            }
        }
    }
    entitas.ReactiveSystem = ReactiveSystem;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    /**
     * As
     * Retuns the object if it implements the interface, else null
     *
     * @param object
     * @param method
     * @returns Object
     */
    function as(object, method) {
        return method in object ? object : null;
    }
    class Systems {
        /**
         * @constructor
         *
         */
        constructor() {
            this._initializeSystems = [];
            this._executeSystems = [];
            /**
             * Load Extensions
             */
        }
        /**
         * Add System
         * @param system
         * @returns {entitas.Systems}
         */
        add(system) {
            if ('function' === typeof system) {
                const Klass = system;
                system = new Klass();
            }
            const reactiveSystem = as(system, 'subsystem');
            const initializeSystem = reactiveSystem != null
                ? as(reactiveSystem.subsystem, 'initialize')
                : as(system, 'initialize');
            if (initializeSystem != null) {
                const _initializeSystems = this._initializeSystems;
                _initializeSystems[_initializeSystems.length] = initializeSystem;
            }
            const executeSystem = as(system, 'execute');
            if (executeSystem != null) {
                const _executeSystems = this._executeSystems;
                _executeSystems[_executeSystems.length] = executeSystem;
            }
            return this;
        }
        /**
         * Initialize Systems
         */
        initialize() {
            for (let i = 0, initializeSysCount = this._initializeSystems.length; i < initializeSysCount; i++) {
                this._initializeSystems[i].initialize();
            }
        }
        /**
         * Execute sustems
         */
        execute() {
            const executeSystems = this._executeSystems;
            for (let i = 0, exeSysCount = executeSystems.length; i < exeSysCount; i++) {
                executeSystems[i].execute();
            }
        }
        /**
         * Clear subsystems
         */
        clearReactiveSystems() {
            for (let i = 0, exeSysCount = this._executeSystems.length; i < exeSysCount; i++) {
                const reactiveSystem = as(this._executeSystems[i], 'subsystem');
                if (reactiveSystem != null) {
                    reactiveSystem.clear();
                }
                const nestedSystems = as(this._executeSystems[i], 'clearReactiveSystems');
                if (nestedSystems != null) {
                    nestedSystems.clearReactiveSystems();
                }
            }
        }
    }
    entitas.Systems = Systems;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var viewer;
    (function (viewer) {
        /**
         * Profiler class for Entities
         */
        class EntityBehavior {
            /**
             * @constructor
             *
             * @param obj
             */
            constructor(obj) {
                this.obj = obj;
                if (this.obj.name) {
                    this._name = this.obj.name;
                }
                else {
                    this._name = `Entity_${this.obj._creationIndex}`;
                }
                Object.defineProperty(this, this._name, { get: () => this.obj.toString() });
            }
            get name() {
                return this._name;
            }
        }
        viewer.EntityBehavior = EntityBehavior;
    })(viewer = entitas.viewer || (entitas.viewer = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var viewer;
    (function (viewer) {
        /**
         * Profiler class for Pools
         */
        class PoolObserver {
            /**
             * @constructor
             *
             * @param _pool
             */
            constructor(_pool) {
                this._pool = _pool;
                this._groups = this._pool._groups;
            }
            get name() {
                return "Pool";
            }
            get Pool() {
                return "Pool " + " (" +
                    this._pool.count + " entities, " +
                    this._pool.reusableEntitiesCount + " reusable, " +
                    Object.keys(this._groups).length + " groups)";
            }
            get entities() {
                return this._pool.count;
            }
            get reusable() {
                return this._pool.reusableEntitiesCount;
            }
        }
        viewer.PoolObserver = PoolObserver;
    })(viewer = entitas.viewer || (entitas.viewer = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var viewer;
    (function (viewer) {
        /** todo: SystemObserver track time spent in ms by system */
        /**
         * Profiler class for Systems
         */
        class SystemObserver {
            /**
             * @constructor
             *
             * @param _systems
             */
            constructor(_systems) {
                this._systems = _systems;
            }
            get name() {
                return "Systems";
            }
            get Systems() {
                return "Systems " + " (" +
                    this._systems._initializeSystems.length + " init, " +
                    this._systems._executeSystems.length + " exe ";
            }
            get initialize() {
                return this._systems._initializeSystems.length;
            }
            get execute() {
                return this._systems._executeSystems.length;
            }
        }
        viewer.SystemObserver = SystemObserver;
    })(viewer = entitas.viewer || (entitas.viewer = {}));
})(entitas || (entitas = {}));
/**
 * Inspired by Unity
 */
var entitas;
(function (entitas) {
    var viewer;
    (function (viewer) {
        var Systems = entitas.Systems;
        var EntityBehavior = entitas.viewer.EntityBehavior;
        var SystemObserver = entitas.viewer.SystemObserver;
        var PoolObserver = entitas.viewer.PoolObserver;
        /**
         * @class VisualDebugging
         */
        class VisualDebugging {
            /**
             *
             * @param pool
             */
            static init(pool) {
                if ((pool._debug || location.search === "?debug=true") && window['dat']) {
                    viewer.gui = new dat.GUI({ height: 5 * 32 - 1, width: 300 });
                    const observer = new PoolObserver(pool);
                    VisualDebugging._controllers = {};
                    VisualDebugging._entities = viewer.gui.addFolder('Entities');
                    VisualDebugging._pools = viewer.gui.addFolder('Pools');
                    VisualDebugging._systems = viewer.gui.addFolder('Systems');
                    VisualDebugging._entities.open();
                    VisualDebugging._pools.open();
                    VisualDebugging._systems.open();
                    VisualDebugging._pools.add(observer, 'entities').listen();
                    VisualDebugging._pools.add(observer, 'reusable').listen();
                    pool.onEntityCreated.add((pool, entity) => {
                        const proxy = new EntityBehavior(entity);
                        VisualDebugging._controllers[entity.id] = VisualDebugging._entities.add(proxy, proxy.name).listen();
                    });
                    pool.onEntityDestroyed.add((pool, entity) => {
                        const controller = VisualDebugging._controllers[entity.id];
                        delete VisualDebugging._controllers[entity.id];
                        VisualDebugging._entities.remove(controller);
                    });
                    /** Wrap the Systems::initialize method */
                    const superInitialize = Systems.prototype.initialize;
                    Systems.prototype.initialize = function () {
                        superInitialize.call(this);
                        const sys = new SystemObserver(this);
                        VisualDebugging._systems.add(sys, 'initialize').listen();
                        VisualDebugging._systems.add(sys, 'execute').listen();
                    };
                    function get_Systems() {
                        return "Systems " + " (" +
                            this._initializeSystems.length + " init, " +
                            this._executeSystems.length + " exe ";
                    }
                    Object.defineProperty(Systems.prototype, 'name', { get: () => 'Systems' });
                    Object.defineProperty(Systems.prototype, 'Systems', { get: get_Systems });
                }
            }
        }
        viewer.VisualDebugging = VisualDebugging;
    })(viewer = entitas.viewer || (entitas.viewer = {}));
})(entitas || (entitas = {}));
//# sourceMappingURL=entitas.js.map