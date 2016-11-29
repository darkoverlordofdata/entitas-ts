/**
 * entitas ecs
 * @const
 */
module entitas {
  "use strict"

  import Pool = entitas.Pool
  import Signal = entitas.utils.Signal
  import ISignal = entitas.utils.ISignal
  import IComponent = entitas.IComponent
  import EntityChanged = Entity.EntityChanged
  import EntityReleased = Entity.EntityReleased
  import IEntityChanged = Entity.IEntityChanged
  import IEntityReleased = Entity.IEntityReleased
  import ComponentReplaced = Entity.ComponentReplaced
  import IComponentReplaced = Entity.IComponentReplaced
  import EntityIsNotEnabledException = entitas.exceptions.EntityIsNotEnabledException
  import EntityIsAlreadyReleasedException = entitas.exceptions.EntityIsAlreadyReleasedException
  import EntityAlreadyHasComponentException = entitas.exceptions.EntityAlreadyHasComponentException
  import EntityDoesNotHaveComponentException = entitas.exceptions.EntityDoesNotHaveComponentException

  export module Entity {

    /**
     * Event EntityReleased
     *
     * All references to the entity have been released
     */
    export interface EntityReleased {(e:Entity):void;}
    export interface IEntityReleased<T> extends ISignal<T> {
      dispatch(e:Entity):void
    }

    /**
     * Event EntityChanged
     *
     * The entity has been changed
     **/
    export interface EntityChanged {(e:Entity, index:number, component:IComponent):void;}
    export interface IEntityChanged<T> extends ISignal<T> {
      dispatch(e:Entity, index:number, component:IComponent):void
    }

    /**
     * Event ComponentReplaced
     *
     * A component was replaced
     */
    export interface ComponentReplaced {(e:Entity, index:number, component:IComponent, replacement:IComponent):void;}
    export interface IComponentReplaced<T> extends ISignal<T> {
      dispatch(e:Entity, index:number, component:IComponent, replacement:IComponent):void
    }
  }

  export class Entity {

    /**
     * @static
     * @type {number} */
    public static instanceIndex:number = 0

    /**
     * @static
     * @type {Array<Array<IComponent>>} */
    public static alloc:Array<Array<IComponent>> = null

    /**
     * @static
     * @type {number} */
    public static size:number = 0

    /**
     * A unique sequential index number assigned to each entity at creation
     * @type {number}
     * @name entitas.Entity#creationIndex */
    public get creationIndex():number {return this._creationIndex;}

    /**
     * Subscribe to Entity Released Event
     * @type {entitas.ISignal} */
    public onEntityReleased:IEntityReleased<EntityReleased> = null

    /**
     * Subscribe to Component Added Event
     * @type {entitas.ISignal} */
    public onComponentAdded:IEntityChanged<EntityChanged> = null

    /**
     * Subscribe to Component Removed Event
     * @type {entitas.ISignal} */
    public onComponentRemoved:IEntityChanged<EntityChanged> = null

    /**
     * Subscribe to Component Replaced Event
     * @type {entitas.ISignal} */
    public onComponentReplaced:Entity.IComponentReplaced<ComponentReplaced> = null

    /**
     * Entity name
     * @type {string} */
    public name:string = ''

    /**
     *  Entity Id
     * @type {string} */
    public id:string = ''

    /**
     *  Instance index
     * @type {number} */
    public instanceIndex:number = 0

    public _creationIndex:number = 0
    public _isEnabled:boolean = true
    public _components:Array<IComponent> = null
    public _componentsCache = null
    public _componentIndicesCache:number[] = null
    public _toStringCache:string = ''
    public _refCount:number = 0
    private _pool:Pool = null
    private _componentsEnum:{} = null

