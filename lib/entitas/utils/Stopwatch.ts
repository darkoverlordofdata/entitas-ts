module entitas.utils {
  "use strict"

  export class Stopwatch {
    public get isRunning():boolean {
      return this._isRunning
    }
    public get startTimeStamp():number {
      return this._startTimeStamp
    }
    public get elapsed():number {
      return this._elapsed
    }

    public static isHighRes:boolean = false
    private _elapsed:number
    private _startTimeStamp:number
    private _isRunning:boolean

    constructor() {

      Stopwatch.isHighRes = performance ? true : false
      this.reset()
    }

    public start() {
      if (!this._isRunning) {
        this._startTimeStamp = Stopwatch.getTimeStamp()
        this._isRunning = true
      }
    }

    public stop() {
      if (this._isRunning) {
        this._elapsed += (Stopwatch.getTimeStamp() - this._startTimeStamp)
        this._isRunning = false
      }
    }


    public reset() {
      this._elapsed = 0
      this._startTimeStamp = 0
      this._isRunning = false
    }

    public static getTimeStamp():number {
      return Stopwatch.isHighRes ? performance.now() : Date.now()
    }


  }
}