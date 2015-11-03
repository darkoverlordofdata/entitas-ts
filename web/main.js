/**
 *
 *     __  __         ___                            ___  ___
 *    / /_/ /  ___   / _ \___ _    _____ ____  ___  / _/ / _ )___  ___ _______
 *   / __/ _ \/ -_) / ___/ _ \ |/|/ / -_) __/ / _ \/ _/ / _  / _ \(_-</ __/ _ \
 *   \__/_//_/\__/ /_/   \___/__,__/\__/_/    \___/_/  /____/\___/___/\__/\___/
 *
 *
 *
 */
bosco.start({
    "namespace": "example",
    "controllers": [
        "GameController"
    ],
    "width": window.innerWidth,
    "height": window.innerHeight,
    "fullScreen": false,
    "scale": false,
    "scaleType": "FILL",
    "stats": true,
    "storage": false,
    "options": {
        "antialiasing": false,
        "transparent": false,
        "resolution": window.devicePixelRatio,
        "autoResize": true,
        "backgroundColor": "0x3c3c3c"
    },
    "assets": {
        "images": (window.devicePixelRatio >= 2) ? "res/images@2x.json" : "res/images.json",
        "normal_fnt"        : "res/fonts/normal.fnt",
        "hud_fnt"           : "res/fonts/hud.fnt"
    },
    "resources": {
        "bullet" : {
            "path": "bullet.png",
            "tint": 0xffd800ff,
            "anchor": {x:0.5, y:0.5}
        },
        "enemy1"  : {
            "path": "enemy1.png",
            "tint": 0xff008e,
            "anchor": {x:0.5, y:0.5}

        },
        "enemy2"  : {
            "path": "enemy2.png",
            "tint": 0xff008e,
            "anchor": {x:0.5, y:0.5}

        },
        "enemy3"  : {
            "path": "enemy3.png",
            "tint": 0xff008e,
            "anchor": {x:0.5, y:0.5}

        },
        "explosion"  : {
            "path": "explosion.png",
            "tint": 0xffd80080,
            "anchor": {x:0.5, y:0.5}

        },
        "fighter"  : {
            "path": "fighter.png",
            "tint": 0x5dff81,
            "anchor": {x:0.5, y:0.5}

        },
        "particle"  : {
            "path": "particle.png",
            "tint": 0xffd800ff,
            "anchor": {x:0.5, y:0.5}

        },
        "star"  : {
            "path": "particle.png",
            "tint": 0xffd800ff,
            "anchor": {x:0.5, y:0.5}

        }

    },


    "properties": {
        "skip": "false",
        "leaderboard": "off",
        "player": "",
        "userId": "",
        "playMusic": "true",
        "playSfx": "true"
    }
});

