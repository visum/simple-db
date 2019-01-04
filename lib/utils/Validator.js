"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PropertyValidator = function () {
    function PropertyValidator(value) {
        _classCallCheck(this, PropertyValidator);

        this.value = value;
    }

    _createClass(PropertyValidator, [{
        key: "isInstanceOf",
        value: function isInstanceOf(type) {
            return this.value instanceof type;
        }
    }, {
        key: "isArray",
        value: function isArray() {
            return Array.isArray(this.value);
        }
    }, {
        key: "isObject",
        value: function isObject() {
            return _typeof(this.value) === "object" && this.value !== null;
        }
    }, {
        key: "isNumber",
        value: function isNumber() {
            return typeof this.value === "number";
        }
    }, {
        key: "isBoolean",
        value: function isBoolean() {
            return typeof this.value === "boolean";
        }
    }, {
        key: "isString",
        value: function isString() {
            return typeof this.value === "string";
        }
    }, {
        key: "isFunction",
        value: function isFunction() {
            return typeof this.value === "function";
        }
    }, {
        key: "isNullableArray",
        value: function isNullableArray() {
            return this.isArray() || this.isNull();
        }
    }, {
        key: "isNullableObject",
        value: function isNullableObject() {
            return this.isObject() || this.isNull();
        }
    }, {
        key: "isNullableNumber",
        value: function isNullableNumber() {
            return this.isNumber() || this.isNull();
        }
    }, {
        key: "isNullableBoolean",
        value: function isNullableBoolean() {
            return this.isBoolean() || this.isNull();
        }
    }, {
        key: "isNullableString",
        value: function isNullableString() {
            return this.isString() || this.isNull();
        }
    }, {
        key: "isFunction",
        value: function isFunction() {
            return this.isFunction() || this.isNull();
        }
    }, {
        key: "isNull",
        value: function isNull() {
            return this.value === null;
        }
    }, {
        key: "isNullOrUndefined",
        value: function isNullOrUndefined() {
            return this.value == null;
        }
    }, {
        key: "isUndefined",
        value: function isUndefined() {
            return typeof this.value === "undefined";
        }
    }]);

    return PropertyValidator;
}();

var Validator = function () {
    function Validator(obj) {
        _classCallCheck(this, Validator);

        this.obj = obj;
    }

    _createClass(Validator, [{
        key: "getObject",
        value: function getObject(obj, namespace) {
            if (namespace == null || obj == null) {
                return undefined;
            }

            var properties = namespace.split(".");
            var property = properties[0];

            if (typeof obj[property] !== "undefined") {
                if (properties.length > 1) {
                    return this.getObject(obj[property], properties.slice(1));
                } else {
                    return obj[property];
                }
            } else {
                return undefined;
            }
        }
    }, {
        key: "validate",
        value: function validate(namespace) {
            var value = this.getObject(this.obj, namespace);
            return new PropertyValidator(value);
        }
    }, {
        key: "getValue",
        value: function getValue(namespace) {
            return this.getObject(this.obj, namespace);
        }
    }]);

    return Validator;
}();

exports.default = Validator;
//# sourceMappingURL=Validator.js.map