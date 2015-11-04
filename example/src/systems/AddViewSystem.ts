module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;
  import IComponent = entitas.IComponent;

  declare var viewContainer;
  import Container = PIXI.Container;
  import Sprite = PIXI.Sprite;

  export class AddViewSystem implements ISetPool {

    protected pool:Pool;
    protected group:Group;

    public setPool(pool:Pool) {
      this.pool = pool;
      pool.getGroup(Matcher.Resource).onEntityAdded.add(this.onEntityAdded);
    }

    /**
     * OnEntityAdded - Resource component.
     *
     * @param group
     * @param e
     * @param index
     * @param component
     */
    protected onEntityAdded = (group:Group, e:Entity, index:number, component:IComponent) => {
      var sprite:Sprite = bosco.prefab(e.resource.name);
      var position = e.position;

      sprite.position.set(position.x, position.y);
      if (e.hasScale) {
        var scale = e.scale;
        sprite.scale.set(scale.x, scale.y);
      }
      viewContainer.addChild(sprite);
      e.addSprite(e.layer.ordinal, sprite)
    };


  }
}