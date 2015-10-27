module entitas.extensions {

  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Exception = entitas.Exception;
  import GroupEventType = entitas.GroupEventType;
  import GroupObserver = entitas.GroupObserver;
  import TriggerOnEvent = entitas.TriggerOnEvent;

  function as(obj, method1:string) {
    return method1 in obj ? obj : null;
  }

  Pool.prototype.getEntities = function(matcher?:IMatcher):Entity[] {
    if (matcher) {
      /** PoolExtension::getEntities */
      return this.getGroup(matcher).getEntities();
    } else {
      if (this._entitiesCache === undefined) {
        var entities = this._entities;
        var keys = Object.keys(entities);
        var length = keys.length;
        var entitiesCache = this._entitiesCache = new Array(length);

        for (var i=0; i<length; i++) {
          entitiesCache[i] = entities[keys[i]]
        }
      }
      return this._entitiesCache;
    }
  };

  Pool.prototype.createSystem = function(system) {
    if ('function' === typeof system) {
      var Klass:any = system;
      system = new Klass();
    }

    Pool.setPool(system, this);

    var reactiveSystem = as(system, 'trigger');
    if (reactiveSystem != null) {
      return new ReactiveSystem(this, reactiveSystem);
    }
    var multiReactiveSystem = as(system, 'triggers');
    if (multiReactiveSystem != null) {
      return new ReactiveSystem(this, multiReactiveSystem);
    }

    return system;
  };

  Pool.setPool = function(system:ISystem, pool:Pool) {
    var poolSystem = as(system, 'setPool');
    if (poolSystem != null) {
      poolSystem.setPool(pool);
    }

  };

}