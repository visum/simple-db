"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NodeFactory = require("./NodeFactory");

var _NodeFactory2 = _interopRequireDefault(_NodeFactory);

var _Queryable = require("./Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OperationBuilder = function () {
    function OperationBuilder(queryable, propertyName) {
        _classCallCheck(this, OperationBuilder);

        this.factory = new _NodeFactory2.default();
        this.propertyName = propertyName;
        this.queryable = queryable;
    }

    _createClass(OperationBuilder, [{
        key: "getQuery",
        value: function getQuery() {
            return this.queryable;
        }
    }, {
        key: "isIn",
        value: function isIn(value) {
            if (!(value instanceof _Queryable2.default) && !Array.isArray(value)) {
                throw new Error("Invalid Argument: value needs to be an array or a queryable.");
            }

            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "isIn", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(value) {
            if (!(value instanceof _Queryable2.default) && !Array.isArray(value)) {
                throw new Error("Invalid Argument: value needs to be an array or a queryable.");
            }

            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "isNotIn", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "endsWith",
        value: function endsWith(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "endsWith", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "startsWith",
        value: function startsWith(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "startsWith", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "contains",
        value: function contains(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "contains", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "isEqualTo", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "isNotEqualTo",
        value: function isNotEqualTo(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "isNotEqualTo", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "isGreaterThan",
        value: function isGreaterThan(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "isGreaterThan", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "isGreaterThanOrEqualTo",
        value: function isGreaterThanOrEqualTo(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "isGreaterThanOrEqualTo", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "isLessThan",
        value: function isLessThan(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "isLessThan", value);

            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }, {
        key: "isLessThanOrEqualTo",
        value: function isLessThanOrEqualTo(value) {
            var node = this.factory.createOperatorNode(this.queryable.type, this.propertyName, "isLessThanOrEqualTo", value);
            if (this.queryable.query.expression && Array.isArray(this.queryable.query.expression.children)) {
                this.queryable.query.expression.children.push(node);
            } else {
                this.queryable.query.expression = node;
            }

            return this.queryable;
        }
    }]);

    return OperationBuilder;
}();

exports.default = OperationBuilder;
//# sourceMappingURL=OperationBuilder.js.map