/**
 * Extensions for Example
 */
module example.extensions {

  const Tau = Math.PI*2;

  import Entity = entitas.Entity;
  import Layer = example.Layer;
  import Effect = example.Effect;
  import Rnd = bosco.utils.Rnd;

  /**
   * Create the player
   */
  entitas.Pool.prototype.createPlayer = function() {
    this.createEntity('Player')
      .addBounds(43)
      .addVelocity(0, 0)
      .addPosition(~~(bosco.config.width/4), ~~(bosco.config.height-80))
      .addLayer(Layer.ACTORS_3)
      .addResource('fighter')
      .setPlayer(true);
  };

  /**
   * Create a bullet at (x,y)
   *
   * @param x
   * @param y
   */
  entitas.Pool.prototype.createBullet = function (x: number, y: number) {
    this.createEntity('Bullet')
      .addPosition(~~x, ~~y)
      .addVelocity(0, 800)
      .addBounds(5)
      .addExpires(1)
      .addSoundEffect(Effect.PEW)
      .addLayer(Layer.PARTICLES)
      .addResource('bullet')
      .setBullet(true);

  };

  /**
   * Create a particle at (x,y)
   *
   * @param x
   * @param y
   */
  entitas.Pool.prototype.createParticle = function (x: number, y: number) {
    var radians: number = Math.random() * Tau;
    var magnitude: number = Rnd.random(200);
    var velocityX = magnitude * Math.cos(radians);
    var velocityY = magnitude * Math.sin(radians);
    var scale = Rnd.random(0.5, 1);

    this.createEntity('Particle')
      .addExpires(1)
      .addColorAnimation(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, false, false, false, true, true)
      .addPosition(~~x, ~~y)
      .addVelocity(velocityX, velocityY)
      .addScale(scale, scale)
      .addLayer(Layer.PARTICLES)
      .addResource('particle');
  };

  /**
   * Create a small explosion at (x,y)
   *
   * @param x
   * @param y
   */
  entitas.Pool.prototype.createSmallExplosion = function (x: number, y: number) {
    var scale = .1;
    this.createEntity('SmallExp')
      .addExpires(0.5)
      .addScaleAnimation(scale / 100, scale, -3, false, true)
      .addPosition(~~x, ~~y)
      .addScale(scale, scale)
      .addLayer(Layer.PARTICLES)
      .addResource('explosion');
  };

  /**
   * Create a big explosion at (x,y)
   *
   * @param x
   * @param y
   */
  entitas.Pool.prototype.createBigExplosion = function (x: number, y: number) {
    var scale = .5;
    this.createEntity('BigExp')
      .addExpires(0.5)
      .addScaleAnimation(scale / 100, scale, -3, false, true)
      .addPosition(~~x, ~~y)
      .addScale(scale, scale)
      .addLayer(Layer.PARTICLES)
      .addResource('explosion');
  };

  /**
   * Create enemy ship #1
   *
   */
  entitas.Pool.prototype.createEnemy1 = function() {
    var x = Rnd.nextInt(bosco.config.width);
    var y = bosco.config.height/2 - 200;
    this.createEntity("Enemy1")
      .addBounds(20)
      .addPosition(~~x, ~~y)
      .addVelocity(0, -40)
      .addLayer(Layer.ACTORS_1)
      .addResource('enemy1')
      .addHealth(10, 10)
      .setEnemy(true);

  };

  /**
   * Create enemy ship #2
   */
  entitas.Pool.prototype.createEnemy2 = function() {
    var x = Rnd.nextInt(bosco.config.width);
    var y = bosco.config.height/2 - 100;
    this.createEntity("Enemy2")
      .addBounds(40)
      .addPosition(~~x, ~~y)
      .addVelocity(0, -30)
      .addLayer(Layer.ACTORS_2)
      .addResource('enemy2')
      .addHealth(20, 20)
      .setEnemy(true);
  };

  /**
   * Create enemy ship #3
   */
  entitas.Pool.prototype.createEnemy3 = function() {
    var x = Rnd.nextInt(bosco.config.width);
    var y = bosco.config.height/2 - 50;
    this.createEntity("Enemy3")
      .addBounds(70)
      .addPosition(~~x, ~~y)
      .addVelocity(0, -20)
      .addLayer(Layer.ACTORS_3)
      .addResource('enemy3')
      .addHealth(60, 60)
      .setEnemy(true);
  };

}