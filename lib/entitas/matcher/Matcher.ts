module entitas {

  import Entity = entitas.Entity;
  import Component = entitas.IComponent;
  import IAllOfMatcher = entitas.IAllOfMatcher;
  import IAnyOfMatcher = entitas.IAnyOfMatcher;
  import INoneOfMatcher = entitas.INoneOfMatcher;
  import MatcherException = entitas.MatcherException;

  export module Matcher {

  }
  export class Matcher implements IAllOfMatcher, IAnyOfMatcher, INoneOfMatcher {

    public get id():number {return this._id;}

    public static uniqueId:number = 0;

    public get indices():number[] {
      if (!this._indices) {
        this._indices = this.mergeIndices();
      }
      return this._indices;
    }

    public get allOfIndices():number[] {return this._allOfIndices;}
    public get anyOfIndices():number[] {return this._anyOfIndices;}
    public get noneOfIndices():number[] {return this._noneOfIndices;}

    private _indices:number[];
    public _allOfIndices:number[];
    public _anyOfIndices:number[];
    public _noneOfIndices:number[];
    private _toStringCache:string;
    private _id:number;

    /** Extension Points */
    public onEntityAdded():TriggerOnEvent;
    public onEntityRemoved():TriggerOnEvent;
    public onEntityAddedOrRemoved():TriggerOnEvent;

    constructor() {
      this._id = Matcher.uniqueId++;
    }

    public anyOf(...args:Array<IMatcher>):IAnyOfMatcher;
    public anyOf(...args:number[]):IAnyOfMatcher;

    public anyOf(...args:any[]):IAnyOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        this._anyOfIndices = Matcher.distinctIndices(args);
        this._indices = undefined;
        return this;
      } else {
        return this.anyOf.apply(this, Matcher.mergeIndices(args));
      }
    }

    public noneOf(...args:number[]):INoneOfMatcher;
    public noneOf(...args:Array<IMatcher>):INoneOfMatcher;

    public noneOf(...args:any[]):INoneOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        this._noneOfIndices = Matcher.distinctIndices(args);
        this._indices = undefined;
        return this;
      } else {
        return this.noneOf.apply(this, Matcher.mergeIndices(args));
      }
    }

    public matches(entity:Entity):boolean {
      var matchesAllOf = this._allOfIndices === undefined || entity.hasComponents(this._allOfIndices);
      var matchesAnyOf = this._anyOfIndices === undefined || entity.hasAnyComponent(this._anyOfIndices);
      var matchesNoneOf = this._noneOfIndices === undefined || !entity.hasAnyComponent(this._noneOfIndices);
      return matchesAllOf && matchesAnyOf && matchesNoneOf;

    }

    public mergeIndices():number[] {
      //var totalIndices = (this._allOfIndices !== undefined ? this._allOfIndices.length : 0)
      //  + (this._anyOfIndices !== undefined ? this._anyOfIndices.length : 0)
      //  + (this._noneOfIndices !== undefined ? this._noneOfIndices.length : 0);

      var indicesList = [];
      if (this._allOfIndices !== undefined) {
        indicesList = indicesList.concat(this._allOfIndices);
      }
      if (this._anyOfIndices !== undefined) {
        indicesList = indicesList.concat(this._anyOfIndices);
      }
      if (this._noneOfIndices !== undefined) {
        indicesList = indicesList.concat(this._noneOfIndices);
      }

      return Matcher.distinctIndices(indicesList);

    }

    public toString() {
      if (this._toStringCache === undefined) {
        var sb:string[] = [];
        if (this._allOfIndices !== undefined) {
          Matcher.appendIndices(sb, "AllOf", this._allOfIndices);
        }
        if (this._anyOfIndices !== undefined) {
          if (this._allOfIndices !== undefined) {
            sb.push(".");
          }
          Matcher.appendIndices(sb, "AnyOf", this._anyOfIndices);
        }
        if (this._noneOfIndices !== undefined) {
          Matcher.appendIndices(sb, ".NoneOf", this._noneOfIndices);
        }
        this._toStringCache = sb.join('');
      }
      return this._toStringCache;
    }

    public equals(obj) {
      if (obj == null || obj === undefined) return false;
      var matcher:Matcher = obj;

      if (!Matcher.equalIndices(matcher.allOfIndices, this._allOfIndices)) {
        return false;
      }
      if (!Matcher.equalIndices(matcher.anyOfIndices, this._anyOfIndices)) {
        return false;
      }
      if (!Matcher.equalIndices(matcher.noneOfIndices, this._noneOfIndices)) {
        return false;
      }
      return true;

    }

    public static equalIndices(i1:number[], i2:number[]):boolean {
      if ((i1 === undefined) != (i2 === undefined)) {
        return false;
      }
      if (i1 === undefined) {
        return true;
      }
      if (i1.length !== i2.length) {
        return false;
      }

      for (var i = 0, indicesLength = i1.length; i < indicesLength; i++) {
        /** compare coerced values so we can compare string type to number type */
        if (i1[i] != i2[i]) {
          return false;
        }
      }

      return true;
    }

    public static distinctIndices(indices:number[]):number[] {
      var indicesSet = {};
      for (var i=0, l=indices.length; i<l; i++) {
        var k = ''+indices[i];
        indicesSet[k]=i;
      }
      return [].concat(Object.keys(indicesSet));
    }

    public static mergeIndices(matchers:Array<IMatcher>):number[] {

      var indices = [];
      for (var i = 0, matchersLength = matchers.length; i < matchersLength; i++) {
        var matcher = matchers[i];
        if (matcher.indices.length !== 1) {
          throw new MatcherException(matcher);
        }
        indices[i] = matcher.indices[0];
      }
      return indices;
    }

    public static allOf(...args:number[]):IAllOfMatcher;
    public static allOf(...args:Array<IMatcher>):IAllOfMatcher;

    public static allOf(...args:any[]):IAllOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        var matcher = new Matcher();
        matcher._allOfIndices = Matcher.distinctIndices(args);
        return matcher;
      } else {
        return Matcher.allOf.apply(this, Matcher.mergeIndices(args));
      }

    }

    public static anyOf(...args:number[]):IAnyOfMatcher;
    public static anyOf(...args:Array<IMatcher>):IAnyOfMatcher;

    public static anyOf(...args:any[]):IAnyOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        var matcher = new Matcher();
        matcher._anyOfIndices = Matcher.distinctIndices(args);
        return matcher;
      } else {
        return Matcher.anyOf.apply(this, Matcher.mergeIndices(args));
      }
    }

    private static appendIndices(sb:string[], prefix:string, indexArray:number[]) {
      const SEPERATOR = ", ";
      sb.push(prefix);
      sb.push("(");
      var lastSeperator = indexArray.length - 1;
      for (var i = 0, indicesLength = indexArray.length; i < indicesLength; i++) {
        sb.push(''+indexArray[i]);
        if (i < lastSeperator) {
          sb.push(SEPERATOR);
        }
      }
      sb.push(")");
    }

    //public onEntityAdded():TriggerOnEvent {
    //  return new TriggerOnEvent(this, GroupEventType.OnEntityAdded);
    //}

    //public onEntityRemoved():TriggerOnEvent {
    //  return new TriggerOnEvent(this, GroupEventType.OnEntityRemoved);
    //}

    //public onEntityAddedOrRemoved():TriggerOnEvent {
    //  return new TriggerOnEvent(this, GroupEventType.OnEntityAddedOrRemoved);
    //}

  }
}

