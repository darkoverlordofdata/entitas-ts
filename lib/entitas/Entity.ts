module entitas {

  import Signal = entitas.Signal;
  import ISignal = entitas.ISignal;
  import IComponent = entitas.IComponent;
  import EntityChanged = Entity.EntityChanged;
  import EntityReleased = Entity.EntityReleased;
  import IEntityChanged = Entity.IEntityChanged;
  import IEntityReleased = Entity.IEntityReleased;
  import ComponentReplaced = Entity.ComponentReplaced;
  import IComponentReplaced = Entity.IComponentReplaced;
  import EntityIsNotEnabledException = entitas.EntityIsNotEnabledException;
  import EntityIsAlreadyReleasedException = entitas.EntityIsAlreadyReleasedException;
  import EntityAlreadyHasComponentException = entitas.EntityAlreadyHasComponentException;
  import EntityDoesNotHaveComponentException = entitas.EntityDoesNotHaveComponentException;

  /**
   * event delegate boilerplate:
   */
  export module Entity {

    export interface EntityReleased {(e:Entity):void;}
    export interface IEntityReleased<T> extends ISignal<T> {
      dispatch(e:Entity):void;
    }

    export interface EntityChanged {(e:Entity, index:number, component:IComponent):void;}
    export interface IEntityChanged<T> extends ISignal<T> {
      dispatch(e:Entity, index:number, component:IComponent):void;
    }

    export interface ComponentReplaced {(e:Entity, index:number, component:IComponent, replacement:IComponent):void;}
    export interface IComponentReplaced<T> extends ISignal<T> {
      dispatch(e:Entity, index:number, component:IComponent, replacement:IComponent):void;
    }
  }

  export class Entity {

    public get creationIndex():number {return this._creationIndex;}

    public onEntityReleased:IEntityReleased<EntityReleased>;
    public onComponentAdded:IEntityChanged<EntityChanged>;
    public onComponentRemoved:IEntityChanged<EntityChanged>;
    public onComponentReplaced:Entity.IComponentReplaced<ComponentReplaced>;

    public name:string;
    public _creationIndex:number=0;
    public _isEnabled:boolean=true;
    public _components;

    private _componentsEnum:{};
    public _componentsCache;
    public _componentIndicesCache:number[];
    public _toStringCache:string;

    public _refCount:number=0;

    constructor(componentsEnum, totalComponents:number=16) {
      this.onEntityReleased = new Signal<EntityReleased>(this);
      this.onComponentAdded = new Signal<EntityChanged>(this);
      this.onComponentRemoved = new Signal<EntityChanged>(this);
      this.onComponentReplaced = new Signal<ComponentReplaced>(this);

      this._componentsEnum = componentsEnum;
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
      this.onComponentAdded.dispatch(this, index, component);

      return this;
    }

    public removeComponent(index:number):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot remove component!");
      }
      if (!this.hasComponent(index)) {
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
        this.onComponentReplaced.dispatch(this, index, previousComponent, replacement);

      } else {
        this._components[index] = replacement;
        this._componentsCache = undefined;
        if (replacement === undefined) {
          delete this._components[index];
          this._componentIndicesCache = undefined;
          this._toStringCache = undefined;
          this.onComponentRemoved.dispatch(this, index, previousComponent);

        } else {
          this.onComponentReplaced.dispatch(this, index, previousComponent, replacement);
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
      this.onComponentAdded.clear();
      this.onComponentReplaced.clear();
      this.onComponentRemoved.clear();
      this._isEnabled = false;

    }

    public toString() {
      if (this._toStringCache === undefined) {
        var sb = [];
        //sb.push("Entity_");
        //sb.push(this._creationIndex);
        //sb.push("(");

        const seperator = ", ";
        var components = this.getComponents();
        var lastSeperator = components.length - 1 ;
        for (var i = 0, componentsLength = components.length; i < componentsLength; i++) {
          sb.push(components[i].constructor['name'].replace('Component', ''));
          if (i < lastSeperator) {
            sb.push(seperator);
          }
        }

        //sb.push(")");
        this._toStringCache = sb.join('');
      }

      return this._toStringCache;
    }

    public addRef():Entity {
      this._refCount += 1;
      return this;
    }

    public release() {
      this._refCount -= 1;
      if (this._refCount === 0) {
        this.onEntityReleased.dispatch(this);

      } else if (this._refCount < 0) {
        throw new EntityIsAlreadyReleasedException();
      }
    }
  }
}