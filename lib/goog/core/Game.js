/**
 * core/Game.ts
 *
 * Top level application object
 *
 */
var example;
(function (example) {
    var Container = PIXI.Container;
    var Constants = example.Constants;
    var GameController = example.GameController;
    var Game = (function () {
        /**
         * Create the game instance
         * @param resources
         */
        function Game(resources) {
            var _this = this;
            /**
             * Game Loop
             * @param time
             */
            this.update = function (time) {
                _this.stats.begin();
                _this.delta = _this.previousTime || time;
                _this.previousTime = time;
                if (_this.controller)
                    _this.controller.update((time - _this.delta) * 0.001);
                _this.renderer.render(_this.stage);
                _this.stats.end();
                requestAnimationFrame(_this.update);
            };
            /**
             * Resize window
             */
            this.resize = function () {
                switch (Constants.SCALE_TYPE) {
                    case example.ScaleType.FILL:
                        var height = window.innerHeight;
                        var width = window.innerWidth;
                        _this.renderer.resize(width, height);
                        break;
                    case example.ScaleType.FIXED:
                        _this.renderer.view.style.width = window.innerWidth + 'px';
                        _this.renderer.view.style.height = window.innerHeight + 'px';
                        break;
                }
            };
            var stats = this.stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            this.stage = new Container();
            viewContainer = this.sprites = new Container();
            var renderer = this.renderer = PIXI.autoDetectRenderer(Constants.FRAME_WIDTH, Constants.FRAME_HEIGHT, { backgroundColor: 0xffffff });
            switch (Constants.SCALE_TYPE) {
                case example.ScaleType.FILL:
                    this.renderer.view.style.position = 'absolute';
                    break;
                case example.ScaleType.FIXED:
                    renderer.view.style.position = 'absolute';
                    renderer.view.style.width = window.innerWidth + 'px';
                    renderer.view.style.height = window.innerHeight + 'px';
                    renderer.view.style.display = 'block';
                    break;
            }
            document.body.appendChild(renderer.view);
            document.body.appendChild(stats.domElement);
            window.addEventListener('resize', this.resize, true);
            window.onorientationchange = this.resize;
            this.stage.addChild(this.sprites);
            this.controller = new GameController();
            this.controller.start();
            requestAnimationFrame(this.update);
        }
        /**
         * Load assets and start
         */
        Game.main = function () {
            for (var asset in Constants.assets) {
                PIXI.loader.add(asset, Constants.assets[asset]);
            }
            PIXI.loader.load(function (loader, resources) { return new Game(resources); });
        };
        return Game;
    })();
    example.Game = Game;
})(example || (example = {}));
//# sourceMappingURL=Game.js.map