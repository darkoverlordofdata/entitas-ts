#!/usr/bin/env bash
#
# Test project setup
#
git clone https://github.com/darkoverlordofdata/template example
cd example

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
entitas create -s AccelerateSystem IReactiveSystem ISetPool
entitas create -s DestroySystem  IReactiveSystem ISetPool
entitas create -s InputSystem IExecuteSystem IInitializeSystem ISetPool
entitas create -s MoveSystem IExecuteSystem ISetPool
entitas create -s ReachedFinishSystem IReactiveSystem ISetPool
entitas create -s RenderPositionSystem IReactiveSystem IEnsureComponents
entitas create -s AddViewSystem IReactiveSystem
entitas create -s RemoveViewSystem IMultiReactiveSystem IEnsureComponents ISetPool
entitas create -s CreatePlayerSystem  IInitializeSystem ISetPool
entitas create -s CreateOpponentsSystem  IInitializeSystem ISetPool
entitas create -s CreateFinishLineSystem IInitializeSystem ISetPool
entitas generate

git clone https://github.com/darkoverlordofdata/template matchone
cd matchone

entitas init matchone

