/**
 * core/Constants.ts
 *
 * Core Constants for Schmup Warz
 *
 */
module example {

  export enum ScaleType {
    FILL, // fill to fit screen
    FIXED // scale fixed size to fit the screen
  }
  export class Constants {

    public static isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    public static appName = "example";
    public static FRAME_WIDTH:number = window.innerWidth;
    public static FRAME_HEIGHT:number = window.innerHeight;
    public static RATIO = window.devicePixelRatio * .6;

    public static SCALE_TYPE:ScaleType = ScaleType.FILL;

    public static assets = {

      finish_png    : 'res/Finish Line.png',
      opponent_png  : 'res/Opponent.png',
      player_png    : 'res/Player.png',
      square_png    : 'res/Square.png'
    };


  }
}

