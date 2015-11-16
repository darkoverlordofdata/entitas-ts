var example;
(function (example) {
    var Pools = example.Pools;
    var Matcher = entitas.Matcher;
    var Text = PIXI.Text;
    var ScoreLabelController = (function () {
        function ScoreLabelController() {
        }
        ScoreLabelController.prototype.start = function () {
            var _this = this;
            this.label = new Text('Score', { font: 'bold 50px Arial', fill: 'white' });
            this.label.position.set((bosco.config.width - this.label.width) / 2, 10);
            viewContainer.addChild(this.label);
            var pool = Pools.pool;
            pool.getGroup(Matcher.Score).onEntityAdded.add(function (group, entity, index, component) {
                _this.updateScore(entity.score.value);
            });
            console.log(pool);
            this.updateScore(pool.score.value);
            this.fps = new Text('FPS', { font: 'bold 30px Arial', fill: 'white' });
            this.fps.position.set(0, 10);
            viewContainer.addChild(this.fps);
        };
        ScoreLabelController.prototype.update = function (delta) {
            var fps = bosco.fps;
            if (this._fps !== fps) {
                this.fps.text = 'FPS ' + fps;
                this._fps = fps;
            }
        };
        ScoreLabelController.prototype.updateScore = function (score) {
            this.label.text = 'Score ' + score;
        };
        return ScoreLabelController;
    })();
    example.ScoreLabelController = ScoreLabelController;
})(example || (example = {}));
//# sourceMappingURL=ScoreLabelController.js.map