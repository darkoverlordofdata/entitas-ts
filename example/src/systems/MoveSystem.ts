module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Matcher = entitas.Matcher;
  import ISetPool = entitas.ISetPool;
  import CoreMatcher = entitas.CoreMatcher;
  import IExecuteSystem = entitas.IExecuteSystem;

  export class MoveSystem implements IExecuteSystem, ISetPool {
    group:Group;

    public setPool(pool:Pool) {
      this.group = pool.getGroup(Matcher.allOf(CoreMatcher.Move, CoreMatcher.Position));
    }

    public execute() {
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var move = e.move;
        var pos = e.position;
        e.replacePosition(pos.x, pos.y + move.speed*.5, pos.z);
      }
    }
  }

}