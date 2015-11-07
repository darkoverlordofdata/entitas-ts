/**
 * entitas ecs
 * @const
 */
module entitas {

  import Pool = entitas.Pool;
  import Signal = entitas.utils.Signal;
  import ISignal = entitas.utils.ISignal;
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

  export module Entity {

    /**
     * Event EntityReleased
     *
     * All references to the entity have been released
     */
    export interface EntityReleased {(e:Entity):void;}
    export interface IEntityReleased<T> extends ISignal<T> {
      dispatch(e:Entity):void;
    }

    /**
     * Event EntityChanged
     *
     * The entity has been changed
     **/
    export interface EntityChanged {(e:Entity, index:number, component:IComponent):void;}
    export interface IEntityChanged<T> extends ISignal<T> {
      dispatch(e:Entity, index:number, component:IComponent):void;
    }

    /**
     * Event ComponentReplaced
     *
     * A component was replaced
     */
    export interface ComponentReplaced {(e:Entity, index:number, component:IComponent, replacement:IComponent):void;}
    export interface IComponentReplaced<T> extends ISignal<T> {
      dispatch(e:Entity, index:number, component:IComponent, replacement:IComponent):void;
    }
  }

  /**
   * The basic game object. Everything is an entity with components that
   * are added / removed as needed.
   */
  export class Entity {

    public get creationIndex():number {return this._creationIndex;}

    public onEntityReleased:IEntityReleased<EntityReleased>;
    public onComponentAdded:IEntityChanged<EntityChanged>;
    public onComponentRemoved:IEntityChanged<EntityChanged>;
    public onComponentReplaced:Entity.IComponentReplaced<ComponentReplaced>;

    public name:string;
    public id:string;
    public _creationIndex:number=0;
    public _isEnabled:boolean=true;
    public _components:Array<IComponent>;
    private _pool:Pool;

    private _componentsEnum:{};
    public _componentsCache;
    public _componentIndicesCache:number[];
    public _toStringCache:string;
    public instanceIndex:number;
    public _refCount:number=0;

    constructor(componentsEnum, totalComponents:number=16) {

      this.onEntityReleased = new Signal<EntityReleased>(this);
      this.onComponentAdded = new Signal<EntityChanged>(this);
      this.onComponentRemoved = new Signal<EntityChanged>(this);
      this.onComponentReplaced = new Signal<ComponentReplaced>(this);
      this._componentsEnum = componentsEnum;
      this._pool = entitas.Pool.instance;
      this._components = this.initialize(totalComponents);
    }

    /**
     * Initialize
     *
     * Extension point to allocate enetity pool.
     *
     * @param totalComponents
     * @returns Array<entitas.IComponent>
     */
    public initialize(totalComponents:number):Array<IComponent> {
      return null;
    }
    /**
     * AddComponent
     *
     * @param index
     * @param component
     * @returns entitas.Entity
     */
    public addComponent(index:number, component:IComponent):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot add component!");
      }
      if (this.hasComponent(index)) {
        var errorMsg = "Cannot add component at index " + index + " to " + this;
        throw new EntityAlreadyHasComponentException(errorMsg, index);
      }
      this._components[index] = component;
      this._componentsCache = null;
      this._componentIndicesCache = null;
      this._toStringCache = null;
      var onComponentAdded:any = this.onComponentAdded;
      if (onComponentAdded.active) onComponentAdded.dispatch(this, index, component);

