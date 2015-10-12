module entitas {

  export class TriggerOnEvent {
    constructor(public trigger:IMatcher, public eventType:GroupEventType) {}
  }
}