module example {

  import Pool = entitas.Pool;
  import Entity = entitas.Entity;
  import ISetPool = entitas.ISetPool;
  import Matcher = entitas.Matcher;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IReactiveSystem = entitas.IReactiveSystem;


  export class ReachedFinishSystem implements IReactiveSystem, ISetPool {

    public get trigger():TriggerOnEvent {
      return Matcher.Position.onEntityAdded();
    }
    pool:Pool;

    public setPool(pool:Pool) {
      this.pool = pool;
    }

    public execute(entities:Array<Entity>) {
      var finishLinePosY = this.pool.finishLineEntity.position.y*50;
      for (var i=0, l=entities.length; i<l; i++) {
        var e = entities[i];
        if (e.position.y > finishLinePosY) {
          e.isDestroy = true;
        }
      }
    }
  }
}

