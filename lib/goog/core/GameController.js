var example;
(function (example) {
    var Pools = example.Pools;
    var Systems = entitas.Systems;
    var GameController = (function () {
        function GameController() {
        }
        GameController.prototype.start = function () {
            this.systems = this.createSystems(Pools.pool);
            this.systems.initialize();
        };
        GameController.prototype.update = function (delta) {
            this.systems.execute();
        };
        GameController.prototype.createSystems = function (pool) {
            return new Systems()
                .add(pool.createSystem(example.CreateFinishLineSystem))
                .add(pool.createSystem(example.CreatePlayerSystem))
                .add(pool.createSystem(example.CreateOpponentsSystem))
                .add(pool.createSystem(example.InputSystem))
                .add(pool.createSystem(example.AccelerateSystem))
                .add(pool.createSystem(example.MoveSystem))
                .add(pool.createSystem(example.ReachedFinishSystem))
                .add(pool.createSystem(example.RemoveViewSystem))
                .add(pool.createSystem(example.AddViewSystem))
                .add(pool.createSystem(example.RenderPositionSystem))
                .add(pool.createSystem(example.DestroySystem));
        };
        return GameController;
    })();
    example.GameController = GameController;
})(example || (example = {}));
//# sourceMappingURL=GameController.js.map