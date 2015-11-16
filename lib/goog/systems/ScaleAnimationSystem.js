var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var ScaleAnimationSystem = (function () {
        function ScaleAnimationSystem() {
        }
        ScaleAnimationSystem.prototype.execute = function () {
            var delta = bosco.delta;
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var scaleAnimation = e.scaleAnimation;
                if (scaleAnimation.active) {
                    //var sprite:Sprite = <Sprite>(e.sprite.object);
                    var scale = e.sprite.object.scale;
                    scale.x += scaleAnimation.speed * delta;
                    scale.y = scale.x;
                    if (scale.x > scaleAnimation.max) {
                        scale.x = scaleAnimation.max;
                        scale.y = scale.x;
                        scaleAnimation.active = false;
                    }
                    else if (scale.x < scaleAnimation.min) {
                        scale.x = scaleAnimation.min;
                        scale.y = scale.x;
                        scaleAnimation.active = false;
                    }
                }
            }
        };
        ScaleAnimationSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.ScaleAnimation));
        };
        return ScaleAnimationSystem;
    })();
    example.ScaleAnimationSystem = ScaleAnimationSystem;
})(example || (example = {}));
//# sourceMappingURL=ScaleAnimationSystem.js.map