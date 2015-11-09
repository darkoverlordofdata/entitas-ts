/**
 * Inspired by Unity
 */
module entitas.browser {

  declare var dat;
  declare var example;

  import Pool = entitas.Pool;
  import Systems = entitas.Systems;
  import Stopwatch = entitas.utils.Stopwatch;
  import EntityBehavior = entitas.browser.EntityBehavior;
  import SystemObserver = entitas.browser.SystemObserver;
  import PoolObserver = entitas.browser.PoolObserver;

  export var gui;
  /**
   * @class VisualDebugging
   */
  export class VisualDebugging {
    public static _controllers;
    public static _entities;
    public static _pools;
    public static _systems;

    /**
     *
     * @param pool
     */
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
          VisualDebugging._controllers[entity.id] = VisualDebugging._entities.add(proxy, proxy.name).listen();
        });

        pool.onEntityDestroyed.add((pool, entity:Entity) => {
          var controller = VisualDebugging._controllers[entity.id];
          delete VisualDebugging._controllers[entity.id];
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
}