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
})(entitas || (entitas = {}));
//# sourceMappingURL=Exception.js.map
//# sourceMappingURL=IComponent.js.map
//# sourceMappingURL=IMatcher.js.map
//# sourceMappingURL=ISystem.js.map
//# sourceMappingURL=IExecuteSystem.js.map
//# sourceMappingURL=IInitializeSystem.js.map
//# sourceMappingURL=IReactiveSystem.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var entitas;
(function (entitas) {
    var Exception = entitas.Exception;
    var CoreMatcher = (function () {
        function CoreMatcher() {
        }
        return CoreMatcher;
    })();
    entitas.CoreMatcher = CoreMatcher;
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
                return this.anyOf(Matcher.mergeIndices(args));
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
                return this.noneOf(Matcher.mergeIndices(args));
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
        /** MatcherExtension::onEntityAdded */
        Matcher.prototype.onEntityAdded = function () {
            return new entitas.TriggerOnEvent(this, entitas.GroupEventType.OnEntityAdded);
        };
        /** MatcherExtension::onEntityRemoved */
        Matcher.prototype.onEntityRemoved = function () {
            return new entitas.TriggerOnEvent(this, entitas.GroupEventType.OnEntityRemoved);
        };
        /** MatcherExtension::onEntityAddedOrRemoved */
        Matcher.prototype.onEntityAddedOrRemoved = function () {
            return new entitas.TriggerOnEvent(this, entitas.GroupEventType.OnEntityAddedOrRemoved);
        };
        Matcher.uniqueId = 0;
        return Matcher;
    })();
    entitas.Matcher = Matcher;
    var MatcherException = (function (_super) {
        __extends(MatcherException, _super);
        function MatcherException(matcher) {
            _super.call(this, "matcher.indices.length must be 1 but was " + matcher.indices.length);
        }
        return MatcherException;
    })(Exception);
})(entitas || (entitas = {}));
//# sourceMappingURL=Matcher.js.map
//# sourceMappingURL=MatcherInterfaces.js.map
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
//# sourceMappingURL=TriggerOnEvent.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var entitas;
(function (entitas) {
    var Exception = entitas.Exception;
    var EntityAlreadyHasComponentException = (function (_super) {
        __extends(EntityAlreadyHasComponentException, _super);
        function EntityAlreadyHasComponentException(message, index) {
            _super.call(this, message + "\nEntity already has a component at index " + index);
        }
        return EntityAlreadyHasComponentException;
    })(Exception);
    var EntityDoesNotHaveComponentException = (function (_super) {
        __extends(EntityDoesNotHaveComponentException, _super);
        function EntityDoesNotHaveComponentException(message, index) {
            _super.call(this, message + "\nEntity does not have a component at index " + index);
        }
        return EntityDoesNotHaveComponentException;
    })(Exception);
    var EntityIsNotEnabledException = (function (_super) {
        __extends(EntityIsNotEnabledException, _super);
        function EntityIsNotEnabledException(message) {
            _super.call(this, message + "\nEntity is not enabled");
        }
        return EntityIsNotEnabledException;
    })(Exception);
    var EntityIsAlreadyReleasedException = (function (_super) {
        __extends(EntityIsAlreadyReleasedException, _super);
        function EntityIsAlreadyReleasedException() {
            _super.call(this, "Entity is already released!");
        }
        return EntityIsAlreadyReleasedException;
    })(Exception);
    var Entity = (function () {
        function Entity(totalComponents) {
            if (totalComponents === void 0) { totalComponents = 16; }
            this.onEntityReleased = [];
            this.onComponentAdded = [];
            this.onComponentRemoved = [];
            this.onComponentReplaced = [];
            this._creationIndex = 0;
            this._isEnabled = true;
            this._refCount = 0;
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
            for (var onComponentAdded = this.onComponentAdded, e = 0; e < onComponentAdded.length; e++)
                onComponentAdded[e](this, index, component);
            return this;
        };
        Entity.prototype.removeComponent = function (index) {
            if (!this._isEnabled) {
                throw new EntityIsNotEnabledException("Cannot remove component!");
            }
            if (this.hasComponent(index)) {
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
                for (var onComponentReplaced = this.onComponentReplaced, e = 0; e < onComponentReplaced.length; e++)
                    onComponentReplaced[e](this, index, previousComponent, replacement);
            }
            else {
                this._components[index] = replacement;
                this._componentsCache = undefined;
                if (replacement === undefined) {
                    this._componentIndicesCache = undefined;
                    this._toStringCache = undefined;
                    for (var onComponentRemoved = this.onComponentRemoved, e = 0; e < onComponentRemoved.length; e++)
                        onComponentRemoved[e](this, index, previousComponent);
                }
                else {
                    for (var onComponentReplaced = this.onComponentReplaced, e = 0; e < onComponentReplaced.length; e++)
                        onComponentReplaced[e](this, index, previousComponent, replacement);
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
            this.onComponentAdded = [];
            this.onComponentReplaced = [];
            this.onComponentRemoved = [];
            this._isEnabled = false;
        };
        Entity.prototype.toString = function () {
            if (this._toStringCache === undefined) {
                var sb = [];
                sb.push("Entity_");
                sb.push(this._creationIndex);
                sb.push("(");
                var seperator = ", ";
                var components = this.getComponents();
                var lastSeperator = components.length - 1;
                for (var i = 0, componentsLength = components.length; i < componentsLength; i++) {
                    sb.push(components[i].constructor.name);
                    //sb.push(typeof components[i]);
                    if (i < lastSeperator) {
                        sb.push(seperator);
                    }
                }
                sb.push(")");
                this._toStringCache = sb.join('');
            }
            return this._toStringCache;
        };
        Entity.prototype.retain = function () {
            this._refCount += 1;
            return this;
        };
        Entity.prototype.release = function () {
            this._refCount -= 1;
            if (this._refCount == 0) {
                for (var onEntityReleased = this.onEntityReleased, e = 0; e < onEntityReleased.length; e++)
                    onEntityReleased[e](this);
            }
            else if (this._refCount < 0) {
                throw new EntityIsAlreadyReleasedException();
            }
        };
        return Entity;
    })();
    entitas.Entity = Entity;
})(entitas || (entitas = {}));
//# sourceMappingURL=Entity.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var entitas;
(function (entitas) {
    var Exception = entitas.Exception;
    var Group = (function () {
        function Group(matcher) {
            this.onEntityAdded = [];
            this.onEntityRemoved = [];
            this.onEntityUpdated = [];
            this._entities = {};
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
            if (this._entities[entity.creationIndex]) {
                for (var onEntityRemoved = this.onEntityRemoved, e = 0; e < onEntityRemoved.length; e++)
                    onEntityRemoved[e](this, entity, index, previousComponent);
                for (var onEntityAdded = this.onEntityAdded, e = 0; e < onEntityAdded.length; e++)
                    onEntityAdded[e](this, entity, index, newComponent);
                for (var onEntityUpdated = this.onEntityUpdated, e = 0; e < onEntityUpdated.length; e++)
                    onEntityUpdated[e](this, entity, index, previousComponent, newComponent);
            }
        };
        Group.prototype.addEntitySilently = function (entity) {
            var added = !this._entities[entity.creationIndex];
            if (added) {
                this._entities[entity.creationIndex] = entity;
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.retain();
            }
        };
        Group.prototype.addEntity = function (entity, index, component) {
            var added = !this._entities[entity.creationIndex];
            if (added) {
                this._entities[entity.creationIndex] = entity;
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.retain();
                for (var onEntityAdded = this.onEntityAdded, e = 0; e < onEntityAdded.length; e++)
                    onEntityAdded[e](this, entity, index, component);
            }
        };
        Group.prototype.removeEntitySilently = function (entity) {
            var removed = !!this._entities[entity.creationIndex];
            if (removed) {
                delete this._entities[entity.creationIndex];
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                entity.release();
            }
        };
        Group.prototype.removeEntity = function (entity, index, component) {
            var removed = !!this._entities[entity.creationIndex];
            if (removed) {
                delete this._entities[entity.creationIndex];
                this._entitiesCache = undefined;
                this._singleEntityCache = undefined;
                for (var onEntityRemoved = this.onEntityRemoved, e = 0; e < onEntityRemoved.length; e++)
                    onEntityRemoved[e](this, entity, index, component);
                entity.release();
            }
        };
        Group.prototype.containsEntity = function (entity) {
            return !this._entities[entity.creationIndex];
        };
        Group.prototype.getEntities = function () {
            if (this._entitiesCache === undefined) {
                this._entitiesCache = [];
                for (var k in Object.keys(this._entities)) {
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
        /** GroupExtension::createObserver */
        Group.prototype.createObserver = function (eventType) {
            if (eventType === void 0) { eventType = entitas.GroupEventType.OnEntityAdded; }
            return new entitas.GroupObserver(this, eventType);
        };
        return Group;
    })();
    entitas.Group = Group;
    var SingleEntityException = (function (_super) {
        __extends(SingleEntityException, _super);
        function SingleEntityException(matcher) {
            _super.call(this, "Multiple entities exist matching " + matcher);
        }
        return SingleEntityException;
    })(Exception);
})(entitas || (entitas = {}));
//# sourceMappingURL=Group.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var entitas;
(function (entitas) {
    var Exception = entitas.Exception;
    (function (GroupEventType) {
        GroupEventType[GroupEventType["OnEntityAdded"] = 0] = "OnEntityAdded";
        GroupEventType[GroupEventType["OnEntityRemoved"] = 1] = "OnEntityRemoved";
        GroupEventType[GroupEventType["OnEntityAddedOrRemoved"] = 2] = "OnEntityAddedOrRemoved";
    })(entitas.GroupEventType || (entitas.GroupEventType = {}));
    var GroupEventType = entitas.GroupEventType;
    var GroupObserver = (function () {
        function GroupObserver(groups, eventTypes) {
            this._collectedEntities = {};
            this._groups = groups[0] ? groups : [groups];
            this._eventTypes = eventTypes[0] ? eventTypes : [eventTypes];
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
                    if (group.onEntityAdded.indexOf(this._addEntityCache) === -1)
                        group.onEntityAdded.push(this._addEntityCache);
                }
                else if (eventType === GroupEventType.OnEntityRemoved) {
                    if (group.onEntityRemoved.indexOf(this._addEntityCache) === -1)
                        group.onEntityRemoved.push(this._addEntityCache);
                }
                else if (eventType === GroupEventType.OnEntityAddedOrRemoved) {
                    if (group.onEntityAdded.indexOf(this._addEntityCache) === -1)
                        group.onEntityAdded.push(this._addEntityCache);
                    if (group.onEntityRemoved.indexOf(this._addEntityCache) === -1)
                        group.onEntityRemoved.push(this._addEntityCache);
                }
            }
        };
        GroupObserver.prototype.deactivate = function () {
            var e;
            for (var i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
                var group = this._groups[i];
                e = group.onEntityAdded.indexOf(this._addEntityCache);
                if (e !== -1)
                    group.onEntityAdded.splice(e, 1);
                e = group.onEntityRemoved.indexOf(this._addEntityCache);
                if (e !== -1)
                    group.onEntityRemoved.splice(e, 1);
                this.clearCollectedEntities();
            }
        };
        GroupObserver.prototype.clearCollectedEntities = function () {
            for (var e in this._collectedEntities) {
                this._collectedEntities[e].release();
            }
            this._collectedEntities = {};
        };
        GroupObserver.prototype.addEntity = function (group, entity, index, component) {
            var added = !this._collectedEntities[entity.creationIndex];
            if (added) {
                this._collectedEntities[entity.creationIndex] = entity;
                entity.retain();
            }
        };
        return GroupObserver;
    })();
    entitas.GroupObserver = GroupObserver;
    var GroupObserverException = (function (_super) {
        __extends(GroupObserverException, _super);
        function GroupObserverException(message) {
            _super.call(this, message);
        }
        return GroupObserverException;
    })(Exception);
})(entitas || (entitas = {}));
//# sourceMappingURL=GroupObserver.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var entitas;
(function (entitas) {
    var Exception = entitas.Exception;
    var Entity = entitas.Entity;
    var Group = entitas.Group;
    var PoolDoesNotContainEntityException = (function (_super) {
        __extends(PoolDoesNotContainEntityException, _super);
        function PoolDoesNotContainEntityException(entity, message) {
            _super.call(this, message + "\nPool does not contain entity " + entity);
        }
        return PoolDoesNotContainEntityException;
    })(Exception);
    var EntityIsNotDestroyedException = (function (_super) {
        __extends(EntityIsNotDestroyedException, _super);
        function EntityIsNotDestroyedException(message) {
            _super.call(this, message + "\nEntity is not destroyed yet!");
        }
        return EntityIsNotDestroyedException;
    })(Exception);
    var Pool = (function () {
        function Pool(totalComponents, startCreationIndex) {
            var _this = this;
            if (startCreationIndex === void 0) { startCreationIndex = 0; }
            this.onEntityCreated = [];
            this.onEntityWillBeDestroyed = [];
            this.onEntityDestroyed = [];
            this.onGroupCreated = [];
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
                var e = entity.onEntityReleased.indexOf(_this._cachedOnEntityReleased);
                if (e !== -1)
                    entity.onEntityReleased.splice(e, 1);
                delete _this._retainedEntities[entity.creationIndex];
                _this._reusableEntities.push(entity);
            };
            this._totalComponents = totalComponents;
            this._creationIndex = startCreationIndex;
            this._groupsForIndex = [];
            this._cachedUpdateGroupsComponentAddedOrRemoved = this.updateGroupsComponentAddedOrRemoved;
            this._cachedUpdateGroupsComponentReplaced = this.updateGroupsComponentReplaced;
            this._cachedOnEntityReleased = this.onEntityReleased;
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
        Pool.prototype.createEntity = function () {
            var entity = this._reusableEntities.length > 0 ? this._reusableEntities.pop() : new Entity(this._totalComponents);
            entity._isEnabled = true;
            entity._creationIndex = this._creationIndex++;
            entity.retain();
            this._entities[entity.creationIndex] = entity;
            this._entitiesCache = undefined;
            entity.onComponentAdded.push(this._cachedUpdateGroupsComponentAddedOrRemoved);
            entity.onComponentRemoved.push(this._cachedUpdateGroupsComponentAddedOrRemoved);
            entity.onComponentReplaced.push(this._cachedUpdateGroupsComponentReplaced);
            entity.onEntityReleased.push(this._cachedOnEntityReleased);
            for (var onEntityCreated = this.onEntityCreated, e = 0; e < onEntityCreated.length; e++)
                onEntityCreated[e](this, entity);
            return entity;
        };
        Pool.prototype.destroyEntity = function (entity) {
            var removed = !!this._entities[entity.creationIndex];
            if (!removed) {
                throw new PoolDoesNotContainEntityException(entity, "Could not destroy entity!");
            }
            this._entitiesCache = undefined;
            for (var onEntityWillBeDestroyed = this.onEntityWillBeDestroyed, e = 0; e < onEntityWillBeDestroyed.length; e++)
                onEntityWillBeDestroyed[e](this, entity);
            entity.destroy();
            for (var onEntityDestroyed = this.onEntityDestroyed, e = 0; e < onEntityDestroyed.length; e++)
                onEntityDestroyed[e](this, entity);
            if (entity._refCount === 1) {
                var e = entity.onEntityReleased.indexOf(this._cachedOnEntityReleased);
                if (e !== -1)
                    entity.onEntityReleased.splice(e, 1);
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
            return !!this._entities[entity.creationIndex];
        };
        Pool.prototype.getEntities = function (matcher) {
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
        Pool.prototype.getGroup = function (matcher) {
            var group;
            if (!!this._groups[matcher.id]) {
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
                for (var onGroupCreated = this.onGroupCreated, e = 0; e < onGroupCreated.length; e++)
                    onGroupCreated[e](this, group);
            }
            return group;
        };
        /** PoolExtension::createSystem */
        Pool.prototype.createSystem = function (system) {
            if ('function' === typeof system) {
                var Klass = system;
                system = new Klass();
            }
            Pool.setPool(system, this);
            var reactiveSystem = system['trigger'] ? system : null;
            if (reactiveSystem != null) {
                return (new entitas.ReactiveSystem(this, reactiveSystem));
            }
            var multiReactiveSystem = system['triggers'] ? system : null;
            if (multiReactiveSystem != null) {
                return new entitas.ReactiveSystem(this, multiReactiveSystem);
            }
            return system;
        };
        /** PoolExtension::setPool */
        Pool.setPool = function (system, pool) {
            var poolSystem = (system['setPool'] ? system : null);
            if (poolSystem != null) {
                poolSystem.setPool(pool);
            }
        };
        return Pool;
    })();
    entitas.Pool = Pool;
})(entitas || (entitas = {}));
//# sourceMappingURL=Pool.js.map
var entitas;
(function (entitas) {
    var GroupObserver = entitas.GroupObserver;
    var ReactiveSystem = (function () {
        function ReactiveSystem(pool, subSystem) {
            var triggers = subSystem['triggers'] ? subSystem['triggers'] : [subSystem['trigger']];
            this._subsystem = subSystem;
            var ensureComponents = (subSystem['ensureComponents'] ? subSystem : null);
            if (ensureComponents != null) {
                this._ensureComponents = ensureComponents.ensureComponents;
            }
            var excludeComponents = (subSystem['excludeComponents'] ? subSystem : null);
            if (excludeComponents != null) {
                this._excludeComponents = excludeComponents.excludeComponents;
            }
            this._clearAfterExecute = subSystem['clearAfterExecute'];
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
                                buffer.push(e.retain());
                            }
                        }
                    }
                    else {
                        for (var k in collectedEntities) {
                            var e = collectedEntities[k];
                            if (ensureComponents.matches(e)) {
                                buffer.push(e.retain());
                            }
                        }
                    }
                }
                else if (excludeComponents) {
                    for (var k in collectedEntities) {
                        var e = collectedEntities[k];
                        if (!excludeComponents.matches(e)) {
                            buffer.push(e.retain());
                        }
                    }
                }
                else {
                    for (var k in collectedEntities) {
                        var e = collectedEntities[k];
                        buffer.push(e.retain());
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
//# sourceMappingURL=ReactiveSystem.js.map
var entitas;
(function (entitas) {
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
        }
        Systems.prototype.add = function (system) {
            if ('function' === typeof system) {
                var Klass = system;
                system = new Klass();
            }
            var reactiveSystem = (system['trigger'] || system['triggers'] ? system : null);
            var initializeSystem = (reactiveSystem != null
                ? reactiveSystem.subsystem['initialize'] ? reactiveSystem.subsystem : null
                : system['initialize'] ? system : null);
            if (initializeSystem != null) {
                this._initializeSystems.push(initializeSystem);
            }
            var executeSystem = (system['execute'] ? system : null);
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
            for (var i = 0, exeSysCount = this._executeSystems.length; i < exeSysCount; i++) {
                this._executeSystems[i].execute();
            }
        };
        Systems.prototype.clearReactiveSystems = function () {
            for (var i = 0, exeSysCount = this._executeSystems.length; i < exeSysCount; i++) {
                var reactiveSystem = this._executeSystems[i];
                if (reactiveSystem != null) {
                    reactiveSystem.clear();
                }
                var nestedSystems = this._executeSystems[i];
                if (nestedSystems != null) {
                    nestedSystems.clearReactiveSystems();
                }
            }
        };
        return Systems;
    })();
    entitas.Systems = Systems;
})(entitas || (entitas = {}));
//# sourceMappingURL=Systems.js.map
/**
 * Entitas Generated Classes for example
 *
 * do not edit this file
 */
var example;
(function (example) {
    var Pool = entitas.Pool;
    (function (CoreComponentIds) {
        CoreComponentIds[CoreComponentIds["Acceleratable"] = 0] = "Acceleratable";
        CoreComponentIds[CoreComponentIds["Accelerating"] = 1] = "Accelerating";
        CoreComponentIds[CoreComponentIds["Destroy"] = 2] = "Destroy";
        CoreComponentIds[CoreComponentIds["Move"] = 3] = "Move";
        CoreComponentIds[CoreComponentIds["Position"] = 4] = "Position";
        CoreComponentIds[CoreComponentIds["FinishLine"] = 5] = "FinishLine";
        CoreComponentIds[CoreComponentIds["Resource"] = 6] = "Resource";
        CoreComponentIds[CoreComponentIds["View"] = 7] = "View";
        CoreComponentIds[CoreComponentIds["TotalComponents"] = 8] = "TotalComponents";
    })(example.CoreComponentIds || (example.CoreComponentIds = {}));
    var CoreComponentIds = example.CoreComponentIds;
    var AcceleratableComponent = (function () {
        function AcceleratableComponent() {
        }
        return AcceleratableComponent;
    })();
    example.AcceleratableComponent = AcceleratableComponent;
    var AcceleratingComponent = (function () {
        function AcceleratingComponent() {
        }
        return AcceleratingComponent;
    })();
    example.AcceleratingComponent = AcceleratingComponent;
    var DestroyComponent = (function () {
        function DestroyComponent() {
        }
        return DestroyComponent;
    })();
    example.DestroyComponent = DestroyComponent;
    var MoveComponent = (function () {
        function MoveComponent() {
        }
        return MoveComponent;
    })();
    example.MoveComponent = MoveComponent;
    var PositionComponent = (function () {
        function PositionComponent() {
        }
        return PositionComponent;
    })();
    example.PositionComponent = PositionComponent;
    var FinishLineComponent = (function () {
        function FinishLineComponent() {
        }
        return FinishLineComponent;
    })();
    example.FinishLineComponent = FinishLineComponent;
    var ResourceComponent = (function () {
        function ResourceComponent() {
        }
        return ResourceComponent;
    })();
    example.ResourceComponent = ResourceComponent;
    var ViewComponent = (function () {
        function ViewComponent() {
        }
        return ViewComponent;
    })();
    example.ViewComponent = ViewComponent;
    var Pools = (function () {
        function Pools() {
        }
        Object.defineProperty(Pools, "allPools", {
            get: function () {
                if (Pools._allPools == null) {
                    Pools._allPools = [Pools.core];
                }
                return Pools._allPools;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pools, "core", {
            get: function () {
                if (Pools._core == null) {
                    Pools._core = new Pool(CoreComponentIds.TotalComponents);
                }
                return Pools._core;
            },
            enumerable: true,
            configurable: true
        });
        return Pools;
    })();
    example.Pools = Pools;
})(example || (example = {}));
//# sourceMappingURL=generated.js.map
/**
 * Entitas Generated Extensions
 *
 * do not edit this file
 */
(function(){
  var Pool = entitas.Pool;
  var Matcher = entitas.Matcher;
  var Entity = entitas.Entity;
  var CoreMatcher = entitas.CoreMatcher;
  var AcceleratableComponent = example.AcceleratableComponent;
  var AcceleratingComponent = example.AcceleratingComponent;
  var DestroyComponent = example.DestroyComponent;
  var MoveComponent = example.MoveComponent;
  var PositionComponent = example.PositionComponent;
  var FinishLineComponent = example.FinishLineComponent;
  var ResourceComponent = example.ResourceComponent;
  var ViewComponent = example.ViewComponent;
  var CoreComponentIds = example.CoreComponentIds;
  Entity.acceleratableComponent = new AcceleratableComponent();
  Object.defineProperty(Entity.prototype, 'isAcceleratable', {
    get: function() {
      return this.hasComponent(CoreComponentIds.Acceleratable);
    },
    set: function(value) {
      if (value !== this.isAcceleratable) {
        if (value) {
          this.addComponent(CoreComponentIds.Acceleratable, Entity.acceleratableComponent);
        } else {
          this.removeComponent(CoreComponentIds.Acceleratable);
        }
      }
    }
  });
  Entity.prototype.setAcceleratable = function(value) {
    this.isAcceleratable = value;
    return this;
  };
  Entity.acceleratingComponent = new AcceleratingComponent();
  Object.defineProperty(Entity.prototype, 'isAccelerating', {
    get: function() {
      return this.hasComponent(CoreComponentIds.Accelerating);
    },
    set: function(value) {
      if (value !== this.isAccelerating) {
        if (value) {
          this.addComponent(CoreComponentIds.Accelerating, Entity.acceleratingComponent);
        } else {
          this.removeComponent(CoreComponentIds.Accelerating);
        }
      }
    }
  });
  Entity.prototype.setAccelerating = function(value) {
    this.isAccelerating = value;
    return this;
  };
  Entity.destroyComponent = new DestroyComponent();
  Object.defineProperty(Entity.prototype, 'isDestroy', {
    get: function() {
      return this.hasComponent(CoreComponentIds.Destroy);
    },
    set: function(value) {
      if (value !== this.isDestroy) {
        if (value) {
          this.addComponent(CoreComponentIds.Destroy, Entity.destroyComponent);
        } else {
          this.removeComponent(CoreComponentIds.Destroy);
        }
      }
    }
  });
  Entity.prototype.setDestroy = function(value) {
    this.isDestroy = value;
    return this;
  };
  Entity._moveComponentPool = [];
  Entity.clearMoveComponentPool = function() {
    Entity._moveComponentPool.length = 0;
  };
  Object.defineProperty(Entity.prototype, 'move', {
    get: function() {
      return this.getComponent(CoreComponentIds.Move);
    }
  });
  Object.defineProperty(Entity.prototype, 'hasMove', {
    get: function() {
      return this.hasComponent(CoreComponentIds.Move);
    }
  });
  Entity.prototype.addMove = function(speed, maxSpeed) {
    var component = Entity._moveComponentPool.length > 0 ? Entity._moveComponentPool.pop() : new MoveComponent();
    component.speed = speed;
    component.maxSpeed = maxSpeed;
    return this.addComponent(CoreComponentIds.Move, component);
  };
  Entity.prototype.replaceMove = function(speed, maxSpeed) {
    var previousComponent = this.hasMove ? this.move : null;
    var component = Entity._moveComponentPool.length > 0 ? Entity._moveComponentPool.pop() : new MoveComponent();
    component.speed = speed;
    component.maxSpeed = maxSpeed;
    this.replaceComponent(CoreComponentIds.Move, component);
    if (previousComponent != null) {
      Entity._moveComponentPool.push(previousComponent);
    }
    return this;
  };
  Entity.prototype.removeMove = function() {
    var component = this.move;
    this.removeComponent(CoreComponentIds.Move);
    Entity._moveComponentPool.push(component);
    return this;
  };
  Entity._positionComponentPool = [];
  Entity.clearPositionComponentPool = function() {
    Entity._positionComponentPool.length = 0;
  };
  Object.defineProperty(Entity.prototype, 'position', {
    get: function() {
      return this.getComponent(CoreComponentIds.Position);
    }
  });
  Object.defineProperty(Entity.prototype, 'hasPosition', {
    get: function() {
      return this.hasComponent(CoreComponentIds.Position);
    }
  });
  Entity.prototype.addPosition = function(x, y, z) {
    var component = Entity._positionComponentPool.length > 0 ? Entity._positionComponentPool.pop() : new PositionComponent();
    component.x = x;
    component.y = y;
    component.z = z;
    return this.addComponent(CoreComponentIds.Position, component);
  };
  Entity.prototype.replacePosition = function(x, y, z) {
    var previousComponent = this.hasPosition ? this.position : null;
    var component = Entity._positionComponentPool.length > 0 ? Entity._positionComponentPool.pop() : new PositionComponent();
    component.x = x;
    component.y = y;
    component.z = z;
    this.replaceComponent(CoreComponentIds.Position, component);
    if (previousComponent != null) {
      Entity._positionComponentPool.push(previousComponent);
    }
    return this;
  };
  Entity.prototype.removePosition = function() {
    var component = this.position;
    this.removeComponent(CoreComponentIds.Position);
    Entity._positionComponentPool.push(component);
    return this;
  };
  Entity.finishLineComponent = new FinishLineComponent();
  Object.defineProperty(Entity.prototype, 'isFinishLine', {
    get: function() {
      return this.hasComponent(CoreComponentIds.FinishLine);
    },
    set: function(value) {
      if (value !== this.isFinishLine) {
        if (value) {
          this.addComponent(CoreComponentIds.FinishLine, Entity.finishLineComponent);
        } else {
          this.removeComponent(CoreComponentIds.FinishLine);
        }
      }
    }
  });
  Entity.prototype.setFinishLine = function(value) {
    this.isFinishLine = value;
    return this;
  };
  Entity._resourceComponentPool = [];
  Entity.clearResourceComponentPool = function() {
    Entity._resourceComponentPool.length = 0;
  };
  Object.defineProperty(Entity.prototype, 'resource', {
    get: function() {
      return this.getComponent(CoreComponentIds.Resource);
    }
  });
  Object.defineProperty(Entity.prototype, 'hasResource', {
    get: function() {
      return this.hasComponent(CoreComponentIds.Resource);
    }
  });
  Entity.prototype.addResource = function(name) {
    var component = Entity._resourceComponentPool.length > 0 ? Entity._resourceComponentPool.pop() : new ResourceComponent();
    component.name = name;
    return this.addComponent(CoreComponentIds.Resource, component);
  };
  Entity.prototype.replaceResource = function(name) {
    var previousComponent = this.hasResource ? this.resource : null;
    var component = Entity._resourceComponentPool.length > 0 ? Entity._resourceComponentPool.pop() : new ResourceComponent();
    component.name = name;
    this.replaceComponent(CoreComponentIds.Resource, component);
    if (previousComponent != null) {
      Entity._resourceComponentPool.push(previousComponent);
    }
    return this;
  };
  Entity.prototype.removeResource = function() {
    var component = this.resource;
    this.removeComponent(CoreComponentIds.Resource);
    Entity._resourceComponentPool.push(component);
    return this;
  };
  Entity._viewComponentPool = [];
  Entity.clearViewComponentPool = function() {
    Entity._viewComponentPool.length = 0;
  };
  Object.defineProperty(Entity.prototype, 'view', {
    get: function() {
      return this.getComponent(CoreComponentIds.View);
    }
  });
  Object.defineProperty(Entity.prototype, 'hasView', {
    get: function() {
      return this.hasComponent(CoreComponentIds.View);
    }
  });
  Entity.prototype.addView = function(stage) {
    var component = Entity._viewComponentPool.length > 0 ? Entity._viewComponentPool.pop() : new ViewComponent();
    component.stage = stage;
    return this.addComponent(CoreComponentIds.View, component);
  };
  Entity.prototype.replaceView = function(stage) {
    var previousComponent = this.hasView ? this.view : null;
    var component = Entity._viewComponentPool.length > 0 ? Entity._viewComponentPool.pop() : new ViewComponent();
    component.stage = stage;
    this.replaceComponent(CoreComponentIds.View, component);
    if (previousComponent != null) {
      Entity._viewComponentPool.push(previousComponent);
    }
    return this;
  };
  Entity.prototype.removeView = function() {
    var component = this.view;
    this.removeComponent(CoreComponentIds.View);
    Entity._viewComponentPool.push(component);
    return this;
  };
  CoreMatcher._matcherAcceleratable=null;
  
  Object.defineProperty(CoreMatcher, 'Acceleratable', {
    get: function() {
      if (CoreMatcher._matcherAcceleratable == null) {
        CoreMatcher._matcherAcceleratable = Matcher.allOf(CoreComponentIds.Acceleratable);
      }
      
      return CoreMatcher._matcherAcceleratable;
    }
  });
  CoreMatcher._matcherAccelerating=null;
  
  Object.defineProperty(CoreMatcher, 'Accelerating', {
    get: function() {
      if (CoreMatcher._matcherAccelerating == null) {
        CoreMatcher._matcherAccelerating = Matcher.allOf(CoreComponentIds.Accelerating);
      }
      
      return CoreMatcher._matcherAccelerating;
    }
  });
  CoreMatcher._matcherDestroy=null;
  
  Object.defineProperty(CoreMatcher, 'Destroy', {
    get: function() {
      if (CoreMatcher._matcherDestroy == null) {
        CoreMatcher._matcherDestroy = Matcher.allOf(CoreComponentIds.Destroy);
      }
      
      return CoreMatcher._matcherDestroy;
    }
  });
  CoreMatcher._matcherMove=null;
  
  Object.defineProperty(CoreMatcher, 'Move', {
    get: function() {
      if (CoreMatcher._matcherMove == null) {
        CoreMatcher._matcherMove = Matcher.allOf(CoreComponentIds.Move);
      }
      
      return CoreMatcher._matcherMove;
    }
  });
  CoreMatcher._matcherPosition=null;
  
  Object.defineProperty(CoreMatcher, 'Position', {
    get: function() {
      if (CoreMatcher._matcherPosition == null) {
        CoreMatcher._matcherPosition = Matcher.allOf(CoreComponentIds.Position);
      }
      
      return CoreMatcher._matcherPosition;
    }
  });
  CoreMatcher._matcherFinishLine=null;
  
  Object.defineProperty(CoreMatcher, 'FinishLine', {
    get: function() {
      if (CoreMatcher._matcherFinishLine == null) {
        CoreMatcher._matcherFinishLine = Matcher.allOf(CoreComponentIds.FinishLine);
      }
      
      return CoreMatcher._matcherFinishLine;
    }
  });
  CoreMatcher._matcherResource=null;
  
  Object.defineProperty(CoreMatcher, 'Resource', {
    get: function() {
      if (CoreMatcher._matcherResource == null) {
        CoreMatcher._matcherResource = Matcher.allOf(CoreComponentIds.Resource);
      }
      
      return CoreMatcher._matcherResource;
    }
  });
  CoreMatcher._matcherView=null;
  
  Object.defineProperty(CoreMatcher, 'View', {
    get: function() {
      if (CoreMatcher._matcherView == null) {
        CoreMatcher._matcherView = Matcher.allOf(CoreComponentIds.View);
      }
      
      return CoreMatcher._matcherView;
    }
  });
  Object.defineProperty(Pool.prototype, 'acceleratingEntity', {
    get: function() {
      return this.getGroup(CoreMatcher.Accelerating)[0];
    }
  });
  Object.defineProperty(Pool.prototype, 'isAccelerating', {
    get: function() {
      return this.acceleratingEntity != null;
    },
    set: function(value) {
      var entity = this.acceleratingEntity;
      if (value != (entity != null)) {
        if (value) {
          this.createEntity().isAccelerating = true;
        } else {
          this.destroyEntity(entity);
        }
      }
    }
  });
  Object.defineProperty(Pool.prototype, 'finishLineEntity', {
    get: function() {
      return this.getGroup(CoreMatcher.FinishLine)[0];
    }
  });
  Object.defineProperty(Pool.prototype, 'isFinishLine', {
    get: function() {
      return this.finishLineEntity != null;
    },
    set: function(value) {
      var entity = this.finishLineEntity;
      if (value != (entity != null)) {
        if (value) {
          this.createEntity().isFinishLine = true;
        } else {
          this.destroyEntity(entity);
        }
      }
    }
  });
})();
var example;
(function (example) {
    var CoreMatcher = entitas.CoreMatcher;
    var Matcher = entitas.Matcher;
    var Exception = entitas.Exception;
    var AccelerateSystem = (function () {
        function AccelerateSystem() {
        }
        Object.defineProperty(AccelerateSystem.prototype, "trigger", {
            get: function () {
                return CoreMatcher.Accelerating.onEntityAddedOrRemoved();
            },
            enumerable: true,
            configurable: true
        });
        AccelerateSystem.prototype.setPool = function (pool) {
            var x = Matcher.allOf(CoreMatcher.Acceleratable, CoreMatcher.Move);
            this._group = pool.getGroup(x);
        };
        AccelerateSystem.prototype.execute = function (entities) {
            console.log('AccelerateSystem::execute', entities);
            if (entities.length !== 1) {
                throw new Exception("Expected exactly one entity but found " + entities.length);
            }
            var accelerate = entities[0].isAccelerating;
            var entities = this._group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var move = e.move;
                var speed = accelerate ? move.maxSpeed : 0;
                e.replaceMove(speed, move.maxSpeed);
            }
        };
        return AccelerateSystem;
    })();
    example.AccelerateSystem = AccelerateSystem;
})(example || (example = {}));
//# sourceMappingURL=AccelerateSystem.js.map
var example;
(function (example) {
    var CoreMatcher = entitas.CoreMatcher;
    var DestroySystem = (function () {
        function DestroySystem() {
        }
        Object.defineProperty(DestroySystem.prototype, "trigger", {
            get: function () {
                return CoreMatcher.Destroy.onEntityAdded();
            },
            enumerable: true,
            configurable: true
        });
        DestroySystem.prototype.setPool = function (pool) {
            this._pool = pool;
        };
        DestroySystem.prototype.execute = function (entities) {
            console.log('DestroySystem::execute', entities);
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                this._pool.destroyEntity(e);
            }
        };
        return DestroySystem;
    })();
    example.DestroySystem = DestroySystem;
})(example || (example = {}));
//# sourceMappingURL=DestroySystem.js.map
var example;
(function (example) {
    //[Core]
    var InputSystem = (function () {
        function InputSystem() {
        }
        InputSystem.prototype.setPool = function (pool) {
            this._pool = pool;
        };
        InputSystem.prototype.execute = function () {
            console.log('InputSystem::execute');
            //this._pool.isAccelerating = Input.GetMouseButton(0);
        };
        return InputSystem;
    })();
    example.InputSystem = InputSystem;
})(example || (example = {}));
//# sourceMappingURL=InputSystem.js.map
var example;
(function (example) {
    var CoreMatcher = entitas.CoreMatcher;
    var Matcher = entitas.Matcher;
    var MoveSystem = (function () {
        function MoveSystem() {
        }
        MoveSystem.prototype.setPool = function (pool) {
            this._group = pool.getGroup(Matcher.allOf(CoreMatcher.Move, CoreMatcher.Position));
        };
        MoveSystem.prototype.execute = function () {
            var entities = this._group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var move = e.move;
                var pos = e.position;
                console.log(i, pos.x, pos.y);
                e.replacePosition(pos.x, pos.y + move.speed, pos.z);
            }
        };
        return MoveSystem;
    })();
    example.MoveSystem = MoveSystem;
})(example || (example = {}));
//# sourceMappingURL=MoveSystem.js.map
var example;
(function (example) {
    var CoreMatcher = entitas.CoreMatcher;
    var ReachedFinishSystem = (function () {
        function ReachedFinishSystem() {
        }
        Object.defineProperty(ReachedFinishSystem.prototype, "trigger", {
            get: function () {
                return CoreMatcher.Position.onEntityAdded();
            },
            enumerable: true,
            configurable: true
        });
        ReachedFinishSystem.prototype.setPool = function (pool) {
            this._pool = pool;
        };
        ReachedFinishSystem.prototype.execute = function (entities) {
            console.log('ReachedFinishSystem::execute', entities);
            var finishLinePosY = this._pool.finishLineEntity.position.y;
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                if (e.position.y > finishLinePosY) {
                    e.isDestroy = true;
                }
            }
        };
        return ReachedFinishSystem;
    })();
    example.ReachedFinishSystem = ReachedFinishSystem;
})(example || (example = {}));
//# sourceMappingURL=ReachedFinishSystem.js.map
var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var CoreMatcher = entitas.CoreMatcher;
    var RenderPositionSystem = (function () {
        function RenderPositionSystem() {
        }
        Object.defineProperty(RenderPositionSystem.prototype, "trigger", {
            get: function () {
                return Matcher.allOf(CoreMatcher.View, CoreMatcher.Position).onEntityAdded();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderPositionSystem.prototype, "ensureComponents", {
            get: function () {
                return CoreMatcher.View;
            },
            enumerable: true,
            configurable: true
        });
        RenderPositionSystem.prototype.execute = function (entities) {
            console.log('RenderPositionSystem::execute', entities);
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var pos = e.position;
            }
        };
        return RenderPositionSystem;
    })();
    example.RenderPositionSystem = RenderPositionSystem;
})(example || (example = {}));
//# sourceMappingURL=RenderPositionSystem.js.map
var example;
(function (example) {
    var CoreMatcher = entitas.CoreMatcher;
    var AddViewSystem = (function () {
        function AddViewSystem() {
        }
        Object.defineProperty(AddViewSystem.prototype, "trigger", {
            get: function () {
                return CoreMatcher.Resource.onEntityAdded();
            },
            enumerable: true,
            configurable: true
        });
        AddViewSystem.prototype.execute = function (entities) {
            console.log('AddViewSystem::execute', entities);
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
            }
        };
        return AddViewSystem;
    })();
    example.AddViewSystem = AddViewSystem;
})(example || (example = {}));
//# sourceMappingURL=AddViewSystem.js.map
var example;
(function (example) {
    var CoreMatcher = entitas.CoreMatcher;
    var Matcher = entitas.Matcher;
    var RemoveViewSystem = (function () {
        function RemoveViewSystem() {
        }
        Object.defineProperty(RemoveViewSystem.prototype, "triggers", {
            get: function () {
                return [
                    CoreMatcher.Resource.onEntityRemoved(),
                    Matcher.allOf(CoreMatcher.Resource, CoreMatcher.Destroy).onEntityAdded()
                ];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RemoveViewSystem.prototype, "ensureComponents", {
            get: function () {
                return CoreMatcher.View;
            },
            enumerable: true,
            configurable: true
        });
        RemoveViewSystem.prototype.setPool = function (pool) {
            pool.getGroup(CoreMatcher.View).onEntityRemoved.push(this.onEntityRemoved);
        };
        RemoveViewSystem.prototype.onEntityRemoved = function (group, entity, index, component) {
            //var viewComponent = <ViewComponent>component;
            //Object.Destroy(viewComponent.gameObject);
        };
        RemoveViewSystem.prototype.execute = function (entities) {
            console.log('RemoveViewSystem::execute', entities);
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                e.removeView();
            }
        };
        return RemoveViewSystem;
    })();
    example.RemoveViewSystem = RemoveViewSystem;
})(example || (example = {}));
//# sourceMappingURL=RemoveViewSystem.js.map
var example;
(function (example) {
    var CreateFinishLineSystem = (function () {
        function CreateFinishLineSystem() {
        }
        CreateFinishLineSystem.prototype.setPool = function (pool) {
            this._pool = pool;
        };
        CreateFinishLineSystem.prototype.initialize = function () {
            this._pool.createEntity()
                .setFinishLine(true)
                .addResource("Finish Line")
                .addPosition(9, 7, 0);
        };
        return CreateFinishLineSystem;
    })();
    example.CreateFinishLineSystem = CreateFinishLineSystem;
})(example || (example = {}));
//# sourceMappingURL=CreateFinishLineSystem.js.map
var example;
(function (example) {
    var CreateOpponentsSystem = (function () {
        function CreateOpponentsSystem() {
        }
        CreateOpponentsSystem.prototype.setPool = function (pool) {
            this._pool = pool;
        };
        CreateOpponentsSystem.prototype.initialize = function () {
            var resourceName = "Opponent";
            for (var i = 1; i < 10; i++) {
                var speed = Math.random() * 0.02;
                this._pool.createEntity()
                    .addResource(resourceName)
                    .addPosition(i + i, 0, 0)
                    .addMove(speed, speed);
            }
        };
        return CreateOpponentsSystem;
    })();
    example.CreateOpponentsSystem = CreateOpponentsSystem;
})(example || (example = {}));
//# sourceMappingURL=CreateOpponentsSystem.js.map
var example;
(function (example) {
    var CreatePlayerSystem = (function () {
        function CreatePlayerSystem() {
        }
        CreatePlayerSystem.prototype.setPool = function (pool) {
            this._pool = pool;
        };
        CreatePlayerSystem.prototype.initialize = function () {
            this._pool.createEntity()
                .addResource("Player")
                .addPosition(0, 0, 0)
                .addMove(0, 0.025)
                .setAcceleratable(true);
        };
        return CreatePlayerSystem;
    })();
    example.CreatePlayerSystem = CreatePlayerSystem;
})(example || (example = {}));
//# sourceMappingURL=CreatePlayerSystem.js.map
var Systems = entitas.Systems;
var Pools = example.Pools;
var GameController = (function () {
    function GameController() {
    }
    GameController.prototype.start = function () {
        this._systems = this.createSystems(Pools.core);
        this._systems.initialize();
    };
    GameController.prototype.update = function () {
        this._systems.execute();
    };
    GameController.prototype.createSystems = function (pool) {
        return new Systems()
            .add(pool.createSystem(example.CreatePlayerSystem))
            .add(pool.createSystem(example.CreateOpponentsSystem))
            .add(pool.createSystem(example.CreateFinishLineSystem))
            .add(pool.createSystem(example.InputSystem))
            .add(pool.createSystem(example.AccelerateSystem))
            .add(pool.createSystem(example.MoveSystem))
            .add(pool.createSystem(example.ReachedFinishSystem))
            .add(pool.createSystem(example.RemoveViewSystem))
            .add(pool.createSystem(example.AddViewSystem))
            .add(pool.createSystem(example.RenderPositionSystem))
            .add(pool.createSystem(example.DestroySystem));
    };
    return GameController;
})();
//# sourceMappingURL=GameController.js.map