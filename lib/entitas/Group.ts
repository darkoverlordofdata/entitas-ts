module entitas {

  import Entity = entitas.Entity;
  import Signal = entitas.utils.Signal;
  import ISignal = entitas.utils.ISignal;
  import IMatcher = entitas.IMatcher;
  import IComponent = entitas.IComponent;
  import GroupChanged = Group.GroupChanged;
  import GroupUpdated = Group.GroupUpdated;
  import GroupEventType = entitas.GroupEventType;
  import SingleEntityException = entitas.SingleEntityException;

  /**
   * event delegate boilerplate:
   */
  export module Group {

    export interface GroupChanged {(group:Group, entity:Entity, index:number, component:IComponent):void;}
    export interface IGroupChanged<T> extends ISignal<T> {
      dispatch(group:Group, entity:Entity, index:number, component:IComponent):void;
    }

    export interface GroupUpdated {(group:Group, entity:Entity, index:number, component:IComponent, newComponent:IComponent):void;}
    export interface IGroupUpdated<T> extends ISignal<T> {
      dispatch(group:Group, entity:Entity, index:number, component:IComponent, newComponent:IComponent):void;
    }
  }

  export class Group {

    /** @type {entitas.utils.ISignal} */
    public onEntityAdded:Group.IGroupChanged<GroupChanged>;
    /** @type {entitas.utils.ISignal} */
    public onEntityRemoved:Group.IGroupChanged<GroupChanged>;
    /** @type {entitas.utils.ISignal} */
    public onEntityUpdated:Group.IGroupUpdated<GroupUpdated>;

    /** @type {number} */
    public get count():number {return Object.keys(this._entities).length;}
    /** @type {entitas.IMatcher} */
    public get matcher():IMatcher {return this._matcher;}

    /** @type {entitas.IMatcher} */
    public _matcher:IMatcher;
    /** @type {Object<string,entitas.Entity>} */
    public _entities = {};
    /** @type {entitas.Entity<Array>} */
    public _entitiesCache:Array<Entity>;
    /** @type {entitas.Entity} */
    public _singleEntityCache:Entity;
    /** @type {string} */
    public _toStringCache:string;

    /** @type {entitas.GroupObserver} Extension Points */
    public createObserver(eventType:GroupEventType):GroupObserver;

    /**
     * @constructor
     * @param matcher
     */
    constructor(matcher:IMatcher) {
      this.onEntityAdded = new Signal<GroupChanged>(this);
      this.onEntityRemoved = new Signal<GroupChanged>(this);
      this.onEntityUpdated = new Signal<GroupUpdated>(this);
      this._matcher = matcher;
    }

    /**
     * Handle entity without raising events
     * @param entity
     */
    public handleEntitySilently(entity:Entity) {
      if (this._matcher.matches(entity)) {
        this.addEntitySilently(entity);
      } else {
        this.removeEntitySilently(entity);
      }
    }

    /**
     * Handle entity and raise events
     * @param entity
     * @param index
     * @param component
     */
    public handleEntity(entity:Entity, index:number, component:IComponent) {
      if (this._matcher.matches(entity)) {
        this.addEntity(entity, index, component);
      } else {
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
    public updateEntity(entity:Entity, index:number, previousComponent:IComponent, newComponent:IComponent) {
      if (entity.id in this._entities) {

        var onEntityRemoved:any = this.onEntityRemoved;
        if (onEntityRemoved.active) onEntityRemoved.dispatch(this, entity, index, previousComponent);
        var onEntityAdded:any = this.onEntityAdded;
        if (onEntityAdded.active) onEntityAdded.dispatch(this, entity, index, newComponent);
        var onEntityUpdated:any = this.onEntityUpdated;
        if (onEntityUpdated.active) onEntityUpdated.dispatch(this, entity, index, previousComponent, newComponent);

      }
    }

    /**
     * Add entity without raising events
     * @param entity
     */
    public addEntitySilently(entity:Entity) {
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
    public addEntity(entity:Entity, index:number, component:IComponent) {
      if (!(entity.id in this._entities)) {
        this._entities[entity.id] = entity;
        this._entitiesCache = null;
        this._singleEntityCache = null;
        entity.addRef();
        var onEntityAdded:any = this.onEntityAdded;
        if (onEntityAdded.active) onEntityAdded.dispatch(this, entity, index, component)

      }
    }

    /**
     * Remove entity without raising events
     * @param entity
     */
    public removeEntitySilently(entity:Entity) {
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
    public removeEntity(entity:Entity, index:number, component:IComponent) {
      if (entity.id in this._entities) {
        delete this._entities[entity.id];
        this._entitiesCache = null;
        this._singleEntityCache = null;
        var onEntityRemoved:any = this.onEntityRemoved;
        if (onEntityRemoved.active) onEntityRemoved.dispatch(this, entity, index, component);
        entity.release();
      }
    }

    /**
     * Check if group has this entity
     *
     * @param entity
     * @returns boolean
     */
    public containsEntity(entity:Entity):boolean {
      return entity.id in this._entities;
    }

    /**
     * Get the entities in this group
     *
     * @returns Array<entitas.Entity>
     */
    public getEntities():Entity[] {
      if (this._entitiesCache == null) {
        var entities = this._entities;
        var keys = Object.keys(entities);
        var length = keys.length;
        var entitiesCache = this._entitiesCache = new Array(length);
        for (var i=0; i<length; i++) {
          entitiesCache[i] = entities[keys[i]];
        }
      }
      return this._entitiesCache;
    }

    /**
     * Gets a single entity.
     * If a group has more than 1 entity, this is an error condition.
     *
     * @returns entitas.Entity
     */
    public getSingleEntity():Entity {
      if (this._singleEntityCache == null) {
        var enumerator = Object.keys(this._entities);
        var c = enumerator.length;
        if (c === 1) {
          this._singleEntityCache = this._entities[enumerator[0]];
        } else if (c === 0) {
          return null;
        } else {
          throw new SingleEntityException(this._matcher);
        }
      }

      return this._singleEntityCache;
    }

    /**
     *
     * @returns string
     */
    public toString():string {
      if (this._toStringCache == null) {
        this._toStringCache = "Group(" + this._matcher + ")";
      }
      return this._toStringCache;
    }
  }
}