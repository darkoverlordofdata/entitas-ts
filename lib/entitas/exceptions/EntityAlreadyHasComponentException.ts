module entitas.exceptions {
  "use strict";

  import Exception = entitas.Exception;

  export class EntityAlreadyHasComponentException extends Exception {
    /**
     * Entity Already Has Component Exception
     * @constructor
     * @param message
     * @param index
     */
    public constructor(message:string, index:number) {
      super(message + "\nEntity already has a component at index (" + index + ") " + entitas.Pool.componentsEnum[index]);
    }
  }

}
