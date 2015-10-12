module example {

  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;
  import CoreMatcher = entitas.CoreMatcher;
  import Pool = entitas.Pool;

  export class MoveSystem implements IExecuteSystem, ISetPool {
    _group:Group;

    public setPool(pool:Pool) {
      this._group = pool.getGroup(Matcher.AllOf(CoreMatcher.Move, CoreMatcher.Position));
    }

    public execute() {
      var entities = this._group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var move = e.move;
        var pos = e.position;
        e.replacePosition(pos.x, pos.y + move.speed, pos.z);
      }
    }
  }

}