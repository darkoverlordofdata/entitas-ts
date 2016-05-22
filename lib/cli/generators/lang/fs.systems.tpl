namespace {{ namespace }} 

open Entitas
open System
open System.Collections.Generic

type {{ name }}(pool:Pool) =
{% for iface in interfaces %}
    interface {{ iface }} with
{% case iface %}
{% when "IReactiveSystem" %}    let triggers:Array<TriggerOnEvent>
{% when "IMultiReactiveSystem" %}       let triggers:Array<TriggerOnEvent>
{% when "IReactiveExecuteSystem" %}     let trigger: TriggerOnEvent
{% when "IExecuteSystem" %}         member  this.Execute() =
            (){% when "IInitializeSystem" %}      member this.Initialize() =
            (){% when "IEnsureComponents" %}      let ensureComponents: IMatcher
{% when "IExcludeComponents" %}     let excludeComponents: IMatcher
{% when "IClearReactiveSystem" %}       let clearAfterExecute:Boolean
{% when "ISetPool" %}       member this.SetPool(pool: Pool) =
            (){% endcase %}
{% endfor %}
