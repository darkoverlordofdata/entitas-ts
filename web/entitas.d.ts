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
    interface ISignal<T> {
        dispatch(...args: any[]): void;
        add(listener: T): void;
        remove(listener: T): void;
        clear(): void;
    }
    class Signal<T> implements ISignal<T> {
        private _listeners;
        private _context;
        constructor(context: any);
        dispatch(...args: any[]): void;
        add(listener: T): void;
        remove(listener: T): void;
        clear(): void;
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
    interface ISystem {
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
    class CoreMatcher {
    }
    class Matcher implements IAllOfMatcher, IAnyOfMatcher, INoneOfMatcher {
        id: number;
        static uniqueId: number;
        indices: number[];
        allOfIndices: number[];
        anyOfIndices: number[];
        noneOfIndices: number[];
        private _indices;
        private _allOfIndices;
        private _anyOfIndices;
        private _noneOfIndices;
        private _toStringCache;
        private _id;
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
        /** MatcherExtension::onEntityAdded */
        onEntityAdded(): TriggerOnEvent;
        /** MatcherExtension::onEntityRemoved */
        onEntityRemoved(): TriggerOnEvent;
        /** MatcherExtension::onEntityAddedOrRemoved */
        onEntityAddedOrRemoved(): TriggerOnEvent;
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
declare module entitas {
    import ISignal = entitas.ISignal;
    import IComponent = entitas.IComponent;
    import EntityChanged = Entity.EntityChanged;
    import IEntityChanged = Entity.IEntityChanged;
    import EntityReleased = Entity.EntityReleased;
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
        _creationIndex: number;
        _isEnabled: boolean;
        _components: any;
        private _componentsEnum;
        _componentsCache: any;
        _componentIndicesCache: number[];
        _toStringCache: string;
        _refCount: number;
        constructor(componentsEnum: {}, totalComponents?: number);
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
        interface IGroupChanged<T> extends entitas.ISignal<T> {
            dispatch(group: Group, entity: Entity, index: number, component: IComponent): void;
        }
        interface GroupUpdated {
            (group: Group, entity: Entity, index: number, component: IComponent, newComponent: IComponent): void;
        }
        interface IGroupUpdated<T> extends entitas.ISignal<T> {
            dispatch(group: Group, entity: Entity, index: number, component: IComponent, newComponent: IComponent): void;
        }
    }
    class Group {
        onEntityAdded: Group.IGroupChanged<GroupChanged>;
        onEntityRemoved: Group.IGroupChanged<GroupChanged>;
        onEntityUpdated: Group.IGroupUpdated<GroupUpdated>;
        count: number;
        matcher: IMatcher;
        private _matcher;
        private _entities;
        _entitiesCache: Entity[];
        _singleEntityCache: Entity;
        _toStringCache: string;
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
        /** GroupExtension::createObserver */
        createObserver(eventType?: GroupEventType): GroupObserver;
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
        addEntity(group: Group, entity: Entity, index: number, component: Component): void;
    }
}
declare module entitas {
    import Entity = entitas.Entity;
    import Group = entitas.Group;
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
        interface IPoolChanged<T> extends entitas.ISignal<T> {
            dispatch(pool: Pool, entity: Entity): void;
        }
        interface GroupChanged {
            (pool: Pool, group: Group): void;
        }
        interface IGroupChanged<T> extends entitas.ISignal<T> {
            dispatch(pool: Pool, group: Group): void;
        }
    }
    interface ISetPool {
        setPool(pool: Pool): any;
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
        _groupsForIndex: Array<Array<Group>>;
        _reusableEntities: Array<Entity>;
        _retainedEntities: {};
        private _componentsEnum;
        private _totalComponents;
        _creationIndex: number;
        _entitiesCache: Array<Entity>;
        _cachedUpdateGroupsComponentAddedOrRemoved: Entity.EntityChanged;
        _cachedUpdateGroupsComponentReplaced: Entity.ComponentReplaced;
        _cachedOnEntityReleased: Entity.EntityReleased;
        constructor(components: {}, totalComponents: number, startCreationIndex?: number);
        createEntity(): Entity;
        destroyEntity(entity: Entity): void;
        destroyAllEntities(): void;
        hasEntity(entity: Entity): boolean;
        getEntities(matcher?: IMatcher): Entity[];
        getGroup(matcher: IMatcher): Group;
        protected updateGroupsComponentAddedOrRemoved: (entity: Entity, index: number, component: IComponent) => void;
        protected updateGroupsComponentReplaced: (entity: Entity, index: number, previousComponent: IComponent, newComponent: IComponent) => void;
        protected onEntityReleased: (entity: Entity) => void;
        /** PoolExtension::createSystem */
        createSystem(system: ISystem): any;
        createSystem(system: Function): any;
        /** PoolExtension::setPool */
        static setPool(system: ISystem, pool: Pool): void;
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
