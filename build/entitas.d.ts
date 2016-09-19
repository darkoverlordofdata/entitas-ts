declare module entitas.utils {
    /**
     * @class UUID
     */
    class UUID {
        /**
         * Fast UUID generator, RFC4122 version 4 compliant
         * format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
         *
         * @author Jeff Ward (jcward.com).
         * @license MIT license
         * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
         **/
        static randomUUID(): string;
    }
}
declare module entitas.utils {
    interface ImmutableBag<E> {
        get(index: number): E;
        size(): number;
        isEmpty(): boolean;
        contains(e: E): boolean;
    }
}
/**
 * @port https://github.com/junkdog/artemis-odb/blob/master/artemis/src/main/java/com/artemis/utils/Bag.java
 * not a full implementation, mostly just what is needed by the game engine.
 */
declare module entitas.utils {
    /**
     * Collection type a bit like ArrayList but does not preserve the order of its
     * entities, speedwise it is very good, especially suited for games.
     */
    class Bag<E> extends Array implements ImmutableBag<E> {
        size_: number;
        /**
         * Constructs an empty Bag with the specified initial capacity.
         * Constructs an empty Bag with an initial capacity of 64.
         *
         * @constructor
         * @param capacity the initial capacity of Bag
         */
        constructor(capacity?: number);
        /**
         * Removes the element at the specified position in this Bag. does this by
         * overwriting it was last element then removing last element
         *
         * @param index
         *            the index of element to be removed
         * @return {Object} element that was removed from the Bag
         */
        removeAt(index: number): E;
        /**
         * Removes the first occurrence of the specified element from this Bag, if
         * it is present. If the Bag does not contain the element, it is unchanged.
         * does this by overwriting it was last element then removing last element
         *
         * @param e
         *            element to be removed from this list, if present
         * @return {boolean} true if this list contained the specified element
         */
        remove(e: E): boolean;
        /**
         * Remove and return the last object in the bag.
         *
         * @return {Object} the last object in the bag, null if empty.
         */
        removeLast(): E;
        /**
         * Check if bag contains this element.
         *
         * @param e
         * @return {boolean}
         */
        contains(e: E): boolean;
        /**
         * Removes from this Bag all of its elements that are contained in the
         * specified Bag.
         *
         * @param bag
         *            Bag containing elements to be removed from this Bag
         * @return {boolean} true if this Bag changed as a result of the call
         */
        removeAll(bag: ImmutableBag<E>): boolean;
        /**
         * Returns the element at the specified position in Bag.
         *
         * @param index
         *            index of the element to return
         * @return {Object} the element at the specified position in bag
         */
        get(index: number): E;
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
        safeGet(index: number): E;
        /**
         * Returns the number of elements in this bag.
         *
         * @return {number} the number of elements in this bag
         */
        size(): number;
        /**
         * Returns the number of elements the bag can hold without growing.
         *
         * @return {number} the number of elements the bag can hold without growing.
         */
        getCapacity(): number;
        /**
         * Checks if the internal storage supports this index.
         *
         * @param index
         * @return {boolean}
         */
        isIndexWithinBounds(index: number): boolean;
        /**
         * Returns true if this list contains no elements.
         *
         * @return {boolean} true if this list contains no elements
         */
        isEmpty(): boolean;
        /**
         * Adds the specified element to the end of this bag. if needed also
         * increases the capacity of the bag.
         *
         * @param e
         *            element to be added to this list
         */
        add(e: E): void;
        /**
         * Set element at specified index in the bag.
         *
         * @param index position of element
         * @param e the element
         */
        set(index: number, e: E): void;
        grow(newCapacity?: number): void;
        ensureCapacity(index: number): void;
        /**
         * Removes all of the elements from this bag. The bag will be empty after
         * this call returns.
         */
        clear(): void;
        /**
         * Add all items into this bag.
         * @param items
         */
        addAll(items: ImmutableBag<E>): void;
    }
}
declare module entitas.utils {
    import Bag = entitas.utils.Bag;
    interface ISignal<T> {
        dispatch(...args: any[]): void;
        add(listener: T): void;
        clear(): void;
        remove(listener: T): void;
    }
    class Signal<T> implements ISignal<T> {
        _listeners: Bag<T>;
        private _context;
        private _alloc;
        active: boolean;
        /**
         *
         * @constructor
         * @param context
         * @param alloc
         */
        constructor(context: any, alloc?: number);
        /**
         * Dispatch event
         *
         * @param args list
         */
        dispatch(...args: any[]): void;
        /**
         * Add event listener
         * @param listener
         */
        add(listener: T): void;
        /**
         * Remove event listener
         * @param listener
         */
        remove(listener: T): void;
        /**
         * Clear and reset to original alloc
         */
        clear(): void;
    }
}
declare module entitas.utils {
    class Stopwatch {
        isRunning: boolean;
        startTimeStamp: number;
        elapsed: number;
        static isHighRes: boolean;
        private _elapsed;
        private _startTimeStamp;
        private _isRunning;
        constructor();
        start(): void;
        stop(): void;
        reset(): void;
        static getTimeStamp(): number;
    }
}
declare module entitas {
    interface IComponent {
    }
}
declare module entitas {
    interface IMatcher {
        id: number;
        indices: number[];
        matches(entity: Entity): any;
    }
    interface ICompoundMatcher extends IMatcher {
        allOfIndices: number[];
        anyOfIndices: number[];
        noneOfIndices: number[];
    }
    interface INoneOfMatcher extends ICompoundMatcher {
    }
    interface IAnyOfMatcher extends ICompoundMatcher {
        noneOf(...args: any[]): INoneOfMatcher;
    }
    interface IAllOfMatcher extends ICompoundMatcher {
        anyOf(...args: any[]): IAnyOfMatcher;
        noneOf(...args: any[]): INoneOfMatcher;
    }
}
declare module entitas {
    import Pool = entitas.Pool;
    interface ISystem {
    }
    interface ISetPool {
        setPool(pool: Pool): any;
    }
}
declare module entitas {
    interface IExecuteSystem extends ISystem {
        execute(): any;
    }
}
declare module entitas {
    interface IInitializeSystem extends ISystem {
        initialize(): any;
    }
}
declare module entitas {
    interface IReactiveExecuteSystem extends ISystem {
        execute(entities: Array<Entity>): any;
    }
    interface IMultiReactiveSystem extends IReactiveExecuteSystem {
        triggers: Array<TriggerOnEvent>;
    }
    interface IReactiveSystem extends IReactiveExecuteSystem {
        trigger: TriggerOnEvent;
    }
    interface IEnsureComponents {
        ensureComponents: IMatcher;
    }
    interface IExcludeComponents {
        excludeComponents: IMatcher;
    }
    interface IClearReactiveSystem {
        clearAfterExecute: boolean;
    }
}
declare module entitas {
    class Exception {
        /** @type {string} */
        message: string;
        /**
         * Base exception class
         * @constructot
         * @param message
         */
        constructor(message: any);
        /** @return {string} */
        toString(): string;
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class EntityAlreadyHasComponentException extends Exception {
        /**
         * Entity Already Has Component Exception
         * @constructor
         * @param message
         * @param index
         */
        constructor(message: string, index: number);
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class EntityDoesNotHaveComponentException extends Exception {
        /**
         * Entity Does Not Have Component Exception
         * @constructor
         * @param message
         * @param index
         */
        constructor(message: string, index: number);
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class EntityIsAlreadyReleasedException extends Exception {
        /**
         * Entity Is Already Released Exception
         * @constructor
         */
        constructor();
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class EntityIsNotDestroyedException extends Exception {
        /**
         * Entity Is Not Destroyed Exception
         * @constructor
         * @param message
         */
        constructor(message: string);
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class EntityIsNotEnabledException extends Exception {
        /**
         * Entity Is Not Enabled Exception
         * @constructor
         * @param message
         */
        constructor(message: string);
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class GroupObserverException extends Exception {
        /**
         * Group Observer Exception
         * @constructor
         * @param message
         */
        constructor(message: string);
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class MatcherException extends Exception {
        /**
         * Matcher Exception
         * @constructor
         * @param matcher
         */
        constructor(matcher: IMatcher);
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class PoolDoesNotContainEntityException extends Exception {
        /**
         * Pool Does Not Contain Entity Exception
         * @constructor
         * @param entity
         * @param message
         */
        constructor(entity: Entity, message: string);
    }
}
declare module entitas.exceptions {
    import Exception = entitas.Exception;
    class SingleEntityException extends Exception {
        /**
         * Single Entity Exception
         * @constructor
         * @param matcher
         */
        constructor(matcher: IMatcher);
    }
}
declare module entitas {
    import GroupEventType = entitas.GroupEventType;
    class TriggerOnEvent {
        trigger: IMatcher;
        eventType: GroupEventType;
        /**
         * @constructor
         *
         * @param trigger
         * @param eventType
         */
        constructor(trigger: IMatcher, eventType: GroupEventType);
    }
}
declare module entitas {
    import Entity = entitas.Entity;
    import IAllOfMatcher = entitas.IAllOfMatcher;
    import IAnyOfMatcher = entitas.IAnyOfMatcher;
    import INoneOfMatcher = entitas.INoneOfMatcher;
    import TriggerOnEvent = entitas.TriggerOnEvent;
    /**
     * Event Types
     * @readonly
     * @enum {number}
     */
    enum GroupEventType {
        OnEntityAdded = 0,
        OnEntityRemoved = 1,
        OnEntityAddedOrRemoved = 2,
    }
    module Matcher {
    }
    class Matcher implements IAllOfMatcher, IAnyOfMatcher, INoneOfMatcher {
        /**
         * Get the matcher id
         * @type {number}
         * @name entitas.Matcher#id */
        id: number;
        /**
         * A unique sequential index number assigned to each ,atch
         * @type {number} */
        static uniqueId: number;
        /**
         * A list of the component ordinals that this matches
         * @type {Array<number>}
         * @name entitas.Matcher#indices */
        indices: number[];
        /**
         * A unique sequential index number assigned to each entity at creation
         * @type {number}
         * @name entitas.Matcher#allOfIndices */
        allOfIndices: number[];
        /**
         * A unique sequential index number assigned to each entity at creation
         * @type {number}
         * @name entitas.Matcher#anyOfIndices */
        anyOfIndices: number[];
        /**
         * A unique sequential index number assigned to each entity at creation
         * @type {number}
         * @name entitas.Matcher#noneOfIndices */
        noneOfIndices: number[];
        private _indices;
        _allOfIndices: number[];
        _anyOfIndices: number[];
        _noneOfIndices: number[];
        private _toStringCache;
        private _id;
        /** Extension Points */
        onEntityAdded(): TriggerOnEvent;
        onEntityRemoved(): TriggerOnEvent;
        onEntityAddedOrRemoved(): TriggerOnEvent;
        /**
         * @constructor
         *
         */
        constructor();
        anyOf(...args: Array<IMatcher>): IAnyOfMatcher;
        anyOf(...args: number[]): IAnyOfMatcher;
        noneOf(...args: number[]): INoneOfMatcher;
        noneOf(...args: Array<IMatcher>): INoneOfMatcher;
        /**
         * Check if the entity matches this matcher
         * @param {entitas.Entity} entity
         * @returns {boolean}
         */
        matches(entity: Entity): boolean;
        /**
         * Merge list of component indices
         * @returns {Array<number>}
         */
        mergeIndices(): number[];
        /**
         * toString representation of this matcher
         * @returns {string}
         */
        toString(): string;
        /**
         * Get the set if distinct (non-duplicate) indices from a list
         * @param {Array<number>} indices
         * @returns {Array<number>}
         */
        static distinctIndices(indices: number[]): number[];
        /**
         * Merge all the indices of a set of Matchers
         * @param {Array<IMatcher>} matchers
         * @returns {Array<number>}
         */
        static mergeIndices(matchers: Array<IMatcher>): number[];
        static allOf(...args: number[]): IAllOfMatcher;
        static allOf(...args: Array<IMatcher>): IAllOfMatcher;
        static anyOf(...args: number[]): IAnyOfMatcher;
        static anyOf(...args: Array<IMatcher>): IAnyOfMatcher;
        private static appendIndices(sb, prefix, indexArray);
    }
}
/**
 * entitas ecs
 * @const
 */
declare module entitas {
    import ISignal = entitas.utils.ISignal;
    import IComponent = entitas.IComponent;
    import EntityChanged = Entity.EntityChanged;
    import EntityReleased = Entity.EntityReleased;
    import IEntityChanged = Entity.IEntityChanged;
    import IEntityReleased = Entity.IEntityReleased;
    import ComponentReplaced = Entity.ComponentReplaced;
    module Entity {
        /**
         * Event EntityReleased
         *
         * All references to the entity have been released
         */
        interface EntityReleased {
            (e: Entity): void;
        }
        interface IEntityReleased<T> extends ISignal<T> {
            dispatch(e: Entity): void;
        }
        /**
         * Event EntityChanged
         *
         * The entity has been changed
         **/
        interface EntityChanged {
            (e: Entity, index: number, component: IComponent): void;
        }
        interface IEntityChanged<T> extends ISignal<T> {
            dispatch(e: Entity, index: number, component: IComponent): void;
        }
        /**
         * Event ComponentReplaced
         *
         * A component was replaced
         */
        interface ComponentReplaced {
            (e: Entity, index: number, component: IComponent, replacement: IComponent): void;
        }
        interface IComponentReplaced<T> extends ISignal<T> {
            dispatch(e: Entity, index: number, component: IComponent, replacement: IComponent): void;
        }
    }
    class Entity {
        /**
         * @static
         * @type {number} */
        static instanceIndex: number;
        /**
         * @static
         * @type {Array<Array<IComponent>>} */
        static alloc: Array<Array<IComponent>>;
        /**
         * @static
         * @type {number} */
        static size: number;
        /**
         * A unique sequential index number assigned to each entity at creation
         * @type {number}
         * @name entitas.Entity#creationIndex */
        creationIndex: number;
        /**
         * Subscribe to Entity Released Event
         * @type {entitas.ISignal} */
        onEntityReleased: IEntityReleased<EntityReleased>;
        /**
         * Subscribe to Component Added Event
         * @type {entitas.ISignal} */
        onComponentAdded: IEntityChanged<EntityChanged>;
        /**
         * Subscribe to Component Removed Event
         * @type {entitas.ISignal} */
        onComponentRemoved: IEntityChanged<EntityChanged>;
        /**
         * Subscribe to Component Replaced Event
         * @type {entitas.ISignal} */
        onComponentReplaced: Entity.IComponentReplaced<ComponentReplaced>;
        /**
         * Entity name
         * @type {string} */
        name: string;
        /**
         *  Entity Id
         * @type {string} */
        id: string;
        /**
         *  Instance index
         * @type {number} */
        instanceIndex: number;
        _creationIndex: number;
        _isEnabled: boolean;
        _components: Array<IComponent>;
        _componentsCache: any;
        _componentIndicesCache: number[];
        _toStringCache: string;
        _refCount: number;
        private _pool;
        private _componentsEnum;
        /**
         * The basic game object. Everything is an entity with components that
         * are added / removed as needed.
         *
         * @param {Object} componentsEnum
         * @param {number} totalComponents
         * @constructor
         */
        constructor(componentsEnum: any, totalComponents?: number);
        static initialize(totalComponents: number, options: any): void;
        /**
         * allocate entity pool
         *
         * @param count number of components
         * @param size max number of entities
         */
        static dim(count: number, size: number): void;
        /**
         * Initialize
         * allocate the entity pool.
         *
         * @param {number} totalComponents
         * @returns {Array<entitas.IComponent>}
         */
        initialize(totalComponents: number): Array<IComponent>;
        /**
         * AddComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         * @returns {entitas.Entity}
         */
        addComponent(index: number, component: IComponent): Entity;
        /**
         * RemoveComponent
         *
         * @param {number} index
         * @returns {entitas.Entity}
         */
        removeComponent(index: number): Entity;
        /**
         * ReplaceComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         * @returns {entitas.Entity}
         */
        replaceComponent(index: number, component: IComponent): Entity;
        protected _replaceComponent(index: number, replacement: IComponent): void;
        /**
         * GetComponent
         *
         * @param {number} index
         * @param {entitas.IComponent} component
         */
        getComponent(index: number): IComponent;
        /**
         * GetComponents
         *
         * @returns {Array<entitas.IComponent>}
         */
        getComponents(): IComponent[];
        /**
         * GetComponentIndices
         *
         * @returns {Array<number>}
         */
        getComponentIndices(): number[];
        /**
         * HasComponent
         *
         * @param {number} index
         * @returns {boolean}
         */
        hasComponent(index: number): boolean;
        /**
         * HasComponents
         *
         * @param {Array<number>} indices
         * @returns {boolean}
         */
        hasComponents(indices: number[]): boolean;
        /**
         * HasAnyComponent
         *
         * @param {Array<number>} indices
         * @returns {boolean}
         */
        hasAnyComponent(indices: number[]): boolean;
        /**
         * RemoveAllComponents
         *
         */
        removeAllComponents(): void;
        /**
         * Destroy
         *
         */
        destroy(): void;
        /**
         * ToString
         *
         * @returns {string}
         */
        toString(): string;
        /**
         * AddRef
         *
         * @returns {entitas.Entity}
         */
        addRef(): Entity;
        /**
         * Release
         *
         */
        release(): void;
    }
}
declare module entitas {
    import Entity = entitas.Entity;
    import ISignal = entitas.utils.ISignal;
    import IMatcher = entitas.IMatcher;
    import IComponent = entitas.IComponent;
    import GroupChanged = Group.GroupChanged;
    import GroupUpdated = Group.GroupUpdated;
    import GroupEventType = entitas.GroupEventType;
    /**
     * event delegate boilerplate:
     */
    module Group {
        interface GroupChanged {
            (group: Group, entity: Entity, index: number, component: IComponent): void;
        }
        interface IGroupChanged<T> extends ISignal<T> {
            dispatch(group: Group, entity: Entity, index: number, component: IComponent): void;
        }
        interface GroupUpdated {
            (group: Group, entity: Entity, index: number, component: IComponent, newComponent: IComponent): void;
        }
        interface IGroupUpdated<T> extends ISignal<T> {
            dispatch(group: Group, entity: Entity, index: number, component: IComponent, newComponent: IComponent): void;
        }
    }
    class Group {
        /**
         * Subscribe to Entity Addded events
         * @type {entitas.utils.ISignal} */
        onEntityAdded: Group.IGroupChanged<GroupChanged>;
        /**
         * Subscribe to Entity Removed events
         * @type {entitas.utils.ISignal} */
        onEntityRemoved: Group.IGroupChanged<GroupChanged>;
        /**
         * Subscribe to Entity Updated events
         * @type {entitas.utils.ISignal} */
        onEntityUpdated: Group.IGroupUpdated<GroupUpdated>;
        /**
         * Count the number of entities in this group
         * @type {number}
         * @name entitas.Group#count */
        count: number;
        /**
         * Get the Matcher for this group
         * @type {entitas.IMatcher}
         * @name entitas.Group#matcher */
        matcher: IMatcher;
        private _entities;
        private _matcher;
        _entitiesCache: Array<Entity>;
        _singleEntityCache: Entity;
        _toStringCache: string;
        /**
         * @constructor
         * @param matcher
         */
        constructor(matcher: IMatcher);
        /**
         * Create an Observer for the event type on this group
         * @param eventType
         */
        createObserver(eventType: GroupEventType): GroupObserver;
        /**
         * Handle adding and removing component from the entity without raising events
         * @param entity
         */
        handleEntitySilently(entity: Entity): void;
        /**
         * Handle adding and removing component from the entity and raisieevents
         * @param entity
         * @param index
         * @param component
         */
        handleEntity(entity: Entity, index: number, component: IComponent): void;
        /**
         * Update entity and raise events
         * @param entity
         * @param index
         * @param previousComponent
         * @param newComponent
         */
        updateEntity(entity: Entity, index: number, previousComponent: IComponent, newComponent: IComponent): void;
        /**
         * Add entity without raising events
         * @param entity
         */
        addEntitySilently(entity: Entity): void;
        /**
         * Add entity and raise events
         * @param entity
         * @param index
         * @param component
         */
        addEntity(entity: Entity, index: number, component: IComponent): void;
        /**
         * Remove entity without raising events
         * @param entity
         */
        removeEntitySilently(entity: Entity): void;
        /**
         * Remove entity and raise events
         * @param entity
         * @param index
         * @param component
         */
        removeEntity(entity: Entity, index: number, component: IComponent): void;
        /**
         * Check if group has this entity
         *
         * @param entity
         * @returns boolean
         */
        containsEntity(entity: Entity): boolean;
        /**
         * Get a list of the entities in this group
         *
         * @returns Array<entitas.Entity>
         */
        getEntities(): Entity[];
        /**
         * Gets an entity singleton.
         * If a group has more than 1 entity, this is an error condition.
         *
         * @returns entitas.Entity
         */
        getSingleEntity(): Entity;
        /**
         * Create a string representation for this group:
         *
         *  ex: 'Group(Position)'
         *
         * @returns string
         */
        toString(): string;
    }
}
declare module entitas {
    import Group = entitas.Group;
    import Entity = entitas.Entity;
    import IComponent = entitas.IComponent;
    import GroupEventType = entitas.GroupEventType;
    class GroupObserver {
        /**
         * Entities being observed
         * @type {Object<string,entitas.Entity>}
         * @name entitas.GroupObserver#collectedEntities */
        collectedEntities: {};
        private _collectedEntities;
        protected _groups: Array<Group>;
        protected _eventTypes: Array<GroupEventType>;
        protected _addEntityCache: Group.GroupChanged;
        /**
         * @constructor
         * @param {Array<entitas.Group>} groups
         * @param {number} eventTypes
         */
        constructor(groups: any, eventTypes: any);
        /**
         * Activate events
         */
        activate(): void;
        /**
         * Deavtivate events
         */
        deactivate(): void;
        /**
         * Clear the list of entities
         */
        clearCollectedEntities(): void;
        /**
         * Adds an entity to this observer group
         * @param group
         * @param {entitas.Entity}entity
         * @param index
         * @param {entitas.IComponent}component
         */
        addEntity: (group: Group, entity: Entity, index: number, component: IComponent) => void;
    }
}
declare module entitas {
    import Bag = entitas.utils.Bag;
    import Group = entitas.Group;
    import Entity = entitas.Entity;
    import ISignal = entitas.utils.ISignal;
    import IMatcher = entitas.IMatcher;
    import PoolChanged = Pool.PoolChanged;
    import IComponent = entitas.IComponent;
    import GroupChanged = Pool.GroupChanged;
    /**
     * event delegate boilerplate:
     */
    module Pool {
        /**
         * Event PoolChanged
         *
         * Pool has changed
         */
        interface PoolChanged {
            (pool: Pool, entity: Entity): void;
        }
        interface IPoolChanged<T> extends ISignal<T> {
            dispatch(pool: Pool, entity: Entity): void;
        }
        /**
         * Event GroupChanged
         *
         * Group has changed
         */
        interface GroupChanged {
            (pool: Pool, group: Group): void;
        }
        interface IGroupChanged<T> extends ISignal<T> {
            dispatch(pool: Pool, group: Group): void;
        }
    }
    /**
     * A cached pool of entities and components.
     * The games world.
     */
    class Pool {
        /**
         * The total number of components in this pool
         * @type {number}
         * @name entitas.Pool#totalComponents */
        totalComponents: number;
        /**
         * Count of active entities
         * @type {number}
         * @name entitas.Pool#count */
        count: number;
        /**
         * Count of entities waiting to be recycled
         * @type {number}
         * @name entitas.Pool#reusableEntitiesCount */
        reusableEntitiesCount: number;
        /**
         * Count of entities that sill have references
         * @type {number}
         * @name entitas.Pool#retainedEntitiesCount */
        retainedEntitiesCount: number;
        /**
         * Subscribe to Entity Created Event
         * @type {entitas.utils.ISignal} */
        onEntityCreated: Pool.IPoolChanged<PoolChanged>;
        /**
         * Subscribe to Entity Will Be Destroyed Event
         * @type {entitas.utils.ISignal} */
        onEntityWillBeDestroyed: Pool.IPoolChanged<PoolChanged>;
        /**
         * Subscribe to Entity Destroyed Event
         * @type {entitas.utils.ISignal} */
        onEntityDestroyed: Pool.IPoolChanged<PoolChanged>;
        /**
         * Subscribe to Group Created Event
         * @type {entitas.utils.ISignal} */
        onGroupCreated: Pool.IGroupChanged<GroupChanged>;
        /**
         * Entity name for debugging
         * @type {string} */
        name: string;
        /**
         * An enum of valid component types
         * @type {Object<string,number>} */
        static componentsEnum: Object;
        /**
         * Count of components
         * @type {number} */
        static totalComponents: number;
        /**
         * Global reference to pool instance
         * @type {entitas.Pool} */
        static instance: Pool;
        _debug: boolean;
        _entities: {};
        _groups: {};
        _groupsForIndex: Bag<Bag<Group>>;
        _reusableEntities: Bag<Entity>;
        _retainedEntities: {};
        _componentsEnum: Object;
        _totalComponents: number;
        _creationIndex: number;
        _entitiesCache: Array<Entity>;
        _cachedUpdateGroupsComponentAddedOrRemoved: Entity.EntityChanged;
        _cachedUpdateGroupsComponentReplaced: Entity.ComponentReplaced;
        _cachedOnEntityReleased: Entity.EntityReleased;
        getEntities(matcher: IMatcher): Entity[];
        getEntities(): Entity[];
        createSystem(system: ISystem): any;
        createSystem(system: Function): any;
        /**
         * Set the system pool if supported
         *
         * @static
         * @param {entitas.ISystem} system
         * @param {entitas.Pool} pool
         */
        static setPool(system: ISystem, pool: Pool): void;
        /**
         * @constructor
         * @param {Object} components
         * @param {number} totalComponents
         * @param {number} startCreationIndex
         */
        constructor(components: {}, totalComponents: number, debug?: boolean, startCreationIndex?: number);
        /**
         * Create a new entity
         * @param {string} name
         * @returns {entitas.Entity}
         */
        createEntity(name: string): Entity;
        /**
         * Destroy an entity
         * @param {entitas.Entity} entity
         */
        destroyEntity(entity: Entity): void;
        /**
         * Destroy All Entities
         */
        destroyAllEntities(): void;
        /**
         * Check if pool has this entity
         *
         * @param {entitas.Entity} entity
         * @returns {boolean}
         */
        hasEntity(entity: Entity): boolean;
        /**
         * Gets all of the entities that match
         *
         * @param {entias.IMatcher} matcher
         * @returns {entitas.Group}
         */
        getGroup(matcher: IMatcher): Group;
        /**
         * @param {entitas.Entity} entity
         * @param {number} index
         * @param {entitas.IComponent} component
         */
        protected updateGroupsComponentAddedOrRemoved: (entity: Entity, index: number, component: IComponent) => void;
        /**
         * @param {entitas.Entity} entity
         * @param {number} index
         * @param {entitas.IComponent} previousComponent
         * @param {entitas.IComponent} newComponent
         */
        protected updateGroupsComponentReplaced: (entity: Entity, index: number, previousComponent: IComponent, newComponent: IComponent) => void;
        /**
         * @param {entitas.Entity} entity
         */
        protected onEntityReleased: (entity: Entity) => void;
    }
}
declare module entitas {
    import IMatcher = entitas.IMatcher;
    import GroupObserver = entitas.GroupObserver;
    import IReactiveSystem = entitas.IReactiveSystem;
    import IMultiReactiveSystem = entitas.IMultiReactiveSystem;
    class ReactiveSystem implements IExecuteSystem {
        /**
         * Get subsystems
         * @type {entitas.IReactiveExecuteSystem}
         * @name entitas.Pool#subsystem */
        subsystem: entitas.IReactiveExecuteSystem;
        private _subsystem;
        _observer: GroupObserver;
        _ensureComponents: IMatcher;
        _excludeComponents: IMatcher;
        _clearAfterExecute: boolean;
        _buffer: Array<Entity>;
        /**
         * @constructor
         *
         * @param pool
         * @param subSystem
         */
        constructor(pool: Pool, subSystem: IReactiveSystem | IMultiReactiveSystem);
        activate(): void;
        deactivate(): void;
        clear(): void;
        /**
         * execute
         */
        execute(): void;
    }
}
declare module entitas {
    import ISystem = entitas.ISystem;
    import IExecuteSystem = entitas.IExecuteSystem;
    import IInitializeSystem = entitas.IInitializeSystem;
    class Systems implements IInitializeSystem, IExecuteSystem {
        protected _initializeSystems: Array<IInitializeSystem>;
        protected _executeSystems: Array<IExecuteSystem>;
        /**
         * @constructor
         *
         */
        constructor();
        add(system: ISystem): any;
        add(system: Function): any;
        /**
         * Initialize Systems
         */
        initialize(): void;
        /**
         * Execute sustems
         */
        execute(): void;
        /**
         * Clear subsystems
         */
        clearReactiveSystems(): void;
    }
}
declare module entitas.viewer {
    /**
     * Profiler class for Entities
     */
    class EntityBehavior {
        protected obj: any;
        name: string;
        private _name;
        /**
         * @constructor
         *
         * @param obj
         */
        constructor(obj: any);
    }
}
declare module entitas.viewer {
    /**
     * Profiler class for Pools
     */
    class PoolObserver {
        protected _pool: any;
        name: string;
        Pool: string;
        entities: string;
        reusable: string;
        protected _groups: any;
        /**
         * @constructor
         *
         * @param _pool
         */
        constructor(_pool: any);
    }
}
declare module entitas.viewer {
    /** todo: SystemObserver track time spent in ms by system */
    /**
     * Profiler class for Systems
     */
    class SystemObserver {
        protected _systems: any;
        name: string;
        Systems: string;
        initialize: string;
        execute: string;
        /**
         * @constructor
         *
         * @param _systems
         */
        constructor(_systems: any);
    }
}
/**
 * Inspired by Unity
 */
declare module entitas.viewer {
    import Pool = entitas.Pool;
    var gui: any;
    /**
     * @class VisualDebugging
     */
    class VisualDebugging {
        static _controllers: any;
        static _entities: any;
        static _pools: any;
        static _systems: any;
        /**
         *
         * @param pool
         */
        static init(pool: Pool): void;
    }
}
