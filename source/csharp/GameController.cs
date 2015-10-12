using UnityEngine;
using Entitas;
using Entitas.Unity.VisualDebugging;

public class GameController : MonoBehaviour {

    Systems _systems;

    void Start() {
        Random.seed = 42;

        _systems = createSystems(Pools.core);
        _systems.Initialize();
    }

    void Update() {
        _systems.Execute();
    }

    Systems createSystems(Pool pool) {
        #if (UNITY_EDITOR)
        return new DebugSystems()
        #else
        return new Systems()
        #endif

            // Initialize
            .Add(pool.CreateSystem<CreatePlayerSystem>())
            .Add(pool.CreateSystem<CreateOpponentsSystem>())
            .Add(pool.CreateSystem<CreateFinishLineSystem>())

            // Input
            .Add(pool.CreateSystem<InputSystem>())

            // Update
            .Add(pool.CreateSystem<AccelerateSystem>())
            .Add(pool.CreateSystem<MoveSystem>())
            .Add(pool.CreateSystem<ReachedFinishSystem>())

            // Render
            .Add(pool.CreateSystem<RemoveViewSystem>())
            .Add(pool.CreateSystem<AddViewSystem>())
            .Add(pool.CreateSystem<RenderPositionSystem>())

            // Destroy
            .Add(pool.CreateSystem<DestroySystem>());
    }
}
