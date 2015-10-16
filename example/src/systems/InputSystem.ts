module example {

  import IComponent = entitas.IComponent;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISetPool = entitas.ISetPool;
  import Pool = entitas.Pool;

  //[Core]
  export class InputSystem implements IExecuteSystem, ISetPool {
    _pool:Pool;

    public setPool(pool:Pool) {
      this._pool = pool;
    }

    public execute() {
      //this._pool.isAccelerating = Input.GetMouseButton(0);
    }
  }
}


