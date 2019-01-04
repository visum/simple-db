"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isObject = function isObject(obj) {
  return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj !== null && !Array.isArray(obj);
};

var isPrimitive = function isPrimitive(value) {
  return !Array.isArray(value) && !isObject(value);
};

var clone = function clone(obj) {
  if (isPrimitive(obj)) {
    return obj;
  }

  var result = Array.isArray(obj) ? [] : {};

  Object.keys(obj).forEach(function (key) {
    result[key] = clone(obj[key]);
  });

  return result;
};

var overlay = function overlay(bottom, top) {
  if (bottom == null && top != null) {
    return clone(top);
  }

  if (top == null && bottom != null) {
    return clone(bottom);
  }

  var result = clone(top);

  if (isPrimitive(bottom)) {
    if ((typeof bottom === "undefined" ? "undefined" : _typeof(bottom)) === (typeof top === "undefined" ? "undefined" : _typeof(top))) {
      return top;
    } else {
      return bottom;
    }
  }

  Object.keys(bottom).forEach(function (key) {
    if (Array.isArray(bottom[key])) {
      if (Array.isArray(top[key])) {
        result[key] = overlay(bottom[key], top[key]);
      } else {
        result[key] = clone(bottom[key]);
      }
    } else if (isObject(bottom[key])) {
      if (isObject(top[key])) {
        result[key] = overlay(bottom[key], top[key]);
      } else {
        result[key] = clone(bottom[key]);
      }
    } else if (isPrimitive(bottom[key])) {
      if (_typeof(bottom[key]) === _typeof(top[key])) {
        result[key] = overlay(bottom[key], top[key]);
      } else {
        result[key] = clone(bottom[key]);
      }
    }
  });

  return result;
};

exports.default = overlay;
//# sourceMappingURL=overlay.js.map