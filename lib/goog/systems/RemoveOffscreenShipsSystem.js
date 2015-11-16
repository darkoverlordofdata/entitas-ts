var example;
(function (example) {
    var Matcher = entitas.Matcher;
    //declare var viewContainer;
    var RemoveOffscreenShipsSystem = (function () {
        function RemoveOffscreenShipsSystem() {
        }
        RemoveOffscreenShipsSystem.prototype.execute = function () {
            var height = bosco.config.height;
            var pool = this.pool;
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                if (e.position.y > height - e.bounds.radius) {
                    e.isDestroy = true;
                }
            }
        };
        RemoveOffscreenShipsSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.Velocity, Matcher.Position, Matcher.Health, Matcher.Bounds));
        };
        return RemoveOffscreenShipsSystem;
    })();
    example.RemoveOffscreenShipsSystem = RemoveOffscreenShipsSystem;
})(example || (example = {}));
//# sourceMappingURL=RemoveOffscreenShipsSystem.js.map