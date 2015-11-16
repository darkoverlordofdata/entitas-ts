var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var MovementSystem = (function () {
        function MovementSystem() {
        }
        MovementSystem.prototype.execute = function () {
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var delta = bosco.delta;
                e.position.x += (e.velocity.x * delta);
                e.position.y -= (e.velocity.y * delta);
            }
        };
        MovementSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.Position, Matcher.Velocity));
        };
        return MovementSystem;
    })();
    example.MovementSystem = MovementSystem;
})(example || (example = {}));
//# sourceMappingURL=MovementSystem.js.map