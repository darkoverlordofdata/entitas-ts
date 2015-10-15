module entitas {

  export interface ISignal<T> {
    dispatch(...args:any[]):void;
    add(listener:T):void;
    remove(listener:T):void;
    clear():void;
  }

  export class Signal<T> implements ISignal<T> {
    private _listeners=[];
    private _context;
    
    constructor(context) {
      this._context = context;
    }
    
    dispatch(...args:any[]):void {
      var listeners = this._listeners;
      for (var i=0, l=listeners.length; i<l; i++) {
          listeners[i].apply(this._context, args);
      }
    }

    add(listener:T):void {
      this._listeners.push(listener);
    }

    remove(listener:T):void {
      var listeners = this._listeners;
      var index  = listeners.indexOf(event);
      if (index !== -1) {
        listeners.splice(index, 1);
      }

    }

    clear():void {
      this._listeners.length = 0;      
    }
  }
}
