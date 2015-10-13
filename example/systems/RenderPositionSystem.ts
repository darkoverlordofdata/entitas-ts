module example {

  import IReactiveSystem = entitas.IReactiveSystem;
  import IEnsureComponents = entitas.IEnsureComponents;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import Matcher = entitas.Matcher;
  import IMatcher = entitas.IMatcher;
  import CoreMatcher = entitas.CoreMatcher;
  import Pool = entitas.Pool;
  import Entity = entitas.Entity;


  export class RenderPositionSystem implements IReactiveSystem, IEnsureComponents {

    public get trigger():TriggerOnEvent {
      return (<Matcher>Matcher.allOf(CoreMatcher.View, CoreMatcher.Position)).onEntityAdded();
    }

    public get ensureComponents():IMatcher {
      return CoreMatcher.View;
    }


    public execute(entities:Array<Entity>) {
      console.log('RenderPositionSystem::execute', entities);
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var pos = e.position;
        //e.view.gameObject.transform.position = new Vector3(pos.x, pos.y, pos.z);
      }
    }


  }
}