      return this;
    }

    /**
     * RemoveComponent
     *
     * @param index
     * @returns entitas.Entity
     */
    public removeComponent(index:number):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot remove component!");
      }
      if (!this.hasComponent(index)) {
        var errorMsg = "Cannot remove component at index " + index + " from " + this;
        throw new EntityDoesNotHaveComponentException(errorMsg, index);
      }
      this._replaceComponent(index, null);
      return this;
    }


    /**
     * ReplaceComponent
     *
     * @param index
     * @param component
     * @returns entitas.Entity
     */
    public replaceComponent(index:number, component:IComponent):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot replace component!");
      }

      if (this.hasComponent(index)) {
        this._replaceComponent(index, component);
      } else if (component != null) {
        this.addComponent(index, component);
      }
      return this;
    }

    protected _replaceComponent(index:number, replacement:IComponent) {
      var components = this._components;
      var previousComponent = components[index];
      if (previousComponent === replacement) {
        var onComponentReplaced:any = this.onComponentReplaced;
        if (onComponentReplaced.active) onComponentReplaced.dispatch(this, index, previousComponent, replacement);

      } else {
        components[index] = replacement;
        this._componentsCache = null;
        if (replacement == null) {
          delete components[index];
          this._componentIndicesCache = null;
          this._toStringCache = null;
          var onComponentRemoved:any = this.onComponentRemoved;
          if (onComponentRemoved.active) onComponentRemoved.dispatch(this, index, previousComponent);

        } else {
          var onComponentReplaced:any = this.onComponentReplaced;
          if (onComponentReplaced.active) onComponentReplaced.dispatch(this, index, previousComponent, replacement);
        }
      }

    }

    /**
     * GetComponent
     *
     * @param index
     * @param component
     */
    public getComponent(index:number):IComponent {
      if (!this.hasComponent(index)) {
        var errorMsg = "Cannot get component at index " + index + " from " + this;
        throw new EntityDoesNotHaveComponentException(errorMsg, index);
      }
      return this._components[index];
    }

    /**
     * GetComponents
     *
     * @returns Array<entitas.IComponent>
     */
    public getComponents():IComponent[] {
      if (this._componentsCache == null) {
        var components = [];
        var _components = this._components;
        for (var i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
          var component = _components[i];
          if (component != null) {
            components[j++] = component;
          }
        }

        this._componentsCache = components;
      }

      return this._componentsCache;

    }

    /**
     * GetComponentIndices
     *
     * @returns Array<number>
     */
    public getComponentIndices():number[] {
      if (this._componentIndicesCache == null) {
        var indices = [];
        var _components = this._components;
        for (var i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
          if (_components[i] != null) {
            indices[j++] = i;
          }
        }

        this._componentIndicesCache = indices;
      }

      return this._componentIndicesCache;

    }

    /**
     * HasComponent
     *
     * @param index
     * @returns boolean
     */
    public hasComponent(index:number):boolean {
      return this._components[index] != null;
    }

    /**
     * HasComponents
     *
     * @param indices
     * @returns boolean
     */
    public hasComponents(indices:number[]):boolean {
      var _components = this._components;
      for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
        if (_components[indices[i]] == null) {
          return false;
        }
      }

      return true;
    }

    /**
     * HasAnyComponent
     *
     * @param indices
     * @returns boolean
     */
    public hasAnyComponent(indices:number[]):boolean {
      var _components = this._components;
      for (var i = 0, indicesLength = indices.length; i < indicesLength; i++) {
        if (_components[indices[i]] != null) {
          return true;
        }
      }

      return false;
    }

    /**
     * RemoveAllComponents
     *
     */
    public removeAllComponents() {
      this._toStringCache = null;
      var _components = this._components;
      for (var i = 0, componentsLength = _components.length; i < componentsLength; i++) {
        if (_components[i] != null) {
          this._replaceComponent(i, null);
        }
      }
    }

    /**
     * Destroy
     *
     */
    public destroy() {
      this.removeAllComponents();
      this.onComponentAdded.clear();
      this.onComponentReplaced.clear();
      this.onComponentRemoved.clear();
      this._isEnabled = false;

    }

    /**
     * ToString
     *
     * @returns string
     */
    public toString() {
      if (this._toStringCache == null) {
        var sb = [];
        const seperator = ", ";
        var components = this.getComponents();
        var lastSeperator = components.length - 1 ;
        for (var i = 0, j=0, componentsLength = components.length; i < componentsLength; i++) {
          sb[j++] = components[i].constructor['name'].replace('Component', '') || i+'';
          if (i < lastSeperator) {
            sb[j++] = seperator;
          }
        }

        this._toStringCache = sb.join('');
      }

      return this._toStringCache;
    }

    /**
     * AddRef
     *
     * @returns entitas.Entity
     */
    public addRef():Entity {
      this._refCount += 1;
      return this;
    }

    /**
     * Release
     *
     */
    public release() {
      this._refCount -= 1;
      if (this._refCount === 0) {
        var onEntityReleased:any = this.onEntityReleased;
        if (onEntityReleased.active) onEntityReleased.dispatch(this);

      } else if (this._refCount < 0) {
        throw new EntityIsAlreadyReleasedException();
      }
    }
  }
}