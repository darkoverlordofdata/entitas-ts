module entitas.viewer {

  /**
   * Profiler class for Pools
   */
  export class PoolObserver {
    public get name():string {
      return "Pool"
    }

    public get Pool():string {
      return "Pool " + " (" +
        this._pool.count + " entities, " +
        this._pool.reusableEntitiesCount + " reusable, " +
        Object.keys(this._groups).length + " groups)"

    }
    public get entities():string {
      return this._pool.count
    }
    public get reusable():string {
      return this._pool.reusableEntitiesCount
    }
    protected _groups

    /**
     * @constructor
     *
     * @param _pool
     */
    constructor(protected _pool){
      this._groups = this._pool._groups
    }
  }
}