module example {

  declare var viewContainer;

  export class MenuController {

    protected gui;

    start() {
      var theme = bosco.config.theme;
      
      EZGUI.Theme.load([`assets/${theme}-theme/${theme}-theme.json`], () => {

        this.gui = EZGUI.create(bosco.config.ezgui.menu, theme);
        this.gui.on('play', (event, btn) => bosco.controller('game'));
        this.gui.on('options', (event, btn) => bosco.controller('game'));
        viewContainer.addChild(this.gui);

      });
    }

    stop() {
      viewContainer.removeChild(this.gui);
    }

    update(delta:number) {
    }
  }
}