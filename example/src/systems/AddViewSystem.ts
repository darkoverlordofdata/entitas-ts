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

  import Container = PIXI.Container;
  import Sprite = PIXI.Sprite;

  declare var viewContainer:Container;

  export class AddViewSystem implements ISetPool {
    protected pool:Pool;
    protected group:Group;

    /**
     * Watch for Resource Added
     *
     * @param pool
     */
    public setPool(pool:Pool) {
      this.pool = pool;
      pool.getGroup(Matcher.Resource).onEntityAdded.add(this.onEntityAdded);
    }

    /**
     * OnEntityAdded - Resource component.
     *
     * Load & configure the sprite for this resource component
     *
     * @param group
     * @param e
     * @param index
     * @param component
     */
    protected onEntityAdded = (group:Group, e:Entity, index:number, component:IComponent) => {
      var sprite:Sprite = bosco.prefab(e.resource.name, null);
      var position = e.position;

      sprite.position.set(position.x, position.y);
      if (e.hasScale) {
        var scale = e.scale;
        sprite.scale.set(scale.x, scale.y);
      }
      var layer = sprite['layer'] = e.layer.ordinal;
      var sprites = viewContainer.children;

      /**
       * Insert sprite in layer order
       */
      for (var i=0, l=sprites.length; i<l; i++) {
        if (layer <= sprites[i]['layer']) {
          viewContainer.addChildAt(sprite, i);
          e.addSprite(layer, sprite);
          return;
        }
      }
      viewContainer.addChild(sprite);
      e.addSprite(layer, sprite);
    };


  }
}