var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var RemoveViewSystem = (function () {
        function RemoveViewSystem() {
        }
        Object.defineProperty(RemoveViewSystem.prototype, "triggers", {
            get: function () {
                return [
                    Matcher.Resource.onEntityRemoved(),
                    Matcher.allOf(Matcher.Resource, Matcher.Destroy).onEntityAdded()
                ];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RemoveViewSystem.prototype, "ensureComponents", {
            get: function () {
                return Matcher.View;
            },
            enumerable: true,
            configurable: true
        });
        RemoveViewSystem.prototype.setPool = function (pool) {
            pool.getGroup(Matcher.View).onEntityRemoved.add(this.onEntityRemoved);
        };
        RemoveViewSystem.prototype.onEntityRemoved = function (group, entity, index, component) {
            viewContainer.removeChild(component.sprite);
        };
        RemoveViewSystem.prototype.execute = function (entities) {
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                e.removeView();
            }
        };
        return RemoveViewSystem;
    })();
    example.RemoveViewSystem = RemoveViewSystem;
})(example || (example = {}));
//# sourceMappingURL=RemoveViewSystem.js.map