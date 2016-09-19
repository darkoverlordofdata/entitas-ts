module entitas.viewer {

  /** todo: SystemObserver track time spent in ms by system */

  /**
   * Profiler class for Systems
   */
  export class SystemObserver {
    public get name():string {
      return "Systems"
    }

    public get Systems():string {
      return "Systems " + " (" +
        this._systems._initializeSystems.length + " init, " +
        this._systems._executeSystems.length + " exe "

    }
    public get initialize():string {
      return this._systems._initializeSystems.length
    }

    public get execute():string {
      return this._systems._executeSystems.length
    }

    /**
     * @constructor
     *
     * @param _systems
     */
    constructor(protected _systems) {}
  }


}