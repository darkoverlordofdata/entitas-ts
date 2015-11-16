var example;
(function (example) {
    var CreatePlayerSystem = (function () {
        function CreatePlayerSystem() {
        }
        CreatePlayerSystem.prototype.setPool = function (pool) {
            this.pool = pool;
        };
        CreatePlayerSystem.prototype.initialize = function () {
            this.pool.createEntity('Player')
                .addResource("Player")
                .addPosition(100, 0, 0)
                .addMove(0, 25)
                .setAcceleratable(true);
        };
        return CreatePlayerSystem;
    })();
    example.CreatePlayerSystem = CreatePlayerSystem;
})(example || (example = {}));
//# sourceMappingURL=CreatePlayerSystem.js.map