var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var SpriteRenderSystem = (function () {
        function SpriteRenderSystem() {
        }
        SpriteRenderSystem.prototype.execute = function () {
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var sprite = e.sprite.object;
                sprite.position.set(e.position.x, e.position.y);
            }
        };
        SpriteRenderSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.Position, Matcher.Sprite));
        };
        return SpriteRenderSystem;
    })();
    example.SpriteRenderSystem = SpriteRenderSystem;
})(example || (example = {}));
//# sourceMappingURL=SpriteRenderSystem.js.map