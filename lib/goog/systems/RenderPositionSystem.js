var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var RenderPositionSystem = (function () {
        function RenderPositionSystem() {
        }
        Object.defineProperty(RenderPositionSystem.prototype, "trigger", {
            get: function () {
                return Matcher.allOf(Matcher.View, Matcher.Position).onEntityAdded();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderPositionSystem.prototype, "ensureComponents", {
            get: function () {
                return Matcher.View;
            },
            enumerable: true,
            configurable: true
        });
        RenderPositionSystem.prototype.execute = function (entities) {
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var pos = e.position;
                var sprite = e.view.sprite;
                sprite.position.set(pos.x, pos.y);
            }
        };
        return RenderPositionSystem;
    })();
    example.RenderPositionSystem = RenderPositionSystem;
})(example || (example = {}));
//# sourceMappingURL=RenderPositionSystem.js.map