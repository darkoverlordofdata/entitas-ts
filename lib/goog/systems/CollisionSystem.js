var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var Layer = example.Layer;
    var Rnd = bosco.utils.Rnd;
    var Tau = Math.PI * 2;
    var CollisionSystem = (function () {
        function CollisionSystem() {
        }
        CollisionSystem.prototype.setPool = function (pool) {
            this.pool = pool;
        };
        /**
         * Check for Collision
         */
        CollisionSystem.prototype.execute = function () {
            var collisionPairs = this.collisionPairs;
            for (var i = 0, l = collisionPairs.length; l > i; i++) {
                collisionPairs[i].checkForCollisions();
            }
        };
        /**
         * Create collision handlers
         */
        CollisionSystem.prototype.initialize = function () {
            var _this = this;
            this.pool.setScore(0);
            this.bullets = this.pool.getGroup(Matcher.Bullet);
            this.enemies = this.pool.getGroup(Matcher.Enemy);
            /** Check for bullets hitting enemy ship */
            this.collisionPairs = [];
            this.collisionPairs.push(new CollisionPair(this, this.bullets, this.enemies, {
                handleCollision: function (bullet, ship) {
                    var bp = bullet.position;
                    var health = ship.health;
                    var position = ship.position;
                    var x = bp.x;
                    var y = bp.y;
                    _this.explode("small", .1, x, y);
                    var i = 5;
                    while (--i > 0)
                        _this.particle(x, y);
                    bullet.setDestroy(true);
                    health.health -= 1;
                    if (health.health < 0) {
                        var score = (_this.pool.score);
                        _this.pool.replaceScore(score.value + ship.health.maximumHealth);
                        ship.setDestroy(true);
                        _this.explode("big", 0.5, position.x, position.y);
                    }
                }
            }));
        };
        /**
         * Create an explosion
         * @param name
         * @param size
         * @param x
         * @param y
         */
        CollisionSystem.prototype.explode = function (name, scale, x, y) {
            this.pool.createEntity(name)
                .addExpires(0.5)
                .addScaleAnimation(scale / 100, scale, -3, false, true)
                .addPosition(~~x, ~~y)
                .addScale(scale, scale)
                .addLayer(Layer.PARTICLES)
                .addResource('explosion');
        };
        /**
         * Bullet hit - create some shrapnel particles
         * @param x
         * @param y
         */
        CollisionSystem.prototype.particle = function (x, y) {
            var radians = Math.random() * Tau;
            var magnitude = Rnd.random(200);
            var velocityX = magnitude * Math.cos(radians);
            var velocityY = magnitude * Math.sin(radians);
            var scale = Rnd.random(0.5, 1);
            this.pool.createEntity('particle')
                .addExpires(1)
                .addColorAnimation(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, false, false, false, true, true)
                .addPosition(~~x, ~~y)
                .addVelocity(velocityX, velocityY)
                .addScale(scale, scale)
                .addLayer(Layer.PARTICLES)
                .addResource('particle');
        };
        return CollisionSystem;
    })();
    example.CollisionSystem = CollisionSystem;
    /**
     *
     */
    var CollisionPair = (function () {
        function CollisionPair(cs, group1, group2, handler) {
            this.groupEntitiesA = group1;
            this.groupEntitiesB = group2;
            this.handler = handler;
            this.cs = cs;
        }
        CollisionPair.prototype.checkForCollisions = function () {
            var handler = this.handler;
            var groupEntitiesA = this.groupEntitiesA.getEntities();
            var groupEntitiesB = this.groupEntitiesB.getEntities();
            var sizeA = groupEntitiesA.length;
            var sizeB = groupEntitiesB.length;
            for (var a = 0; sizeA > a; a++) {
                var entityA = groupEntitiesA[a];
                for (var b = 0; sizeB > b; b++) {
                    var entityB = groupEntitiesB[b];
                    if (this.collisionExists(entityA, entityB)) {
                        handler.handleCollision(entityA, entityB);
                    }
                }
            }
        };
        CollisionPair.prototype.collisionExists = function (e1, e2) {
            if (e1 === null || e2 === null)
                return false;
            var p1 = e1.position;
            var p2 = e2.position;
            var b1 = e1.bounds;
            var b2 = e2.bounds;
            var a = p1.x - p2.x;
            var b = p1.y - p2.y;
            return Math.sqrt(a * a + b * b) - (b1.radius) < (b2.radius);
        };
        return CollisionPair;
    })();
})(example || (example = {}));
//# sourceMappingURL=CollisionSystem.js.map