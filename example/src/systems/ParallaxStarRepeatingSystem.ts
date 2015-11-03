module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IInitializeSystem = entitas.IInitializeSystem;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;

  export class ParallaxStarRepeatingSystem implements IInitializeSystem, IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;

    public initialize() {
    }
    
    public execute() {
      var height = bosco.config.height;
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var position:PositionComponent = e.position;

        if (position.y >= height) {
          position.y = 0;
        }
      }
    }
    
    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.ParallaxStar, Matcher.Position));
    }
    


  }
}