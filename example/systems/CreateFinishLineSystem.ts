module example {

  import IInitializeSystem = entitas.IInitializeSystem;
  import Pool = entitas.Pool;
  import ISetPool = entitas.ISetPool;

  export class CreateFinishLineSystem implements IInitializeSystem, ISetPool {
    _pool:Pool;

    public setPool(pool:Pool) {
      this._pool = pool;
    }

    public initialize() {
      this._pool.createEntity()
        .setFinishLine(true)
        .addResource("Finish Line")
        .addPosition(9, 7, 0);
    }
  }

}