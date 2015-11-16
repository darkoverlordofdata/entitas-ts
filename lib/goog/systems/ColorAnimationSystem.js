var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var ColorAnimationSystem = (function () {
        function ColorAnimationSystem() {
        }
        ColorAnimationSystem.prototype.execute = function () {
            var delta = bosco.delta;
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var c = e.colorAnimation;
                var sprite = e.sprite.object;
                if (c.alphaAnimate) {
                    sprite.alpha += c.alphaSpeed * delta;
                    if (sprite.alpha > c.alphaMax || sprite.alpha < c.alphaMin) {
                        if (c.repeat) {
                            c.alphaSpeed = -c.alphaSpeed;
                        }
                        else {
                            c.alphaAnimate = false;
                        }
                    }
                }
            }
        };
        ColorAnimationSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.ColorAnimation, Matcher.Sprite));
        };
        return ColorAnimationSystem;
    })();
    example.ColorAnimationSystem = ColorAnimationSystem;
})(example || (example = {}));
//# sourceMappingURL=ColorAnimationSystem.js.map