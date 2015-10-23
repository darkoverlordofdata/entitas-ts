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

entitas create -c Movable
entitas create -c Position x:number y:number
entitas create -c Destroy
entitas create -c GameBoardCache grid
entitas create -c GameBoard columns:number row:number
entitas create -c GameBoardElement
entitas create -c Input  x:number y:number
entitas create -c Interactive
entitas create -c Resource name:string
entitas create -c View sprite
entitas create -c Score value:number
entitas create -e GameBoardCache
entitas create -e GameBoard
entitas create -e Score
entitas create -s DestroySystem IReactiveSystem ISetPool
entitas create -s FallSystem IReactiveSystem ISetPool
entitas create -s FillSystem IReactiveSystem ISetPool
entitas create -s CreateGameBoardCacheSystem ISetPool
entitas create -s GameBoardSystem IInitializeSystem IReactiveSystem ISetPool
entitas create -s ProcessInputSystem IReactiveSystem ISetPool
entitas create -s RenderPositionSystem IReactiveSystem
entitas create -s AddViewSystem IReactiveSystem
entitas create -s RemoveViewSystem IReactiveSystem ISetPool IEnsureComponents
entitas create -s ScoreSystem IInitializeSystem IReactiveSystem ISetPool
entitas create -x Pool createRandomPiece:Entity x:number y:number
entitas create -x Pool createBlocker:Entity x:number y:number
entitas generate

git clone https://github.com/darkoverlordofdata/template monkeydance
cd monkeydance

entitas init monkeydance

entitas create -c Movable
entitas create -c Position x:number y:number
entitas create -c Destroy
entitas create -c Input x:number y:number
entitas create -c Interactive
entitas create -c Resource name:string
entitas create -c View sprite
entitas create -c Score value:number
entitas create -e Score
entitas create -s DestroySystem IReactiveSystem ISetPool
entitas create -s ProcessInputSystem IReactiveSystem ISetPool
entitas create -s RenderPositionSystem IReactiveSystem
entitas create -s AddViewSystem IReactiveSystem
entitas create -s RemoveViewSystem IReactiveSystem ISetPool IEnsureComponents
entitas create -s ScoreSystem IInitializeSystem IReactiveSystem ISetPool
