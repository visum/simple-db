"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _QueryFactory = require("../sqlite/factories/QueryFactory");

var _QueryFactory2 = _interopRequireDefault(_QueryFactory);

var _OperationBuilder = require("./OperationBuilder");

var _OperationBuilder2 = _interopRequireDefault(_OperationBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queryable = function () {
    function Queryable(_ref) {
        var _ref$type = _ref.type,
            type = _ref$type === undefined ? "any" : _ref$type,
            _ref$query = _ref.query,
            query = _ref$query === undefined ? {
            expression: null,
            select: {},
            limit: Infinity,
            offset: 0,
            orderBy: []
        } : _ref$query,
            _ref$provider = _ref.provider,
            provider = _ref$provider === undefined ? null : _ref$provider;

        _classCallCheck(this, Queryable);

        this.type = type;
        this.factory = new _QueryFactory2.default();
        this.query = query;
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
            return new Queryable({
                type: this.type,
                provider: this.provider,
                query: {
                    expression: this.query.expression == null ? null : this.query.expression.clone(),
                    select: Object.assign({}, this.query.select),
                    limit: this.query.limit,
                    offset: this.query.offset,
                    orderBy: this.query.orderBy.slice()
                }
            });
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
            var queryable = this.clone();
            queryable.query.limit = _take;

            return queryable;
        }
    }, {
        key: "skip",
        value: function skip(_skip) {
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
        value: function updateAsync(entity) {
            this.assertProvider();

            return this.provider.updateAsync(this, entity);
        }
    }]);

    return Queryable;
}();

exports.default = Queryable;
//# sourceMappingURL=Queryable.js.map