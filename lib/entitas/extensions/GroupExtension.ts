module entitas.extensions {

  import Entity = entitas.Entity;
  import Exception = entitas.Exception;
  import GroupEventType = entitas.GroupEventType;
  import GroupObserver = entitas.GroupObserver;

  Group.prototype.createObserver = function(eventType:GroupEventType = GroupEventType.OnEntityAdded):GroupObserver {
    return new GroupObserver(this, eventType);
  }
}