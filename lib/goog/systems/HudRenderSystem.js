var example;
(function (example) {
    var BitmapText = PIXI.extras.BitmapText;
    var HudRenderSystem = (function () {
        function HudRenderSystem() {
        }
        HudRenderSystem.prototype.initialize = function () {
            var font = { font: '36px Radio Stars', align: 'left' };
            this.activeEntities = new BitmapText("Active entitiez:           ", font);
            this.totalCreated = new BitmapText("Total created:          ", font);
            this.totalDeleted = new BitmapText("Total deleted:          ", font);
            this.activeEntities.scale.set(0.5);
            this.totalCreated.scale.set(0.5);
            this.totalDeleted.scale.set(0.5);
            this.activeEntities.position.set(0, 20);
            this.totalCreated.position.set(0, 40);
            this.totalDeleted.position.set(0, 60);
            viewContainer.addChild(this.activeEntities);
            viewContainer.addChild(this.totalCreated);
            viewContainer.addChild(this.totalDeleted);
        };
        HudRenderSystem.prototype.execute = function () {
            var pool = this.pool;
            var size = pool.count;
            this.activeEntities.text = "Active entities: " + size;
            this.totalCreated.text = "Total created: " + pool.reusableEntitiesCount;
            this.totalDeleted.text = "Total deleted: " + (pool._creationIndex - size);
        };
        HudRenderSystem.prototype.setPool = function (pool) {
            this.pool = pool;
        };
        return HudRenderSystem;
    })();
    example.HudRenderSystem = HudRenderSystem;
})(example || (example = {}));
//# sourceMappingURL=HudRenderSystem.js.map