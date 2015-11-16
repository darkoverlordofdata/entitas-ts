var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var BitmapText = PIXI.extras.BitmapText;
    var HealthRenderSystem = (function () {
        function HealthRenderSystem() {
            var _this = this;
            this.onEntityAdded = function (group, e, index, component) {
                // add a text element to the sprite
                var b = new BitmapText('100%', { font: '20px Radio Stars', align: 'left' });
                b.scale.set(0.5, 0.5);
                viewContainer.addChild(b);
                _this.texts[e.id] = b;
            };
            this.onEntityRemoved = function (group, e, index, component) {
                // remove the text element from the sprite
                viewContainer.removeChild(_this.texts[e.id]);
                _this.texts[e.id] = null;
                delete _this.texts[e.id];
            };
            this.texts = {};
        }
        HealthRenderSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.Position, Matcher.Health));
            pool.getGroup(Matcher.Enemy).onEntityAdded.add(this.onEntityAdded);
            pool.getGroup(Matcher.Enemy).onEntityRemoved.add(this.onEntityRemoved);
        };
        HealthRenderSystem.prototype.execute = function () {
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                if (this.texts[e.id]) {
                    var position = e.position;
                    var health = e.health;
                    var text = this.texts[e.id];
                    var percentage = Math.round(health.health / health.maximumHealth * 100);
                    text.position.set(position.x, position.y);
                    text.text = percentage + "%";
                }
            }
        };
        return HealthRenderSystem;
    })();
    example.HealthRenderSystem = HealthRenderSystem;
})(example || (example = {}));
//# sourceMappingURL=HealthRenderSystem.js.map