module example {

  declare var viewContainer;

  import Input = bosco.utils.Input;
  import Pools = example.Pools;

  export class InputController {

    start() {
      Pools.pool.replaceMouse(0, 0);
    }

    update(delta:number) {

      var pos = Input.mousePosition;

      Pools.pool.mouse.x = pos.x;
      Pools.pool.mouse.y = pos.y;
      Pools.pool.isFiring = Input.getMouseButton(0);

    }
  }
}