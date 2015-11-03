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

  export class SpriteRenderSystem implements IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;

    public execute() {
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var sprite:Sprite = <Sprite>e.sprite.object;
        sprite.position.set(e.position.x, e.position.y);
      }
    }
    
    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.Position, Matcher.Sprite));
    }
  }
}