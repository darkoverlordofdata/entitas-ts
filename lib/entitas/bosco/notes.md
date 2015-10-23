...


      pool.onEntityCreated.add((pool, entity:Entity) => {
        var proxy = new EntityProxy(entity);
        this._controllers[entity.creationIndex] = this._entities.add(proxy, proxy.name).listen();
      });

      pool.onEntityDestroyed.add((pool, entity) => {
        var controller = this._controllers[entity.creationIndex];
        delete this._controllers[entity.creationIndex];
        this._entities.remove(controller);
      });



namespace:

entitas.bosco.visualDebugging

Entity.EntityBehavior
        void Update() {
            name = _entity.ToString();
        }

PoolObserver.PoolObserver

        public override string ToString() {
            return _entitiesContainer.name = 
                "Entities " + " (" +
                _pool.count + " entities, " +
                _pool.reusableEntitiesCount + " reusable, " +
                _groups.Count + " groups)";
        }
PoolObserver.PoolObserverBehavior
        void Update() {
            if (_poolObserver.entitiesContainer != null) {
                _poolObserver.entitiesContainer.name = _poolObserver.ToString();
            }
        }


Systems    

public class DebugSystems : Systems {
...

        void updateName() {
            if (_container != null) {
                _container.name = string.Format("{0} ({1} init, {2} exe, {3:0.###} ms)",
                    "Systems ", _initializeSystems.Count, _executeSystems.Count, _totalDuration);
            }
        }