    /**
     * The basic game object. Everything is an entity with components that
     * are added / removed as needed.
     *
     * @param {Object} componentsEnum
     * @param {number} totalComponents
     * @constructor
     */
    constructor(componentsEnum, totalComponents:number=16) {

      this.onEntityReleased = new Signal<EntityReleased>(this)
      this.onComponentAdded = new Signal<EntityChanged>(this)
      this.onComponentRemoved = new Signal<EntityChanged>(this)
      this.onComponentReplaced = new Signal<ComponentReplaced>(this)
      this._componentsEnum = componentsEnum
      this._pool = entitas.Pool.instance
      this._components = this.initialize(totalComponents)
    }

    public static initialize(totalComponents:number, options) {
      Entity.size = options.entities || 100
    }

    /**
     * allocate entity pool
     *
     * @param count number of components
     * @param size max number of entities
     */
    public static dim(count:number, size:number): void {
      Entity.alloc = new Array(size)
      for (let e=0; e<size; e++) {
        Entity.alloc[e] = new Array(count)
        for (let k=0; k<count; k++) {
          Entity.alloc[e][k] = null
        }
      }
    }

    /**
     * Initialize
     * allocate the entity pool.
     *
     * @param {number} totalComponents
     * @returns {Array<entitas.IComponent>}
     */
    public initialize(totalComponents:number):Array<IComponent> {
      let mem
      const size = Entity.size

      if (Entity.alloc == null) Entity.dim(totalComponents, size)
      const alloc = Entity.alloc

      this.instanceIndex = Entity.instanceIndex++
      if (mem = alloc[this.instanceIndex]) return mem

      console.log('Insufficient memory allocation at ', this.instanceIndex, '. Allocating ', size, ' entities.')
      for (let i=this.instanceIndex, l=i+size; i<l; i++) {
        alloc[i] = new Array(totalComponents)
        for (let k=0; k<totalComponents; k++) {
          alloc[i][k] = null
        }
      }
      mem = alloc[this.instanceIndex]
      return mem
    }
    /**
     * AddComponent
     *
     * @param {number} index
     * @param {entitas.IComponent} component
     * @returns {entitas.Entity}
     */
    public addComponent(index:number, component:IComponent):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot add component!")
      }
      if (this.hasComponent(index)) {
        const errorMsg = "Cannot add component at index " + index + " to " + this
        throw new EntityAlreadyHasComponentException(errorMsg, index)
      }
      this._components[index] = component
      this._componentsCache = null
      this._componentIndicesCache = null
      this._toStringCache = null
      const onComponentAdded:any = this.onComponentAdded
      if (onComponentAdded.active) onComponentAdded.dispatch(this, index, component)

