module {{ namespace }} {

  declare var foreContainer;
  declare var viewContainer;

  import Pools = {{ namespace }}.Pools;
  import Matcher = entitas.Matcher;
  import Text = PIXI.Text;
  import ScoreComponent = {{ namespace }}.ScoreComponent;

  export class ScoreLabelController {

    public label:Text;

    start() {

      this.label = new Text('Score', {font:'bold 50px Arial', fill:'white'});
      this.label.position.set((bosco.config.width-this.label.width)/2, 10);
      viewContainer.addChild(this.label);
      var pool = Pools.pool;
      pool.getGroup(Matcher.Score).onEntityAdded.add((group, entity, index, component) => {
        this.updateScore(entity.score.value);
      });
      this.updateScore((<ScoreComponent>pool.score).value);

    }

    update(delta:number) {
    }

    updateScore(score:number) {
      this.label.text = 'Score '+score;
    }
  }
}