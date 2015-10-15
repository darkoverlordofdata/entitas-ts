module entitas {

  export class Exception {
    public message:string;
    constructor(message) {
      this.message = message;
    }
    public toString():string {
      return this.message;
    }
  }

  export class EntityAlreadyHasComponentException extends Exception {
    public constructor(message:string, index:number) {
      super(message + "\nEntity already has a component at index " + index);
    }
  }

  export class EntityDoesNotHaveComponentException extends Exception {
    public constructor(message:string, index:number) {
      super(message + "\nEntity does not have a component at index " + index);
    }
  }

  export class EntityIsNotEnabledException extends Exception {
    public constructor(message:string) {
      super(message + "\nEntity is not enabled");
    }
  }

  export class EntityIsAlreadyReleasedException extends Exception {
    public constructor() {
      super("Entity is already released!");
    }
  }

  export class SingleEntityException extends Exception {
    public constructor(matcher:IMatcher) {
      super("Multiple entities exist matching " + matcher);
    }
  }

  export class GroupObserverException extends Exception {
    public constructor(message:string) {
      super(message);
    }
  }

  export class PoolDoesNotContainEntityException extends Exception {
    public constructor(entity:Entity, message:string) {
      super(message + "\nPool does not contain entity " + entity);
    }
  }

  export class EntityIsNotDestroyedException extends Exception {
    public constructor(message:string) {
      super(message + "\nEntity is not destroyed yet!");
    }
  }

  export class MatcherException extends Exception {
    public constructor(matcher:IMatcher) {
      super("matcher.indices.length must be 1 but was " + matcher.indices.length);
    }
  }


}
