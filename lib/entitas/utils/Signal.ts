module entitas.utils {

  import Bag = entitas.utils.Bag;

  export interface ISignal<T> {
    dispatch(...args:any[]):void;
    add(listener:T):void;
    clear():void;
    remove(listener:T):void;
  }

  export class Signal<T> implements ISignal<T> {
    public _listeners:Bag<T>;
    private _context;
    private _alloc:number;
    public active:boolean;

    /**
     *
     * @constructor
     * @param context
     * @param alloc
     */
    constructor(context, alloc:number=16) {
      this._listeners = new Bag<T>();
      this._context = context;
      this._alloc = alloc;
      this.active = false;
    }

    /**
     * Dispatch event
     *
     * @param $0
     * @param $1
     * @param $2
     * @param $3
     * @param $4
     */
    dispatch($0?, $1?, $2?, $3?, $4?):void {
      var listeners:Bag<T> = this._listeners;
      var size = listeners.size();
      if (size <=0 ) return; // bail early
      var context = this._context;

      for (var i = 0; i < size; i++) {
        listeners[i].call(context, $0, $1, $2, $3, $4);
      }
    }

    /**
     * Add event listener
     * @param listener
     */
    add(listener:T):void {
      this._listeners.add(listener);
      this.active = true

    }

    /**
     * Remove event listener
     * @param listener
     */
    remove(listener:T):void {
      var listeners = this._listeners;
      listeners.remove(listener);
      this.active = listeners.size() > 0;

    }

    /**
     * Clear and reset to original alloc
     */
    clear():void {
      this._listeners.clear();
      this.active = false;
    }
  }
}
