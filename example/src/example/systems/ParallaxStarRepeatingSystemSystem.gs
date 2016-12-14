[indent=4]
uses
    Bosco
    Entitas

namespace example 


    class ParallaxStarRepeatingSystemSystem : Object implements  IInitializeSystem,  IExecuteSystem,  ISetPool, ISystem
        _game : Game

        construct(game : Game)
            _game = game



        def initialize


        def execute()




