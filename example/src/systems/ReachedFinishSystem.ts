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
    _pool:Pool;

    public setPool(pool:Pool) {
      this._pool = pool;
    }

    public execute(entities:Array<Entity>) {
      console.log('ReachedFinishSystem::execute', entities);
      var finishLinePosY = this._pool.finishLineEntity.position.y;
      for (var i=0, l=entities.length; i<l; i++) {
        var e = entities[i];
        if (e.position.y > finishLinePosY) {
          e.isDestroy = true;
        }
      }
    }
  }
}

