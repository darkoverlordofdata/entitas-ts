module entitas {

  import Entity = entitas.Entity;
  import Group = entitas.Group;
  import IMatcher = entitas.IMatcher;
  import PoolChanged = Pool.PoolChanged;
  import IComponent = entitas.IComponent;
  import GroupChanged = Pool.GroupChanged;
  import IReactiveSystem = entitas.IReactiveSystem;
  import IMultiReactiveSystem = entitas.IMultiReactiveSystem;
  import EntityIsNotDestroyedException = entitas.EntityIsNotDestroyedException;
  import PoolDoesNotContainEntityException = entitas.PoolDoesNotContainEntityException;

  /**
   * event delegate boilerplate:
   */
  export module Pool {

    export interface PoolChanged {(pool:Pool, entity:Entity):void;}
    export interface IPoolChanged<T> extends entitas.ISignal<T> {
      dispatch(pool:Pool, entity:Entity):void;
    }

    export interface GroupChanged {(pool:Pool, group:Group):void;}
    export interface IGroupChanged<T> extends entitas.ISignal<T> {
      dispatch(pool:Pool, group:Group):void;
    }
  }

  export interface ISetPool {
    setPool(pool:Pool);
  }

  export class Pool {

    public get totalComponents():number {return this._totalComponents;}
    public get count():number {return Object.keys(this._entities).length;}
    public get reusableEntitiesCount():number {return this._reusableEntities.length;}
    public get retainedEntitiesCount():number {return Object.keys(this._retainedEntities).length;}

    public onEntityCreated:Pool.IPoolChanged<PoolChanged>;
    public onEntityWillBeDestroyed:Pool.IPoolChanged<PoolChanged>;
    public onEntityDestroyed:Pool.IPoolChanged<PoolChanged>;
    public onGroupCreated:Pool.IGroupChanged<GroupChanged>;

    public _entities = {};
    public _groups = {};
    public _groupsForIndex:Array<Array<Group>>;
    public _reusableEntities:Array<Entity> = [];
    public _retainedEntities = {};

    private _componentsEnum:Object;
    private _totalComponents:number = 0;
    public _creationIndex:number = 0;
    public _entitiesCache:Array<Entity>;

    public _cachedUpdateGroupsComponentAddedOrRemoved:Entity.EntityChanged;
    public _cachedUpdateGroupsComponentReplaced:Entity.ComponentReplaced;
    public _cachedOnEntityReleased:Entity.EntityReleased;

    constructor(components:{}, totalComponents:number, startCreationIndex:number=0) {
      this.onGroupCreated = new Signal<GroupChanged>(this);
      this.onEntityCreated = new Signal<PoolChanged>(this);
      this.onEntityDestroyed = new Signal<PoolChanged>(this);
      this.onEntityWillBeDestroyed = new Signal<PoolChanged>(this);

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
      entity.addRef();
      this._entities[entity.creationIndex] = entity;
      this._entitiesCache = undefined;
      entity.onComponentAdded.add(this._cachedUpdateGroupsComponentAddedOrRemoved);
      entity.onComponentRemoved.add(this._cachedUpdateGroupsComponentAddedOrRemoved);
      entity.onComponentReplaced.add(this._cachedUpdateGroupsComponentReplaced);
      entity.onEntityReleased.add(this._cachedOnEntityReleased);

      this.onEntityCreated.dispatch(this, entity);
      return entity;
    }

    public destroyEntity(entity:Entity) {
      var removed = !!this._entities[entity.creationIndex];
      if (!removed) {
        throw new PoolDoesNotContainEntityException(entity,
          "Could not destroy entity!");
      }
      this._entitiesCache = undefined;
      this.onEntityWillBeDestroyed.dispatch(this, entity);
      entity.destroy();

      this.onEntityDestroyed.dispatch(this, entity);

      if (entity._refCount === 1) {
        entity.onEntityReleased.remove(this._cachedOnEntityReleased);
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
          this.onGroupCreated.dispatch(this, group);
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
      console.log('updateGroupsComponentReplaced', entity);
      var groups = this._groupsForIndex[index];
      if (groups !== undefined) {
        for (var i = 0, groupsCount = groups.length; i < groupsCount; i++) {
          groups[i].updateEntity(entity, index, previousComponent, newComponent);
        }
      }
    };

    protected onEntityReleased = (entity:Entity) => {
      console.log('onEntityReleased', entity);
      if(entity._isEnabled){
        throw new EntityIsNotDestroyedException("Cannot release entity.");
      }
      entity.onEntityReleased.remove(this._cachedOnEntityReleased);
      delete this._retainedEntities[entity.creationIndex];
      this._reusableEntities.push(entity);
    };



    /** PoolExtension::createSystem */
    public createSystem(system:ISystem);
    public createSystem(system:Function);

    public createSystem(system) {
      if ('function' === typeof system) {
        var Klass:any = system;
        system = new Klass();
      }

      Pool.setPool(system, this);
      var reactiveSystem = system['trigger'] ? system : null;
      if (reactiveSystem != null) {
        return new ReactiveSystem(this, <IReactiveSystem>reactiveSystem);
      }
      var multiReactiveSystem = system['triggers'] ? system : null;
      if (multiReactiveSystem != null) {
        return new ReactiveSystem(this, <IMultiReactiveSystem>multiReactiveSystem);
      }
      return system;
    }

    /** PoolExtension::setPool */
    public static setPool(system:ISystem, pool:Pool) {
      var poolSystem:ISetPool = <ISetPool>(system['setPool'] ? system : null);
      if (poolSystem != null) {
        poolSystem.setPool(pool);
      }

    }

  }
}