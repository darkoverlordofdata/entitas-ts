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
  import Container = PIXI.Container;
  import Layer = example.Layer;

  import Sprite = PIXI.Sprite;
  import Texture = PIXI.Texture;

  declare var viewContainer;

  export class PlayerInputSystem implements IExecuteSystem, IInitializeSystem, ISetPool {
    protected pool:Pool;
    protected group:Group;
    private static FireRate = .1;

    protected shoot:boolean;
    protected timeToFire:number=0;
    protected mouseVector;

    public execute() {
      var entities = this.group.getEntities();
      if (entities.length === 0) return;

      var e = entities[0];
      if (this.mouseVector === undefined) return;

      var position:PositionComponent = e.position;
      var destinationX = this.mouseVector.x;
      var destinationY = this.mouseVector.y;

      if (destinationX === undefined || destinationY === undefined) return;

      position.x = this.mouseVector.x;
      position.y = this.mouseVector.y;


      if (this.shoot) {
        if (this.timeToFire <= 0) {
          this.createBullet(position.x - 27, position.y + 2);
          this.createBullet(position.x + 27, position.y + 2);
          this.timeToFire = PlayerInputSystem.FireRate;
        }
      }
      if (this.timeToFire > 0) {
        this.timeToFire -= bosco.delta;
        if (this.timeToFire < 0) {
          this.timeToFire = 0;
        }
      }
    }

    public initialize() {
      document.addEventListener('touchstart', this.onTouchStart, true);
      document.addEventListener('touchmove', this.onTouchMove, true);
      document.addEventListener('touchend', this.onTouchEnd, true);
      document.addEventListener('mousedown', this.onTouchStart, true);
      document.addEventListener('mousemove', this.onTouchMove, true);
      document.addEventListener('mouseup', this.onTouchEnd, true);
      this.createPlayer();
    }
    
    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.Player));
    }



    protected onTouchStart = (event) => {
      event = event.changedTouches ? event.changedTouches[0] : event;
      this.shoot = true;
      this.mouseVector = {
        x: parseInt(event.clientX),
        y: parseInt(event.clientY)
      };
      return true;
    };

    protected onTouchMove = (event) => {
      event = event.changedTouches ? event.changedTouches[0] : event;
      this.mouseVector = {
        x: parseInt(event.clientX),
        y: parseInt(event.clientY)
      };
      return true;
    };

    protected onTouchEnd = (event) => {
      this.shoot = false;
    };

    protected createPlayer() {
      var x = bosco.config.width/4;
      var y = bosco.config.height-80;

      var sprite:Sprite = bosco.prefab('fighter');
      sprite.position.set(~~x, ~~y);
      viewContainer.addChild(sprite);

      this.pool.createEntity('Player')
        .addPosition(~~x, ~~y)
        .addVelocity(0, 0)
        .addBounds(43)
        .addSprite(Layer.ACTORS_3, sprite)
        .setPlayer(true);

    }

    protected createBullet(x:number, y:number) {
      var sprite:Sprite = bosco.prefab('bullet');
      sprite.position.set(~~x, ~~y);
      viewContainer.addChild(sprite);

      this.pool.createEntity('bullet')
        .addPosition(~~x, ~~y)
        .addVelocity(0, 800)
        .addBounds(5)
        .addExpires(1)
        .addSoundEffect(EFFECT.PEW)
        .addSprite(Layer.PARTICLES, sprite)
        .setBullet(true);

    }
  }
}