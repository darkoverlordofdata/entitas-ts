module entitas {
  export interface IMatcher {
    id:number;
    indices:number[];
    matches(entity:Entity);
  }
}

