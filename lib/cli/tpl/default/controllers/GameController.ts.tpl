module {{ namespace }} {

  declare var dat;

  import Pools = {{ namespace }}.Pools;
  import Systems = entitas.Systems;

  export class GameController {

    systems:Systems;

    start() {

      var html = document.getElementsByTagName('html')[0];
      html.style.backgroundImage = 'none';


      this.systems = this.createSystems(Pools.pool);
      this.systems.initialize();

    }

    update(delta:number) {
      this.systems.execute();
    }

    createSystems(pool) {
      return new Systems()
        // Input
        .add(pool.createSystem({{ namespace }}.ProcessInputSystem))

        // Update
        .add(pool.createSystem({{ namespace }}.ScoreSystem))

        // Render
        .add(pool.createSystem({{ namespace }}.RemoveViewSystem))
        .add(pool.createSystem({{ namespace }}.AddViewSystem))
        .add(pool.createSystem({{ namespace }}.RenderPositionSystem))

        // Destroy
        .add(pool.createSystem({{ namespace }}.DestroySystem));

    }
  }
}