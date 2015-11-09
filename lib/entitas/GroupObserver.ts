module entitas {

  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import IComponent = entitas.IComponent;
  import GroupObserverException = entitas.exceptions.GroupObserverException;

  /**
   * Event Types
   * @readonly
   * @enum {number}
   */
  export enum GroupEventType {
    OnEntityAdded,
    OnEntityRemoved,
    OnEntityAddedOrRemoved
  }

  export class GroupObserver {

    /**
     * Entities being observed
     * @type {Object<string,entitas.Entity>}
     * @name entitas.GroupObserver#collectedEntities */
    public get collectedEntities() {return this._collectedEntities;}
    private _collectedEntities = {};

    /**
     * groups being observed
     * @type {Array<entitas.Group>} */
    protected _groups:Array<Group> = null;

    /**
     * Signal array
     * @type {Array<entitas.GroupEventType>} */
    protected _eventTypes:Array<GroupEventType> = null;

    /**
     * GroupChanged Event
     * @type {entitas.Group.GroupChanged} */
    protected _addEntityCache:Group.GroupChanged = null;


    /**
     * @constructor
     * @param {Array<entitas.Group>} groups
     * @param {number} eventTypes
     */
    constructor(groups, eventTypes) {
      this._groups = Array.isArray(groups) ? groups : [groups];
      this._eventTypes = Array.isArray(eventTypes) ? eventTypes : [eventTypes];

      if (groups.length !== eventTypes.length) {
        throw new GroupObserverException("Unbalanced count with groups (" + groups.length +
          ") and event types (" + eventTypes.length + ")");
      }
      this._collectedEntities = {};
      this._addEntityCache = this.addEntity;
      this.activate();
    }

    /**
     * Activate events
     */
    activate() {
      for (var i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
        var group:Group = this._groups[i];
        var eventType:GroupEventType = this._eventTypes[i];

        if (eventType === GroupEventType.OnEntityAdded) {

          group.onEntityAdded.remove(this._addEntityCache);
          group.onEntityAdded.add(this._addEntityCache);

        } else if (eventType === GroupEventType.OnEntityRemoved) {

          group.onEntityRemoved.remove(this._addEntityCache);
          group.onEntityRemoved.add(this._addEntityCache);

        } else if (eventType === GroupEventType.OnEntityAddedOrRemoved) {

          group.onEntityAdded.remove(this._addEntityCache);
          group.onEntityAdded.add(this._addEntityCache);
          group.onEntityRemoved.remove(this._addEntityCache);
          group.onEntityRemoved.add(this._addEntityCache);

        } else {
          throw `Invalid eventType [${typeof eventType}:${eventType}] in GroupObserver::activate`
        }
      }
    }

    /**
     * Deavtivate events
     */
    deactivate() {
      var e;
      for (var i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
        var group:Group = this._groups[i];

        group.onEntityAdded.remove(this._addEntityCache);
        group.onEntityRemoved.remove(this._addEntityCache);

        this.clearCollectedEntities();
      }

    }

    /**
     * Clear the list of entities
     */
    clearCollectedEntities() {
      for (var e in this._collectedEntities) {
        this._collectedEntities[e].release();
      }
      this._collectedEntities = {};
    }

    /**
     * Adds an entity to this observer group
     * @param group
     * @param {entitas.Entity}entity
     * @param index
     * @param {entitas.IComponent}component
     */
    addEntity = (group:Group, entity:Entity, index:number, component:IComponent) => {
      if (!(entity.id in this._collectedEntities)) {
        this._collectedEntities[entity.id] = entity;
        entity.addRef();
      }
    }
  }
}