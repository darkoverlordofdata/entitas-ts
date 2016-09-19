module entitas {
  "use strict"

  import Entity = entitas.Entity
  import Signal = entitas.utils.Signal
  import ISignal = entitas.utils.ISignal
  import IMatcher = entitas.IMatcher
  import IComponent = entitas.IComponent
  import GroupChanged = Group.GroupChanged
  import GroupUpdated = Group.GroupUpdated
  import GroupEventType = entitas.GroupEventType
  import SingleEntityException = entitas.exceptions.SingleEntityException

  /**
   * event delegate boilerplate:
   */
  export module Group {

    export interface GroupChanged {(group:Group, entity:Entity, index:number, component:IComponent):void;}
    export interface IGroupChanged<T> extends ISignal<T> {
      dispatch(group:Group, entity:Entity, index:number, component:IComponent):void
    }

    export interface GroupUpdated {(group:Group, entity:Entity, index:number, component:IComponent, newComponent:IComponent):void;}
    export interface IGroupUpdated<T> extends ISignal<T> {
      dispatch(group:Group, entity:Entity, index:number, component:IComponent, newComponent:IComponent):void
    }
  }

  export class Group {

    /**
     * Subscribe to Entity Addded events
     * @type {entitas.utils.ISignal} */
    public onEntityAdded:Group.IGroupChanged<GroupChanged> = null
    /**
     * Subscribe to Entity Removed events
     * @type {entitas.utils.ISignal} */
    public onEntityRemoved:Group.IGroupChanged<GroupChanged> = null
    /**
     * Subscribe to Entity Updated events
     * @type {entitas.utils.ISignal} */
    public onEntityUpdated:Group.IGroupUpdated<GroupUpdated> = null

    /**
     * Count the number of entities in this group
     * @type {number}
     * @name entitas.Group#count */
    public get count():number {return Object.keys(this._entities).length;}

    /**
     * Get the Matcher for this group
     * @type {entitas.IMatcher}
     * @name entitas.Group#matcher */
    public get matcher():IMatcher {return this._matcher;}

    private _entities = {}
    private _matcher:IMatcher = null
    public _entitiesCache:Array<Entity> = null
    public _singleEntityCache:Entity = null
    public _toStringCache:string = ''

    /**
     * @constructor
     * @param matcher
     */
    constructor(matcher:IMatcher) {
      this._entities = {}
      this.onEntityAdded = new Signal<GroupChanged>(this)
      this.onEntityRemoved = new Signal<GroupChanged>(this)
      this.onEntityUpdated = new Signal<GroupUpdated>(this)
      this._matcher = matcher
    }

    /**
     * Create an Observer for the event type on this group
     * @param eventType
     */
    public createObserver(eventType:GroupEventType):GroupObserver {
      if (eventType === undefined) eventType = GroupEventType.OnEntityAdded
      return new GroupObserver(this, eventType); 
    }


    /**
     * Handle adding and removing component from the entity without raising events
     * @param entity
     */
    public handleEntitySilently(entity:Entity) {
      if (this._matcher.matches(entity)) {
        this.addEntitySilently(entity)
      } else {
        this.removeEntitySilently(entity)
      }
    }

    /**
     * Handle adding and removing component from the entity and raisieevents
     * @param entity
     * @param index
     * @param component
     */
    public handleEntity(entity:Entity, index:number, component:IComponent) {
      if (this._matcher.matches(entity)) {
        this.addEntity(entity, index, component)
      } else {
        this.removeEntity(entity, index, component)
      }
    }

    /**
     * Update entity and raise events
     * @param entity
     * @param index
     * @param previousComponent
     * @param newComponent
     */
    public updateEntity(entity:Entity, index:number, previousComponent:IComponent, newComponent:IComponent) {
      if (entity.id in this._entities) {

        const onEntityRemoved:any = this.onEntityRemoved
        if (onEntityRemoved.active) onEntityRemoved.dispatch(this, entity, index, previousComponent)
        const onEntityAdded:any = this.onEntityAdded
        if (onEntityAdded.active) onEntityAdded.dispatch(this, entity, index, newComponent)
        const onEntityUpdated:any = this.onEntityUpdated
        if (onEntityUpdated.active) onEntityUpdated.dispatch(this, entity, index, previousComponent, newComponent)

      }
    }

    /**
     * Add entity without raising events
     * @param entity
     */
    public addEntitySilently(entity:Entity) {
      if (!(entity.id in this._entities)) {
        this._entities[entity.id] = entity
        this._entitiesCache = null
        this._singleEntityCache = null
        entity.addRef()
      }
    }

    /**
     * Add entity and raise events
     * @param entity
     * @param index
     * @param component
     */
    public addEntity(entity:Entity, index:number, component:IComponent) {
      if (!(entity.id in this._entities)) {
        this._entities[entity.id] = entity
        this._entitiesCache = null
        this._singleEntityCache = null
        entity.addRef()
        const onEntityAdded:any = this.onEntityAdded
        if (onEntityAdded.active) onEntityAdded.dispatch(this, entity, index, component)

      }
    }

    /**
     * Remove entity without raising events
     * @param entity
     */
    public removeEntitySilently(entity:Entity) {
      if (entity.id in this._entities) {
        delete this._entities[entity.id]
        this._entitiesCache = null
        this._singleEntityCache = null
        entity.release()
      }
    }

    /**
     * Remove entity and raise events
     * @param entity
     * @param index
     * @param component
     */
    public removeEntity(entity:Entity, index:number, component:IComponent) {
      if (entity.id in this._entities) {
        delete this._entities[entity.id]
        this._entitiesCache = null
        this._singleEntityCache = null
        let onEntityRemoved:any = this.onEntityRemoved
        if (onEntityRemoved.active) onEntityRemoved.dispatch(this, entity, index, component)
        entity.release()
      }
    }

    /**
     * Check if group has this entity
     *
     * @param entity
     * @returns boolean
     */
    public containsEntity(entity:Entity):boolean {
      return entity.id in this._entities
    }

    /**
     * Get a list of the entities in this group
     *
     * @returns Array<entitas.Entity>
     */
    public getEntities():Entity[] {
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

    /**
     * Gets an entity singleton.
     * If a group has more than 1 entity, this is an error condition.
     *
     * @returns entitas.Entity
     */
    public getSingleEntity():Entity {
      if (this._singleEntityCache == null) {
        const enumerator = Object.keys(this._entities)
        const c = enumerator.length
        if (c === 1) {
          this._singleEntityCache = this._entities[enumerator[0]]
        } else if (c === 0) {
          return null
        } else {
          throw new SingleEntityException(this._matcher)
        }
      }

      return this._singleEntityCache
    }

    /**
     * Create a string representation for this group:
     *
     *  ex: 'Group(Position)'
     *
     * @returns string
     */
    public toString():string {
      if (this._toStringCache == null) {
        this._toStringCache = "Group(" + this._matcher + ")"
      }
      return this._toStringCache
    }
  }
}