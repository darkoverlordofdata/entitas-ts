module example {

  import Pool = entitas.Pool;
  import ISetPool = entitas.ISetPool;
  import IInitializeSystem = entitas.IInitializeSystem;

  export class CreateOpponentsSystem implements IInitializeSystem, ISetPool {
    pool:Pool;

    public setPool(pool:Pool) {
      this.pool = pool;
    }

    public initialize() {
      const resourceName = "Opponent";
      for (var i = 1; i < 10; i++) {
        var speed = (Math.random()+.5) * 2;
        this.pool.createEntity()
          .addResource(resourceName)
          .addPosition(i*100 + 100, 0, 0)
          .addMove(speed, speed);
      }
    }
  }

}