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
            var valueNode = void 0;
            var node = this.factory.createIsInNode();
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            if (Array.isArray(value)) {
                valueNode = this.factory.createValueNode(value);
            } else if (value instanceof _Queryable2.default) {
                valueNode = this.factory.createQueryableValueNode(value);
            } else {
                throw new Error("Invalid Argument: value needs to be an array or a queryable.");
            }

            node.children.push(propertyNode, valueNode);

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
            var valueNode = void 0;
            var node = this.factory.createIsNotInNode();
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            if (Array.isArray(value)) {
                valueNode = this.factory.createValueNode(value);
            } else if (value instanceof _Queryable2.default) {
                valueNode = this.factory.createQueryableValueNode(value);
            } else {
                throw new Error("Invalid Argument: value needs to be an array or a queryable.");
            }

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createEndsWithNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createStartsWithNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createContainsNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createIsEqualToNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createIsNotEqualToNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createIsGreaterThanNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createIsGreaterThanOrEqualToNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createIsLessThanNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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
            var node = this.factory.createIsLessThanOrEqualToNode();
            var valueNode = this.factory.createValueNode(value);
            var propertyNode = this.factory.createPropertyNode(this.queryable.type, this.propertyName);

            node.children.push(propertyNode, valueNode);

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