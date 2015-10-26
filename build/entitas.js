var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    var Signal = (function () {
        /**
         *
         * @param context
         * @param alloc
         */
        function Signal(context, alloc) {
            if (alloc === void 0) { alloc = 16; }
            this._listeners = [];
            this._context = context;
            this._alloc = alloc;
            this._size = 0;
        }
        /**
         * Dispatch event
         * @param args
         */
        Signal.prototype.dispatch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var listeners = this._listeners;
            var size = listeners.length;
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
            this._listeners.push(listener);
            //var listeners = this._listeners;
            //var length = listeners.length;
            //
            //if (this._size === length) {
            //  listeners.length = ~~((length * 3) / 2) + 1;
            //}
            //listeners[this._size++] = listener;
            //
        };
        /**
         * Remove event listener
         * @param listener
         */
        Signal.prototype.remove = function (listener) {
            var listeners = this._listeners;
            var index = listeners.indexOf(listener);
            if (index !== -1)
                listeners.splice(index, 1);
            //var listeners = this._listeners;
            //var size = this._size;
            //
            //for (var i = 0; i < size; i++) {
            //  if (listener == listeners[i]) {
            //    for (var j = i, k = i+1; k < size; j++, k++) {
            //      listeners[j] = listeners[k];
            //    }
            //    delete listeners[--this._size];
            //    //listeners[--this._size] = undefined;
            //    return;
            //  }
            //}
        };
        /**
         * Clear and reset to original alloc
         */
        Signal.prototype.clear = function () {
            this._listeners.length = 0;
            //this._listeners.length = this._alloc;
        };
        return Signal;
    })();
    entitas.Signal = Signal;
})(entitas || (entitas = {}));
var entitas;
(function (entitas) {
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
    entitas.Stopwatch = Stopwatch;
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
            var matchesAllOf = this._allOfIndices === undefined || entity.hasComponents(this._allOfIndices);
            var matchesAnyOf = this._anyOfIndices === undefined || entity.hasAnyComponent(this._anyOfIndices);
            var matchesNoneOf = this._noneOfIndices === undefined || !entity.hasAnyComponent(this._noneOfIndices);
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
                        sb.push(".");
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
                matcher._allOfIndices = Matcher.distinctIndices(args);
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
                matcher._anyOfIndices = Matcher.distinctIndices(args);
                return matcher;
            }
            else {
                return Matcher.anyOf.apply(this, Matcher.mergeIndices(args));
            }
        };
        Matcher.appendIndices = function (sb, prefix, indexArray) {
            var SEPERATOR = ", ";
            sb.push(prefix);
            sb.push("(");
            var lastSeperator = indexArray.length - 1;
            for (var i = 0, indicesLength = indexArray.length; i < indicesLength; i++) {
                sb.push('' + indexArray[i]);
                if (i < lastSeperator) {
                    sb.push(SEPERATOR);
                }
            }
            sb.push(")");
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
    var Signal = entitas.Signal;
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
            this.onComponentAdded.dispatch(this, index, component);
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
            var previousComponent = this._components[index];
            if (previousComponent === replacement) {
                this.onComponentReplaced.dispatch(this, index, previousComponent, replacement);
            }
            else {
                this._components[index] = replacement;
                this._componentsCache = undefined;
                if (replacement === undefined) {
                    delete this._components[index];
                    this._componentIndicesCache = undefined;
                    this._toStringCache = undefined;
                    this.onComponentRemoved.dispatch(this, index, previousComponent);
                }
                else {
                    this.onComponentReplaced.dispatch(this, index, previousComponent, replacement);
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
                for (var i = 0, componentsLength = this._components.length; i < componentsLength; i++) {
                    var component = this._components[i];
                    if (component !== undefined) {
                        components.push(component);
                    }
                }
                this._componentsCache = components;
            }
            return this._componentsCache;
        };
        Entity.prototype.getComponentIndices = function () {
            if (this._componentIndicesCache === undefined) {
                var indices = [];
                for (var i = 0, componentsLength = this._components.length; i < componentsLength; i++) {
                    if (this._components[i] !== undefined) {
                        indices.push(i);
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
            for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
                if (this._components[indices[i]] === undefined) {
                    return false;
                }
            }
            return true;
        };
        Entity.prototype.hasAnyComponent = function (indices) {
            for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
                if (this._components[indices[i]] !== undefined) {
                    return true;
                }
            }
            return false;
        };
        Entity.prototype.removeAllComponents = function () {
            this._toStringCache = undefined;
            for (var i = 0, componentsLength = this._components.length; i < componentsLength; i++) {
                if (this._components[i] !== undefined) {
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
                //sb.push("Entity_");
                //sb.push(this._creationIndex);
                //sb.push("(");
                var seperator = ", ";
                var components = this.getComponents();
                var lastSeperator = components.length - 1;
                for (var i = 0, componentsLength = components.length; i < componentsLength; i++) {
                    sb.push(components[i].constructor['name'].replace('Component', '') || i + '');
                    if (i < lastSeperator) {
                        sb.push(seperator);
                    }
                }
                //sb.push(")");
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
                this.onEntityReleased.dispatch(this);
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
    var Signal = entitas.Signal;
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
            if (entity.creationIndex in this._entities) {
                this.onEntityRemoved.dispatch(this, entity, index, previousComponent);
                this.onEntityAdded.dispatch(this, entity, index, newComponent);
                this.onEntityUpdated.dispatch(this, entity, index, previousComponent, newComponent);
            }
        };
        Group.prototype.addEntitySilently = function (entity) {
            if (!(entity.creationIndex in this._entities)) {
                this._entities[entity.creationIndex] = entity;
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.addRef();
            }
        };
        Group.prototype.addEntity = function (entity, index, component) {
            if (!(entity.creationIndex in this._entities)) {
                this._entities[entity.creationIndex] = entity;
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.addRef();
                this.onEntityAdded.dispatch(this, entity, index, component);
            }
        };
        Group.prototype.removeEntitySilently = function (entity) {
            if (entity.creationIndex in this._entities) {
                delete this._entities[entity.creationIndex];
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.release();
            }
        };
        Group.prototype.removeEntity = function (entity, index, component) {
            if (entity.creationIndex in this._entities) {
                delete this._entities[entity.creationIndex];
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                this.onEntityRemoved.dispatch(this, entity, index, component);
                entity.release();
            }
        };
        Group.prototype.containsEntity = function (entity) {
            return entity.creationIndex in this._entities;
        };
        Group.prototype.getEntities = function () {
            if (this._entitiesCache === undefined) {
                this._entitiesCache = [];
                for (var k in this._entities) {
                    this._entitiesCache.push(this._entities[k]);
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
                if (!(entity.creationIndex in _this._collectedEntities)) {
                    _this._collectedEntities[entity.creationIndex] = entity;
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
    var Group = entitas.Group;
    var Entity = entitas.Entity;
    var EntityIsNotDestroyedException = entitas.EntityIsNotDestroyedException;
    var PoolDoesNotContainEntityException = entitas.PoolDoesNotContainEntityException;
    var Pool = (function () {
        function Pool(components, totalComponents, startCreationIndex) {
            var _this = this;
            if (startCreationIndex === void 0) { startCreationIndex = 0; }
            this._entities = {};
            this._groups = {};
            this._reusableEntities = [];
            this._retainedEntities = {};
            this._totalComponents = 0;
            this._creationIndex = 0;
            this.updateGroupsComponentAddedOrRemoved = function (entity, index, component) {
                var groups = _this._groupsForIndex[index];
                if (groups !== undefined) {
                    for (var i = 0, groupsCount = groups.length; i < groupsCount; i++) {
                        groups[i].handleEntity(entity, index, component);
                    }
                }
            };
            this.updateGroupsComponentReplaced = function (entity, index, previousComponent, newComponent) {
                var groups = _this._groupsForIndex[index];
                if (groups !== undefined) {
                    for (var i = 0, groupsCount = groups.length; i < groupsCount; i++) {
                        groups[i].updateEntity(entity, index, previousComponent, newComponent);
                    }
                }
            };
            this.onEntityReleased = function (entity) {
                if (entity._isEnabled) {
                    throw new EntityIsNotDestroyedException("Cannot release entity.");
                }
                entity.onEntityReleased.remove(_this._cachedOnEntityReleased);
                delete _this._retainedEntities[entity.creationIndex];
                _this._reusableEntities.push(entity);
            };
            this.onGroupCreated = new entitas.Signal(this);
            this.onEntityCreated = new entitas.Signal(this);
            this.onEntityDestroyed = new entitas.Signal(this);
            this.onEntityWillBeDestroyed = new entitas.Signal(this);
            this._componentsEnum = components;
            this._totalComponents = totalComponents;
            this._creationIndex = startCreationIndex;
            this._groupsForIndex = [];
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
            get: function () { return this._reusableEntities.length; },
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
            var entity = this._reusableEntities.length > 0 ? this._reusableEntities.pop() : new Entity(this._componentsEnum, this._totalComponents);
            entity._isEnabled = true;
            entity.name = name;
            entity._creationIndex = this._creationIndex++;
            entity.addRef();
            this._entities[entity.creationIndex] = entity;
            this._entitiesCache = undefined;
            entity.onComponentAdded.add(this._cachedUpdateGroupsComponentAddedOrRemoved);
            entity.onComponentRemoved.add(this._cachedUpdateGroupsComponentAddedOrRemoved);
            entity.onComponentReplaced.add(this._cachedUpdateGroupsComponentReplaced);
            entity.onEntityReleased.add(this._cachedOnEntityReleased);
            this.onEntityCreated.dispatch(this, entity);
            return entity;
        };
        /**
         *
         * @param entity
         */
        Pool.prototype.destroyEntity = function (entity) {
            if (!(entity.creationIndex in this._entities)) {
                throw new PoolDoesNotContainEntityException(entity, "Could not destroy entity!");
            }
            delete this._entities[entity.creationIndex];
            this._entitiesCache = undefined;
            this.onEntityWillBeDestroyed.dispatch(this, entity);
            entity.destroy();
            this.onEntityDestroyed.dispatch(this, entity);
            if (entity._refCount === 1) {
                entity.onEntityReleased.remove(this._cachedOnEntityReleased);
                this._reusableEntities.push(entity);
            }
            else {
                this._retainedEntities[entity.creationIndex] = entity;
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
            return entity.creationIndex in this._entities;
        };
        Pool.prototype.getEntities = function () {
            if (this._entitiesCache === undefined) {
                this._entitiesCache = [];
                for (var k in Object.keys(this._entities)) {
                    this._entitiesCache.push(this._entities[k]);
                }
            }
            return this._entitiesCache;
        };
        //public getEntities(matcher?:IMatcher):Entity[] {
        //  if (matcher) {
        //    /** PoolExtension::getEntities */
        //    return this.getGroup(matcher).getEntities();
        //  } else {
        //    if (this._entitiesCache === undefined) {
        //      this._entitiesCache = [];
        //      for (var k in Object.keys(this._entities)) {
        //        this._entitiesCache.push(this._entities[k]);
        //      }
        //    }
        //    return this._entitiesCache;
        //  }
        //}
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
                        this._groupsForIndex[index] = [];
                    }
                    this._groupsForIndex[index].push(group);
                }
                this.onGroupCreated.dispatch(this, group);
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
            if (Object.keys(collectedEntities).length != 0) {
                if (ensureComponents) {
                    if (excludeComponents) {
                        for (var k in collectedEntities) {
                            var e = collectedEntities[k];
                            if (ensureComponents.matches(e) && !excludeComponents.matches(e)) {
                                buffer.push(e.addRef());
                            }
                        }
                    }
                    else {
                        for (var k in collectedEntities) {
                            var e = collectedEntities[k];
                            if (ensureComponents.matches(e)) {
                                buffer.push(e.addRef());
                            }
                        }
                    }
                }
                else if (excludeComponents) {
                    for (var k in collectedEntities) {
                        var e = collectedEntities[k];
                        if (!excludeComponents.matches(e)) {
                            buffer.push(e.addRef());
                        }
                    }
                }
                else {
                    for (var k in collectedEntities) {
                        var e = collectedEntities[k];
                        buffer.push(e.addRef());
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
                this._initializeSystems.push(initializeSystem);
            }
            var executeSystem = as(system, 'execute');
            if (executeSystem != null) {
                this._executeSystems.push(executeSystem);
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
                    this._entitiesCache = [];
                    for (var k in Object.keys(this._entities)) {
                        this._entitiesCache.push(this._entities[k]);
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
                    VisualDebugging._controllers = [];
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
                        VisualDebugging._controllers[entity.creationIndex] = VisualDebugging._entities.add(proxy, proxy.name).listen();
                    });
                    pool.onEntityDestroyed.add(function (pool, entity) {
                        var controller = VisualDebugging._controllers[entity.creationIndex];
                        delete VisualDebugging._controllers[entity.creationIndex];
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
//# sourceMappingURL=entitas.js.map