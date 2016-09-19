module entitas.exceptions {
  "use strict"

  import Exception = entitas.Exception

  export class GroupObserverException extends Exception {
    /**
     * Group Observer Exception
     * @constructor
     * @param message
     */
    public constructor(message:string) {
      super(message)
    }
  }
}
