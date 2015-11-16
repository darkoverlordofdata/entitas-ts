var example;
(function (example) {
    var Matcher = entitas.Matcher;
    //declare var viewContainer;
    var ExpiringSystem = (function () {
        function ExpiringSystem() {
        }
        ExpiringSystem.prototype.execute = function () {
            var pool = this.pool;
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                if ((e.expires.delay -= bosco.delta) <= 0) {
                    e.isDestroy = true;
                }
            }
        };
        ExpiringSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.Expires));
        };
        return ExpiringSystem;
    })();
    example.ExpiringSystem = ExpiringSystem;
})(example || (example = {}));
//# sourceMappingURL=ExpiringSystem.js.map