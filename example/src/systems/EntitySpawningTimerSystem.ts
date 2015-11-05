module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import IInitializeSystem = entitas.IInitializeSystem;
  import ISetPool = entitas.ISetPool;
  import Rnd = bosco.utils.Rnd;
  import Timer = bosco.utils.Timer;

  export class EntitySpawningTimerSystem implements IExecuteSystem, IInitializeSystem, ISetPool {

    protected pool:Pool;
    private timer1:Timer;
    private timer2:Timer;
    private timer3:Timer;

    public execute() {
      var rnd = Math.random();
      if (rnd<.5) rnd = 1-rnd;
      var delta = rnd*bosco.delta;

      this.timer1.update(delta);
      this.timer2.update(delta);
      this.timer3.update(delta);
    }

    public initialize() {
      this.timer1 = new Timer(2, true);
      this.timer1.execute = () => {
        this.pool.createEnemy1();
      };

      this.timer2 = new Timer(6, true);
      this.timer2.execute = () => {
        this.pool.createEnemy2();
      };

      this.timer3 = new Timer(12, true);
      this.timer3.execute = () => {
        this.pool.createEnemy3();
      };

    }

    public setPool(pool:Pool) {
      this.pool = pool;
    }

  }
}