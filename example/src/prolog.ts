module example {
  export enum Layer {
    DEFAULT,
    BACKGROUND,
    ACTORS_1,
    ACTORS_2,
    ACTORS_3,
    PARTICLES

    // getLayerId() {
    // 	return ordinal();
    // }
  }
  export enum EFFECT {
    PEW, ASPLODE, SMALLASPLODE

  }

  export enum Groups {
    PLAYER_BULLETS,
    PLAYER_SHIP,
    ENEMY_SHIPS,
    ENEMY_BULLETS
  }

}
