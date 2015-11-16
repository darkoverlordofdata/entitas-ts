var example;
(function (example) {
    var CreateOpponentsSystem = (function () {
        function CreateOpponentsSystem() {
        }
        CreateOpponentsSystem.prototype.setPool = function (pool) {
            this.pool = pool;
        };
        CreateOpponentsSystem.prototype.initialize = function () {
            var resourceName = "Opponent";
            for (var i = 1; i < 10; i++) {
                var speed = (Math.random() + .5) * 2;
                this.pool.createEntity('Opponent')
                    .addResource(resourceName)
                    .addPosition(i * 100 + 100, 0, 0)
                    .addMove(speed, speed);
            }
        };
        return CreateOpponentsSystem;
    })();
    example.CreateOpponentsSystem = CreateOpponentsSystem;
})(example || (example = {}));
//# sourceMappingURL=CreateOpponentsSystem.js.map