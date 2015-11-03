module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;

  //declare var viewContainer;

  export class ExpiringSystem implements IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;

    public execute() {
      var pool = this.pool;
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        if ((e.expires.delay -= bosco.delta) <= 0) {
          e.isDestroy = true;
          //viewContainer.removeChild(e.sprite.object);
          //pool.destroyEntity(e);
        }
      }
    }
    
    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.Expires));
    }
    


  }
}