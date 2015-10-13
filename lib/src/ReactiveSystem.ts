module entitas {

  import IReactiveExecuteSystem = entitas.IReactiveExecuteSystem;
  import IReactiveSystem = entitas.IReactiveSystem;
  import IMultiReactiveSystem = entitas.IMultiReactiveSystem;
  import GroupObserver = entitas.GroupObserver;
  import IMatcher = entitas.IMatcher;
  import IEnsureComponents = entitas.IEnsureComponents;
  import IExcludeComponents = entitas.IExcludeComponents;
  import IClearReactiveSystem = entitas.IClearReactiveSystem;
  import Group = entitas.Group;
  import GroupEventType = entitas.GroupEventType;

  export class ReactiveSystem implements IExecuteSystem {
    public get subsystem():entitas.IReactiveExecuteSystem {return this._subsystem;}

    private _subsystem:IReactiveExecuteSystem;
    public _observer:GroupObserver;
    public _ensureComponents:IMatcher;
    public _excludeComponents:IMatcher;
    public _clearAfterExecute:boolean;
    public _buffer:Array<Entity>;

    constructor(pool:Pool, subSystem:IReactiveSystem|IMultiReactiveSystem) {

      var triggers:Array<TriggerOnEvent> = subSystem['triggers'] ?  subSystem['triggers'] : [subSystem['trigger']];
      this._subsystem = subSystem;

      var ensureComponents:IEnsureComponents = <IEnsureComponents>(subSystem['ensureComponents'] ? <any>subSystem : null);
      if (ensureComponents != null) {
        this._ensureComponents = ensureComponents.ensureComponents;
      }
      var excludeComponents:IExcludeComponents = <IExcludeComponents>(subSystem['excludeComponents'] ? <any>subSystem : null);
      if (excludeComponents != null) {
        this._excludeComponents = excludeComponents.excludeComponents;
      }

      this._clearAfterExecute = subSystem['clearAfterExecute'];

      var triggersLength = triggers.length;
      var groups = new Array(triggersLength);
      var eventTypes = new Array(triggersLength);
      for (var i = 0; i < triggersLength; i++) {
        var trigger = triggers[i];
        groups[i] = pool.getGroup(trigger.trigger);
        eventTypes[i] = trigger.eventType;
      }
      this._observer = new GroupObserver(groups, eventTypes);
      this._buffer = [];
    }

    public activate() {
      this._observer.activate();
    }

    public deactivate() {
      this._observer.deactivate();
    }

    public clear() {
      this._observer.clearCollectedEntities();
    }


    public execute() {

      var collectedEntities = this._observer.collectedEntities;
      var ensureComponents = this._ensureComponents;
      var excludeComponents = this._excludeComponents;
      var buffer = this._buffer;


      if (Object.keys(collectedEntities).length != 0) {
        if (ensureComponents) {
          if (excludeComponents) {
            for (var k in collectedEntities) {
              var e = collectedEntities[k];
              if (ensureComponents.matches(e) && !excludeComponents.matches(e)) {
                buffer.push(e.retain());
              }
            }
          } else {
            for (var k in collectedEntities) {
              var e = collectedEntities[k];
              if (ensureComponents.matches(e)) {
                buffer.push(e.retain());
              }
            }
          }
        } else if (excludeComponents) {
          for (var k in collectedEntities) {
            var e = collectedEntities[k];
            if (!excludeComponents.matches(e)) {
              buffer.push(e.retain());
            }
          }
        } else {
          for (var k in collectedEntities) {
            var e = collectedEntities[k];
            buffer.push(e.retain());
          }
        }

        this._observer.clearCollectedEntities();
        if (buffer.length != 0) {
          this._subsystem.execute(buffer);
          for (var i = 0, bufferCount = buffer.length; i < bufferCount; i++) {
            buffer[i].release();
          }
          buffer.length = 0;
          if (this._clearAfterExecute) {
            this._observer.clearCollectedEntities();
          }
        }
      }

    }
  }
}