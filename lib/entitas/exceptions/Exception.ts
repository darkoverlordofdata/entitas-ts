module entitas {
  "use strict"

  export class Exception {
    /** @type {string} */
    public message:string

    /**
     * Base exception class
     * @constructot
     * @param message
     */
    constructor(message) {
      this.message = message
    }
    /** @return {string} */
    public toString():string {
      return this.message
    }
  }
}
