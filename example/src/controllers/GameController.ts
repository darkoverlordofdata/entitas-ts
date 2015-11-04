module example {

  import Pools = example.Pools;
  import Systems = entitas.Systems;

  export class GameController {

    systems:Systems;

    start() {

      this.systems = this.createSystems(Pools.pool);
      this.systems.initialize();

    }

    createSystems(pool) {
      return new Systems()
        .add(pool.createSystem(example.MovementSystem))
        .add(pool.createSystem(example.PlayerInputSystem))
        .add(pool.createSystem(example.SoundEffectSystem))
        .add(pool.createSystem(example.CollisionSystem))
        .add(pool.createSystem(example.ExpiringSystem))
        .add(pool.createSystem(example.EntitySpawningTimerSystem))
        .add(pool.createSystem(example.ParallaxStarRepeatingSystem))
        .add(pool.createSystem(example.ColorAnimationSystem))
        .add(pool.createSystem(example.ScaleAnimationSystem))
        .add(pool.createSystem(example.RemoveOffscreenShipsSystem))
        .add(pool.createSystem(example.SpriteRenderSystem))
        .add(pool.createSystem(example.AddViewSystem))
        .add(pool.createSystem(example.HealthRenderSystem))
        .add(pool.createSystem(example.HudRenderSystem))
        .add(pool.createSystem(example.DestroySystem));

    }

    update(delta:number) {
      this.systems.execute();
    }
  }
}
