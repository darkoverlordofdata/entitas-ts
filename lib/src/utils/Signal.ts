module entitas {

  export interface ISignal<T> {
    dispatch(...args:any[]):void;
    add(listener:T):void;
    clear():void;
    remove(listener:T):void;
  }

  export class Signal<T> implements ISignal<T> {
    private _listeners;
    private _context;
    private _size:number;
    private _alloc:number;

    /**
     *
     * @param context
     * @param alloc
     */
    constructor(context, alloc:number=16) {
      this._listeners = new Array(alloc);
      this._context = context;
      this._alloc = alloc;
      this._size = 0;
    }

    /**
     * Dispatch event
     * @param args
     */
    dispatch(...args:any[]):void {
      var listeners = this._listeners;
      var size = this._size;
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
      var listeners = this._listeners;
      var length = listeners.length;

      if (this._size === length) {
        listeners.length = ~~((length * 3) / 2) + 1;
      }
      listeners[this._size++] = listener;

    }

    /**
     * Remove event listener
     * @param listener
     */
    remove(listener:T):void {
      var listeners = this._listeners;
      var size = this._size;

      for (var i = 0; i < size; i++) {
        if (listener == listeners[i]) {
          for (var j = i, k = i+1; k < size; j++, k++) {
            listeners[j] = listeners[k];
          }
          listeners[--this._size] = undefined;
          return;
        }
      }

    }

    /**
     * Clear and reset to original alloc
     */
    clear():void {
      this._listeners.length = 0;
      this._listeners.length = this._alloc;
    }
  }
}
