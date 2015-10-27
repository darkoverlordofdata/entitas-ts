/**
 * Inspired by Unity
 */
module entitas.browser {

  declare var dat;
  declare var example;

  import Pool = entitas.Pool;
  import Systems = entitas.Systems;
  import Stopwatch = entitas.Stopwatch;
  /** todo: SystemObserver track time spent in ms by system */

  export var gui;
  export class VisualDebugging {
    public static _controllers;
    public static _entities;
    public static _pools;
    public static _systems;

    public static init(pool:Pool) {
      if (location.search === "?debug=true" && window['dat']) {
        gui = new dat.GUI({height: 5*32-1, width: 300});

        var observer = new PoolObserver(pool);

        VisualDebugging._controllers = {};
        VisualDebugging._entities = gui.addFolder('Entities');
        VisualDebugging._pools = gui.addFolder('Pools');
        VisualDebugging._systems = gui.addFolder('Systems');

        VisualDebugging._entities.open();
        VisualDebugging._pools.open();
        VisualDebugging._systems.open();

        VisualDebugging._pools.add(observer, 'entities').listen();
        VisualDebugging._pools.add(observer, 'reusable').listen();

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

          var sys = new SystemObserver(this);
          VisualDebugging._systems.add(sys, 'initialize').listen();
          VisualDebugging._systems.add(sys, 'execute').listen();
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
   * Profiler class for Entities
   */
  export class EntityBehavior {
    public get name():string {
      return this._name;
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

  /**
   * Profiler class for Systems
   */
  export class SystemObserver {
    public get name():string {
      return "Systems";
    }

    public get Systems():string {
      return "Systems " + " (" +
        this._systems._initializeSystems.length + " init, " +
        this._systems._executeSystems.length + " exe ";

    }
    public get initialize():string {
      return this._systems._initializeSystems.length;
    }

    public get execute():string {
      return this._systems._executeSystems.length;
    }
    constructor(protected _systems) {}
  }

  /**
   * Profiler class for Pools
   */
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
    public get entities():string {
      return this._pool.count;
    }
    public get reusable():string {
      return this._pool.reusableEntitiesCount;
    }
    protected _groups;

    constructor(protected _pool){
      this._groups = this._pool._groups;
    }
  }
}