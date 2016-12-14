[indent=4]
uses
    Bosco
    Entitas

namespace example 


    class AddViewSystemSystem : Object implements  ISetPool, ISystem
        _game : Game

        construct(game : Game)
            _game = game





