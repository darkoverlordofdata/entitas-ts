module entitas {

  import IInitializeSystem = entitas.IInitializeSystem;
  import IExecuteSystem = entitas.IExecuteSystem;
  import ISystem = entitas.ISystem;
  import ReactiveSystem = entitas.ReactiveSystem;

  export enum SystemType {
    IInitializeSystem=1,          //  ::initialize()
    IExecuteSystem=2,             //  ::execute()
    IReactiveExecuteSystem=4,
    IMultiReactiveSystem=8,       //  ::triggers
    IReactiveSystem=16,           //  ::trigger
    IEnsureComponents=32,         //  ::ensureComponents
    IExcludeComponents=64,        //  ::excludeComponents
    IClearReactiveSystem=128
  }

  export class Systems implements IInitializeSystem, IExecuteSystem {

    protected _initializeSystems:Array<IInitializeSystem>;
    protected _executeSystems:Array<IExecuteSystem>;

    constructor() {
      this._initializeSystems = [];
      this._executeSystems = [];
    }

    public add(system:ISystem|Function) {

      if ('function' === typeof system) {
        var Klass:any = system;
        system = new Klass();
      }

      var reactiveSystem:ReactiveSystem = <ReactiveSystem>(system['trigger'] || system['triggers'] ? system : null);

      var initializeSystem:IInitializeSystem = <IInitializeSystem>(reactiveSystem != null
        ? reactiveSystem.subsystem['initialize'] ? reactiveSystem.subsystem : null
        : system['initialize'] ? system : null);


      if (initializeSystem != null) {
        this._initializeSystems.push(initializeSystem);
      }

      var executeSystem:IExecuteSystem = <IExecuteSystem>(system['execute'] ? system : null);
      if (executeSystem != null) {
        this._executeSystems.push(executeSystem);
      }

      return this;
    }

    public initialize() {
      for (var i = 0, initializeSysCount = this._initializeSystems.length; i < initializeSysCount; i++) {
        this._initializeSystems[i].initialize();
      }
    }

    public execute() {
      for (var i = 0, exeSysCount = this._executeSystems.length; i < exeSysCount; i++) {
        this._executeSystems[i].execute();
      }
    }


    public clearReactiveSystems() {
      for (var i = 0, exeSysCount = this._executeSystems.length; i < exeSysCount; i++) {
        var reactiveSystem:ReactiveSystem = <ReactiveSystem>this._executeSystems[i];
        if (reactiveSystem != null) {
          reactiveSystem.clear();
        }

        var nestedSystems:Systems = <Systems>this._executeSystems[i];
        if (nestedSystems != null) {
          nestedSystems.clearReactiveSystems();
        }
      }

    }

  }
}