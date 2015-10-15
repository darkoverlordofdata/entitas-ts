module example {

  import IInitializeSystem = entitas.IInitializeSystem;
  import Pool = entitas.Pool;
  import ISetPool = entitas.ISetPool;


  export class CreatePlayerSystem implements IInitializeSystem, ISetPool {
    _pool:Pool;

    public setPool(pool:Pool) {
      this._pool = pool;
    }

    public initialize() {
      this._pool.createEntity()
        .addResource("Player")
        .addPosition(0, 0, 0)
        .addMove(0, 0.025)
        .setAcceleratable(true);
    }
  }

}