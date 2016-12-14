[indent=4]
uses
    Bosco
    Entitas

namespace example 


    class MovementSystemSystem : Object implements  IExecuteSystem,  ISetPool, ISystem
        _game : Game

        construct(game : Game)
            _game = game



        def execute()




