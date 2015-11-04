module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IInitializeSystem = entitas.IInitializeSystem;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;
  import Layer = example.Layer;
  import Rnd = bosco.utils.Rnd;

  import Sprite = PIXI.Sprite;
  import Texture = PIXI.Texture;
  declare var viewContainer;

  export class ParallaxStarRepeatingSystem implements IInitializeSystem, IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;

    public initialize() {
      //
      //var width = bosco.config.width;
      //var height = bosco.config.height;
      //
      //for (var i = 0; 500 > i; i++) {
      //  var x = Rnd.nextInt(width);
      //  var y = Rnd.nextInt(height);
      //
      //  var sprite:Sprite = bosco.prefab('star');
      //  sprite.alpha = Rnd.random(127);
      //  sprite.anchor.set(0.5, 0.5);
      //  sprite.position.set(~~x, ~~y);
      //  viewContainer.addChild(sprite);
      //
      //  this.pool.createEntity('star')
      //    .addPosition(~~x, ~~y)
      //    .addVelocity(0, Rnd.random(-10, -60))
      //    .addColorAnimation(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, Rnd.random(0.2, 0.7), false, false, false, true, true)
      //    .addSprite(Layer.BACKGROUND, sprite)
      //    .setParallaxStar(true);
      //
      //}
    }
    
    public execute() {
      //var height = bosco.config.height;
      //var entities = this.group.getEntities();
      //for (var i = 0, l = entities.length; i < l; i++) {
      //  var e = entities[i];
      //  var position:PositionComponent = e.position;
      //
      //  if (position.y >= height) {
      //    position.y = 0;
      //  }
      //}
    }
    
    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.ParallaxStar, Matcher.Position));
    }
  }
}