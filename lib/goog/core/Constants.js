/**
 * core/Constants.ts
 *
 * Core Constants for Schmup Warz
 *
 */
var example;
(function (example) {
    (function (ScaleType) {
        ScaleType[ScaleType["FILL"] = 0] = "FILL";
        ScaleType[ScaleType["FIXED"] = 1] = "FIXED"; // scale fixed size to fit the screen
    })(example.ScaleType || (example.ScaleType = {}));
    var ScaleType = example.ScaleType;
    var Constants = (function () {
        function Constants() {
        }
        Constants.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        Constants.appName = "example";
        Constants.FRAME_WIDTH = window.innerWidth;
        Constants.FRAME_HEIGHT = window.innerHeight;
        Constants.RATIO = window.devicePixelRatio * .6;
        Constants.SCALE_TYPE = ScaleType.FILL;
        Constants.assets = {
            finish_png: 'res/Finish Line.png',
            opponent_png: 'res/Opponent.png',
            player_png: 'res/Player.png',
            square_png: 'res/Square.png'
        };
        /**
         * Prefab's
         */
        Constants.resources = {
            'Finish Line': {
                path: 'res/Finish Line.png',
                scale: {
                    x: .04,
                    y: .6,
                    z: 1
                }
            },
            'Opponent': {
                path: 'res/Opponent.png',
                scale: {
                    x: .5,
                    y: .5,
                    z: .5
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 90 * Math.PI / 180
                }
            },
            'Player': {
                path: 'res/Player.png',
                scale: {
                    x: .5,
                    y: .5,
                    z: .5
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 90 * Math.PI / 180
                }
            }
        };
        return Constants;
    })();
    example.Constants = Constants;
})(example || (example = {}));
//# sourceMappingURL=Constants.js.map