module example {

  import IInitializeSystem = entitas.IInitializeSystem;
  import Pool = entitas.Pool;
  import ISetPool = entitas.ISetPool;
  import Entity = entitas.Entity;

  export class CreateFinishLineSystem implements IInitializeSystem, ISetPool {
    _pool:Pool;

    public setPool(pool:Pool) {
      this._pool = pool;
    }

    public initialize() {
      var e:Entity = <Entity>this._pool.createEntity();

      e.setFinishLine(true);
      e.addResource("Finish Line");
      e.addPosition(9, 7, 0);
    }
  }

}