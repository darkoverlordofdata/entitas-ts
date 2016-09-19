module entitas.exceptions {
  "use strict"

  import Exception = entitas.Exception

  export class PoolDoesNotContainEntityException extends Exception {
    /**
     * Pool Does Not Contain Entity Exception
     * @constructor
     * @param entity
     * @param message
     */
    public constructor(entity:Entity, message:string) {
      super(message + "\nPool does not contain entity " + entity)
    }
  }
}
