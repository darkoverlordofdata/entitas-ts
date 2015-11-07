module entitas {

  export class Exception {
    /** @type {string} */
    public message:string;
    constructor(message) {
      this.message = message;
    }
    /** @return {string} */
    public toString():string {
      return this.message;
    }
  }

  export class EntityAlreadyHasComponentException extends Exception {
    /**
     * Entity Already Has Component Exception
     * @constructor
     * @param message
     * @param index
     */
    public constructor(message:string, index:number) {
      super(message + "\nEntity already has a component at index " + index);
    }
  }

  export class EntityDoesNotHaveComponentException extends Exception {
    /**
     * Entity Does Not Have Component Exception
     * @constructor
     * @param message
     * @param index
     */
    public constructor(message:string, index:number) {
      super(message + "\nEntity does not have a component at index " + index);
    }
  }

  export class EntityIsNotEnabledException extends Exception {
    /**
     * Entity Is Not Enabled Exception
     * @constructor
     * @param message
     */
    public constructor(message:string) {
      super(message + "\nEntity is not enabled");
    }
  }

  export class EntityIsAlreadyReleasedException extends Exception {
    /**
     * Entity Is Already Released Exception
     * @constructor
     */
    public constructor() {
      super("Entity is already released!");
    }
  }

  export class SingleEntityException extends Exception {
    /**
     * Single Entity Exception
     * @constructor
     * @param matcher
     */
    public constructor(matcher:IMatcher) {
      super("Multiple entities exist matching " + matcher);
    }
  }

  export class GroupObserverException extends Exception {
    /**
     * Group Observer Exception
     * @constructor
     * @param message
     */
    public constructor(message:string) {
      super(message);
    }
  }

  export class PoolDoesNotContainEntityException extends Exception {
    /**
     * Pool Does Not Contain Entity Exception
     * @constructor
     * @param entity
     * @param message
     */
    public constructor(entity:Entity, message:string) {
      super(message + "\nPool does not contain entity " + entity);
    }
  }

  export class EntityIsNotDestroyedException extends Exception {
    /**
     * Entity Is Not Destroyed Exception
     * @constructor
     * @param message
     */
    public constructor(message:string) {
      super(message + "\nEntity is not destroyed yet!");
    }
  }

  export class MatcherException extends Exception {
    /**
     * Matcher Exception
     * @constructor
     * @param matcher
     */
    public constructor(matcher:IMatcher) {
      super("matcher.indices.length must be 1 but was " + matcher.indices.length);
    }
  }
}
