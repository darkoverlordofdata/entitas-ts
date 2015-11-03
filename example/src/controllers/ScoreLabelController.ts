module example {

  declare var foreContainer;
  declare var viewContainer;

  import Pools = example.Pools;
  import Matcher = entitas.Matcher;
  import Text = PIXI.Text;
  import ScoreComponent = example.ScoreComponent;

  export class ScoreLabelController {

    public label:Text;
    protected fps:Text;
    protected _fps:number;

    start() {

      this.label = new Text('Score', { font: 'bold 50px Arial', fill: 'white' });
      this.label.position.set((bosco.config.width - this.label.width) / 2, 10);
      viewContainer.addChild(this.label);
      var pool = Pools.pool;
      pool.getGroup(Matcher.Score).onEntityAdded.add((group, entity, index, component) => {
        this.updateScore(entity.score.value);
      });
      console.log(pool);
      this.updateScore(pool.score.value);
      this.fps = new Text('FPS', { font: 'bold 30px Arial', fill: 'white' });
      this.fps.position.set(0, 10);
      viewContainer.addChild(this.fps);

    }

    update(delta:number) {
      var fps = bosco.fps;
      if (this._fps !== fps) {
        this.fps.text = 'FPS ' + fps;
        this._fps = fps;
      }
    }

    updateScore(score:number) {
      this.label.text = 'Score '+score;
    }
  }
}