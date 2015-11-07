module example {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import Exception = entitas.Exception;
  import IInitializeSystem = entitas.IInitializeSystem;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;

  export class SoundEffectSystem implements IInitializeSystem, IExecuteSystem, ISetPool {

    protected pool:Pool;
    protected group:Group;
    private pew;
    private asplode;
    private smallasplode;
    private playSfx:boolean=false;
    private effect;

    public setPool(pool:Pool) {
      this.pool = pool;
      this.group = pool.getGroup(Matcher.allOf(Matcher.SoundEffect));
    }


    public execute() {
      //if (!this.playSfx) return;
      var entities = this.group.getEntities();
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        var soundEffect:SoundEffectComponent = e.soundEffect;
        var sound = this.effect[soundEffect.effect];
        if (sound) sound.play();
        e.removeSoundEffect();
      }
    }

    public initialize() {
      var Howl = window['Howl'];

      this.pew = new Howl({urls:['res/sounds/pew.ogg']});
      this.asplode = new Howl({urls:['res/sounds/asplode.ogg']});
      this.smallasplode = new Howl({urls:['res/sounds/smallasplode.ogg']});

      this.effect = [];
      this.effect[Effect.PEW] = this.pew;
      this.effect[Effect.ASPLODE] = this.asplode;
      this.effect[Effect.SMALLASPLODE] = this.smallasplode;

    }
  }
}