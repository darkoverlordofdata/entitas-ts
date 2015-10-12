module example {

  import IReactiveSystem = entitas.IReactiveSystem;
  import IEnsureComponents = entitas.IEnsureComponents;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import CoreMatcher = entitas.CoreMatcher;
  import Pool = entitas.Pool;
  import Entity = entitas.Entity;


  export class RenderPositionSystem implements IReactiveSystem, IEnsureComponents {

    public get trigger():TriggerOnEvent {
      return Matcher.AllOf(CoreMatcher.View, CoreMatcher.Position).OnEntityAdded();
    }

    public get ensureComponents():IMatcher {
      return CoreMatcher.View;
    }


    public execute(entities:Array<Entity>) {
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var pos = e.position;
        //e.view.gameObject.transform.position = new Vector3(pos.x, pos.y, pos.z);
      }
    }


  }
}