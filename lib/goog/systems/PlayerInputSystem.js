var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var Layer = example.Layer;
    var PlayerInputSystem = (function () {
        function PlayerInputSystem() {
            var _this = this;
            this.timeToFire = 0;
            this.onTouchStart = function (event) {
                event = event.changedTouches ? event.changedTouches[0] : event;
                _this.shoot = true;
                _this.mouseVector = {
                    x: parseInt(event.clientX),
                    y: parseInt(event.clientY)
                };
                return true;
            };
            this.onTouchMove = function (event) {
                event = event.changedTouches ? event.changedTouches[0] : event;
                _this.mouseVector = {
                    x: parseInt(event.clientX),
                    y: parseInt(event.clientY)
                };
                return true;
            };
            this.onTouchEnd = function (event) {
                _this.shoot = false;
            };
        }
        PlayerInputSystem.prototype.execute = function () {
            var entities = this.group.getEntities();
            if (entities.length === 0)
                return;
            var e = entities[0];
            if (this.mouseVector === undefined)
                return;
            var position = e.position;
            var destinationX = this.mouseVector.x;
            var destinationY = this.mouseVector.y;
            if (destinationX === undefined || destinationY === undefined)
                return;
            position.x = this.mouseVector.x;
            position.y = this.mouseVector.y;
            if (this.shoot) {
                if (this.timeToFire <= 0) {
                    this.createBullet(position.x - 27, position.y + 2);
                    this.createBullet(position.x + 27, position.y + 2);
                    this.timeToFire = PlayerInputSystem.FireRate;
                }
            }
            if (this.timeToFire > 0) {
                this.timeToFire -= bosco.delta;
                if (this.timeToFire < 0) {
                    this.timeToFire = 0;
                }
            }
        };
        PlayerInputSystem.prototype.createBullet = function (x, y) {
            this.pool.createEntity('bullet')
                .addPosition(~~x, ~~y)
                .addVelocity(0, 800)
                .addBounds(5)
                .addExpires(1)
                .addSoundEffect(example.EFFECT.PEW)
                .addLayer(Layer.PARTICLES)
                .addResource('bullet')
                .setBullet(true);
        };
        PlayerInputSystem.prototype.initialize = function () {
            document.addEventListener('touchstart', this.onTouchStart, true);
            document.addEventListener('touchmove', this.onTouchMove, true);
            document.addEventListener('touchend', this.onTouchEnd, true);
            document.addEventListener('mousedown', this.onTouchStart, true);
            document.addEventListener('mousemove', this.onTouchMove, true);
            document.addEventListener('mouseup', this.onTouchEnd, true);
            this.pool.createEntity('Player')
                .addBounds(43)
                .addVelocity(0, 0)
                .addPosition(~~(bosco.config.width / 4), ~~(bosco.config.height - 80))
                .addLayer(Layer.ACTORS_3)
                .addResource('fighter')
                .setPlayer(true);
        };
        PlayerInputSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.Player));
        };
        PlayerInputSystem.FireRate = .1;
        return PlayerInputSystem;
    })();
    example.PlayerInputSystem = PlayerInputSystem;
})(example || (example = {}));
//# sourceMappingURL=PlayerInputSystem.js.map