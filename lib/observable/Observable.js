"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Observer = _interopRequireDefault(require("./Observer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Observable {
  constructor() {
    this.observers = [];
  }

  notify(event) {
    this.observers.forEach(observer => {
      observer.notify(event);
    });
  }

  observe(type, callback) {
    const observer = new _Observer.default({
      type,
      callback,
      unbind: () => {
        const index = this.observers.indexOf(observer);

        if (index >= 0) {
          this.observers.splice(index, 1);
        }
      }
    });
    return observer;
  }

}

exports.default = Observable;
//# sourceMappingURL=Observable.js.map