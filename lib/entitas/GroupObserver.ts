module entitas {

  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Component = entitas.IComponent;
  import GroupObserverException = entitas.GroupObserverException;

  export enum GroupEventType {
    OnEntityAdded,
    OnEntityRemoved,
    OnEntityAddedOrRemoved
  }

  export class GroupObserver {
    public get collectedEntities() {return this._collectedEntities;}

    private _collectedEntities = {};
    public _groups:Array<Group>;
    public _eventTypes:Array<GroupEventType>;
    public _addEntityCache:Group.GroupChanged;

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

    deactivate() {
      var e;
      for (var i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
        var group:Group = this._groups[i];

        group.onEntityAdded.remove(this._addEntityCache);
        group.onEntityRemoved.remove(this._addEntityCache);

        this.clearCollectedEntities();
      }

    }
    clearCollectedEntities() {
      for (var e in this._collectedEntities) {
        this._collectedEntities[e].release();
      }
      this._collectedEntities = {};
    }

    addEntity = (group:Group, entity:Entity, index:number, component:Component) => {
      if (!(entity.creationIndex in this._collectedEntities)) {
        this._collectedEntities[entity.creationIndex] = entity;
        entity.addRef();
      }
    }
  }
}