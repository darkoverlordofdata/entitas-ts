module entitas.exceptions {
  "use strict"

  import Exception = entitas.Exception

  export class SingleEntityException extends Exception {
    /**
     * Single Entity Exception
     * @constructor
     * @param matcher
     */
    public constructor(matcher:IMatcher) {
      super("Multiple entities exist matching " + matcher)
    }
  }
}
