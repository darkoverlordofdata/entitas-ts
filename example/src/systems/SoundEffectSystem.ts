module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;

  export class SoundEffectSystem implements IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;

    public execute() {
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var soundEffect:SoundEffectComponent = e.soundEffect;

        switch (soundEffect.effect) {
          case EFFECT.PEW:
            //pew.play();
            break;
          case EFFECT.ASPLODE:
            //asplode.play();
            break;
          case EFFECT.SMALLASPLODE:
            //smallasplode.play();
            break;
          default:
            break;
        }

        e.removeSoundEffect();
      }
    }
    
    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.SoundEffect));
    }
    


  }
}