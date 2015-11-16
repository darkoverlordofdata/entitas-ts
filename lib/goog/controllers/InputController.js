var example;
(function (example) {
    var Input = bosco.utils.Input;
    var Pools = example.Pools;
    var InputController = (function () {
        function InputController() {
        }
        InputController.prototype.start = function () {
            Pools.pool.replaceMouse(0, 0);
        };
        InputController.prototype.update = function (delta) {
            var pos = Input.mousePosition;
            Pools.pool.mouse.x = pos.x;
            Pools.pool.mouse.y = pos.y;
            Pools.pool.isFiring = Input.getMouseButton(0);
        };
        return InputController;
    })();
    example.InputController = InputController;
})(example || (example = {}));
//# sourceMappingURL=InputController.js.map