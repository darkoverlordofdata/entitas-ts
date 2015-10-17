module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import ISetPool = entitas.ISetPool;
  import IMatcher = entitas.IMatcher;
  import IComponent = entitas.IComponent;
  import CoreMatcher = entitas.CoreMatcher;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IEnsureComponents = entitas.IEnsureComponents;
  import IMultiReactiveSystem = entitas.IMultiReactiveSystem;

  /**
   *
   */
  declare var viewContainer;

  export class RemoveViewSystem implements IMultiReactiveSystem, ISetPool, IEnsureComponents {

    public get triggers():TriggerOnEvent[] {
      return [
        <TriggerOnEvent>CoreMatcher.Resource.onEntityRemoved(),
        <TriggerOnEvent>(<Matcher>Matcher.allOf(CoreMatcher.Resource, CoreMatcher.Destroy)).onEntityAdded()
      ];
    }

    public get ensureComponents():IMatcher {
      return CoreMatcher.View;
    }


    public setPool(pool:Pool) {
      pool.getGroup(CoreMatcher.View).onEntityRemoved.add(this.onEntityRemoved);
    }

    protected onEntityRemoved(group:Group, entity:Entity, index:number, component:IComponent) {
      viewContainer.removeChild((<ViewComponent>component).sprite);

    }

    public execute(entities:Array<Entity>) {
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        e.removeView();
      }
    }
  }
}

