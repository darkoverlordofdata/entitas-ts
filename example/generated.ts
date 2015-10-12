module example {

  import Matcher = entitas.Matcher;
  import IComponent = entitas.IComponent;
  import IMatcher = entitas.IMatcher;
  import ISystem = entitas.IMatcher;

  export enum CoreComponentIds {
    Acceleratable,
    Accelerating,
    Destroy,
    Move,
    Position,
    FinishLine,
    Resource,
    View,
    TotalComponents
  }


  export class AcceleratableComponent implements IComponent {
  }
  export class AcceleratingComponent implements IComponent {
  }
  export class DestroyComponent implements IComponent {
  }
  export class MoveComponent implements IComponent {
    public speed:number;
    public maxSpeed:number;
  }
  export class PositionComponent implements IComponent {
    public x:number;
    public y:number;
    public z:number;
  }
  export class FinishLineComponent implements IComponent {
  }
  export class ResourceComponent implements IComponent {
    public name:string;
  }
  export class ViewComponent implements IComponent {
    public stage:Object;
  }

  export class Entity extends entitas.Entity {

    static acceleratableComponent:AcceleratableComponent = new AcceleratableComponent();
    get isAcceleratable():boolean {
      return this.hasComponent(CoreComponentIds.Acceleratable);
    }
    set isAcceleratable(value:boolean) {
      if (value !== this.isAcceleratable) {
        if (value) {
          this.addComponent(CoreComponentIds.Acceleratable, Entity.acceleratableComponent);
        } else {
          this.removeComponent(CoreComponentIds.Acceleratable);
        }
      }
    }
    setAcceleratable(value:boolean) {
      this.isAcceleratable = value;
      return this;
    }
    static acceleratingComponent:AcceleratingComponent = new AcceleratingComponent();
    get isAccelerating():boolean {
      return this.hasComponent(CoreComponentIds.Accelerating);
    }
    set isAccelerating(value:boolean) {
      if (value !== this.isAccelerating) {
        if (value) {
          this.addComponent(CoreComponentIds.Accelerating, Entity.acceleratingComponent);
        } else {
          this.removeComponent(CoreComponentIds.Accelerating);
        }
      }
    }
    setAccelerating(value:boolean) {
      this.isAccelerating = value;
      return this;
    }
    static destroyComponent:DestroyComponent = new DestroyComponent();
    get isDestroy():boolean {
      return this.hasComponent(CoreComponentIds.Destroy);
    }
    set isDestroy(value:boolean) {
      if (value !== this.isDestroy) {
        if (value) {
          this.addComponent(CoreComponentIds.Destroy, Entity.destroyComponent);
        } else {
          this.removeComponent(CoreComponentIds.Destroy);
        }
      }
    }
    setDestroy(value:boolean) {
      this.isDestroy = value;
      return this;
    }
    static _moveComponentPool:Array<MoveComponent> = [];
    static clearMoveComponentPool() {
            Entity._moveComponentPool.length = 0;
    }
    get move():MoveComponent {
      return <MoveComponent>this.getComponent(CoreComponentIds.Move);
    }
    get hasMove():boolean {
      return this.hasComponent(CoreComponentIds.Move);
    }
    addMove(speed:number, maxSpeed:number) {
      var component = Entity._moveComponentPool.length > 0 ? Entity._moveComponentPool.pop() : new MoveComponent();
      component.speed = speed;
      component.maxSpeed = maxSpeed;
      return this.addComponent(CoreComponentIds.Move, component);
    }
    replaceMove(speed:number, maxSpeed:number) {
      var previousComponent = this.hasMove ? this.move : null;
      var component = Entity._moveComponentPool.length > 0 ? Entity._moveComponentPool.pop() : new MoveComponent();
      component.speed = speed;
      component.maxSpeed = maxSpeed;
      this.replaceComponent(CoreComponentIds.Move, component);
      if (previousComponent != null) {
        Entity._moveComponentPool.push(previousComponent);
      }
      return this;
    }
    removeMove() {
      var component = this.move;
      this.removeComponent(CoreComponentIds.Move);
      Entity._moveComponentPool.push(component);
      return this;
    }
    static _positionComponentPool:Array<PositionComponent> = [];
    static clearPositionComponentPool() {
            Entity._positionComponentPool.length = 0;
    }
    get position():PositionComponent {
      return <PositionComponent>this.getComponent(CoreComponentIds.Position);
    }
    get hasPosition():boolean {
      return this.hasComponent(CoreComponentIds.Position);
    }
    addPosition(x:number, y:number, z:number) {
      var component = Entity._positionComponentPool.length > 0 ? Entity._positionComponentPool.pop() : new PositionComponent();
      component.x = x;
      component.y = y;
      component.z = z;
      return this.addComponent(CoreComponentIds.Position, component);
    }
    replacePosition(x:number, y:number, z:number) {
      var previousComponent = this.hasPosition ? this.position : null;
      var component = Entity._positionComponentPool.length > 0 ? Entity._positionComponentPool.pop() : new PositionComponent();
      component.x = x;
      component.y = y;
      component.z = z;
      this.replaceComponent(CoreComponentIds.Position, component);
      if (previousComponent != null) {
        Entity._positionComponentPool.push(previousComponent);
      }
      return this;
    }
    removePosition() {
      var component = this.position;
      this.removeComponent(CoreComponentIds.Position);
      Entity._positionComponentPool.push(component);
      return this;
    }
    static finishLineComponent:FinishLineComponent = new FinishLineComponent();
    get isFinishLine():boolean {
      return this.hasComponent(CoreComponentIds.FinishLine);
    }
    set isFinishLine(value:boolean) {
      if (value !== this.isFinishLine) {
        if (value) {
          this.addComponent(CoreComponentIds.FinishLine, Entity.finishLineComponent);
        } else {
          this.removeComponent(CoreComponentIds.FinishLine);
        }
      }
    }
    setFinishLine(value:boolean) {
      this.isFinishLine = value;
      return this;
    }
    static _resourceComponentPool:Array<ResourceComponent> = [];
    static clearResourceComponentPool() {
            Entity._resourceComponentPool.length = 0;
    }
    get resource():ResourceComponent {
      return <ResourceComponent>this.getComponent(CoreComponentIds.Resource);
    }
    get hasResource():boolean {
      return this.hasComponent(CoreComponentIds.Resource);
    }
    addResource(name:string) {
      var component = Entity._resourceComponentPool.length > 0 ? Entity._resourceComponentPool.pop() : new ResourceComponent();
      component.name = name;
      return this.addComponent(CoreComponentIds.Resource, component);
    }
    replaceResource(name:string) {
      var previousComponent = this.hasResource ? this.resource : null;
      var component = Entity._resourceComponentPool.length > 0 ? Entity._resourceComponentPool.pop() : new ResourceComponent();
      component.name = name;
      this.replaceComponent(CoreComponentIds.Resource, component);
      if (previousComponent != null) {
        Entity._resourceComponentPool.push(previousComponent);
      }
      return this;
    }
    removeResource() {
      var component = this.resource;
      this.removeComponent(CoreComponentIds.Resource);
      Entity._resourceComponentPool.push(component);
      return this;
    }
    static _viewComponentPool:Array<ViewComponent> = [];
    static clearViewComponentPool() {
            Entity._viewComponentPool.length = 0;
    }
    get view():ViewComponent {
      return <ViewComponent>this.getComponent(CoreComponentIds.View);
    }
    get hasView():boolean {
      return this.hasComponent(CoreComponentIds.View);
    }
    addView(stage:Object) {
      var component = Entity._viewComponentPool.length > 0 ? Entity._viewComponentPool.pop() : new ViewComponent();
      component.stage = stage;
      return this.addComponent(CoreComponentIds.View, component);
    }
    replaceView(stage:Object) {
      var previousComponent = this.hasView ? this.view : null;
      var component = Entity._viewComponentPool.length > 0 ? Entity._viewComponentPool.pop() : new ViewComponent();
      component.stage = stage;
      this.replaceComponent(CoreComponentIds.View, component);
      if (previousComponent != null) {
        Entity._viewComponentPool.push(previousComponent);
      }
      return this;
    }
    removeView() {
      var component = this.view;
      this.removeComponent(CoreComponentIds.View);
      Entity._viewComponentPool.push(component);
      return this;
    }
  }

  export class CoreMatcher {

    private static _matcherAcceleratable:IMatcher;
    
    public static get Acceleratable():IMatcher {
      if (CoreMatcher._matcherAcceleratable == null) {
        CoreMatcher._matcherAcceleratable = Matcher.allOf(CoreComponentIds.Acceleratable);
      }
      
      return CoreMatcher._matcherAcceleratable;
    }
    
    private static _matcherAccelerating:IMatcher;
    
    public static get Accelerating():IMatcher {
      if (CoreMatcher._matcherAccelerating == null) {
        CoreMatcher._matcherAccelerating = Matcher.allOf(CoreComponentIds.Accelerating);
      }
      
      return CoreMatcher._matcherAccelerating;
    }
    
    private static _matcherDestroy:IMatcher;
    
    public static get Destroy():IMatcher {
      if (CoreMatcher._matcherDestroy == null) {
        CoreMatcher._matcherDestroy = Matcher.allOf(CoreComponentIds.Destroy);
      }
      
      return CoreMatcher._matcherDestroy;
    }
    
    private static _matcherMove:IMatcher;
    
    public static get Move():IMatcher {
      if (CoreMatcher._matcherMove == null) {
        CoreMatcher._matcherMove = Matcher.allOf(CoreComponentIds.Move);
      }
      
      return CoreMatcher._matcherMove;
    }
    
    private static _matcherPosition:IMatcher;
    
    public static get Position():IMatcher {
      if (CoreMatcher._matcherPosition == null) {
        CoreMatcher._matcherPosition = Matcher.allOf(CoreComponentIds.Position);
      }
      
      return CoreMatcher._matcherPosition;
    }
    
    private static _matcherFinishLine:IMatcher;
    
    public static get FinishLine():IMatcher {
      if (CoreMatcher._matcherFinishLine == null) {
        CoreMatcher._matcherFinishLine = Matcher.allOf(CoreComponentIds.FinishLine);
      }
      
      return CoreMatcher._matcherFinishLine;
    }
    
    private static _matcherResource:IMatcher;
    
    public static get Resource():IMatcher {
      if (CoreMatcher._matcherResource == null) {
        CoreMatcher._matcherResource = Matcher.allOf(CoreComponentIds.Resource);
      }
      
      return CoreMatcher._matcherResource;
    }
    
    private static _matcherView:IMatcher;
    
    public static get View():IMatcher {
      if (CoreMatcher._matcherView == null) {
        CoreMatcher._matcherView = Matcher.allOf(CoreComponentIds.View);
      }
      
      return CoreMatcher._matcherView;
    }
    
  }

  export class Pool extends entitas.Pool {

    get acceleratingEntity():Entity {
      return <Entity>this.getGroup(CoreMatcher.Accelerating).getSingleEntity();
    }

    get isAccelerating():boolean {
      return this.acceleratingEntity != null;
    }

    set isAccelerating(value:boolean) {
      var entity = this.acceleratingEntity;
      if (value != (entity != null)) {
        if (value) {
          (<Entity>this.createEntity()).isAccelerating = true;
        } else {
          this.destroyEntity(entity);
        }
      }
    }

    get finishLineEntity():Entity {
      return <Entity>this.getGroup(CoreMatcher.FinishLine).getSingleEntity();
    }

    get isFinishLine():boolean {
      return this.finishLineEntity != null;
    }

    set isFinishLine(value:boolean) {
      var entity = this.finishLineEntity;
      if (value != (entity != null)) {
        if (value) {
          (<Entity>this.createEntity()).isFinishLine = true;
        } else {
          this.destroyEntity(entity);
        }
      }
    }


  }
  export class Pools {
    
    static _allPools:Array<Pool>;
    
    static get allPools():Array<Pool> {
      if (Pools._allPools == null) {
        Pools._allPools = [Pools.core];
      }
      return Pools._allPools;
    }
    
    static _core:Pool;
    
    static get core():Pool {
      if (Pools._core == null) {
        Pools._core = new Pool(CoreComponentIds.TotalComponents);
      }
    
      return Pools._core;
    }
  }
}