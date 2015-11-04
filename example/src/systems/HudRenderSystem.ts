module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import Container = PIXI.Container;
  import BitmapText = PIXI.extras.BitmapText;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import IInitializeSystem = entitas.IInitializeSystem;
  import ISetPool = entitas.ISetPool;

  declare var viewContainer;

  export class HudRenderSystem implements IInitializeSystem, IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;
    private activeEntities:BitmapText;
    private totalCreated:BitmapText;
    private totalDeleted:BitmapText;

    public initialize() {
      var font = {font: '36px Radio Stars', align: 'left'};
      this.activeEntities = new BitmapText("Active entitiez:           ", font);
      this.totalCreated = new BitmapText("Total created:          ", font);
      this.totalDeleted = new BitmapText("Total deleted:          ", font);

      this.activeEntities.scale.set(0.5);
      this.totalCreated.scale.set(0.5);
      this.totalDeleted.scale.set(0.5);

      this.activeEntities.position.set(0, 20);
      this.totalCreated.position.set(0, 40);
      this.totalDeleted.position.set(0, 60);

      viewContainer.addChild(this.activeEntities);
      viewContainer.addChild(this.totalCreated);
      viewContainer.addChild(this.totalDeleted);

    }

    public execute() {
      var pool:Pool = this.pool;
      var size:number = pool.count;
      this.activeEntities.text = "Active entities: " + size;
      this.totalCreated.text = "Total created: " + pool.reusableEntitiesCount;
      this.totalDeleted.text = "Total deleted: " + (pool._creationIndex-size);
    }

    public setPool(pool:Pool) {
      this.pool = pool;
    }



  }
}
