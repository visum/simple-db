"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NodeFactory = require("./NodeFactory");

var _NodeFactory2 = _interopRequireDefault(_NodeFactory);

var _OperationBuilder = require("./OperationBuilder");

var _OperationBuilder2 = _interopRequireDefault(_OperationBuilder);

var _CompositeNode = require("../../lib/queryable/abstractSyntaxTree/CompositeNode");

var _CompositeNode2 = _interopRequireDefault(_CompositeNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultQuery = {
    type: "any",
    expression: null,
    select: {},
    limit: -1,
    offset: 0,
    orderBy: []
};

var Queryable = function () {
    function Queryable(_ref) {
        var query = _ref.query,
            _ref$provider = _ref.provider,
            provider = _ref$provider === undefined ? null : _ref$provider;

        _classCallCheck(this, Queryable);

        this.factory = new _NodeFactory2.default();
        this.query = Object.assign({}, defaultQuery, query);
        this.query.expression = query.expression || null;
        this.provider = provider;
    }

    _createClass(Queryable, [{
        key: "assertProvider",
        value: function assertProvider() {
            if (this.provider == null) {
                throw new Error("Null Exception: Cannot retrieve results, the provider is null.");
            }
        }
    }, {
        key: "and",
        value: function and() {
            if (this.query.expression != null && this.query.expression.type !== "and") {

                var andNode = this.factory.createAndNode();
                var queryable = this.clone();

                andNode.children.push(queryable.query.expression);
                queryable.query.expression = andNode;
                return queryable;
            } else if (this.query.expression != null && this.query.expression.type === "and") {
                return this;
            } else {
                this.query.expression = this.factory.createAndNode();
                return this;
            }
        }
    }, {
        key: "or",
        value: function or() {
            if (this.query.expression != null && this.query.expression.type !== "or") {

                var orNode = this.factory.createOrNode();
                var queryable = this.clone();

                orNode.children.push(queryable.query.expression);
                queryable.query.expression = orNode;
                return queryable;
            } else if (this.query.expression != null && this.query.expression.type === "or") {
                return this;
            } else {
                this.query.expression = this.factory.createOrNode();
                return this;
            }
        }
    }, {
        key: "clone",
        value: function clone() {
            var queryable = new Queryable({
                provider: this.provider,
                query: {
                    type: this.query.type,
                    expression: this.query.expression == null ? null : this.query.expression.clone(),
                    select: Object.assign({}, this.query.select),
                    limit: this.query.limit,
                    offset: this.query.offset,
                    orderBy: this.query.orderBy.slice()
                }
            });
            return queryable;
        }
    }, {
        key: "column",
        value: function column(_column) {
            if (_column == null) {
                throw new Error("Null Exception: column cannot be null.");
            }

            var builder = new _OperationBuilder2.default(this, _column);
            return builder;
        }
    }, {
        key: "select",
        value: function select(selectMapping) {
            var queryable = this.clone();
            queryable.query.select = selectMapping;

            return queryable;
        }
    }, {
        key: "take",
        value: function take(_take) {
            if (typeof _take !== "number") {
                throw new Error("Illegal Argument: expected a number.");
            }

            var queryable = this.clone();
            queryable.query.limit = _take;

            return queryable;
        }
    }, {
        key: "skip",
        value: function skip(_skip) {
            if (typeof _skip !== "number") {
                throw new Error("Illegal Argument: expected a number.");
            }

            var queryable = this.clone();
            queryable.query.offset = _skip;

            return queryable;
        }
    }, {
        key: "orderByAsc",
        value: function orderByAsc(column) {
            var queryable = this.clone();
            queryable.query.orderBy.push({
                "type": "ASC",
                "column": column
            });

            return queryable;
        }
    }, {
        key: "orderByDesc",
        value: function orderByDesc(column) {
            var queryable = this.clone();
            queryable.query.orderBy.push({
                "type": "DESC",
                "column": column
            });

            return queryable;
        }
    }, {
        key: "toArrayAsync",
        value: function toArrayAsync() {
            this.assertProvider();

            return this.provider.toArrayAsync(this);
        }
    }, {
        key: "getFirstAsync",
        value: function getFirstAsync() {
            this.assertProvider();

            return this.provider.getFirstAsync(this);
        }
    }, {
        key: "getCountAsync",
        value: function getCountAsync() {
            this.assertProvider();

            return this.provider.getCountAsync(this);
        }
    }, {
        key: "removeAsync",
        value: function removeAsync() {
            this.assertProvider();

            return this.provider.removeAsync(this);
        }
    }, {
        key: "updateAsync",
        value: function updateAsync(updates) {
            this.assertProvider();

            return this.provider.updateAsync(this, updates);
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return JSON.stringify(this.query);
        }
    }], [{
        key: "fromObject",
        value: function fromObject(query) {
            query.expression = _CompositeNode2.default.fromObject(query.expression);

            var queryable = new Queryable({
                provider: this.provider,
                query: query
            });

            return queryable;
        }
    }, {
        key: "fromJson",
        value: function fromJson(jsonQuery) {
            var query = JSON.parse(jsonQuery);
            return Queryable.fromObject(query);
        }
    }]);

    return Queryable;
}();

exports.default = Queryable;
//# sourceMappingURL=Queryable.js.map