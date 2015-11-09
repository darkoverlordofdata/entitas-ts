module entitas.extensions {

  import Matcher = entitas.Matcher;
  import Entity = entitas.Entity;
  import Exception = entitas.Exception;
  import GroupEventType = entitas.GroupEventType;
  import GroupObserver = entitas.GroupObserver;
  import TriggerOnEvent = entitas.TriggerOnEvent;

  Matcher.prototype.onEntityAdded = function():TriggerOnEvent {
    return new TriggerOnEvent(this, GroupEventType.OnEntityAdded);
  };

  Matcher.prototype.onEntityRemoved = function():TriggerOnEvent {
    return new TriggerOnEvent(this, GroupEventType.OnEntityRemoved);
  };

  Matcher.prototype.onEntityAddedOrRemoved = function():TriggerOnEvent {
    return new TriggerOnEvent(this, GroupEventType.OnEntityAddedOrRemoved);
  };

}