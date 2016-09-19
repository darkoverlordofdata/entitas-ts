module entitas.exceptions {
  "use strict"

  import Exception = entitas.Exception

  export class EntityIsNotEnabledException extends Exception {
    /**
     * Entity Is Not Enabled Exception
     * @constructor
     * @param message
     */
    public constructor(message:string) {
      super(message + "\nEntity is not enabled")
    }
  }
}
