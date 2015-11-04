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
  import Layer = example.Layer;
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

        var x = Rnd.nextInt(bosco.config.width);
        var y = bosco.config.height/2 - 200;
        this.pool.createEntity("Enemy1")
          .addBounds(20)
          .addPosition(~~x, ~~y)
          .addVelocity(0, -40)
          .addLayer(Layer.ACTORS_1)
          .addResource('enemy1')
          .addHealth(10, 10)
          .setEnemy(true);
      };

      this.timer2 = new Timer(6, true);
      this.timer2.execute = () => {

        var x = Rnd.nextInt(bosco.config.width);
        var y = bosco.config.height/2 - 100;
        this.pool.createEntity("Enemy2")
          .addBounds(40)
          .addPosition(~~x, ~~y)
          .addVelocity(0, -30)
          .addLayer(Layer.ACTORS_2)
          .addResource('enemy2')
          .addHealth(20, 20)
          .setEnemy(true);
      };

      this.timer3 = new Timer(12, true);
      this.timer3.execute = () => {

        var x = Rnd.nextInt(bosco.config.width);
        var y = bosco.config.height/2 - 50;
        this.pool.createEntity("Enemy3")
          .addBounds(70)
          .addPosition(~~x, ~~y)
          .addVelocity(0, -20)
          .addLayer(Layer.ACTORS_3)
          .addResource('enemy3')
          .addHealth(60, 60)
          .setEnemy(true);
      };

    }

    public setPool(pool:Pool) {
      this.pool = pool;
    }

  }
}