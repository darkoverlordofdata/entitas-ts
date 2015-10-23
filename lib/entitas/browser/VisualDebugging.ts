module entitas.browser {

  declare var dat;
  declare var example;

  import Pool = entitas.Pool;
  import Systems = entitas.Systems;
  import Stopwatch = entitas.Stopwatch;

  export var gui;
  export class VisualDebugging {
    public static _controllers;
    public static _entities;
    public static _pools;
    public static _systems;

    public init(pool:Pool) {
      if (window['dat']) {


        gui = new dat.GUI({height: 5*32-1, width: 300});

        VisualDebugging._controllers = [];
        var observer = new PoolObserver(pool);
        VisualDebugging._pools = gui.add(observer, observer.name);
        VisualDebugging._entities = gui.addFolder('Entities');



        pool.onEntityCreated.add((pool, entity:Entity) => {
          var proxy = new EntityBehavior(entity);
          VisualDebugging._controllers[entity.creationIndex] = VisualDebugging._entities.add(proxy, proxy.name).listen();
        });

        pool.onEntityDestroyed.add((pool, entity:Entity) => {
          var controller = VisualDebugging._controllers[entity.creationIndex];
          delete VisualDebugging._controllers[entity.creationIndex];
          VisualDebugging._entities.remove(controller);
        });

        Systems.prototype.initialize = function() {
          for (var i = 0, initializeSysCount = this._initializeSystems.length; i < initializeSysCount; i++) {
            this._initializeSystems[i].initialize();
          }
          VisualDebugging._entities = gui.addFolder(this, "Systems");
        };

        function get_Systems() {
          return "Systems " + " (" +
            this._initializeSystems.length + " init, " +
            this._executeSystems.length + " exe ";
        }

        Object.defineProperty(Systems.prototype, 'name', {get: () => 'Systems'});
        Object.defineProperty(Systems.prototype, 'Systems', {get: get_Systems});


      }

    }
  }
  /**
   * Profiler
   */
  export class EntityBehavior {
    public get name():string {
      return this._name;
    }
    public get refCount():number {
      return this.obj._refCount;
    }

    private _name:string;

    constructor(protected obj) {
      if (this.obj.name) {
        this._name = this.obj.name;
      } else {
        this._name = `Entity_${this.obj._creationIndex}`;
      }
      Object.defineProperty(this, this._name, {get: () => this.obj.toString()});
    }
  }

  export class PoolObserver {
    public get name():string {
      return "Pool";
    }

    public get Pool():string {
      return "Pool " + " (" +
        this._pool.count + " entities, " +
        this._pool.reusableEntitiesCount + " reusable, " +
        Object.keys(this._groups).length + " groups)";

    }
    protected _groups;

    constructor(protected _pool){
      this._groups = this._pool._groups;
    }
  }
}