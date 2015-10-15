declare module entitas {
    class Exception {
        message: string;
        constructor(message: any);
        toString(): string;
    }
    interface IDelegate {
        add(delegate: Function): void;
        remove(delegate: Function): void;
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
    import IComponent = entitas.IComponent;
    module Entity {
        /**
         * event delegates:
         */
        interface EntityReleased {
            (e: Entity): void;
        }
        interface EntityChanged {
            (e: Entity, index: number, component: IComponent): void;
        }
        interface ComponentReplaced {
            (e: Entity, index: number, component: IComponent, replacement: IComponent): void;
        }
        interface IEntityReleased extends IDelegate, EntityReleased {
        }
        interface IEntityChanged extends IDelegate, EntityChanged {
        }
        interface IComponentReplaced extends IDelegate, ComponentReplaced {
        }
    }
    class Entity {
        creationIndex: number;
        onEntityReleased: Entity.IEntityReleased;
        onComponentAdded: Entity.IEntityChanged;
        onComponentRemoved: Entity.IEntityChanged;
        onComponentReplaced: Entity.IComponentReplaced;
        _creationIndex: number;
        _isEnabled: boolean;
        _components: any;
        _componentsCache: any;
        _componentIndicesCache: number[];
        _toStringCache: string;
        _refCount: number;
        constructor(totalComponents?: number);
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
        retain(): Entity;
        release(): void;
    }
}
declare module entitas {
    import GroupEventType = entitas.GroupEventType;
    import Entity = entitas.Entity;
    import IMatcher = entitas.IMatcher;
    import IComponent = entitas.IComponent;
    module Group {
        /**
         * event delegates:
         */
        interface GroupChanged {
            (group: Group, entity: Entity, index: number, component: IComponent): void;
        }
        interface GroupUpdated {
            (group: Group, entity: Entity, index: number, component: IComponent, newComponent: IComponent): void;
        }
        interface IGroupChanged extends IDelegate, GroupChanged {
        }
        interface IGroupUpdated extends IDelegate, GroupUpdated {
        }
    }
    class Group {
        onEntityAdded: Group.IGroupChanged;
        onEntityRemoved: Group.IGroupChanged;
        onEntityUpdated: Group.IGroupUpdated;
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
    import IComponent = entitas.IComponent;
    module Pool {
        /**
         * event delegates:
         */
        interface PoolChanged {
            (pool: Pool, entity: Entity): void;
        }
        interface GroupChanged {
            (pool: Pool, group: Group): void;
        }
        interface IPoolChanged extends IDelegate, PoolChanged {
        }
        interface IGroupChanged extends IDelegate, GroupChanged {
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
        onEntityCreated: Pool.IPoolChanged;
        onEntityWillBeDestroyed: Pool.IPoolChanged;
        onEntityDestroyed: Pool.IPoolChanged;
        onGroupCreated: Pool.IGroupChanged;
        _entities: {};
        _groups: {};
        _groupsForIndex: Array<Array<Group>>;
        _reusableEntities: Array<Entity>;
        _retainedEntities: {};
        private _totalComponents;
        _creationIndex: number;
        _entitiesCache: Array<Entity>;
        _cachedUpdateGroupsComponentAddedOrRemoved: Entity.EntityChanged;
        _cachedUpdateGroupsComponentReplaced: Entity.ComponentReplaced;
        _cachedOnEntityReleased: Entity.EntityReleased;
        constructor(totalComponents: number, startCreationIndex?: number);
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
    import IReactiveSystem = entitas.IReactiveSystem;
    import IMultiReactiveSystem = entitas.IMultiReactiveSystem;
    import GroupObserver = entitas.GroupObserver;
    import IMatcher = entitas.IMatcher;
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
    import IInitializeSystem = entitas.IInitializeSystem;
    import IExecuteSystem = entitas.IExecuteSystem;
    import ISystem = entitas.ISystem;
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
