var example;
(function (example) {
    var Layer = example.Layer;
    var Rnd = bosco.utils.Rnd;
    var Timer = bosco.utils.Timer;
    var EntitySpawningTimerSystem = (function () {
        function EntitySpawningTimerSystem() {
        }
        EntitySpawningTimerSystem.prototype.execute = function () {
            var rnd = Math.random();
            if (rnd < .5)
                rnd = 1 - rnd;
            var delta = rnd * bosco.delta;
            this.timer1.update(delta);
            this.timer2.update(delta);
            this.timer3.update(delta);
        };
        EntitySpawningTimerSystem.prototype.initialize = function () {
            var _this = this;
            this.timer1 = new Timer(2, true);
            this.timer1.execute = function () {
                var x = Rnd.nextInt(bosco.config.width);
                var y = bosco.config.height / 2 - 200;
                _this.pool.createEntity("Enemy1")
                    .addBounds(20)
                    .addPosition(~~x, ~~y)
                    .addVelocity(0, -40)
                    .addLayer(Layer.ACTORS_1)
                    .addResource('enemy1')
                    .addHealth(10, 10)
                    .setEnemy(true);
            };
            this.timer2 = new Timer(6, true);
            this.timer2.execute = function () {
                var x = Rnd.nextInt(bosco.config.width);
                var y = bosco.config.height / 2 - 100;
                _this.pool.createEntity("Enemy2")
                    .addBounds(40)
                    .addPosition(~~x, ~~y)
                    .addVelocity(0, -30)
                    .addLayer(Layer.ACTORS_2)
                    .addResource('enemy2')
                    .addHealth(20, 20)
                    .setEnemy(true);
            };
            this.timer3 = new Timer(12, true);
            this.timer3.execute = function () {
                var x = Rnd.nextInt(bosco.config.width);
                var y = bosco.config.height / 2 - 50;
                _this.pool.createEntity("Enemy3")
                    .addBounds(70)
                    .addPosition(~~x, ~~y)
                    .addVelocity(0, -20)
                    .addLayer(Layer.ACTORS_3)
                    .addResource('enemy3')
                    .addHealth(60, 60)
                    .setEnemy(true);
            };
        };
        EntitySpawningTimerSystem.prototype.setPool = function (pool) {
            this.pool = pool;
        };
        return EntitySpawningTimerSystem;
    })();
    example.EntitySpawningTimerSystem = EntitySpawningTimerSystem;
})(example || (example = {}));
//# sourceMappingURL=EntitySpawningTimerSystem.js.map