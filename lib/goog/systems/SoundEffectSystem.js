var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var SoundEffectSystem = (function () {
        function SoundEffectSystem() {
            this.playSfx = false;
        }
        SoundEffectSystem.prototype.setPool = function (pool) {
            this.pool = pool;
            this.group = pool.getGroup(Matcher.allOf(Matcher.SoundEffect));
        };
        SoundEffectSystem.prototype.execute = function () {
            //if (!this.playSfx) return;
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var soundEffect = e.soundEffect;
                var sound = this.effect[soundEffect.effect];
                if (sound)
                    sound.play();
                e.removeSoundEffect();
            }
        };
        SoundEffectSystem.prototype.initialize = function () {
            var Howl = window['Howl'];
            this.pew = new Howl({ urls: ['res/sounds/pew.ogg'] });
            this.asplode = new Howl({ urls: ['res/sounds/asplode.ogg'] });
            this.smallasplode = new Howl({ urls: ['res/sounds/smallasplode.ogg'] });
            this.effect = [];
            this.effect[example.EFFECT.PEW] = this.pew;
            this.effect[example.EFFECT.ASPLODE] = this.asplode;
            this.effect[example.EFFECT.SMALLASPLODE] = this.smallasplode;
        };
        return SoundEffectSystem;
    })();
    example.SoundEffectSystem = SoundEffectSystem;
})(example || (example = {}));
//# sourceMappingURL=SoundEffectSystem.js.map