module entitas.utils {
  "use strict"

  import Bag = entitas.utils.Bag

  export interface ISignal<T> {
    dispatch(...args:any[]):void
    add(listener:T):void
    clear():void
    remove(listener:T):void
  }

  export class Signal<T> implements ISignal<T> {
    public _listeners:Bag<T>
    private _context
    private _alloc:number
    public active:boolean

    /**
     *
     * @constructor
     * @param context
     * @param alloc
     */
    constructor(context, alloc:number=16) {
      this._listeners = new Bag<T>()
      this._context = context
      this._alloc = alloc
      this.active = false
    }

    /**
     * Dispatch event
     *
     * @param args list
     */
    dispatch(...args: any[]):void {
      const listeners:Bag<T> = this._listeners
      const size = listeners.size()
      if (size <= 0) return; // bail early
      const context = this._context

      for (let i = 0; i < size; i++) {
        listeners[i].apply(context, args)
      }
    }

    /**
     * Add event listener
     * @param listener
     */
    add(listener:T):void {
      this._listeners.add(listener)
      this.active = true

    }

    /**
     * Remove event listener
     * @param listener
     */
    remove(listener:T):void {
      const listeners = this._listeners
      listeners.remove(listener)
      this.active = listeners.size() > 0

    }

    /**
     * Clear and reset to original alloc
     */
    clear():void {
      this._listeners.clear()
      this.active = false
    }
  }
}
