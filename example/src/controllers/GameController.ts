module example {

  import CollisionSystem = example.CollisionSystem;
  import ColorAnimationSystem = example.ColorAnimationSystem;
  import EntitySpawningTimerSystem = example.EntitySpawningTimerSystem;
  import ExpiringSystem = example.ExpiringSystem;
  import HealthRenderSystem = example.HealthRenderSystem;
  import HudRenderSystem = example.HudRenderSystem;
  import MovementSystem = example.MovementSystem;
  import ParallaxStarRepeatingSystem = example.ParallaxStarRepeatingSystem;
  import PlayerInputSystem = example.PlayerInputSystem;
  import RemoveOffscreenShipsSystem = example.RemoveOffscreenShipsSystem;
  import ScaleAnimationSystem = example.ScaleAnimationSystem;
  import SoundEffectSystem = example.SoundEffectSystem;
  import SpriteRenderSystem = example.SpriteRenderSystem;
  import AddViewSystem = example.AddViewSystem;
  import Pools = example.Pools;
  import Systems = entitas.Systems;
  import Layer = example.Layer;

  /** PIXI.Container */
  declare var viewContainer;
  declare var stuff;

  export class GameController {

    systems:Systems;

    start() {

      this.systems = this.createSystems(Pools.pool);
      this.systems.initialize();

    }

    createSystems(pool) {
      return new Systems()
        .add(pool.createSystem(MovementSystem))
        .add(pool.createSystem(PlayerInputSystem))
        .add(pool.createSystem(SoundEffectSystem))
        .add(pool.createSystem(CollisionSystem))
        .add(pool.createSystem(ExpiringSystem))
        .add(pool.createSystem(EntitySpawningTimerSystem))
        .add(pool.createSystem(ParallaxStarRepeatingSystem))
        .add(pool.createSystem(ColorAnimationSystem))
        .add(pool.createSystem(ScaleAnimationSystem))
        .add(pool.createSystem(RemoveOffscreenShipsSystem))
        .add(pool.createSystem(SpriteRenderSystem))
        .add(pool.createSystem(AddViewSystem))
        .add(pool.createSystem(HealthRenderSystem))
        .add(pool.createSystem(HudRenderSystem))
        .add(pool.createSystem(DestroySystem));

    }

    update(delta:number) {
      this.systems.execute();
    }
  }
}
