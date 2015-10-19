module entitas {

  import GroupEventType = entitas.GroupEventType;

  export class TriggerOnEvent {
    constructor(public trigger:IMatcher, public eventType:GroupEventType) {}
  }
}