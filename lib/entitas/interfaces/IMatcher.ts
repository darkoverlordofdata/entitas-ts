module entitas {
  export interface IMatcher {
    id:number
    indices:number[]
    matches(entity:Entity)
  }
  export interface ICompoundMatcher extends IMatcher {

    allOfIndices:number[]
    anyOfIndices:number[]
    noneOfIndices:number[]
  }

  export interface INoneOfMatcher extends ICompoundMatcher {}

  export interface IAnyOfMatcher extends ICompoundMatcher {
    noneOf(...args:any[]):INoneOfMatcher
  }

  export interface IAllOfMatcher extends ICompoundMatcher {
    anyOf(...args:any[]):IAnyOfMatcher
    noneOf(...args:any[]):INoneOfMatcher
  }

}

