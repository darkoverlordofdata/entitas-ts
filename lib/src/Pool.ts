module entitas {

  import Exception = entitas.Exception;
  import Entity = entitas.Entity;
  import Group = entitas.Group;
  import IMatcher = entitas.IMatcher;
  import IComponent = entitas.IComponent;


  class PoolDoesNotContainEntityException extends Exception {
    public constructor(entity:Entity, message:string) {
      super(message + "\nPool does not contain entity " + entity);
    }
  }

  class EntityIsNotDestroyedException extends Exception {
    public constructor(message:string) {
      super(message + "\nEntity is not destroyed yet!");
    }
  }

  export module Pool {
    /**
     * event delegates:
     */
    export interface PoolChanged {(pool:Pool, entity:Entity):void;}
    export interface GroupChanged {(pool:Pool, group:Group):void;}

  }

  export interface ISetPool {
    setPool(pool:Pool);
  }

  export class Pool {

    public get totalComponents():number {return this._totalComponents;}
    public get count():number {return Object.keys(this._entities).length;}
    public get reusableEntitiesCount():number {return this._reusableEntities.length;}
    public get retainedEntitiesCount():number {return Object.keys(this._retainedEntities).length;}

    public onEntityCreated:Array<Pool.PoolChanged> = [];
    public onEntityWillBeDestroyed:Array<Pool.PoolChanged> = [];
    public onEntityDestroyed:Array<Pool.PoolChanged> = [];
    public onGroupCreated:Array<Pool.GroupChanged> = [];

    public _entities = {};
    public _groups = {};
    public _groupsForIndex:Array<Array<Group>>;
    public _reusableEntities:Array<Entity> = [];
    public _retainedEntities = {};

    private _totalComponents:number = 0;
    public _creationIndex:number = 0;
    public _entitiesCache:Array<Entity>;

    public _cachedUpdateGroupsComponentAddedOrRemoved:Entity.EntityChanged;
    public _cachedUpdateGroupsComponentReplaced:Entity.ComponentReplaced;
    public _cachedOnEntityReleased:Entity.EntityReleased;

    constructor(totalComponents:number, startCreationIndex:number=0) {

      this._totalComponents = totalComponents;
      this._creationIndex = startCreationIndex;
      this._groupsForIndex = [];
      this._cachedUpdateGroupsComponentAddedOrRemoved = this.updateGroupsComponentAddedOrRemoved;
      this._cachedUpdateGroupsComponentReplaced = this.updateGroupsComponentReplaced;
      this._cachedOnEntityReleased = this.onEntityReleased;
    }

    public createEntity():Entity {
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

      for (var onEntityCreated=this.onEntityCreated, e=0; e<onEntityCreated.length; e++)
        onEntityCreated[e](this, entity);

      return entity;
    }

    public destroyEntity(entity:Entity) {
      var removed = !!this._entities[entity.creationIndex];
      if (!removed) {
        throw new PoolDoesNotContainEntityException(entity,
          "Could not destroy entity!");
      }
      this._entitiesCache = undefined;


      for (var onEntityWillBeDestroyed=this.onEntityWillBeDestroyed, e=0; e<onEntityWillBeDestroyed.length; e++)
        onEntityWillBeDestroyed[e](this, entity);

      entity.destroy();

      for (var onEntityDestroyed=this.onEntityDestroyed, e=0; e<onEntityDestroyed.length; e++)
        onEntityDestroyed[e](this, entity);

      if (entity._refCount === 1) {
        var e = entity.onEntityReleased.indexOf(this._cachedOnEntityReleased);
        if (e !== -1) entity.onEntityReleased.splice(e, 1);
        this._reusableEntities.push(entity);
      } else {
        this._retainedEntities[entity.creationIndex] = entity;
      }
      entity.release();

    }

    public destroyAllEntities() {
      var entities = this.getEntities();
      for (var i = 0, entitiesLength = entities.length; i < entitiesLength; i++) {
        this.destroyEntity(entities[i]);
      }
    }

    public hasEntity(entity:Entity):boolean {
      return !!this._entities[entity.creationIndex]
    }


    public getEntities(matcher?:IMatcher):Entity[] {
      if (matcher) {
        /** PoolExtension::getEntities */
        return this.getGroup(matcher).getEntities();
      } else {
        if (this._entitiesCache === undefined) {
          this._entitiesCache = [];
          for (var k in Object.keys(this._entities)) {
            this._entitiesCache.push(this._entities[k]);
          }
        }
        return this._entitiesCache;
      }
    }

    public getGroup(matcher:IMatcher) {
      var group:Group;

      if (!!this._groups[matcher.id]) {
        group = this._groups[matcher.id];
      } else {
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
        for (var onGroupCreated=this.onGroupCreated, e=0; e<onGroupCreated.length; e++)
          onGroupCreated[e](this, group);
      }
      return group;
    }

    protected updateGroupsComponentAddedOrRemoved = (entity:Entity, index:number, component:IComponent) => {
      var groups = this._groupsForIndex[index];
      if (groups !== undefined) {
        for (var i = 0, groupsCount = groups.length; i < groupsCount; i++) {
          groups[i].handleEntity(entity, index, component);
        }
      }
    };


    protected updateGroupsComponentReplaced = (entity:Entity, index:number, previousComponent:IComponent, newComponent:IComponent) => {
      var groups = this._groupsForIndex[index];
      if (groups !== undefined) {
        for (var i = 0, groupsCount = groups.length; i < groupsCount; i++) {
          groups[i].updateEntity(entity, index, previousComponent, newComponent);
        }
      }
    };

    protected onEntityReleased = (entity:Entity) => {
      if(entity._isEnabled){
        throw new EntityIsNotDestroyedException("Cannot release entity.");
      }
      var e = entity.onEntityReleased.indexOf(this._cachedOnEntityReleased);
      if (e !== -1) entity.onEntityReleased.splice(e, 1);
      delete this._retainedEntities[entity.creationIndex];
      this._reusableEntities.push(entity);
    };



    /** PoolExtension::createSystem */
    public createSystem(system:ISystem|Function) {
      if ('function' === typeof system) {
        var Klass:any = system;
        system = new Klass();
      }

      Pool.setPool(system, this);
      var reactiveSystem:any = system['trigger'] ? system : null;
      if (reactiveSystem != null) {
        return <any>(new ReactiveSystem(this, reactiveSystem));
      }
      var multiReactiveSystem = system['triggers'] ? system : null;
      if (multiReactiveSystem != null) {
        return new ReactiveSystem(this, multiReactiveSystem);
      }
      return system;
    }

    /** PoolExtension::setPool */
    public static setPool(system:ISystem, pool:Pool) {
      var poolSystem:ISetPool = <any>(system['setPool'] ? system : null);
      if (poolSystem != null) {
        poolSystem.setPool(pool);
      }

    }

  }
}