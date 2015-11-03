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

  import Sprite = PIXI.Sprite;
  import Texture = PIXI.Texture;

  declare var viewContainer;

  export class EntitySpawningTimerSystem implements IExecuteSystem, IInitializeSystem, ISetPool {

    protected pool:Pool;
    private timer1:Timer;
    private timer2:Timer;
    private timer3:Timer;
    protected cache = {};

    constructor() {
      var sprite:Sprite = new Sprite(Texture.fromFrame('enemy1.png'));
      sprite.tint = 0xff008e;
      this.cache['enemy1'] = sprite.generateTexture(bosco['renderer']);

      var sprite:Sprite = new Sprite(Texture.fromFrame('enemy2.png'));
      sprite.tint = 0xff008e;
      this.cache['enemy2'] = sprite.generateTexture(bosco['renderer']);

      var sprite:Sprite = new Sprite(Texture.fromFrame('enemy3.png'));
      sprite.tint = 0xff008e;
      this.cache['enemy3'] = sprite.generateTexture(bosco['renderer']);
    }

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
        var sprite:Sprite = new Sprite(this.cache['enemy1']);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(~~x, ~~y);
        viewContainer.addChild(sprite);
        this.pool.createEntity("Enemy1")
          .addPosition(~~x, ~~y)
          .addVelocity(0, -40)
          .addBounds(20)
          .addHealth(10, 10)
          .addSprite(Layer.ACTORS_1, sprite)
          .setEnemy(true);
      };

      this.timer2 = new Timer(6, true);
      this.timer2.execute = () => {
        var x = Rnd.nextInt(bosco.config.width);
        var y = bosco.config.height/2 - 100;
        var sprite:Sprite = new Sprite(this.cache['enemy2']);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(~~x, ~~y);
        viewContainer.addChild(sprite);
        this.pool.createEntity("Enemy2")
          .addPosition(~~x, ~~y)
          .addVelocity(0, -30)
          .addBounds(40)
          .addHealth(20, 20)
          .addSprite(Layer.ACTORS_2, sprite)
          .setEnemy(true);
      };

      this.timer3 = new Timer(12, true);
      this.timer3.execute = () => {
        var x = Rnd.nextInt(bosco.config.width);
        var y = bosco.config.height/2 - 50;
        var sprite:Sprite = new Sprite(this.cache['enemy3']);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(~~x, ~~y);
        viewContainer.addChild(sprite);
        this.pool.createEntity("Enemy3")
          .addPosition(~~x, ~~y)
          .addVelocity(0, -20)
          .addBounds(70)
          .addHealth(60, 60)
          .addSprite(Layer.ACTORS_3, sprite)
          .setEnemy(true);
      };

    }

    public setPool(pool:Pool) {
      this.pool = pool;
    }

  }
}