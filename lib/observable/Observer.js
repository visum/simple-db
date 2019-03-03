"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var states = {
    ON: "ON",
    STOPPED: "STOPPED",
    DISPOSED: "DISPOSED"
};

var Observer = function () {
    function Observer(_ref) {
        var type = _ref.type,
            callback = _ref.callback,
            unbind = _ref.unbind;

        _classCallCheck(this, Observer);

        if (typeof unbind !== "function") {
            throw new Error("Illegal Argument: unbind needs to be a function.");
        }

        if (typeof callback !== "function") {
            throw new Error("Illegal Argument: callback needs to be a function.");
        }

        this.type = type;
        this.callback = callback;
        this.unbind = unbind;
        this.state = states.ON;
    }

    _createClass(Observer, [{
        key: "isType",
        value: function isType(event) {
            return this.type === event.type || event.type == null;
        }
    }, {
        key: "willNotify",
        value: function willNotify(event) {
            return this.isType(event) && this.state == state.ON;
        }
    }, {
        key: "notify",
        value: function notify(event) {
            if (this.willNotify(event)) {
                this.callback(event);
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.state === states.ON) {
                this.state = states.STOPPED;
            }
        }
    }, {
        key: "start",
        value: function start() {
            if (this.state === states.STOPPED) {
                this.state = states.ON;
            }
        }
    }, {
        key: "dispose",
        value: function dispose() {
            if (this.state !== states.DISPOSED) {
                this.state = states.DISPOSED;
                this.unbind();
            }
        }
    }]);

    return Observer;
}();

exports.default = Observer;
//# sourceMappingURL=Observer.js.map