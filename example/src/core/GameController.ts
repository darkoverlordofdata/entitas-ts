module example {

  import Pools = example.Pools;
  import Systems = entitas.Systems;

  export class GameController {

    systems:Systems;

    start() {

      this.systems = this.createSystems(Pools.core);
      this.systems.initialize();

    }

    update(delta:number) {
      this.systems.execute();
    }

    createSystems(pool) {
      return new Systems()
        // Initialize
        .add(pool.createSystem(example.CreateFinishLineSystem))
        .add(pool.createSystem(example.CreatePlayerSystem))
        .add(pool.createSystem(example.CreateOpponentsSystem))

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