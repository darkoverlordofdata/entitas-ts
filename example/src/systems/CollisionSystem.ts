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
  const Tau = Math.PI * 2;
  declare var viewContainer;

  export class CollisionSystem implements IInitializeSystem, IExecuteSystem, ISetPool {

    protected pool: Pool;
    protected group: Group;
    protected bullets: Group;
    protected enemies: Group;
    protected collisionPairs: Array<CollisionPair>;


    /**
     * Check for Collision
     */
    public execute() {
      var collisionPairs = this.collisionPairs;
      for (var i = 0, l = collisionPairs.length; l > i; i++) {
        collisionPairs[i].checkForCollisions();
      }
    }

    /**
     * Create collision handlers
     */
    public initialize() {
      this.pool.setScore(0);
      this.bullets = this.pool.getGroup(Matcher.Bullet);
      this.enemies = this.pool.getGroup(Matcher.Enemy);

      /** Check for bullets hitting enemy ship */
      this.collisionPairs = [];
      this.collisionPairs.push(new CollisionPair(this, this.bullets, this.enemies, {

        handleCollision: (bullet: Entity, ship: Entity) => {
          var bp: PositionComponent = bullet.position;
          var health: HealthComponent = ship.health;
          var position: PositionComponent = ship.position;
          var x = bp.x;
          var y = bp.y;

          this.explode("small", .1, x, y);
          var i = 5;
          while (--i > 0) this.particle(x, y);

          bullet.setDestroy(true);
          health.health -= 1;
          if (health.health < 0) {
            var score: ScoreComponent = <ScoreComponent>(this.pool.score);
            this.pool.replaceScore(score.value + ship.health.maximumHealth);
            ship.setDestroy(true);
            this.explode("big", 0.5, position.x, position.y);
          }
        }
      }));
    }

    public setPool(pool: Pool) {
      this.pool = pool;
    }

    /**
     * Create an explosion
     * @param name
     * @param size
     * @param x
     * @param y
     */
    protected explode(name: string, scale: number, x: number, y: number) {
      var sprite: Sprite = bosco.prefab('explosion');
      sprite.position.set(~~x, ~~y);
      sprite.scale.set(scale, scale);
      viewContainer.addChild(sprite);

      this.pool.createEntity(name)
        .addPosition(~~x, ~~y)
        .addExpires(0.5)
        .addSprite(Layer.PARTICLES, sprite)
        .addScaleAnimation(scale / 100, scale, -3, false, true);
    }

    /**
     * Bullet hit - create some shrapnel particles
     * @param x
     * @param y
     */
    protected particle(x: number, y: number) {
      var radians: number = Math.random() * Tau;
      var magnitude: number = Rnd.random(200);
      var velocityX = magnitude * Math.cos(radians);
      var velocityY = magnitude * Math.sin(radians);
      var scale = Rnd.random(0.5, 1);

      var sprite: Sprite = bosco.prefab('particle');
      sprite.scale.set(scale, scale);
      sprite.position.set(~~x, ~~y);
      viewContainer.addChild(sprite);

      this.pool.createEntity('particle')
        .addPosition(~~x, ~~y)
        .addVelocity(velocityX, velocityY)
        .addExpires(1)
        .addSprite(Layer.PARTICLES, sprite)
        .addColorAnimation(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, false, false, false, true, true);

    }
  }


  /**
   *
   */
  class CollisionPair {
    private groupEntitiesA: Group;
    private groupEntitiesB: Group;
    private handler: CollisionHandler;
    private cs: CollisionSystem;

    constructor(cs: CollisionSystem, group1, group2, handler: CollisionHandler) {
      this.groupEntitiesA = group1;
      this.groupEntitiesB = group2;
      this.handler = handler;
      this.cs = cs;
    }

    public checkForCollisions() {
      var handler = this.handler;
      var groupEntitiesA = this.groupEntitiesA.getEntities();
      var groupEntitiesB = this.groupEntitiesB.getEntities();
      var sizeA = groupEntitiesA.length;
      var sizeB = groupEntitiesB.length;

      for (var a = 0; sizeA > a; a++) {
        var entityA: Entity = groupEntitiesA[a];
        for (var b = 0; sizeB > b; b++) {
          var entityB: Entity = groupEntitiesB[b];
          if (this.collisionExists(entityA, entityB)) {
            handler.handleCollision(entityA, entityB);
          }
        }
      }
    }

    private collisionExists(e1: Entity, e2: Entity): boolean {

      if (e1 === null || e2 === null) return false;

      var p1: PositionComponent = e1.position;
      var p2: PositionComponent = e2.position;

      var b1: BoundsComponent = e1.bounds;
      var b2: BoundsComponent = e2.bounds;

      var a = p1.x - p2.x;
      var b = p1.y - p2.y;
      return Math.sqrt(a * a + b * b) - (b1.radius) < (b2.radius);
    }
  }

  interface CollisionHandler {
    handleCollision(a: Entity, b: Entity);
  }
}
