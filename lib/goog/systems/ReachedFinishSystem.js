var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var ReachedFinishSystem = (function () {
        function ReachedFinishSystem() {
        }
        Object.defineProperty(ReachedFinishSystem.prototype, "trigger", {
            get: function () {
                return Matcher.Position.onEntityAdded();
            },
            enumerable: true,
            configurable: true
        });
        ReachedFinishSystem.prototype.setPool = function (pool) {
            this.pool = pool;
        };
        ReachedFinishSystem.prototype.execute = function (entities) {
            var finishLinePosY = this.pool.finishLineEntity.position.y * 50;
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                if (e.position.y > finishLinePosY) {
                    e.isDestroy = true;
                }
            }
        };
        return ReachedFinishSystem;
    })();
    example.ReachedFinishSystem = ReachedFinishSystem;
})(example || (example = {}));
//# sourceMappingURL=ReachedFinishSystem.js.map