module example {

  import Pool = entitas.Pool;
  import Entity = entitas.Entity;
  import ISetPool = entitas.ISetPool;
  import IInitializeSystem = entitas.IInitializeSystem;

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