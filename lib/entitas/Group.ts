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

    public onEntityAdded:Group.IGroupChanged<GroupChanged>;
    public onEntityRemoved:Group.IGroupChanged<GroupChanged>;
    public onEntityUpdated:Group.IGroupUpdated<GroupUpdated>;

    public get count():number {return Object.keys(this._entities).length;}
    public get matcher():IMatcher {return this._matcher;}

    public _matcher:IMatcher;
    public _entities = {};
    public _entitiesCache:Array<Entity>;
    public _singleEntityCache:Entity;
    public _toStringCache:string;

    /** Extension Points */
    public createObserver(eventType:GroupEventType):GroupObserver;

    constructor(matcher:IMatcher) {
      this.onEntityAdded = new Signal<GroupChanged>(this);
      this.onEntityRemoved = new Signal<GroupChanged>(this);
      this.onEntityUpdated = new Signal<GroupUpdated>(this);
      this._matcher = matcher;
    }

    public handleEntitySilently(entity:Entity) {
      if (this._matcher.matches(entity)) {
        this.addEntitySilently(entity);
      } else {
        this.removeEntitySilently(entity);
      }
    }

    public handleEntity(entity:Entity, index:number, component:IComponent) {
      if (this._matcher.matches(entity)) {
        this.addEntity(entity, index, component);
      } else {
        this.removeEntity(entity, index, component);
      }
    }

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

    public addEntitySilently(entity:Entity) {
      if (!(entity.id in this._entities)) {
        this._entities[entity.id] = entity;
        this._entitiesCache = null;
        this._singleEntityCache = null;
        entity.addRef();
      }
    }

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

    public removeEntitySilently(entity:Entity) {
      if (entity.id in this._entities) {
        delete this._entities[entity.id];
        this._entitiesCache = null;
        this._singleEntityCache = null;
        entity.release();
      }
    }

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

    public containsEntity(entity:Entity):boolean {
      return entity.id in this._entities;
    }

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

    public toString():string {
      if (this._toStringCache == null) {
        this._toStringCache = "Group(" + this._matcher + ")";
      }
      return this._toStringCache;
    }
  }
}