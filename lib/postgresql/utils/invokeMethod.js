"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (obj, methodName, args, fallbackResult) => {
  if (!Array.isArray(args)) {
    args = [];
  }

  if (obj != null && typeof obj[methodName] === "function") {
    return obj[methodName].apply(obj, args);
  }

  return fallbackResult;
};

exports.default = _default;
//# sourceMappingURL=invokeMethod.js.map