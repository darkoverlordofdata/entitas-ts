module example {

  import IReactiveSystem = entitas.IReactiveSystem;
  import ISetPool = entitas.ISetPool;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import Group = entitas.Group;
  import Pool = entitas.Pool;
  import Entity = entitas.Entity;
  import CoreMatcher = entitas.CoreMatcher;

  export class AccelerateSystem implements IReactiveSystem, ISetPool {

    public get trigger():TriggerOnEvent {
      return CoreMatcher.Accelerating.onEntityAddedOrRemoved();
    }

    private _trigger:TriggerOnEvent;
    _group:Group;

    public setPool(pool:Pool) {
      _group = pool.getGroup(Matcher.allOf(CoreMatcher.Acceleratable, CoreMatcher.Move));
    }

    public execute(entities:Array<Entity>) {
      var accelerate = entities.SingleEntity().isAccelerating;
      var entities = this._group.getEntities();
      for (var i=0, l=entities.length; i<l; i++) {
        var move = e.move;
        var speed = accelerate ? move.maxSpeed : 0;
        e.replaceMove(speed, move.maxSpeed);
      }
    }
  }

}