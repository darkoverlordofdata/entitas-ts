module entitas {

  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import ISignal = entitas.ISignal;
  import IMatcher = entitas.IMatcher;
  import ISetPool = entitas.ISetPool;
  import PoolChanged = Pool.PoolChanged;
  import IComponent = entitas.IComponent;
  import GroupChanged = Pool.GroupChanged;
  import IReactiveSystem = entitas.IReactiveSystem;
  import IMultiReactiveSystem = entitas.IMultiReactiveSystem;
  import EntityIsNotDestroyedException = entitas.EntityIsNotDestroyedException;
  import PoolDoesNotContainEntityException = entitas.PoolDoesNotContainEntityException;

  function as(obj, method1:string) {
    return method1 in obj ? obj : null;
  }
  /**
   * event delegate boilerplate:
   */
  export module Pool {

    export interface PoolChanged {(pool:Pool, entity:Entity):void;}
    export interface IPoolChanged<T> extends ISignal<T> {
      dispatch(pool:Pool, entity:Entity):void;
    }

    export interface GroupChanged {(pool:Pool, group:Group):void;}
    export interface IGroupChanged<T> extends ISignal<T> {
      dispatch(pool:Pool, group:Group):void;
    }
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

    public static componentsEnum:Object;
    public static totalComponents:number=0;

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

      this._componentsEnum = components;
      this._totalComponents = totalComponents;
      this._creationIndex = startCreationIndex;
      this._groupsForIndex = [];
      this._cachedUpdateGroupsComponentAddedOrRemoved = this.updateGroupsComponentAddedOrRemoved;
      this._cachedUpdateGroupsComponentReplaced = this.updateGroupsComponentReplaced;
      this._cachedOnEntityReleased = this.onEntityReleased;

      Pool.componentsEnum = components;
      Pool.totalComponents = totalComponents;

    }

    /**
     * groupDesc
     *
     * expand out the group tostring for better debug info
     *
     * @param group
     * @returns {string}
     */
    static groupDesc(group:Group):string {
      var s:string = group.toString();
      for (var c=Pool.totalComponents; c>-1; c--) {
        s = s.replace(''+c, Pool.componentsEnum[c]);
      }
      return s;
    }


    /**
     *
     * @param name
     */
    public createEntity(name):Entity {
      var entity = this._reusableEntities.length > 0 ? this._reusableEntities.pop() : new Entity(this._totalComponents);
      entity._isEnabled = true;
      entity.name = name;
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

    /**
     *
     * @param entity
     */
    public destroyEntity(entity:Entity) {
      if (!(entity.creationIndex in this._entities)) {
        throw new PoolDoesNotContainEntityException(entity,
          "Could not destroy entity!");
      }
      delete this._entities[entity.creationIndex];
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
      return entity.creationIndex in this._entities
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

      if (matcher.id in this._groups) {
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

      //    return method1 in obj ? obj : null;

      var reactiveSystem = as(system, 'trigger');
      if (reactiveSystem != null) {
        return new ReactiveSystem(this, reactiveSystem);
      }
      var multiReactiveSystem = as(system, 'triggers');
      if (multiReactiveSystem != null) {
        return new ReactiveSystem(this, multiReactiveSystem);
      }

      return system;
    }

    /** PoolExtension::setPool */
    public static setPool(system:ISystem, pool:Pool) {
      var poolSystem = as(system, 'setPool');
      if (poolSystem != null) {
        poolSystem.setPool(pool);
      }

    }

  }
}