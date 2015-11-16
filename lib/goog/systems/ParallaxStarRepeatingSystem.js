var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var ParallaxStarRepeatingSystem = (function () {
        function ParallaxStarRepeatingSystem() {
        }
        ParallaxStarRepeatingSystem.prototype.initialize = function () {
            //
            //var width = bosco.config.width;
            //var height = bosco.config.height;
            //
            //for (var i = 0; 500 > i; i++) {
            //  var x = Rnd.nextInt(width);
            //  var y = Rnd.nextInt(height);
            //
            //  var sprite:Sprite = bosco.prefab('star');
            //  sprite.alpha = Rnd.random(127);
            //  sprite.anchor.set(0.5, 0.5);
            //  sprite.position.set(~~x, ~~y);
            //  viewContainer.addChild(sprite);
            //
            //  this.pool.createEntity('star')
            //    .addPosition(~~x, ~~y)
            //    .addVelocity(0, Rnd.random(-10, -60))
            //    .addColorAnimation(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, Rnd.random(0.2, 0.7), false, false, false, true, true)
            //    .addSprite(Layer.BACKGROUND, sprite)
            //    .setParallaxStar(true);
            //
            //}
        };
        ParallaxStarRepeatingSystem.prototype.execute = function () {
            //var height = bosco.config.height;
            //var entities = this.group.getEntities();
            //for (var i = 0, l = entities.length; i < l; i++) {
            //  var e = entities[i];
            //  var position:PositionComponent = e.position;
            //
            //  if (position.y >= height) {
            //    position.y = 0;
            //  }
            //}
        };
        ParallaxStarRepeatingSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.ParallaxStar, Matcher.Position));
        };
        return ParallaxStarRepeatingSystem;
    })();
    example.ParallaxStarRepeatingSystem = ParallaxStarRepeatingSystem;
})(example || (example = {}));
//# sourceMappingURL=ParallaxStarRepeatingSystem.js.map