#!/usr/bin/env bash

entitas init example
entitas create -c Acceleratable
entitas create -c Accelerating
entitas create -c Destroy
entitas create -c Move speed:number maxSpeed:number
entitas create -c Position x:number y:number z:number
entitas create -c FinishLine
entitas create -c Resource name:string
entitas create -c View sprite:Object
entitas create -e Accelerating
entitas create -e FinishLine
entitas create -s Accelerate IReactiveSystem ISetPool
entitas create -s Destroy  IReactiveSystem ISetPool
entitas create -s Input IExecuteSystem IInitializeSystem ISetPool
entitas create -s Move IExecuteSystem ISetPool
entitas create -s ReachedFinish IReactiveSystem ISetPool
entitas create -s RenderPosition IReactiveSystem IEnsureComponents
entitas create -s AddView IReactiveSystem
entitas create -s RemoveView IMultiReactiveSystem IEnsureComponents ISetPool
entitas create -s CreatePlayerSystem  IInitializeSystem ISetPool
entitas create -s CreateOpponentsSystem  IInitializeSystem ISetPool
entitas create -s CreateFinishLineSystem IInitializeSystem ISetPool
entitas generate

