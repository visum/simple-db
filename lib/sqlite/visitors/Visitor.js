"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Visitor = function () {
    function Visitor() {
        _classCallCheck(this, Visitor);
    }

    _createClass(Visitor, [{
        key: "visit",
        value: function visit(node) {
            var _this = this;

            if (node == null) {
                return null;
            }

            if (node.isComposite) {

                var results = node.children.map(function (node) {
                    return _this.visit(node);
                });

                if (typeof this[node.type] === "function") {
                    return this[node.type].apply(this, results);
                } else {
                    throw new Error("\"" + node.type + "\" is an unsupported node type.");
                }
            } else {

                if (typeof this[node.type] === "function") {
                    return this[node.type](node.value);
                } else {
                    throw new Error("\"" + node.type + "\" is an unsupported node type.");
                }
            }
        }
    }]);

    return Visitor;
}();

exports.default = Visitor;
//# sourceMappingURL=Visitor.js.map