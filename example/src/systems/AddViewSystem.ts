module example {

  import IReactiveSystem = entitas.IReactiveSystem;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import CoreMatcher = entitas.CoreMatcher;
  import Entity = entitas.Entity;


  export class AddViewSystem implements IReactiveSystem {

    public get trigger():TriggerOnEvent {
      return CoreMatcher.Resource.onEntityAdded();
    }

    public execute(entities:Array<Entity>) {
      console.log('AddViewSystem::execute', entities);
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i]
      }
    }
  }
}
