module example {

  import Pool = entitas.Pool;
  import Entity = entitas.Entity;
  import ISetPool = entitas.ISetPool;
  import IComponent = entitas.IComponent;
  import Matcher = entitas.Matcher;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IReactiveSystem = entitas.IReactiveSystem;

  export class DestroySystem implements IReactiveSystem, ISetPool {

    public get trigger():TriggerOnEvent {
      return Matcher.Destroy.onEntityAdded();
    }

    pool:Pool;

    public setPool(pool:Pool) {
      this.pool = pool;
    }

    public execute(entities:Array<Entity>) {
      for (var i=0, l=entities.length; i<l; i++) {
        this.pool.destroyEntity(entities[i]);
      }
    }
  }
}

