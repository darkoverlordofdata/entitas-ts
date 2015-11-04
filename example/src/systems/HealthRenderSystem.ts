module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import IComponent = entitas.IComponent;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;

  declare var viewContainer;
  import Container = PIXI.Container;
  import BitmapText = PIXI.extras.BitmapText;

  interface ILabelBMFont {
    [key: string]: BitmapText;
  }

  export class HealthRenderSystem implements IExecuteSystem, ISetPool {
    private texts:ILabelBMFont;
    protected pool:Pool;
    protected group:Group;

    constructor() {
      this.texts = {};
    }

    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.Position, Matcher.Health));
      pool.getGroup(Matcher.Enemy).onEntityAdded.add(this.onEntityAdded);
      pool.getGroup(Matcher.Enemy).onEntityRemoved.add(this.onEntityRemoved);
    }

    public execute() {
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e:Entity = entities[i];
        if (this.texts[e.id]) {
          var position:PositionComponent = e.position;
          var health:HealthComponent = e.health;
          var text:BitmapText = this.texts[e.id];

          var percentage:number = Math.round(health.health / health.maximumHealth * 100);
          text.position.set(position.x, position.y);
          text.text = `${percentage}%`;
        }
      }
    }

    protected onEntityAdded = (group:Group, e:Entity, index:number, component:IComponent) => {
      // add a text element to the sprite
      var b:BitmapText = new BitmapText('100%', {font: '20px Radio Stars', align: 'left'});
      b.scale.set(0.5, 0.5);

      viewContainer.addChild(b);
      this.texts[e.id] = b;
    };

    protected onEntityRemoved = (group:Group, e:Entity, index:number, component:IComponent) => {
      // remove the text element from the sprite
      viewContainer.removeChild(this.texts[e.id]);
      this.texts[e.id] = null;
      delete this.texts[e.id];
    };

  }
}