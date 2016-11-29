var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        "use strict";
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
        /**
         * @class UUID
         */
        var UUID = (function () {
            function UUID() {
            }
            //static check = {}
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
        }());
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
        var Bag = (function (_super) {
            __extends(Bag, _super);
            /**
             * Constructs an empty Bag with the specified initial capacity.
             * Constructs an empty Bag with an initial capacity of 64.
             *
             * @constructor
             * @param capacity the initial capacity of Bag
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
             * @return {Object} element that was removed from the Bag
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
             * @return {boolean} true if this list contained the specified element
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
             * @return {Object} the last object in the bag, null if empty.
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
             * @return {boolean}
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
             * @return {boolean} true if this Bag changed as a result of the call
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
             * @return {Object} the element at the specified position in bag
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
             * @return {Object} the element at the specified position in bag
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
             * @return {number} the number of elements in this bag
             */
            Bag.prototype.size = function () {
                return this.size_;
            };
            /**
             * Returns the number of elements the bag can hold without growing.
             *
             * @return {number} the number of elements the bag can hold without growing.
             */
            Bag.prototype.getCapacity = function () {
                return this.length;
            };
            /**
             * Checks if the internal storage supports this index.
             *
             * @param index
             * @return {boolean}
             */
            Bag.prototype.isIndexWithinBounds = function (index) {
                return index < this.getCapacity();
            };
            /**
             * Returns true if this list contains no elements.
             *
             * @return {boolean} true if this list contains no elements
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
        }(Array));
        utils.Bag = Bag;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        "use strict";
        var Bag = entitas.utils.Bag;
        var Signal = (function () {
            /**
             *
             * @constructor
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
             * @param args list
             */
            Signal.prototype.dispatch = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var listeners = this._listeners;
                var size = listeners.size();
                if (size <= 0)
                    return; // bail early
                var context = this._context;
                for (var i = 0; i < size; i++) {
                    listeners[i].apply(context, args);
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
        }());
        utils.Signal = Signal;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var utils;
    (function (utils) {
        "use strict";
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
        }());
        utils.Stopwatch = Stopwatch;
    })(utils = entitas.utils || (entitas.utils = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var Exception = (function () {
        /**
         * Base exception class
         * @constructot
         * @param message
         */
        function Exception(message) {
            this.message = message;
        }
        /** @return {string} */
        Exception.prototype.toString = function () {
            return this.message;
        };
        return Exception;
    }());
    entitas.Exception = Exception;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var EntityAlreadyHasComponentException = (function (_super) {
            __extends(EntityAlreadyHasComponentException, _super);
            /**
             * Entity Already Has Component Exception
             * @constructor
             * @param message
             * @param index
             */
            function EntityAlreadyHasComponentException(message, index) {
                _super.call(this, message + "\nEntity already has a component at index (" + index + ") " + entitas.Pool.componentsEnum[index]);
            }
            return EntityAlreadyHasComponentException;
        }(Exception));
        exceptions.EntityAlreadyHasComponentException = EntityAlreadyHasComponentException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var EntityDoesNotHaveComponentException = (function (_super) {
            __extends(EntityDoesNotHaveComponentException, _super);
            /**
             * Entity Does Not Have Component Exception
             * @constructor
             * @param message
             * @param index
             */
            function EntityDoesNotHaveComponentException(message, index) {
                _super.call(this, message + "\nEntity does not have a component at index (" + index + ") " + entitas.Pool.componentsEnum[index]);
            }
            return EntityDoesNotHaveComponentException;
        }(Exception));
        exceptions.EntityDoesNotHaveComponentException = EntityDoesNotHaveComponentException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var EntityIsAlreadyReleasedException = (function (_super) {
            __extends(EntityIsAlreadyReleasedException, _super);
            /**
             * Entity Is Already Released Exception
             * @constructor
             */
            function EntityIsAlreadyReleasedException() {
                _super.call(this, "Entity is already released!");
            }
            return EntityIsAlreadyReleasedException;
        }(Exception));
        exceptions.EntityIsAlreadyReleasedException = EntityIsAlreadyReleasedException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var EntityIsNotDestroyedException = (function (_super) {
            __extends(EntityIsNotDestroyedException, _super);
            /**
             * Entity Is Not Destroyed Exception
             * @constructor
             * @param message
             */
            function EntityIsNotDestroyedException(message) {
                _super.call(this, message + "\nEntity is not destroyed yet!");
            }
            return EntityIsNotDestroyedException;
        }(Exception));
        exceptions.EntityIsNotDestroyedException = EntityIsNotDestroyedException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var EntityIsNotEnabledException = (function (_super) {
            __extends(EntityIsNotEnabledException, _super);
            /**
             * Entity Is Not Enabled Exception
             * @constructor
             * @param message
             */
            function EntityIsNotEnabledException(message) {
                _super.call(this, message + "\nEntity is not enabled");
            }
            return EntityIsNotEnabledException;
        }(Exception));
        exceptions.EntityIsNotEnabledException = EntityIsNotEnabledException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var GroupObserverException = (function (_super) {
            __extends(GroupObserverException, _super);
            /**
             * Group Observer Exception
             * @constructor
             * @param message
             */
            function GroupObserverException(message) {
                _super.call(this, message);
            }
            return GroupObserverException;
        }(Exception));
        exceptions.GroupObserverException = GroupObserverException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var MatcherException = (function (_super) {
            __extends(MatcherException, _super);
            /**
             * Matcher Exception
             * @constructor
             * @param matcher
             */
            function MatcherException(matcher) {
                _super.call(this, "matcher.indices.length must be 1 but was " + matcher.indices.length);
            }
            return MatcherException;
        }(Exception));
        exceptions.MatcherException = MatcherException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var PoolDoesNotContainEntityException = (function (_super) {
            __extends(PoolDoesNotContainEntityException, _super);
            /**
             * Pool Does Not Contain Entity Exception
             * @constructor
             * @param entity
             * @param message
             */
            function PoolDoesNotContainEntityException(entity, message) {
                _super.call(this, message + "\nPool does not contain entity " + entity);
            }
            return PoolDoesNotContainEntityException;
        }(Exception));
        exceptions.PoolDoesNotContainEntityException = PoolDoesNotContainEntityException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var exceptions;
    (function (exceptions) {
        "use strict";
        var Exception = entitas.Exception;
        var SingleEntityException = (function (_super) {
            __extends(SingleEntityException, _super);
            /**
             * Single Entity Exception
             * @constructor
             * @param matcher
             */
            function SingleEntityException(matcher) {
                _super.call(this, "Multiple entities exist matching " + matcher);
            }
            return SingleEntityException;
        }(Exception));
        exceptions.SingleEntityException = SingleEntityException;
    })(exceptions = entitas.exceptions || (entitas.exceptions = {}));
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var TriggerOnEvent = (function () {
        /**
         * @constructor
         *
         * @param trigger
         * @param eventType
         */
        function TriggerOnEvent(trigger, eventType) {
            this.trigger = trigger;
            this.eventType = eventType;
        }
        return TriggerOnEvent;
    }());
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
    var Matcher = (function () {
        /**
         * @constructor
         *
         */
        function Matcher() {
            this._id = Matcher.uniqueId++;
        }
        Object.defineProperty(Matcher.prototype, "id", {
            /**
             * Get the matcher id
             * @type {number}
             * @name entitas.Matcher#id */
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matcher.prototype, "indices", {
            /**
             * A list of the component ordinals that this matches
             * @type {Array<number>}
             * @name entitas.Matcher#indices */
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
            /**
             * A unique sequential index number assigned to each entity at creation
             * @type {number}
             * @name entitas.Matcher#allOfIndices */
            get: function () { return this._allOfIndices; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matcher.prototype, "anyOfIndices", {
            /**
             * A unique sequential index number assigned to each entity at creation
             * @type {number}
             * @name entitas.Matcher#anyOfIndices */
            get: function () { return this._anyOfIndices; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matcher.prototype, "noneOfIndices", {
            /**
             * A unique sequential index number assigned to each entity at creation
             * @type {number}
             * @name entitas.Matcher#noneOfIndices */
            get: function () { return this._noneOfIndices; },
            enumerable: true,
            configurable: true
        });
        /**
         * Matches anyOf the components/indices specified
         * @params {Array<entitas.IMatcher>|Array<number>} args
         * @returns {entitas.Matcher}
         */
        Matcher.prototype.anyOf = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                this._anyOfIndices = Matcher.distinctIndices(args);
                this._indices = null;
                return this;
            }
            else {
                return this.anyOf.apply(this, Matcher.mergeIndices(args));
            }
        };
        /**
         * Matches noneOf the components/indices specified
         * @params {Array<entitas.IMatcher>|Array<number>} args
         * @returns {entitas.Matcher}
         */
        Matcher.prototype.noneOf = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if ('number' === typeof args[0] || 'string' === typeof args[0]) {
                this._noneOfIndices = Matcher.distinctIndices(args);
                this._indices = null;
                return this;
            }
            else {
                return this.noneOf.apply(this, Matcher.mergeIndices(args));
            }
        };
        /**
         * Check if the entity matches this matcher
         * @param {entitas.Entity} entity
         * @returns {boolean}
         */
        Matcher.prototype.matches = function (entity) {
            var matchesAllOf = this._allOfIndices == null ? true : entity.hasComponents(this._allOfIndices);
            var matchesAnyOf = this._anyOfIndices == null ? true : entity.hasAnyComponent(this._anyOfIndices);
            var matchesNoneOf = this._noneOfIndices == null ? true : !entity.hasAnyComponent(this._noneOfIndices);
            return matchesAllOf && matchesAnyOf && matchesNoneOf;
        };
        /**
         * Merge list of component indices
         * @returns {Array<number>}
         */
        Matcher.prototype.mergeIndices = function () {
            //const totalIndices = (this._allOfIndices != null ? this._allOfIndices.length : 0)
            //  + (this._anyOfIndices != null ? this._anyOfIndices.length : 0)
            //  + (this._noneOfIndices != null ? this._noneOfIndices.length : 0)
            var indicesList = [];
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
        };
        /**
         * toString representation of this matcher
         * @returns {string}
         */
        Matcher.prototype.toString = function () {
            if (this._toStringCache == null) {
                var sb = [];
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
        };
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
        Matcher.distinctIndices = function (indices) {
            var indicesSet = {};
            for (var i = 0, l = indices.length; i < l; i++) {
                var k = '' + indices[i];
                indicesSet[k] = i;
            }
            return [].concat(Object.keys(indicesSet));
        };
        /**
         * Merge all the indices of a set of Matchers
         * @param {Array<IMatcher>} matchers
         * @returns {Array<number>}
         */
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
        /**
         * Matches allOf the components/indices specified
         * @params {Array<entitas.IMatcher>|Array<number>} args
         * @returns {entitas.Matcher}
         */
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
        /**
         * Matches anyOf the components/indices specified
         * @params {Array<entitas.IMatcher>|Array<number>} args
         * @returns {entitas.Matcher}
         */
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
        /**
         * Subscribe to Entity Added event
         * @returns {entitas.TriggerOnEvent}
         */
        Matcher.prototype.onEntityAdded = function () {
            return new TriggerOnEvent(this, GroupEventType.OnEntityAdded);
        };
        /**
         * Subscribe to Entity Removed event
         * @returns {entitas.TriggerOnEvent}
         */
        Matcher.prototype.onEntityRemoved = function () {
            return new TriggerOnEvent(this, GroupEventType.OnEntityRemoved);
        };
        /**
         * Subscribe to Entity Added or Removed event
         * @returns {entitas.TriggerOnEvent}
         */
        Matcher.prototype.onEntityAddedOrRemoved = function () {
            return new TriggerOnEvent(this, GroupEventType.OnEntityAddedOrRemoved);
        };
        /**
         * A unique sequential index number assigned to each ,atch
         * @type {number} */
        Matcher.uniqueId = 0;
        return Matcher;
    }());
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
    var Entity = (function () {
        /**
         * The basic game object. Everything is an entity with components that
         * are added / removed as needed.
         *
         * @param {Object} componentsEnum
         * @param {number} totalComponents
         * @constructor
         */
        function Entity(componentsEnum, totalComponents) {
            if (totalComponents === void 0) { totalComponents = 16; }
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
        Object.defineProperty(Entity.prototype, "creationIndex", {
            /**
             * A unique sequential index number assigned to each entity at creation
             * @type {number}
             * @name entitas.Entity#creationIndex */
            get: function () { return this._creationIndex; },
            enumerable: true,
            configurable: true
        });
        Entity.initialize = function (totalComponents, options) {
            Entity.size = options.entities || 100;
        };
        /**
         * allocate entity pool
         *
         * @param count number of components
         * @param size max number of entities
         */
        Entity.dim = function (count, size) {
            Entity.alloc = new Array(size);
            for (var e = 0; e < size; e++) {
                Entity.alloc[e] = new Array(count);
                for (var k = 0; k < count; k++) {
                    Entity.alloc[e][k] = null;
                }
            }
        };
        /**
         * Initialize
         * allocate the entity pool.
         *
         * @param {number} totalComponents
         * @returns {Array<entitas.IComponent>}
         */
        Entity.prototype.initialize = function (totalComponents) {
            var mem;
            var size = Entity.size;
            if (Entity.alloc == null)
                Entity.dim(totalComponents, size);
            var alloc = Entity.alloc;
            this.instanceIndex = Entity.instanceIndex++;
            if (mem = alloc[this.instanceIndex])
                return mem;
            console.log('Insufficient memory allocation at ', this.instanceIndex, '. Allocating ', size, ' entities.');
            for (var i = this.instanceIndex, l = i + size; i < l; i++) {
                alloc[i] = new Array(totalComponents);
                for (var k = 0; k < totalComponents; k++) {
                    alloc[i][k] = null;
                }
            }
            mem = alloc[this.instanceIndex];
            return mem;
        };
        /**
         * AddComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         * @returns {entitas.Entity}
         */
        Entity.prototype.addComponent = function (index, component) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot add component!");
            }
            if (this.hasComponent(index)) {
                var errorMsg = "Cannot add component at index " + index + " to " + this;
                throw new EntityAlreadyHasComponentException(errorMsg, index);
            }
            this._components[index] = component;
            this._componentsCache = null;
            this._componentIndicesCache = null;
            this._toStringCache = null;
            var onComponentAdded = this.onComponentAdded;
            if (onComponentAdded.active)
                onComponentAdded.dispatch(this, index, component);
            return this;
        };
        /**
         * RemoveComponent
         *
         * @param {number} index
         * @returns {entitas.Entity}
         */
        Entity.prototype.removeComponent = function (index) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot remove component!");
            }
            if (!this.hasComponent(index)) {
                var errorMsg = "Cannot remove component at index " + index + " from " + this;
                throw new EntityDoesNotHaveComponentException(errorMsg, index);
            }
            this._replaceComponent(index, null);
            return this;
        };
        /**
         * ReplaceComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         * @returns {entitas.Entity}
         */
        Entity.prototype.replaceComponent = function (index, component) {
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
                this._componentsCache = null;
                if (replacement == null) {
                    //delete components[index]
                    components[index] = null;
                    this._componentIndicesCache = null;
                    this._toStringCache = null;
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
        /**
         * GetComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         */
        Entity.prototype.getComponent = function (index) {
            if (!this.hasComponent(index)) {
                var errorMsg = "Cannot get component at index " + index + " from " + this;
                throw new EntityDoesNotHaveComponentException(errorMsg, index);
            }
            return this._components[index];
        };
        /**
         * GetComponents
         *
         * @returns {Array<entitas.IComponent>}
         */
        Entity.prototype.getComponents = function () {
            if (this._componentsCache == null) {
                var components = [];
                var _components = this._components;
                for (var i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
                    var component = _components[i];
                    if (component != null) {
                        components[j++] = component;
                    }
                }
                this._componentsCache = components;
            }
            return this._componentsCache;
        };
        /**
         * GetComponentIndices
         *
         * @returns {Array<number>}
         */
        Entity.prototype.getComponentIndices = function () {
            if (this._componentIndicesCache == null) {
                var indices = [];
                var _components = this._components;
                for (var i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
                    if (_components[i] != null) {
                        indices[j++] = i;
                    }
                }
                this._componentIndicesCache = indices;
            }
            return this._componentIndicesCache;
        };
        /**
         * HasComponent
         *
         * @param {number} index
         * @returns {boolean}
         */
        Entity.prototype.hasComponent = function (index) {
            return this._components[index] != null;
        };
        /**
         * HasComponents
         *
         * @param {Array<number>} indices
         * @returns {boolean}
         */
        Entity.prototype.hasComponents = function (indices) {
            var _components = this._components;
            for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
                if (_components[indices[i]] == null) {
                    return false;
                }
            }
            return true;
        };
        /**
         * HasAnyComponent
         *
         * @param {Array<number>} indices
         * @returns {boolean}
         */
        Entity.prototype.hasAnyComponent = function (indices) {
            var _components = this._components;
            for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
                if (_components[indices[i]] != null) {
                    return true;
                }
            }
            return false;
        };
        /**
         * RemoveAllComponents
         *
         */
        Entity.prototype.removeAllComponents = function () {
            this._toStringCache = null;
            var _components = this._components;
            for (var i = 0, componentsLength = _components.length; i < componentsLength; i++) {
                if (_components[i] != null) {
                    this._replaceComponent(i, null);
                }
            }
        };
        /**
         * Destroy
         *
         */
        Entity.prototype.destroy = function () {
            this.removeAllComponents();
            this.onComponentAdded.clear();
            this.onComponentReplaced.clear();
            this.onComponentRemoved.clear();
            this._isEnabled = false;
        };
        /**
         * ToString
         *
         * @returns {string}
         */
        Entity.prototype.toString = function () {
            if (this._toStringCache == null) {
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
        /**
         * AddRef
         *
         * @returns {entitas.Entity}
         */
        Entity.prototype.addRef = function () {
            this._refCount += 1;
            return this;
        };
        /**
         * Release
         *
         */
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
        return Entity;
    }());
    entitas.Entity = Entity;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var Signal = entitas.utils.Signal;
    var GroupEventType = entitas.GroupEventType;
    var SingleEntityException = entitas.exceptions.SingleEntityException;
    var Group = (function () {
        /**
         * @constructor
         * @param matcher
         */
        function Group(matcher) {
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
        Object.defineProperty(Group.prototype, "count", {
            /**
             * Count the number of entities in this group
             * @type {number}
             * @name entitas.Group#count */
            get: function () { return Object.keys(this._entities).length; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "matcher", {
            /**
             * Get the Matcher for this group
             * @type {entitas.IMatcher}
             * @name entitas.Group#matcher */
            get: function () { return this._matcher; },
            enumerable: true,
            configurable: true
        });
        /**
         * Create an Observer for the event type on this group
         * @param eventType
         */
        Group.prototype.createObserver = function (eventType) {
            if (eventType === undefined)
                eventType = GroupEventType.OnEntityAdded;
            return new entitas.GroupObserver(this, eventType);
        };
        /**
         * Handle adding and removing component from the entity without raising events
         * @param entity
         */
        Group.prototype.handleEntitySilently = function (entity) {
            if (this._matcher.matches(entity)) {
                this.addEntitySilently(entity);
            }
            else {
                this.removeEntitySilently(entity);
            }
        };
        /**
         * Handle adding and removing component from the entity and raisieevents
         * @param entity
         * @param index
         * @param component
         */
        Group.prototype.handleEntity = function (entity, index, component) {
            if (this._matcher.matches(entity)) {
                this.addEntity(entity, index, component);
            }
            else {
                this.removeEntity(entity, index, component);
            }
        };
        /**
         * Update entity and raise events
         * @param entity
         * @param index
         * @param previousComponent
         * @param newComponent
         */
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
        /**
         * Add entity without raising events
         * @param entity
         */
        Group.prototype.addEntitySilently = function (entity) {
            if (!(entity.id in this._entities)) {
                this._entities[entity.id] = entity;
                this._entitiesCache = null;
                this._singleEntityCache = null;
                entity.addRef();
            }
        };
        /**
         * Add entity and raise events
         * @param entity
         * @param index
         * @param component
         */
        Group.prototype.addEntity = function (entity, index, component) {
            if (!(entity.id in this._entities)) {
                this._entities[entity.id] = entity;
                this._entitiesCache = null;
                this._singleEntityCache = null;
                entity.addRef();
                var onEntityAdded = this.onEntityAdded;
                if (onEntityAdded.active)
                    onEntityAdded.dispatch(this, entity, index, component);
            }
        };
        /**
         * Remove entity without raising events
         * @param entity
         */
        Group.prototype.removeEntitySilently = function (entity) {
            if (entity.id in this._entities) {
                delete this._entities[entity.id];
                this._entitiesCache = null;
                this._singleEntityCache = null;
                entity.release();
            }
        };
        /**
         * Remove entity and raise events
         * @param entity
         * @param index
         * @param component
         */
        Group.prototype.removeEntity = function (entity, index, component) {
            if (entity.id in this._entities) {
                delete this._entities[entity.id];
                this._entitiesCache = null;
                this._singleEntityCache = null;
                var onEntityRemoved = this.onEntityRemoved;
                if (onEntityRemoved.active)
                    onEntityRemoved.dispatch(this, entity, index, component);
                entity.release();
            }
        };
        /**
         * Check if group has this entity
         *
         * @param entity
         * @returns boolean
         */
        Group.prototype.containsEntity = function (entity) {
            return entity.id in this._entities;
        };
        /**
         * Get a list of the entities in this group
         *
         * @returns Array<entitas.Entity>
         */
        Group.prototype.getEntities = function () {
            if (this._entitiesCache == null) {
                var entities = this._entities;
                var keys = Object.keys(entities);
                var length_1 = keys.length;
                var entitiesCache = this._entitiesCache = new Array(length_1);
                for (var i = 0; i < length_1; i++) {
                    entitiesCache[i] = entities[keys[i]];
                }
            }
            return this._entitiesCache;
        };
        /**
         * Gets an entity singleton.
         * If a group has more than 1 entity, this is an error condition.
         *
         * @returns entitas.Entity
         */
        Group.prototype.getSingleEntity = function () {
            if (this._singleEntityCache == null) {
                var enumerator = Object.keys(this._entities);
                var c = enumerator.length;
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
        };
        /**
         * Create a string representation for this group:
         *
         *  ex: 'Group(Position)'
         *
         * @returns string
         */
        Group.prototype.toString = function () {
            if (this._toStringCache == null) {
                this._toStringCache = "Group(" + this._matcher + ")";
            }
            return this._toStringCache;
        };
        return Group;
    }());
    entitas.Group = Group;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    "use strict";
    var GroupEventType = entitas.GroupEventType;
    var GroupObserverException = entitas.exceptions.GroupObserverException;
    var GroupObserver = (function () {
        /**
         * @constructor
         * @param {Array<entitas.Group>} groups
         * @param {number} eventTypes
         */
        function GroupObserver(groups, eventTypes) {
            var _this = this;
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
            /**
             * Entities being observed
             * @type {Object<string,entitas.Entity>}
             * @name entitas.GroupObserver#collectedEntities */
            get: function () { return this._collectedEntities; },
            enumerable: true,
            configurable: true
        });
        /**
         * Activate events
         */
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
        /**
         * Deavtivate events
         */
        GroupObserver.prototype.deactivate = function () {
            for (var i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
                var group = this._groups[i];
                group.onEntityAdded.remove(this._addEntityCache);
                group.onEntityRemoved.remove(this._addEntityCache);
                this.clearCollectedEntities();
            }
        };
        /**
         * Clear the list of entities
         */
        GroupObserver.prototype.clearCollectedEntities = function () {
            for (var e in this._collectedEntities) {
                this._collectedEntities[e].release();
            }
            this._collectedEntities = {};
        };
        return GroupObserver;
    }());
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
    var Pool = (function () {
        /**
         * @constructor
         * @param {Object} components
         * @param {number} totalComponents
         * @param {number} startCreationIndex
         */
        function Pool(components, totalComponents, debug, startCreationIndex) {
            var _this = this;
            if (debug === void 0) { debug = false; }
            if (startCreationIndex === void 0) { startCreationIndex = 0; }
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
            this.updateGroupsComponentAddedOrRemoved = function (entity, index, component) {
                var groups = _this._groupsForIndex[index];
                if (groups != null) {
                    for (var i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
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
            this.updateGroupsComponentReplaced = function (entity, index, previousComponent, newComponent) {
                var groups = _this._groupsForIndex[index];
                if (groups != null) {
                    for (var i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
                        groups[i].updateEntity(entity, index, previousComponent, newComponent);
                    }
                }
            };
            /**
             * @param {entitas.Entity} entity
             */
            this.onEntityReleased = function (entity) {
                if (entity._isEnabled) {
                    throw new EntityIsNotDestroyedException("Cannot release entity.");
                }
                entity.onEntityReleased.remove(_this._cachedOnEntityReleased);
                delete _this._retainedEntities[entity.id];
                _this._reusableEntities.add(entity);
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
        Object.defineProperty(Pool.prototype, "totalComponents", {
            /**
             * The total number of components in this pool
             * @type {number}
             * @name entitas.Pool#totalComponents */
            get: function () { return this._totalComponents; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "count", {
            /**
             * Count of active entities
             * @type {number}
             * @name entitas.Pool#count */
            get: function () { return Object.keys(this._entities).length; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "reusableEntitiesCount", {
            /**
             * Count of entities waiting to be recycled
             * @type {number}
             * @name entitas.Pool#reusableEntitiesCount */
            get: function () { return this._reusableEntities.size(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "retainedEntitiesCount", {
            /**
             * Count of entities that sill have references
             * @type {number}
             * @name entitas.Pool#retainedEntitiesCount */
            get: function () { return Object.keys(this._retainedEntities).length; },
            enumerable: true,
            configurable: true
        });
        /**
         * Set the system pool if supported
         *
         * @static
         * @param {entitas.ISystem} system
         * @param {entitas.Pool} pool
         */
        Pool.setPool = function (system, pool) {
            var poolSystem = as(system, 'setPool');
            if (poolSystem != null) {
                poolSystem.setPool(pool);
            }
        };
        /**
         * Create a new entity
         * @param {string} name
         * @returns {entitas.Entity}
         */
        Pool.prototype.createEntity = function (name) {
            var entity = this._reusableEntities.size() > 0 ? this._reusableEntities.removeLast() : new Entity(this._componentsEnum, this._totalComponents);
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
            var onEntityCreated = this.onEntityCreated;
            if (onEntityCreated.active)
                onEntityCreated.dispatch(this, entity);
            return entity;
        };
        /**
         * Destroy an entity
         * @param {entitas.Entity} entity
         */
        Pool.prototype.destroyEntity = function (entity) {
            if (!(entity.id in this._entities)) {
                throw new PoolDoesNotContainEntityException(entity, "Could not destroy entity!");
            }
            delete this._entities[entity.id];
            this._entitiesCache = null;
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
        /**
         * Destroy All Entities
         */
        Pool.prototype.destroyAllEntities = function () {
            var entities = this.getEntities();
            for (var i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
                this.destroyEntity(entities[i]);
            }
        };
        /**
         * Check if pool has this entity
         *
         * @param {entitas.Entity} entity
         * @returns {boolean}
         */
        Pool.prototype.hasEntity = function (entity) {
            return entity.id in this._entities;
        };
        /**
         * Gets all of the entities
         *
         * @returns {Array<entitas.Entity>}
         */
        Pool.prototype.getEntities = function (matcher) {
            if (matcher) {
                /** PoolExtension::getEntities */
                return this.getGroup(matcher).getEntities();
            }
            else {
                if (this._entitiesCache == null) {
                    var entities = this._entities;
                    var keys = Object.keys(entities);
                    var length_2 = keys.length;
                    var entitiesCache = this._entitiesCache = new Array(length_2);
                    for (var i = 0; i < length_2; i++) {
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
        };
        /**
         * Create System
         * @param {entitas.ISystem|Function}
         * @returns {entitas.ISystem}
         */
        Pool.prototype.createSystem = function (system) {
            if ('function' === typeof system) {
                var Klass = system;
                system = new Klass();
            }
            Pool.setPool(system, this);
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
        /**
         * Gets all of the entities that match
         *
         * @param {entias.IMatcher} matcher
         * @returns {entitas.Group}
         */
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
                    if (this._groupsForIndex[index] == null) {
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
        return Pool;
    }());
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
    var ReactiveSystem = (function () {
        /**
         * @constructor
         *
         * @param pool
         * @param subSystem
         */
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
            /**
             * Get subsystems
             * @type {entitas.IReactiveExecuteSystem}
             * @name entitas.Pool#subsystem */
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
        /**
         * execute
         */
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
    }());
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
    var Systems = (function () {
        /**
         * @constructor
         *
         */
        function Systems() {
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
        /**
         * Initialize Systems
         */
        Systems.prototype.initialize = function () {
            for (var i = 0, initializeSysCount = this._initializeSystems.length; i < initializeSysCount; i++) {
                this._initializeSystems[i].initialize();
            }
        };
        /**
         * Execute sustems
         */
        Systems.prototype.execute = function () {
            var executeSystems = this._executeSystems;
            for (var i = 0, exeSysCount = executeSystems.length; i < exeSysCount; i++) {
                executeSystems[i].execute();
            }
        };
        /**
         * Clear subsystems
         */
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
    }());
    entitas.Systems = Systems;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
    var viewer;
    (function (viewer) {
        /**
         * Profiler class for Entities
         */
        var EntityBehavior = (function () {
            /**
             * @constructor
             *
             * @param obj
             */
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
        }());
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
        var PoolObserver = (function () {
            /**
             * @constructor
             *
             * @param _pool
             */
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
        }());
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
        var SystemObserver = (function () {
            /**
             * @constructor
             *
             * @param _systems
             */
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
        }());
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
        var VisualDebugging = (function () {
            function VisualDebugging() {
            }
            /**
             *
             * @param pool
             */
            VisualDebugging.init = function (pool) {
                if ((pool._debug || location.search === "?debug=true") && window['dat']) {
                    viewer.gui = new dat.GUI({ height: 5 * 32 - 1, width: 300 });
                    var observer = new PoolObserver(pool);
                    VisualDebugging._controllers = {};
                    VisualDebugging._entities = viewer.gui.addFolder('Entities');
                    VisualDebugging._pools = viewer.gui.addFolder('Pools');
                    VisualDebugging._systems = viewer.gui.addFolder('Systems');
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
                    /** Wrap the Systems::initialize method */
                    var superInitialize_1 = Systems.prototype.initialize;
                    Systems.prototype.initialize = function () {
                        superInitialize_1.call(this);
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
        }());
        viewer.VisualDebugging = VisualDebugging;
    })(viewer = entitas.viewer || (entitas.viewer = {}));
})(entitas || (entitas = {}));
//# sourceMappingURL=entitas.js.map