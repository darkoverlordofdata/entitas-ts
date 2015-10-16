module example {

  import IInitializeSystem = entitas.IInitializeSystem;
  import Pool = entitas.Pool;
  import ISetPool = entitas.ISetPool;
  import Entity = entitas.Entity;

  export class CreateFinishLineSystem implements IInitializeSystem, ISetPool {
    pool:Pool;

    public setPool(pool:Pool) {
      this.pool = pool;
    }

    public initialize() {
      this.pool.createEntity()
        .setFinishLine(true)
        .addResource("Finish Line")
        .addPosition(9, 7, 0);
    }
  }

}