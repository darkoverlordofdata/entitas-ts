module entitas {

  import Exception = entitas.Exception;
  import IComponent = entitas.IComponent;

  class EntityAlreadyHasComponentException extends Exception {
    public constructor(message:string, index:number) {
      super(message + "\nEntity already has a component at index " + index);
    }
  }

  class EntityDoesNotHaveComponentException extends Exception {
    public constructor(message:string, index:number) {
      super(message + "\nEntity does not have a component at index " + index);
    }
  }

  class EntityIsNotEnabledException extends Exception {
    public constructor(message:string) {
      super(message + "\nEntity is not enabled");
    }
  }

  class EntityIsAlreadyReleasedException extends Exception {
    public constructor() {
      super("Entity is already released!");
    }
  }
  export module Entity {
    /**
     * event delegates:
     */
    export interface EntityReleased {(e:Entity):void;}
    export interface EntityChanged {(e:Entity, index:number, component:IComponent):void;}
    export interface ComponentReplaced {(e:Entity, index:number, component:IComponent, replacement:IComponent):void;}

  }

  export class Entity {

    public get creationIndex():number {return this._creationIndex;}

    public onEntityReleased:Array<Entity.EntityReleased> = [];
    public onComponentAdded:Array<Entity.EntityChanged> = [];
    public onComponentRemoved:Array<Entity.EntityChanged> = [];
    public onComponentReplaced:Array<Entity.ComponentReplaced> = [];

    public _creationIndex:number=0;
    public _isEnabled:boolean=true;
    public _components;

    public _componentsCache;
    public _componentIndicesCache:number[];
    public _toStringCache:string;

    public _refCount:number=0;


    constructor(totalComponents:number=16) {
      this._components = new Array(totalComponents);
    }

    public addComponent(index:number, component:IComponent):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot add component!");
      }
      if (this.hasComponent(index)) {
        var errorMsg = "Cannot add component at index " + index + " to " + this;
        throw new EntityAlreadyHasComponentException(errorMsg, index);
      }
      this._components[index] = component;
      this._componentsCache = undefined;
      this._componentIndicesCache = undefined;
      this._toStringCache = undefined;
      for (var onComponentAdded=this.onComponentAdded, e=0; e<onComponentAdded.length; e++)
        onComponentAdded[e](this, index, component);

      return this;
    }

    public removeComponent(index:number):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot remove component!");
      }
      if (this.hasComponent(index)) {
        var errorMsg = "Cannot remove component at index " + index + " from " + this;
        throw new EntityDoesNotHaveComponentException(errorMsg, index);
      }
      this._replaceComponent(index, undefined);
      return this;
    }


    public replaceComponent(index:number, component:IComponent):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot replace component!");
      }

      if (this.hasComponent(index)) {
        this._replaceComponent(index, component);
      } else if (component !== undefined) {
        this.addComponent(index, component);
      }
      return this;
    }

    protected _replaceComponent(index:number, replacement:IComponent) {
      var previousComponent = this._components[index];
      if (previousComponent === replacement) {
        for (var onComponentReplaced=this.onComponentReplaced, e=0; e<onComponentReplaced.length; e++)
          onComponentReplaced[e](this, index, previousComponent, replacement);

      } else {
        this._components[index] = replacement;
        this._componentsCache = undefined;
        if (replacement === undefined) {
          this._componentIndicesCache = undefined;
          this._toStringCache = undefined;
          for (var onComponentRemoved=this.onComponentRemoved, e=0; e<onComponentRemoved.length; e++)
            onComponentRemoved[e](this, index, previousComponent);

        } else {
          for (var onComponentReplaced=this.onComponentReplaced, e=0; e<onComponentReplaced.length; e++)
            onComponentReplaced[e](this, index, previousComponent, replacement);

        }
      }

    }

    public getComponent(index:number):IComponent {
      if (!this.hasComponent(index)) {
        var errorMsg = "Cannot get component at index " + index + " from " + this;
        throw new EntityDoesNotHaveComponentException(errorMsg, index);
      }
      return this._components[index];
    }

    public getComponents():IComponent[] {
      if (this._componentsCache === undefined) {
        var components = [];
        for (var i = 0, componentsLength = this._components.length; i < componentsLength; i++) {
          var component = this._components[i];
          if (component !== undefined) {
            components.push(component);
          }
        }

        this._componentsCache = components;
      }

      return this._componentsCache;

    }

    public getComponentIndices():number[] {
      if (this._componentIndicesCache === undefined) {
        var indices = [];
        for (var i = 0, componentsLength = this._components.length; i < componentsLength; i++) {
          if (this._components[i] !== undefined) {
            indices.push(i);
          }
        }

        this._componentIndicesCache = indices;
      }

      return this._componentIndicesCache;

    }

    public hasComponent(index:number):boolean {
      return this._components[index] !== undefined;
    }

    public hasComponents(indices:number[]):boolean {
      for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
        if (this._components[indices[i]] === undefined) {
          return false;
        }
      }

      return true;
    }

    public hasAnyComponent(indices:number[]):boolean {
      for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
        if (this._components[indices[i]] !== undefined) {
          return true;
        }
      }

      return false;
    }

    public removeAllComponents() {
      this._toStringCache = undefined;
      for (var i = 0, componentsLength = this._components.length; i < componentsLength; i++) {
        if (this._components[i] !== undefined) {
          this._replaceComponent(i, undefined);
        }
      }
    }

    public destroy() {
      this.removeAllComponents();
      this.onComponentAdded = [];
      this.onComponentReplaced = [];
      this.onComponentRemoved = [];
      this._isEnabled = false;

    }

    public toString() {
      if (this._toStringCache === undefined) {
        var sb = [];
        sb.push("Entity_");
        sb.push(this._creationIndex);
        sb.push("(");

        const seperator = ", ";
        var components = this.getComponents();
        var lastSeperator = components.length - 1 ;
        for (var i = 0, componentsLength = components.length; i < componentsLength; i++) {
          sb.push(components[i].constructor.name);
          //sb.push(typeof components[i]);
          if (i < lastSeperator) {
            sb.push(seperator);
          }
        }

        sb.push(")");
        this._toStringCache = sb.join('');
      }

      return this._toStringCache;
    }

    public retain():Entity {
      this._refCount += 1;
      return this;
    }

    public release() {
      this._refCount -= 1;
      if (this._refCount == 0) {
        for (var onEntityReleased=this.onEntityReleased, e=0; e<onEntityReleased.length; e++)
          onEntityReleased[e](this);

      } else if (this._refCount < 0) {
        throw new EntityIsAlreadyReleasedException();
      }
    }
  }
}