module entitas {

  import GroupEventType = entitas.GroupEventType;

  export class TriggerOnEvent {
    /**
     * @constructor
     *
     * @param trigger
     * @param eventType
     */
    constructor(public trigger:IMatcher, public eventType:GroupEventType) {}
  }
}