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

  export class CollisionSystem implements IInitializeSystem, IExecuteSystem, ISetPool {

    protected pool: Pool;
    protected group: Group;
    protected bullets: Group;
    protected enemies: Group;
    protected collisionPairs: Array<CollisionPair>;

    public setPool(pool: Pool) {
      this.pool = pool;
    }


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

          this.pool.createSmallExplosion(x, y);
          var i = 5;
          while (--i > 0) this.pool.createParticle(x, y);

          bullet.setDestroy(true);
          health.health -= 1;
          if (health.health < 0) {
            var score: ScoreComponent = <ScoreComponent>(this.pool.score);
            this.pool.replaceScore(score.value + ship.health.maximumHealth);
            ship.setDestroy(true);
            this.pool.createBigExplosion(position.x, position.y);
          }
        }
      }));
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
