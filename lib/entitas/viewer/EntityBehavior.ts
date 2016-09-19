module entitas.viewer {

  /**
   * Profiler class for Entities
   */
  export class EntityBehavior {
    public get name():string {
      return this._name
    }
    private _name:string

    /**
     * @constructor
     *
     * @param obj
     */
    constructor(protected obj) {
      if (this.obj.name) {
        this._name = this.obj.name
      } else {
        this._name = `Entity_${this.obj._creationIndex}`
      }
      Object.defineProperty(this, this._name, {get: () => this.obj.toString()})
    }
  }


}