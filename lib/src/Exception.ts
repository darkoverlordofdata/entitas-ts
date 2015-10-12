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
}