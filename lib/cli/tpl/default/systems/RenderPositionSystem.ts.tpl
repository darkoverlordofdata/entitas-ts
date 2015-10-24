module {{ namespace }} {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IReactiveSystem = entitas.IReactiveSystem;

  export class RenderPositionSystem implements IReactiveSystem {


    public get trigger():TriggerOnEvent {
      return (<Matcher>Matcher.allOf(Matcher.View, Matcher.Position)).onEntityAdded();
    }

    public execute(entities:Array<Entity>) {
      for (var e of entities) {
        var pos = e.position;
        var w = e.view.sprite.width;
        //var x = pos.x+200;
        var x = pos.x*w;
        var y = pos.y+200; //(w*10)-(w+pos.y*w);
        var tween = new TWEEN.Tween(e.view.sprite.position);
        tween.to({x:x, y:y }, 300).start();
        e.view.sprite.animationSpeed = .1;
        e.view.sprite.play();
      }
    }



  }

}