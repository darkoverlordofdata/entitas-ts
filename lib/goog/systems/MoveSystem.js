var example;
(function (example) {
    var Matcher = entitas.Matcher;
    var MoveSystem = (function () {
        function MoveSystem() {
        }
        MoveSystem.prototype.setPool = function (pool) {
            this.group = pool.getGroup(Matcher.allOf(Matcher.Move, Matcher.Position));
        };
        MoveSystem.prototype.execute = function () {
            var entities = this.group.getEntities();
            for (var i = 0, l = entities.length; i < l; i++) {
                var e = entities[i];
                var move = e.move;
                var pos = e.position;
                e.replacePosition(pos.x, pos.y + move.speed * .5, pos.z);
            }
        };
        return MoveSystem;
    })();
    example.MoveSystem = MoveSystem;
})(example || (example = {}));
//# sourceMappingURL=MoveSystem.js.map