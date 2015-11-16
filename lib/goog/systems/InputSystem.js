var example;
(function (example) {
    //[Core]
    var InputSystem = (function () {
        function InputSystem() {
            var _this = this;
            this._mouseDown = false;
            this.onTouchStart = function (event) {
                _this._mouseDown = true;
                return true;
            };
            this.onTouchEnd = function (event) {
                _this._mouseDown = false;
            };
        }
        InputSystem.prototype.setPool = function (pool) {
            this._pool = pool;
        };
        InputSystem.prototype.initialize = function () {
            document.addEventListener('touchstart', this.onTouchStart, true);
            document.addEventListener('touchend', this.onTouchEnd, true);
            document.addEventListener('mousedown', this.onTouchStart, true);
            document.addEventListener('mouseup', this.onTouchEnd, true);
        };
        InputSystem.prototype.execute = function () {
            this._pool.isAccelerating = this._mouseDown;
        };
        return InputSystem;
    })();
    example.InputSystem = InputSystem;
})(example || (example = {}));
//# sourceMappingURL=InputSystem.js.map