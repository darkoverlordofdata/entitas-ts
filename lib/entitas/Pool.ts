module entitas {

  import Bag = entitas.utils.Bag;
  import ImmutableBag = entitas.utils.ImmutableBag;

  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Signal = entitas.utils.Signal;
  import ISignal = entitas.utils.ISignal;
  import IMatcher = entitas.IMatcher;
  import ISetPool = entitas.ISetPool;
  import PoolChanged = Pool.PoolChanged;
  import IComponent = entitas.IComponent;
  import GroupChanged = Pool.GroupChanged;
  import IReactiveSystem = entitas.IReactiveSystem;
  import IMultiReactiveSystem = entitas.IMultiReactiveSystem;
  import EntityIsNotDestroyedException = entitas.EntityIsNotDestroyedException;
  import PoolDoesNotContainEntityException = entitas.PoolDoesNotContainEntityException;

  //function as(obj, method1:string) {
  //  return method1 in obj ? obj : null;
  //}
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
    public get reusableEntitiesCount():number {return this._reusableEntities.size();}
    public get retainedEntitiesCount():number {return Object.keys(this._retainedEntities).length;}

    public onEntityCreated:Pool.IPoolChanged<PoolChanged>;
    public onEntityWillBeDestroyed:Pool.IPoolChanged<PoolChanged>;
    public onEntityDestroyed:Pool.IPoolChanged<PoolChanged>;
    public onGroupCreated:Pool.IGroupChanged<GroupChanged>;

    public _entities = {};
    public _groups = {};
    public _groupsForIndex:Bag<Bag<Group>>;
    public _reusableEntities:Bag<Entity> = new Bag<Entity>();
    public _retainedEntities = {};

    public static componentsEnum:Object;
    public static totalComponents:number=0;

    public _componentsEnum:Object;
    public _totalComponents:number = 0;
    public _creationIndex:number = 0;
    public _entitiesCache:Array<Entity>;

    public _cachedUpdateGroupsComponentAddedOrRemoved:Entity.EntityChanged;
    public _cachedUpdateGroupsComponentReplaced:Entity.ComponentReplaced;
    public _cachedOnEntityReleased:Entity.EntityReleased;

    /** Extension Points */
    public getEntities(matcher:IMatcher):Entity[];
    public getEntities():Entity[];
    public createSystem(system:ISystem);
    public createSystem(system:Function);
    public static setPool(system:ISystem, pool:Pool);


    constructor(components:{}, totalComponents:number, startCreationIndex:number=0) {
      this.onGroupCreated = new Signal<GroupChanged>(this);
      this.onEntityCreated = new Signal<PoolChanged>(this);
      this.onEntityDestroyed = new Signal<PoolChanged>(this);
      this.onEntityWillBeDestroyed = new Signal<PoolChanged>(this);

      this._componentsEnum = components;
      this._totalComponents = totalComponents;
      this._creationIndex = startCreationIndex;
      this._groupsForIndex = new Bag<Bag<Group>>();
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
      var entity = this._reusableEntities.size() > 0 ? this._reusableEntities.removeLast() : new Entity(this._componentsEnum, this._totalComponents);
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

      var onEntityCreated:any = this.onEntityCreated;
      if (onEntityCreated.active) onEntityCreated.dispatch(this, entity);
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
      var onEntityWillBeDestroyed:any = this.onEntityWillBeDestroyed;
      if (onEntityWillBeDestroyed.active) onEntityWillBeDestroyed.dispatch(this, entity);
      entity.destroy();

      var onEntityDestroyed:any = this.onEntityDestroyed;
      if (onEntityDestroyed.active) onEntityDestroyed.dispatch(this, entity);

      if (entity._refCount === 1) {
        entity.onEntityReleased.remove(this._cachedOnEntityReleased);
        this._reusableEntities.add(entity);
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


    public getEntities():Entity[] {
      if (this._entitiesCache === undefined) {

        var entities = this._entities;
        var keys = Object.keys(entities);
        var length = keys.length;
        var entitiesCache = this._entitiesCache = new Array(length);

        for (var i=0; i<length; i++) {
          var k = keys[i];
          entitiesCache[i] = entities[k];
        }
      }
      return entitiesCache;
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
            this._groupsForIndex[index] = new Bag();
          }
          this._groupsForIndex[index].add(group);
        }
        var onGroupCreated:any = this.onGroupCreated;
        if (onGroupCreated.active) onGroupCreated.dispatch(this, group);
      }
      return group;
    }

    public updateGroupsComponentAddedOrRemoved = (entity:Entity, index:number, component:IComponent) => {
      var groups = this._groupsForIndex[index];
      if (groups !== undefined) {
        for (var i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
          groups[i].handleEntity(entity, index, component);
        }
      }
    };


    public updateGroupsComponentReplaced = (entity:Entity, index:number, previousComponent:IComponent, newComponent:IComponent) => {
      var groups = this._groupsForIndex[index];
      if (groups !== undefined) {
        for (var i = 0, groupsCount = groups.size(); i < groupsCount; i++) {
          groups[i].updateEntity(entity, index, previousComponent, newComponent);
        }
      }
    };

    public onEntityReleased = (entity:Entity) => {
      if(entity._isEnabled){
        throw new EntityIsNotDestroyedException("Cannot release entity.");
      }
      entity.onEntityReleased.remove(this._cachedOnEntityReleased);
      delete this._retainedEntities[entity.creationIndex];
      this._reusableEntities.add(entity);
    };
  }
}