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
         * @param capacity
         *            the initial capacity of Bag
         */
        constructor(capacity?: number);
        /**
         * Removes the element at the specified position in this Bag. does this by
         * overwriting it was last element then removing last element
         *
         * @param index
         *            the index of element to be removed
         * @return element that was removed from the Bag
         */
        removeAt(index: number): E;
        /**
         * Removes the first occurrence of the specified element from this Bag, if
         * it is present. If the Bag does not contain the element, it is unchanged.
         * does this by overwriting it was last element then removing last element
         *
         * @param e
         *            element to be removed from this list, if present
         * @return <tt>true</tt> if this list contained the specified element
         */
        remove(e: E): boolean;
        /**
         * Remove and return the last object in the bag.
         *
         * @return the last object in the bag, null if empty.
         */
        removeLast(): E;
        /**
         * Check if bag contains this element.
         *
         * @param e
         * @return
         */
        contains(e: E): boolean;
        /**
         * Removes from this Bag all of its elements that are contained in the
         * specified Bag.
         *
         * @param bag
         *            Bag containing elements to be removed from this Bag
         * @return {@code true} if this Bag changed as a result of the call
         */
        removeAll(bag: ImmutableBag<E>): boolean;
        /**
         * Returns the element at the specified position in Bag.
         *
         * @param index
         *            index of the element to return
         * @return the element at the specified position in bag
         *
         * @throws ArrayIndexOutOfBoundsException
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
         * @return the element at the specified position in bag
         *
         */
        safeGet(index: number): E;
        /**
         * Returns the number of elements in this bag.
         *
         * @return the number of elements in this bag
         */
        size(): number;
        /**
         * Returns the number of elements the bag can hold without growing.
         *
         * @return the number of elements the bag can hold without growing.
         */
        getCapacity(): number;
        /**
         * Checks if the internal storage supports this index.
         *
         * @param index
         * @return
         */
        isIndexWithinBounds(index: number): boolean;
        /**
         * Returns true if this list contains no elements.
         *
         * @return true if this list contains no elements
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
    class BitSet {
        private words_;
        constructor(nbits?: number);
        nextSetBit(fromIndex: number): number;
        intersects(set: BitSet): boolean;
        hasAll(set: BitSet): boolean;
        isEmpty(): boolean;
        set(bitIndex: number, value?: boolean): number;
        get(bitIndex: number): boolean;
        clear(bitIndex?: number): number;
    }
}
declare module entitas.utils {
    /**
     * For documenting where Function refers to a class definition
     */
    interface Class extends Function {
    }
    /**
     * Gets Class Metadata - Name
     *
     * @param {Function} klass
     * @return {string}
     */
    function getClassName(klass: any): any;
    /**
     * HashMap
     *
     * Allow object as key.
     */
    class HashMap<K, V> implements Map<K, V> {
        private map_;
        private keys_;
        constructor();
        clear(): void;
        values(): any[];
        contains(value: any): boolean;
        containsKey(key: any): boolean;
        containsValue(value: any): boolean;
        get(key: any): any;
        isEmpty(): boolean;
        keys(): any[];
        /**
         * if key is a string, use as is, else use key.id_ or key.name
         */
        put(key: any, value: any): void;
        remove(key: any): any;
        size(): number;
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
declare module entitas.utils {
    interface Map<K, V> {
        clear(): any;
        containsKey(key: any): boolean;
        containsValue(value: any): boolean;
        get(key: any): any;
        isEmpty(): boolean;
        put(key: any, value: any): any;
        remove(key: any): any;
        size(): number;
        values(): any;
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
         * @param context
         * @param alloc
         */
        constructor(context: any, alloc?: number);
        /**
         * Dispatch event
         *
         * @param $0
         * @param $1
         * @param $2
         * @param $3
         * @param $4
         */
        dispatch($0?: any, $1?: any, $2?: any, $3?: any, $4?: any): void;
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
declare module entitas.utils {
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
    import Entity = entitas.Entity;
    import IAllOfMatcher = entitas.IAllOfMatcher;
    import IAnyOfMatcher = entitas.IAnyOfMatcher;
    import INoneOfMatcher = entitas.INoneOfMatcher;
    module Matcher {
    }
    class Matcher implements IAllOfMatcher, IAnyOfMatcher, INoneOfMatcher {
        id: number;
        static uniqueId: number;
        indices: number[];
        allOfIndices: number[];
        anyOfIndices: number[];
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
        constructor();
        anyOf(...args: Array<IMatcher>): IAnyOfMatcher;
        anyOf(...args: number[]): IAnyOfMatcher;
        noneOf(...args: number[]): INoneOfMatcher;
        noneOf(...args: Array<IMatcher>): INoneOfMatcher;
        matches(entity: Entity): boolean;
        mergeIndices(): number[];
        toString(): string;
        equals(obj: any): boolean;
        static equalIndices(i1: number[], i2: number[]): boolean;
        static distinctIndices(indices: number[]): number[];
        static mergeIndices(matchers: Array<IMatcher>): number[];
        static allOf(...args: number[]): IAllOfMatcher;
        static allOf(...args: Array<IMatcher>): IAllOfMatcher;
        static anyOf(...args: number[]): IAnyOfMatcher;
        static anyOf(...args: Array<IMatcher>): IAnyOfMatcher;
        private static appendIndices(sb, prefix, indexArray);
    }
}
declare module entitas {
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
    import GroupEventType = entitas.GroupEventType;
    class TriggerOnEvent {
        trigger: IMatcher;
        eventType: GroupEventType;
        constructor(trigger: IMatcher, eventType: GroupEventType);
    }
}
declare module entitas.extensions {
    import Entity = entitas.Entity;
    class Collection extends Array {
        constructor($0: any);
        singleEntity(): Entity;
    }
}
declare module entitas.extensions {
}
declare module entitas.extensions {
}
declare module entitas.extensions {
}
/**
 * Inspired by Unity
 */
declare module entitas.browser {
    import Pool = entitas.Pool;
    /** todo: SystemObserver track time spent in ms by system */
    var gui: any;
    class VisualDebugging {
        static _controllers: any;
        static _entities: any;
        static _pools: any;
        static _systems: any;
        static init(pool: Pool): void;
    }
    /**
     * Profiler class for Entities
     */
    class EntityBehavior {
        protected obj: any;
        name: string;
        private _name;
        constructor(obj: any);
    }
    /**
     * Profiler class for Systems
     */
    class SystemObserver {
        protected _systems: any;
        name: string;
        Systems: string;
        initialize: string;
        execute: string;
        constructor(_systems: any);
    }
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
        constructor(_pool: any);
    }
}
declare module entitas {
    class Exception {
        message: string;
        constructor(message: any);
        toString(): string;
    }
    class EntityAlreadyHasComponentException extends Exception {
        constructor(message: string, index: number);
    }
    class EntityDoesNotHaveComponentException extends Exception {
        constructor(message: string, index: number);
    }
    class EntityIsNotEnabledException extends Exception {
        constructor(message: string);
    }
    class EntityIsAlreadyReleasedException extends Exception {
        constructor();
    }
    class SingleEntityException extends Exception {
        constructor(matcher: IMatcher);
    }
    class GroupObserverException extends Exception {
        constructor(message: string);
    }
    class PoolDoesNotContainEntityException extends Exception {
        constructor(entity: Entity, message: string);
    }
    class EntityIsNotDestroyedException extends Exception {
        constructor(message: string);
    }
    class MatcherException extends Exception {
        constructor(matcher: IMatcher);
    }
}
declare module entitas {
    import ISignal = entitas.utils.ISignal;
    import IComponent = entitas.IComponent;
    import EntityChanged = Entity.EntityChanged;
    import EntityReleased = Entity.EntityReleased;
    import IEntityChanged = Entity.IEntityChanged;
    import IEntityReleased = Entity.IEntityReleased;
    import ComponentReplaced = Entity.ComponentReplaced;
    /**
     * event delegate boilerplate:
     */
    module Entity {
        interface EntityReleased {
            (e: Entity): void;
        }
        interface IEntityReleased<T> extends ISignal<T> {
            dispatch(e: Entity): void;
        }
        interface EntityChanged {
            (e: Entity, index: number, component: IComponent): void;
        }
        interface IEntityChanged<T> extends ISignal<T> {
            dispatch(e: Entity, index: number, component: IComponent): void;
        }
        interface ComponentReplaced {
            (e: Entity, index: number, component: IComponent, replacement: IComponent): void;
        }
        interface IComponentReplaced<T> extends ISignal<T> {
            dispatch(e: Entity, index: number, component: IComponent, replacement: IComponent): void;
        }
    }
    class Entity {
        creationIndex: number;
        onEntityReleased: IEntityReleased<EntityReleased>;
        onComponentAdded: IEntityChanged<EntityChanged>;
        onComponentRemoved: IEntityChanged<EntityChanged>;
        onComponentReplaced: Entity.IComponentReplaced<ComponentReplaced>;
        name: string;
        id: string;
        _creationIndex: number;
        _isEnabled: boolean;
        _components: any;
        private _componentsEnum;
        _componentsCache: any;
        _componentIndicesCache: number[];
        _toStringCache: string;
        _refCount: number;
        constructor(componentsEnum: any, totalComponents?: number);
        addComponent(index: number, component: IComponent): Entity;
        removeComponent(index: number): Entity;
        replaceComponent(index: number, component: IComponent): Entity;
        protected _replaceComponent(index: number, replacement: IComponent): void;
        getComponent(index: number): IComponent;
        getComponents(): IComponent[];
        getComponentIndices(): number[];
        hasComponent(index: number): boolean;
        hasComponents(indices: number[]): boolean;
        hasAnyComponent(indices: number[]): boolean;
        removeAllComponents(): void;
        destroy(): void;
        toString(): string;
        addRef(): Entity;
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
        onEntityAdded: Group.IGroupChanged<GroupChanged>;
        onEntityRemoved: Group.IGroupChanged<GroupChanged>;
        onEntityUpdated: Group.IGroupUpdated<GroupUpdated>;
        count: number;
        matcher: IMatcher;
        _matcher: IMatcher;
        _entities: {};
        _entitiesCache: Array<Entity>;
        _singleEntityCache: Entity;
        _toStringCache: string;
        /** Extension Points */
        createObserver(eventType: GroupEventType): GroupObserver;
        constructor(matcher: IMatcher);
        handleEntitySilently(entity: Entity): void;
        handleEntity(entity: Entity, index: number, component: IComponent): void;
        updateEntity(entity: Entity, index: number, previousComponent: IComponent, newComponent: IComponent): void;
        addEntitySilently(entity: Entity): void;
        addEntity(entity: Entity, index: number, component: IComponent): void;
        removeEntitySilently(entity: Entity): void;
        removeEntity(entity: Entity, index: number, component: IComponent): void;
        containsEntity(entity: Entity): boolean;
        getEntities(): Entity[];
        getSingleEntity(): Entity;
        toString(): string;
    }
}
declare module entitas {
    import Group = entitas.Group;
    import Entity = entitas.Entity;
    import Component = entitas.IComponent;
    enum GroupEventType {
        OnEntityAdded = 0,
        OnEntityRemoved = 1,
        OnEntityAddedOrRemoved = 2,
    }
    class GroupObserver {
        collectedEntities: {};
        private _collectedEntities;
        _groups: Array<Group>;
        _eventTypes: Array<GroupEventType>;
        _addEntityCache: Group.GroupChanged;
        constructor(groups: any, eventTypes: any);
        activate(): void;
        deactivate(): void;
        clearCollectedEntities(): void;
        addEntity: (group: Group, entity: Entity, index: number, component: Component) => void;
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
        interface PoolChanged {
            (pool: Pool, entity: Entity): void;
        }
        interface IPoolChanged<T> extends ISignal<T> {
            dispatch(pool: Pool, entity: Entity): void;
        }
        interface GroupChanged {
            (pool: Pool, group: Group): void;
        }
        interface IGroupChanged<T> extends ISignal<T> {
            dispatch(pool: Pool, group: Group): void;
        }
    }
    class Pool {
        totalComponents: number;
        count: number;
        reusableEntitiesCount: number;
        retainedEntitiesCount: number;
        onEntityCreated: Pool.IPoolChanged<PoolChanged>;
        onEntityWillBeDestroyed: Pool.IPoolChanged<PoolChanged>;
        onEntityDestroyed: Pool.IPoolChanged<PoolChanged>;
        onGroupCreated: Pool.IGroupChanged<GroupChanged>;
        _entities: {};
        _groups: {};
        _groupsForIndex: Bag<Bag<Group>>;
        _reusableEntities: Bag<Entity>;
        _retainedEntities: {};
        static componentsEnum: Object;
        static totalComponents: number;
        _componentsEnum: Object;
        _totalComponents: number;
        _creationIndex: number;
        _entitiesCache: Array<Entity>;
        _cachedUpdateGroupsComponentAddedOrRemoved: Entity.EntityChanged;
        _cachedUpdateGroupsComponentReplaced: Entity.ComponentReplaced;
        _cachedOnEntityReleased: Entity.EntityReleased;
        /** Extension Points */
        getEntities(matcher: IMatcher): Entity[];
        getEntities(): Entity[];
        createSystem(system: ISystem): any;
        createSystem(system: Function): any;
        static setPool(system: ISystem, pool: Pool): any;
        constructor(components: {}, totalComponents: number, startCreationIndex?: number);
        /**
         * groupDesc
         *
         * expand out the group tostring for better debug info
         *
         * @param group
         * @returns {string}
         */
        static groupDesc(group: Group): string;
        /**
         *
         * @param name
         */
        createEntity(name: any): Entity;
        /**
         *
         * @param entity
         */
        destroyEntity(entity: Entity): void;
        destroyAllEntities(): void;
        hasEntity(entity: Entity): boolean;
        getGroup(matcher: IMatcher): Group;
        updateGroupsComponentAddedOrRemoved: (entity: Entity, index: number, component: IComponent) => void;
        updateGroupsComponentReplaced: (entity: Entity, index: number, previousComponent: IComponent, newComponent: IComponent) => void;
        onEntityReleased: (entity: Entity) => void;
    }
}
declare module entitas {
    import IMatcher = entitas.IMatcher;
    import GroupObserver = entitas.GroupObserver;
    import IReactiveSystem = entitas.IReactiveSystem;
    import IMultiReactiveSystem = entitas.IMultiReactiveSystem;
    class ReactiveSystem implements IExecuteSystem {
        subsystem: entitas.IReactiveExecuteSystem;
        private _subsystem;
        _observer: GroupObserver;
        _ensureComponents: IMatcher;
        _excludeComponents: IMatcher;
        _clearAfterExecute: boolean;
        _buffer: Array<Entity>;
        constructor(pool: Pool, subSystem: IReactiveSystem | IMultiReactiveSystem);
        activate(): void;
        deactivate(): void;
        clear(): void;
        execute(): void;
    }
}
declare module entitas {
    import ISystem = entitas.ISystem;
    import IExecuteSystem = entitas.IExecuteSystem;
    import IInitializeSystem = entitas.IInitializeSystem;
    enum SystemType {
        IInitializeSystem = 1,
        IExecuteSystem = 2,
        IReactiveExecuteSystem = 4,
        IMultiReactiveSystem = 8,
        IReactiveSystem = 16,
        IEnsureComponents = 32,
        IExcludeComponents = 64,
        IClearReactiveSystem = 128,
    }
    class Systems implements IInitializeSystem, IExecuteSystem {
        protected _initializeSystems: Array<IInitializeSystem>;
        protected _executeSystems: Array<IExecuteSystem>;
        constructor();
        add(system: ISystem): any;
        add(system: Function): any;
        initialize(): void;
        execute(): void;
        clearReactiveSystems(): void;
    }
}
