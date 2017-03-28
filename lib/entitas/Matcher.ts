module entitas {
  "use strict"

  import Entity = entitas.Entity
  import Component = entitas.IComponent
  import IAllOfMatcher = entitas.IAllOfMatcher
  import IAnyOfMatcher = entitas.IAnyOfMatcher
  import INoneOfMatcher = entitas.INoneOfMatcher
  import MatcherException = entitas.exceptions.MatcherException
  import GroupObserver = entitas.GroupObserver
  import TriggerOnEvent = entitas.TriggerOnEvent

  /**
   * Event Types
   * @readonly
   * @enum {number}
   */
  export enum GroupEventType {
    OnEntityAdded,
    OnEntityRemoved,
    OnEntityAddedOrRemoved
  }


  export module Matcher {

  }
  
  export class Matcher implements IAllOfMatcher, IAnyOfMatcher, INoneOfMatcher {

    /**
     * Get the matcher id
     * @type {number}
     * @name entitas.Matcher#id */
    public get id():number {return this._id;}

    /**
     * A unique sequential index number assigned to each ,atch
     * @type {number} */
    public static uniqueId:number = 0

    /**
     * A list of the component ordinals that this matches
     * @type {Array<number>}
     * @name entitas.Matcher#indices */
    public get indices():number[] {
      if (!this._indices) {
        this._indices = this.mergeIndices()
      }
      return this._indices
    }

    /**
     * A unique sequential index number assigned to each entity at creation
     * @type {number}
     * @name entitas.Matcher#allOfIndices */
    public get allOfIndices():number[] {return this._allOfIndices;}

    /**
     * A unique sequential index number assigned to each entity at creation
     * @type {number}
     * @name entitas.Matcher#anyOfIndices */
    public get anyOfIndices():number[] {return this._anyOfIndices;}

    /**
     * A unique sequential index number assigned to each entity at creation
     * @type {number}
     * @name entitas.Matcher#noneOfIndices */
    public get noneOfIndices():number[] {return this._noneOfIndices;}

    private _indices:number[]
    public _allOfIndices:number[]
    public _anyOfIndices:number[]
    public _noneOfIndices:number[]
    private _toStringCache:string
    private _id:number

    /** Extension Points */
    // public onEntityAdded():TriggerOnEvent 
    // public onEntityRemoved():TriggerOnEvent
    // public onEntityAddedOrRemoved():TriggerOnEvent

    /**
     * @constructor
     *
     */
    constructor() {
      this._id = Matcher.uniqueId++
    }

    public anyOf(...args:Array<IMatcher>):IAnyOfMatcher
    public anyOf(...args:number[]):IAnyOfMatcher

    /**
     * Matches anyOf the components/indices specified
     * @params {Array<entitas.IMatcher>|Array<number>} args
     * @returns {entitas.Matcher}
     */
    public anyOf(...args:any[]):IAnyOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        this._anyOfIndices = Matcher.distinctIndices(args)
        this._indices = null
        return this
      } else {
        return this.anyOf.apply(this, Matcher.mergeIndices(args))
      }
    }

    public noneOf(...args:number[]):INoneOfMatcher
    public noneOf(...args:Array<IMatcher>):INoneOfMatcher

    /**
     * Matches noneOf the components/indices specified
     * @params {Array<entitas.IMatcher>|Array<number>} args
     * @returns {entitas.Matcher}
     */
    public noneOf(...args:any[]):INoneOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        this._noneOfIndices = Matcher.distinctIndices(args)
        this._indices = null
        return this
      } else {
        return this.noneOf.apply(this, Matcher.mergeIndices(args))
      }
    }

    /**
     * Check if the entity matches this matcher
     * @param {entitas.Entity} entity
     * @returns {boolean}
     */
    public matches(entity:Entity):boolean {
      const matchesAllOf = this._allOfIndices == null ? true : entity.hasComponents(this._allOfIndices)
      const matchesAnyOf = this._anyOfIndices == null ? true : entity.hasAnyComponent(this._anyOfIndices)
      const matchesNoneOf = this._noneOfIndices == null ? true : !entity.hasAnyComponent(this._noneOfIndices)
      return matchesAllOf && matchesAnyOf && matchesNoneOf

    }

    /**
     * Merge list of component indices
     * @returns {Array<number>}
     */
    public mergeIndices():number[] {
      //const totalIndices = (this._allOfIndices != null ? this._allOfIndices.length : 0)
      //  + (this._anyOfIndices != null ? this._anyOfIndices.length : 0)
      //  + (this._noneOfIndices != null ? this._noneOfIndices.length : 0)

      let indicesList = []
      if (this._allOfIndices != null) {
        indicesList = indicesList.concat(this._allOfIndices)
      }
      if (this._anyOfIndices != null) {
        indicesList = indicesList.concat(this._anyOfIndices)
      }
      if (this._noneOfIndices != null) {
        indicesList = indicesList.concat(this._noneOfIndices)
      }

      return Matcher.distinctIndices(indicesList)

    }

    /**
     * toString representation of this matcher
     * @returns {string}
     */
    public toString() {
      if (this._toStringCache == null) {
        const sb:string[] = []
        if (this._allOfIndices != null) {
          Matcher.appendIndices(sb, "AllOf", this._allOfIndices)
        }
        if (this._anyOfIndices != null) {
          if (this._allOfIndices != null) {
            sb[sb.length] = '.'
          }
          Matcher.appendIndices(sb, "AnyOf", this._anyOfIndices)
        }
        if (this._noneOfIndices != null) {
          Matcher.appendIndices(sb, ".NoneOf", this._noneOfIndices)
        }
        this._toStringCache = sb.join('')
      }
      return this._toStringCache
    }

    // /**
    //  * Check if the matchers are equal
    //  * @param {Object} obj
    //  * @returns {boolean}
    //  */
    // public equals(obj) {
    //   if (obj == null || obj == null) return false
    //   const matcher:Matcher = obj

    //   if (!Matcher.equalIndices(matcher.allOfIndices, this._allOfIndices)) {
    //     return false
    //   }
    //   if (!Matcher.equalIndices(matcher.anyOfIndices, this._anyOfIndices)) {
    //     return false
    //   }
    //   if (!Matcher.equalIndices(matcher.noneOfIndices, this._noneOfIndices)) {
    //     return false
    //   }
    //   return true

    // }

    // /**
    //  * Check if the lists of component indices are equal
    //  * @param {Array<number>} list1
    //  * @param {Array<number>} list2
    //  * @returns {boolean}
    //  */
    // public static equalIndices(i1:number[], i2:number[]):boolean {
    //   if ((i1 == null) != (i2 == null)) {
    //     return false
    //   }
    //   if (i1 == null) {
    //     return true
    //   }
    //   if (i1.length !== i2.length) {
    //     return false
    //   }

    //   for (let i = 0, indicesLength = i1.length; i < indicesLength; i++) {
    //     /** compare coerced values so we can compare string type to number type */
    //     if (i1[i] != i2[i]) {
    //       return false
    //     }
    //   }

    //   return true
    // }

    /**
     * Get the set if distinct (non-duplicate) indices from a list
     * @param {Array<number>} indices
     * @returns {Array<number>}
     */
    public static distinctIndices(indices:number[]):number[] {
      const indicesSet = {}
      for (let i=0, l=indices.length; i<l; i++) {
        const k = ''+indices[i]
        indicesSet[k]=i
      }
      return [].concat(Object.keys(indicesSet))
    }

    /**
     * Merge all the indices of a set of Matchers
     * @param {Array<IMatcher>} matchers
     * @returns {Array<number>}
     */
    public static mergeIndices(matchers:Array<IMatcher>):number[] {

      const indices = []
      for (let i = 0, matchersLength = matchers.length; i < matchersLength; i++) {
        const matcher = matchers[i]
        if (matcher.indices.length !== 1) {
          throw new MatcherException(matcher)
        }
        indices[i] = matcher.indices[0]
      }
      return indices
    }

    public static allOf(...args:number[]):IAllOfMatcher
    public static allOf(...args:Array<IMatcher>):IAllOfMatcher

    /**
     * Matches allOf the components/indices specified
     * @params {Array<entitas.IMatcher>|Array<number>} args
     * @returns {entitas.Matcher}
     */
    public static allOf(...args:any[]):IAllOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        const matcher = new Matcher()
        const indices = matcher._allOfIndices = Matcher.distinctIndices(args)
        return matcher
      } else {
        return Matcher.allOf.apply(this, Matcher.mergeIndices(args))
      }

    }

    public static anyOf(...args:number[]):IAnyOfMatcher
    public static anyOf(...args:Array<IMatcher>):IAnyOfMatcher

    /**
     * Matches anyOf the components/indices specified
     * @params {Array<entitas.IMatcher>|Array<number>} args
     * @returns {entitas.Matcher}
     */
    public static anyOf(...args:any[]):IAnyOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        const matcher = new Matcher()
        const indices = matcher._anyOfIndices = Matcher.distinctIndices(args)
        return matcher
      } else {
        return Matcher.anyOf.apply(this, Matcher.mergeIndices(args))
      }
    }

    private static appendIndices(sb:string[], prefix:string, indexArray:number[]) {
      const SEPERATOR = ", "
      let j = sb.length
      sb[j++] = prefix
      sb[j++] = '('
      const lastSeperator = indexArray.length - 1
      for (let i = 0, indicesLength = indexArray.length; i < indicesLength; i++) {
        sb[j++] = ''+indexArray[i]
        if (i < lastSeperator) {
          sb[j++] = SEPERATOR
        }
      }
      sb[j++] = ')'
    }

    /**
     * Subscribe to Entity Added event
     * @returns {entitas.TriggerOnEvent}
     */
    public onEntityAdded():TriggerOnEvent {
      return new TriggerOnEvent(this, GroupEventType.OnEntityAdded)
    }

    /**
     * Subscribe to Entity Removed event
     * @returns {entitas.TriggerOnEvent}
     */
    public onEntityRemoved():TriggerOnEvent {
      return new TriggerOnEvent(this, GroupEventType.OnEntityRemoved)
    }

    /**
     * Subscribe to Entity Added or Removed event
     * @returns {entitas.TriggerOnEvent}
     */
    public onEntityAddedOrRemoved():TriggerOnEvent {
      return new TriggerOnEvent(this, GroupEventType.OnEntityAddedOrRemoved)
    }

  }
}

