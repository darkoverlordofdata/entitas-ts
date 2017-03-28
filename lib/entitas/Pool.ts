module entitas {
  "use strict"

  import UUID = entitas.utils.UUID
  import Bag = entitas.utils.Bag
  import ImmutableBag = entitas.utils.ImmutableBag

  import Group = entitas.Group
  import Entity = entitas.Entity
  import Signal = entitas.utils.Signal
  import ISignal = entitas.utils.ISignal
  import IMatcher = entitas.IMatcher
  import ISetPool = entitas.ISetPool
  import PoolChanged = Pool.PoolChanged
  import IComponent = entitas.IComponent
  import GroupChanged = Pool.GroupChanged
  import IReactiveSystem = entitas.IReactiveSystem
  import IMultiReactiveSystem = entitas.IMultiReactiveSystem
  import EntityIsNotDestroyedException = entitas.exceptions.EntityIsNotDestroyedException
  import PoolDoesNotContainEntityException = entitas.exceptions.PoolDoesNotContainEntityException

  function as(obj, method1:string) {
    return method1 in obj ? obj : null
  }

  /**
   * event delegate boilerplate:
   */
  export module Pool {

    /**
     * Event PoolChanged
     *
     * Pool has changed
     */
    export interface PoolChanged { (pool: Pool, entity: Entity): void; }
    export interface IPoolChanged<T> extends ISignal<T> {
      dispatch(pool: Pool, entity: Entity): void
    }

    /**
     * Event GroupChanged
     *
     * Group has changed
     */
    export interface GroupChanged { (pool: Pool, group: Group): void; }
    export interface IGroupChanged<T> extends ISignal<T> {
      dispatch(pool: Pool, group: Group): void
    }
  }

  /**
   * A cached pool of entities and components.
   * The games world.
   */
  export class Pool {

    /**
     * The total number of components in this pool
     * @type {number}
     * @name entitas.Pool#totalComponents */
    public get totalComponents(): number { return this._totalComponents; }

    /**
     * Count of active entities
     * @type {number}
     * @name entitas.Pool#count */
    public get count(): number { return Object.keys(this._entities).length }

    /**
     * Count of entities waiting to be recycled
     * @type {number}
     * @name entitas.Pool#reusableEntitiesCount */
    public get reusableEntitiesCount(): number { return this._reusableEntities.size() }

    /**
     * Count of entities that sill have references
     * @type {number}
     * @name entitas.Pool#retainedEntitiesCount */
    public get retainedEntitiesCount(): number { return Object.keys(this._retainedEntities).length }

    /**
     * Subscribe to Entity Created Event
     * @type {entitas.utils.ISignal} */
    public onEntityCreated: Pool.IPoolChanged<PoolChanged> = null

    /**
     * Subscribe to Entity Will Be Destroyed Event
     * @type {entitas.utils.ISignal} */
    public onEntityWillBeDestroyed: Pool.IPoolChanged<PoolChanged> = null

    /**
     * Subscribe to Entity Destroyed Event
     * @type {entitas.utils.ISignal} */
    public onEntityDestroyed: Pool.IPoolChanged<PoolChanged> = null

    /**
     * Subscribe to Group Created Event
     * @type {entitas.utils.ISignal} */
    public onGroupCreated: Pool.IGroupChanged<GroupChanged> = null

    /**
     * Entity name for debugging
     * @type {string} */
    public name: string = ''

    /**
     * An enum of valid component types
     * @type {Object<string,number>} */
    public static componentsEnum: Object = null

    /**
     * Count of components
     * @type {number} */
    public static totalComponents: number = 0

    /**
     * Global reference to pool instance
     * @type {entitas.Pool} */
    public static instance: Pool = null

    public _debug: boolean = false
    public _entities = {}
    public _groups = {}
    public _groupsForIndex: Bag<Bag<Group>> = null
    public _reusableEntities: Bag<Entity> = new Bag<Entity>()
    public _retainedEntities = {}
    public _componentsEnum: Object = null
    public _totalComponents: number = 0
    public _creationIndex: number = 0
    public _entitiesCache: Array<Entity> = null
    public _cachedUpdateGroupsComponentAddedOrRemoved: Entity.EntityChanged
    public _cachedUpdateGroupsComponentReplaced: Entity.ComponentReplaced
    public _cachedOnEntityReleased: Entity.EntityReleased

    // public getEntities(matcher: IMatcher): Entity[];
    // public getEntities(): Entity[];
    // public createSystem(system: ISystem);
    // public createSystem(system: Function);
    
    /**
     * Set the system pool if supported
     * 
     * @static
     * @param {entitas.ISystem} system
     * @param {entitas.Pool} pool
     */
    public static setPool(system: ISystem, pool: Pool) {
      const poolSystem = as(system, 'setPool')
      if (poolSystem != null) {
        poolSystem.setPool(pool)
      }
    }

    /**
     * @constructor
     * @param {Object} components
     * @param {number} totalComponents
     * @param {number} startCreationIndex
     */
    constructor(components: {}, totalComponents: number, debug:boolean = false, startCreationIndex: number = 0) {
      Pool.instance = this
      this.onGroupCreated = new Signal<GroupChanged>(this)
      this.onEntityCreated = new Signal<PoolChanged>(this)
      this.onEntityDestroyed = new Signal<PoolChanged>(this)
      this.onEntityWillBeDestroyed = new Signal<PoolChanged>(this)

      this._debug = debug
      this._componentsEnum = components
      this._totalComponents = totalComponents
      this._creationIndex = startCreationIndex
      this._groupsForIndex = new Bag<Bag<Group>>()
      this._cachedUpdateGroupsComponentAddedOrRemoved = this.updateGroupsComponentAddedOrRemoved
      this._cachedUpdateGroupsComponentReplaced = this.updateGroupsComponentReplaced
      this._cachedOnEntityReleased = this.onEntityReleased
      Pool.componentsEnum = components
      Pool.totalComponents = totalComponents

    }

    /**
     * Create a new entity
     * @param {string} name
     * @returns {entitas.Entity}
     */
    public createEntity(name: string): Entity {
      const entity = this._reusableEntities.size() > 0 ? this._reusableEntities.removeLast() : new Entity(this._componentsEnum, this._totalComponents)
      entity._isEnabled = true
      entity.name = name
      entity._creationIndex = this._creationIndex++
      entity.id = UUID.randomUUID()
      entity.addRef()
      this._entities[entity.id] = entity
      this._entitiesCache = null
      entity.onComponentAdded.add(this._cachedUpdateGroupsComponentAddedOrRemoved)
      entity.onComponentRemoved.add(this._cachedUpdateGroupsComponentAddedOrRemoved)
      entity.onComponentReplaced.add(this._cachedUpdateGroupsComponentReplaced)
      entity.onEntityReleased.add(this._cachedOnEntityReleased)

      const onEntityCreated: any = this.onEntityCreated
      if (onEntityCreated.active) onEntityCreated.dispatch(this, entity)
      return entity
    }

    /**
     * Destroy an entity
     * @param {entitas.Entity} entity
     */
    public destroyEntity(entity: Entity) {
      if (!(entity.id in this._entities)) {
        throw new PoolDoesNotContainEntityException(entity,
          "Could not destroy entity!")
      }
      delete this._entities[entity.id]
      this._entitiesCache = null
      const onEntityWillBeDestroyed: any = this.onEntityWillBeDestroyed
      if (onEntityWillBeDestroyed.active) onEntityWillBeDestroyed.dispatch(this, entity)
      entity.destroy()

      const onEntityDestroyed: any = this.onEntityDestroyed
      if (onEntityDestroyed.active) onEntityDestroyed.dispatch(this, entity)

      if (entity._refCount === 1) {
        entity.onEntityReleased.remove(this._cachedOnEntityReleased)
        this._reusableEntities.add(entity)
      } else {
        this._retainedEntities[entity.id] = entity
      }
      entity.release()

    }

    /**
     * Destroy All Entities
     */
    public destroyAllEntities() {
      const entities = this.getEntities()
      for (let i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
        this.destroyEntity(entities[i])
      }
    }

    /**
     * Check if pool has this entity
     *
     * @param {entitas.Entity} entity
     * @returns {boolean}
     */
    public hasEntity(entity: Entity): boolean {
      return entity.id in this._entities
    }

    /**
     * Gets all of the entities
     *
     * @returns {Array<entitas.Entity>}
     */
    public getEntities(matcher?:IMatcher): Entity[] {
    if (matcher) {
      /** PoolExtension::getEntities */
      return this.getGroup(matcher).getEntities()
    } else {
      if (this._entitiesCache == null) {
        const entities = this._entities
        const keys = Object.keys(entities)
        const length = keys.length
        const entitiesCache = this._entitiesCache = new Array(length)

        for (let i=0; i<length; i++) {
          entitiesCache[i] = entities[keys[i]]
        }
      }
      return this._entitiesCache
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
    public createSystem(system:any) {
      if ('function' === typeof system) {
        const Klass:any = system
        system = new Klass()
      }
  
      Pool.setPool(system, this)
  
      const reactiveSystem = as(system, 'trigger')
      if (reactiveSystem != null) {
        return new ReactiveSystem(this, reactiveSystem)
      }
      const multiReactiveSystem = as(system, 'triggers')
      if (multiReactiveSystem != null) {
        return new ReactiveSystem(this, multiReactiveSystem)
      }
  
      return system
    }

    /**
     * Gets all of the entities that match
     *
     * @param {entias.IMatcher} matcher
     * @returns {entitas.Group}
     */
    public getGroup(matcher: IMatcher):Group {
      let group: Group

      if (matcher.id in this._groups) {
        group = this._groups[matcher.id]
      } else {
        group = new Group(matcher)

        const entities = this.getEntities()
        for (let i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
          group.handleEntitySilently(entities[i])
        }
        this._groups[matcher.id] = group

        for (let i = 0, indicesLength = matcher.indices.length; i < indicesLength; i++) {
          const index = matcher.indices[i]
          if (this._groupsForIndex[index] == null) {
            this._groupsForIndex[index] = new Bag()
          }
          this._groupsForIndex[index].add(group)
        }
        const onGroupCreated: any = this.onGroupCreated
        if (onGroupCreated.active) onGroupCreated.dispatch(this, group)
      }
      return group
    }

    /**
     * @param {entitas.Entity} entity
     * @param {number} index
     * @param {entitas.IComponent} component
     */
    protected updateGroupsComponentAddedOrRemoved = (entity: Entity, index: number, component: IComponent) => {
      const groups = this._groupsForIndex[index]
      if (groups != null) {
        for (let i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
          groups[i].handleEntity(entity, index, component)
        }
      }
    }


    /**
     * @param {entitas.Entity} entity
     * @param {number} index
     * @param {entitas.IComponent} previousComponent
     * @param {entitas.IComponent} newComponent
     */
    protected updateGroupsComponentReplaced = (entity: Entity, index: number, previousComponent: IComponent, newComponent: IComponent) => {
      const groups = this._groupsForIndex[index]
      if (groups != null) {
        for (let i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
          groups[i].updateEntity(entity, index, previousComponent, newComponent)
        }
      }
    }

    /**
     * @param {entitas.Entity} entity
     */
    protected onEntityReleased = (entity: Entity) => {
      if (entity._isEnabled) {
        throw new EntityIsNotDestroyedException("Cannot release entity.")
      }
      entity.onEntityReleased.remove(this._cachedOnEntityReleased)
      delete this._retainedEntities[entity.id]
      this._reusableEntities.add(entity)
    }
  }
}