      return this
    }

    /**
     * RemoveComponent
     *
     * @param {number} index
     * @returns {entitas.Entity}
     */
    public removeComponent(index:number):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot remove component!")
      }
      if (!this.hasComponent(index)) {
        const errorMsg = "Cannot remove component at index " + index + " from " + this
        throw new EntityDoesNotHaveComponentException(errorMsg, index)
      }
      this._replaceComponent(index, null)
      return this
    }


    /**
     * ReplaceComponent
     *
     * @param {number} index
     * @param {entitas.IComponent} component
     * @returns {entitas.Entity}
     */
    public replaceComponent(index:number, component:IComponent):Entity {
      if (!this._isEnabled) {
        throw new EntityIsNotEnabledException("Cannot replace component!")
      }

      if (this.hasComponent(index)) {
        this._replaceComponent(index, component)
      } else if (component != null) {
        this.addComponent(index, component)
      }
      return this
    }

    protected _replaceComponent(index:number, replacement:IComponent) {
      const components = this._components
      const previousComponent = components[index]
      if (previousComponent === replacement) {
        let onComponentReplaced:any = this.onComponentReplaced
        if (onComponentReplaced.active) onComponentReplaced.dispatch(this, index, previousComponent, replacement)

      } else {
        components[index] = replacement
        this._componentsCache = null
        if (replacement == null) {
          //delete components[index]
          components[index] = null
          this._componentIndicesCache = null
          this._toStringCache = null
          const onComponentRemoved:any = this.onComponentRemoved
          if (onComponentRemoved.active) onComponentRemoved.dispatch(this, index, previousComponent)

        } else {
          const onComponentReplaced:any = this.onComponentReplaced
          if (onComponentReplaced.active) onComponentReplaced.dispatch(this, index, previousComponent, replacement)
        }
      }

    }

    /**
     * GetComponent
     *
     * @param {number} index
     * @param {entitas.IComponent} component
     */
    public getComponent(index:number):IComponent {
      if (!this.hasComponent(index)) {
        const errorMsg = "Cannot get component at index " + index + " from " + this
        throw new EntityDoesNotHaveComponentException(errorMsg, index)
      }
      return this._components[index]
    }

    /**
     * GetComponents
     *
     * @returns {Array<entitas.IComponent>}
     */
    public getComponents():IComponent[] {
      if (this._componentsCache == null) {
        const components = []
        const _components = this._components
        for (let i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
          const component = _components[i]
          if (component != null) {
            components[j++] = component
          }
        }

        this._componentsCache = components
      }

      return this._componentsCache

    }

    /**
     * GetComponentIndices
     *
     * @returns {Array<number>}
     */
    public getComponentIndices():number[] {
      if (this._componentIndicesCache == null) {
        const indices = []
        const _components = this._components
        for (let i = 0, j = 0, componentsLength = _components.length; i < componentsLength; i++) {
          if (_components[i] != null) {
            indices[j++] = i
          }
        }
        this._componentIndicesCache = indices
      }
      return this._componentIndicesCache

    }

    /**
     * HasComponent
     *
     * @param {number} index
     * @returns {boolean}
     */
    public hasComponent(index:number):boolean {
      return this._components[index] != null
    }

    /**
     * HasComponents
     *
     * @param {Array<number>} indices
     * @returns {boolean}
     */
    public hasComponents(indices:number[]):boolean {
      const _components = this._components
      for (let i = 0, indicesLength = indices.length; i < indicesLength; i++) {
        if (_components[indices[i]] == null) {
          return false
        }
      }

      return true
    }

    /**
     * HasAnyComponent
     *
     * @param {Array<number>} indices
     * @returns {boolean}
     */
    public hasAnyComponent(indices:number[]):boolean {
      const _components = this._components
      for (let i = 0, indicesLength = indices.length; i < indicesLength; i++) {
        if (_components[indices[i]] != null) {
          return true
        }
      }

      return false
    }

    /**
     * RemoveAllComponents
     *
     */
    public removeAllComponents() {
      this._toStringCache = null
      const _components = this._components
      for (let i = 0, componentsLength = _components.length; i < componentsLength; i++) {
        if (_components[i] != null) {
          this._replaceComponent(i, null)
        }
      }
    }

    /**
     * Destroy
     *
     */
    public destroy() {
      this.removeAllComponents()
      this.onComponentAdded.clear()
      this.onComponentReplaced.clear()
      this.onComponentRemoved.clear()
      this._isEnabled = false

    }

    /**
     * ToString
     *
     * @returns {string}
     */
    public toString() {
      if (this._toStringCache == null) {
        const sb = []
        const seperator = ", "
        const components = this.getComponents()
        const lastSeperator = components.length - 1 
        for (let i = 0, j=0, componentsLength = components.length; i < componentsLength; i++) {
          sb[j++] = components[i].constructor['name'].replace('Component', '') || i+''
          if (i < lastSeperator) {
            sb[j++] = seperator
          }
        }

        this._toStringCache = sb.join('')
      }

      return this._toStringCache
    }

    /**
     * AddRef
     *
     * @returns {entitas.Entity}
     */
    public addRef():Entity {
      this._refCount += 1
      return this
    }

    /**
     * Release
     *
     */
    public release() {
      this._refCount -= 1
      if (this._refCount === 0) {
        let onEntityReleased:any = this.onEntityReleased
        if (onEntityReleased.active) onEntityReleased.dispatch(this)

      } else if (this._refCount < 0) {
        throw new EntityIsAlreadyReleasedException()
      }
    }
  }
}