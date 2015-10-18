module example {

  import Pool = entitas.Pool;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import IMatcher = entitas.IMatcher;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IReactiveSystem = entitas.IReactiveSystem;
  import IEnsureComponents = entitas.IEnsureComponents;


  export class RenderPositionSystem implements IReactiveSystem, IEnsureComponents {

    public get trigger():TriggerOnEvent {
      return (<Matcher>Matcher.allOf(Matcher.View, Matcher.Position)).onEntityAdded();
    }

    public get ensureComponents():IMatcher {
      return Matcher.View;
    }


    public execute(entities:Array<Entity>) {
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var pos = e.position;
        e.view.sprite.position.set(pos.x, pos.y);
      }
    }


  }
}