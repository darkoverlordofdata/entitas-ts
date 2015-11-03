module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;

  export class MovementSystem implements IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;

    public execute() {
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var delta = bosco.delta;
        e.position.x += (e.velocity.x * delta);
        e.position.y -= (e.velocity.y * delta);
        //console.log(e.name, delta, e.position.x, e.position.y, e.velocity.x, e.velocity.y);
      }
    }
    
    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.Position, Matcher.Velocity));
    }
  }
}