module entitas.extensions {

  import Entity = entitas.Entity;
  import Exception = entitas.Exception;

  export class Collection extends Array {
    constructor($0) {
      super($0);

    }
    public singleEntity():Entity {
      if (this.length !== 1) {
        throw new Exception("Expected exactly one entity but found " + this.length);
      }
      return this[0];
    }
  }
}