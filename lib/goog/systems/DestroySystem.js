var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var DestroySystem = (function () {
        function DestroySystem() {
        }
        DestroySystem.prototype.execute = function () {
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                viewContainer.removeChild(e.sprite.object);
                this.pool.destroyEntity(e);
            }
        };
        DestroySystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.Destroy));
        };
        return DestroySystem;
    })();
    example.DestroySystem = DestroySystem;
})(example || (example = {}));
//# sourceMappingURL=DestroySystem.js.map