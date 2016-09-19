module entitas.exceptions {
  "use strict"

  import Exception = entitas.Exception

  export class MatcherException extends Exception {
    /**
     * Matcher Exception
     * @constructor
     * @param matcher
     */
    public constructor(matcher:IMatcher) {
      super("matcher.indices.length must be 1 but was " + matcher.indices.length)
    }
  }
}
