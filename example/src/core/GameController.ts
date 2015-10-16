module example {

  import Pools = example.Pools;
  import Systems = entitas.Systems;

  export class GameController {

    _systems:Systems;

    start() {

      this._systems = this.createSystems(Pools.core);
      this._systems.initialize();

    }

    update(delta:number) {
      this._systems.execute();
    }

    createSystems(pool) {
      return new Systems()
        // Initialize
        .add(pool.createSystem(example.CreatePlayerSystem))
        .add(pool.createSystem(example.CreateOpponentsSystem))
        .add(pool.createSystem(example.CreateFinishLineSystem))

        // Input
        .add(pool.createSystem(example.InputSystem))

        // Update
        .add(pool.createSystem(example.AccelerateSystem))
        .add(pool.createSystem(example.MoveSystem))
        .add(pool.createSystem(example.ReachedFinishSystem))

        // Render
        .add(pool.createSystem(example.RemoveViewSystem))
        .add(pool.createSystem(example.AddViewSystem))
        .add(pool.createSystem(example.RenderPositionSystem))

        // Destroy
        .add(pool.createSystem(example.DestroySystem));

    }
  }
}