module example {

  import IReactiveSystem = entitas.IReactiveSystem;
  import ISetPool = entitas.ISetPool;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import CoreMatcher = entitas.CoreMatcher;
  import Pool = entitas.Pool;
  import Entity = entitas.Entity;


  export class ReachedFinishSystem implements IReactiveSystem, ISetPool {

    public get trigger():TriggerOnEvent {
      return CoreMatcher.Position.onEntityAdded();
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

