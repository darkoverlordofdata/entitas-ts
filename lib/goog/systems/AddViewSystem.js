var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var AddViewSystem = (function () {
        function AddViewSystem() {
            /**
             * OnEntityAdded - Resource component.
             *
             * @param group
             * @param e
             * @param index
             * @param component
             */
            this.onEntityAdded = function (group, e, index, component) {
                var sprite = bosco.prefab(e.resource.name);
                var position = e.position;
                sprite.position.set(position.x, position.y);
                if (e.hasScale) {
                    var scale = e.scale;
                    sprite.scale.set(scale.x, scale.y);
                }
                viewContainer.addChild(sprite);
                e.addSprite(e.layer.ordinal, sprite);
            };
        }
        AddViewSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            pool.getGroup(Matcher.Resource).onEntityAdded.add(this.onEntityAdded);
        };
        return AddViewSystem;
    })();
    example.AddViewSystem = AddViewSystem;
})(example || (example = {}));
//# sourceMappingURL=AddViewSystem.js.map