module {{ namespace }} {

  declare var viewContainer;

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import IMatcher = entitas.IMatcher;
  import Exception = entitas.Exception;
  import IComponent = entitas.IComponent;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IReactiveSystem = entitas.IReactiveSystem;
  import IEnsureComponents = entitas.IEnsureComponents;
  import ISetPool = entitas.ISetPool;

  export class RemoveViewSystem implements IReactiveSystem, ISetPool, IEnsureComponents {
    protected pool:Pool;

    public get trigger():TriggerOnEvent {
      return Matcher.Resource.onEntityRemoved();
    }

    public execute(entities:Array<Entity>) {
      for (var e of entities) {
        e.removeView();
      }
    }

    public get ensureComponents():IMatcher {
      return Matcher.View;
    }

    public setPool(pool:Pool) {
      pool.getGroup(Matcher.View).onEntityRemoved.add(this.onEntityRemoved);
    }

    protected onEntityRemoved(group:Group, entity:Entity, index:number, component:IComponent) {
      viewContainer.removeChild((<ViewComponent>component).sprite);

    }
  }

}