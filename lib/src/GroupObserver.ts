module entitas {

  import Exception = entitas.Exception;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Component = entitas.IComponent;

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

      this._groups = groups[0] ? groups : [groups];
      this._eventTypes = eventTypes[0] ? eventTypes : [eventTypes];

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

          if (group.onEntityAdded.indexOf(this._addEntityCache) === -1)
            group.onEntityAdded.push(this._addEntityCache);

        } else if (eventType === GroupEventType.OnEntityRemoved) {

          if (group.onEntityRemoved.indexOf(this._addEntityCache) === -1)
            group.onEntityRemoved.push(this._addEntityCache);

        } else if (eventType === GroupEventType.OnEntityAddedOrRemoved) {

          if (group.onEntityAdded.indexOf(this._addEntityCache) === -1)
            group.onEntityAdded.push(this._addEntityCache);
          if (group.onEntityRemoved.indexOf(this._addEntityCache) === -1)
            group.onEntityRemoved.push(this._addEntityCache);
        }
      }
    }

    deactivate() {
      var e;
      for (var i = 0, groupsLength = this._groups.length; i < groupsLength; i++) {
        var group:Group = this._groups[i];

        e = group.onEntityAdded.indexOf(this._addEntityCache);
        if (e !== -1) group.onEntityAdded.splice(e,1);

        e = group.onEntityRemoved.indexOf(this._addEntityCache);
        if (e !== -1) group.onEntityRemoved.splice(e,1);

        this.clearCollectedEntities();
      }

    }
    clearCollectedEntities() {
      for (var e in this._collectedEntities) {
        this._collectedEntities[e].release();
      }
      this._collectedEntities = {};
    }

    addEntity(group:Group, entity:Entity, index:number, component:Component) {
      var added = !this._collectedEntities[entity.creationIndex];
      if (added) {
        this._collectedEntities[entity.creationIndex] = entity;
        entity.retain();
      }
    }
  }

  class GroupObserverException extends Exception {
    public constructor(message:string) {
      super(message);
    }
  }

}