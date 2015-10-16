module example {

  import Pool = entitas.Pool;
  import ISetPool = entitas.ISetPool;
  import IInitializeSystem = entitas.IInitializeSystem;


  export class CreatePlayerSystem implements IInitializeSystem, ISetPool {
    pool:Pool;

    public setPool(pool:Pool) {
      this.pool = pool;
    }

    public initialize() {
      this.pool.createEntity()
        .addResource("Player")
        .addPosition(100, 0, 0)
        .addMove(0, 25)
        .setAcceleratable(true);
    }
  }

}