module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;
  import Sprite = PIXI.Sprite;

  export class ColorAnimationSystem implements IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;

    public execute() {
      var delta = bosco.delta;
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var c:ColorAnimationComponent = e.colorAnimation;
        var sprite:Sprite = <Sprite>e.sprite.object;

        if(c.alphaAnimate) {
          sprite.alpha += c.alphaSpeed * delta;

          if(sprite.alpha > c.alphaMax || sprite.alpha < c.alphaMin) {
            if(c.repeat) {
              c.alphaSpeed = -c.alphaSpeed;
            } else {
              c.alphaAnimate = false;
            }
          }
        }
      }
    }
    
    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.ColorAnimation, Matcher.Sprite));
    }
    


  }
}