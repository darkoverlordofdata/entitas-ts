var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var Exception = entitas.Exception;
    var AccelerateSystem = (function () {
        function AccelerateSystem() {
        }
        Object.defineProperty(AccelerateSystem.prototype, "trigger", {
            get: function () {
                return Matcher.Accelerating.onEntityAddedOrRemoved();
            },
            enumerable: true,
            configurable: true
        });
        AccelerateSystem.prototype.setPool = function (pool) {
            this.group = pool.getGroup(Matcher.allOf(Matcher.Acceleratable, Matcher.Move));
        };
        AccelerateSystem.prototype.execute = function (entities) {
            if (entities.length !== 1) {
                throw new Exception("Expected exactly one entity but found " + entities.length);
            }
            var accelerate = entities[0].isAccelerating;
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var move = e.move;
                var speed = accelerate ? move.maxSpeed : 0;
                e.replaceMove(speed, move.maxSpeed);
            }
        };
        return AccelerateSystem;
    })();
    example.AccelerateSystem = AccelerateSystem;
})(example || (example = {}));
//# sourceMappingURL=AccelerateSystem.js.map