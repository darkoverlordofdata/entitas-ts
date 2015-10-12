module entitas {

  import Exception = entitas.Exception;
  import Entity = entitas.Entity;
  import IMatcher = entitas.IMatcher;
  import IComponent = entitas.IComponent;

  export module Group {
    /**
     * event delegates:
     */
    export interface GroupChanged {(group:Group, entity:Entity, index:number, component:IComponent):void;}
    export interface GroupUpdated {(group:Group, entity:Entity, index:number, component:IComponent, newComponent:IComponent):void;}
  }

  export class Group {

    public onEntityAdded:Array<Group.GroupChanged> = [];
    public onEntityRemoved:Array<Group.GroupChanged> = [];
    public onEntityUpdated:Array<Group.GroupUpdated> = [];

    public get count():number {return Object.keys(this._entities).length;}
    public get matcher():IMatcher {return this._matcher;}

    private _matcher:IMatcher;
    private _entities = {};
    public _entitiesCache:Entity[];
    public _singleEntityCache:Entity;
    public _toStringCache:string;

    constructor(matcher:IMatcher) {
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
      if (this._entities[entity.creationIndex]) {

        for (var onEntityRemoved=this.onEntityRemoved, e=0; e<onEntityRemoved.length; e++)
          onEntityRemoved[e](this, entity, index, previousComponent);

        for (var onEntityAdded=this.onEntityAdded, e=0; e<onEntityAdded.length; e++)
          onEntityAdded[e](this, entity, index, newComponent);

        for (var onEntityUpdated=this.onEntityUpdated, e=0; e<onEntityUpdated.length; e++)
          onEntityUpdated[e](this, entity, index, previousComponent, newComponent);

      }
    }

    public addEntitySilently(entity:Entity) {
      var added = !this._entities[entity.creationIndex];
      if (added) {
        this._entities[entity.creationIndex] = entity;
        this._entitiesCache = undefined;
        this._singleEntityCache = undefined;
        entity.retain();
      }
    }

    public addEntity(entity:Entity, index:number, component:IComponent) {
      var added = !this._entities[entity.creationIndex];
      if (added) {
        this._entities[entity.creationIndex] = entity;
        this._entitiesCache = undefined;
        this._singleEntityCache = undefined;
        entity.retain();
        for (var onEntityAdded=this.onEntityAdded, e=0; e<onEntityAdded.length; e++)
          onEntityAdded[e](this, entity, index, component);

      }
    }

    public removeEntitySilently(entity:Entity) {
      var removed = !!this._entities[entity.creationIndex];
      if (removed) {
        delete this._entities[entity.creationIndex];
        this._entitiesCache = undefined;
        this._singleEntityCache = undefined;
        entity.release();
      }
    }

    public removeEntity(entity:Entity, index:number, component:IComponent) {
      var removed = !!this._entities[entity.creationIndex];
      if (removed) {
        delete this._entities[entity.creationIndex];
        this._entitiesCache = undefined;
        this._singleEntityCache = undefined;
        for (var onEntityRemoved=this.onEntityRemoved, e=0; e<onEntityRemoved.length; e++)
          onEntityRemoved[e](this, entity, index, component);

        entity.release();
      }
    }

    public containsEntity(entity:Entity):boolean {
      return !this._entities[entity.creationIndex];
    }

    public getEntities():Entity[] {
      if (this._entitiesCache === undefined) {
        this._entitiesCache = [];
        for (var k in Object.keys(this._entities)) {
          this._entitiesCache.push(this._entities[k]);
        }
      }
      return this._entitiesCache;
    }

    public getSingleEntity():Entity {
      if (this._singleEntityCache === undefined) {
        var enumerator = Object.keys(this._entities);
        var c = enumerator.length;
        if (c === 1) {
          this._singleEntityCache = this._entities[enumerator[0]];
        } else if (c === 0) {
          return undefined;
        } else {
          throw new SingleEntityException(this._matcher);
        }
      }

      return this._singleEntityCache;
    }

    public toString():string {
      if (this._toStringCache === undefined) {
        this._toStringCache = "Group(" + this._matcher + ")";
      }
      return this._toStringCache;
    }

    /** GroupExtension::createObserver */
    public createObserver(eventType:GroupEventType = GroupEventType.OnEntityAdded):GroupObserver {
      return new GroupObserver(this, eventType);
    }


  }

  class SingleEntityException extends Exception {
    public constructor(matcher:IMatcher) {
      super("Multiple entities exist matching " + matcher);
    }
  }

}