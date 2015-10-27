module entitas {

  import Bag = entitas.Bag;

  export interface ISignal<T> {
    dispatch(...args:any[]):void;
    add(listener:T):void;
    clear():void;
    remove(listener:T):void;
  }

  export class Signal<T> implements ISignal<T> {
    private _listeners:Bag<T>;
    private _context;
    private _size:number;
    private _alloc:number;

    /**
     *
     * @param context
     * @param alloc
     */
    constructor(context, alloc:number=16) {
      this._listeners = new Bag<T>();
      this._context = context;
      this._alloc = alloc;
      this._size = 0;
    }

    /**
     * Dispatch event
     * @param args
     */
    dispatch(...args:any[]):void {
      var listeners:Bag<T> = this._listeners;
      var size = listeners.size();
      var context = this._context;

      for (var i = 0; i < size; i++) {
        listeners[i].apply(context, args);
      }
    }

    /**
     * Add event listener
     * @param listener
     */
    add(listener:T):void {
      this._listeners.add(listener);
    }

    /**
     * Remove event listener
     * @param listener
     */
    remove(listener:T):void {
      //var listeners = this._listeners;
      //var index = listeners.indexOf(listener);
      //if (index !== -1) listeners.splice(index, 1);

      this._listeners.remove(listener);
    }

    /**
     * Clear and reset to original alloc
     */
    clear():void {
      this._listeners.clear();
    }
  }
}
