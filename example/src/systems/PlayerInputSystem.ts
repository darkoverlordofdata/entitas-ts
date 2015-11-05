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
          this.pool.createBullet(position.x - 27, position.y + 2);
          this.pool.createBullet(position.x + 27, position.y + 2);
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
      this.pool.createPlayer();
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
  }
}