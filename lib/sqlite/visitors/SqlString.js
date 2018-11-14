"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SqlString = function () {
    function SqlString(value) {
        _classCallCheck(this, SqlString);

        this.value = "" + value.replace("'", "''");
    }

    _createClass(SqlString, [{
        key: "toString",
        value: function toString() {
            return "'" + this.value + "'";
        }
    }, {
        key: "toEndsWithString",
        value: function toEndsWithString() {
            return "'%" + this.value + "'";
        }
    }, {
        key: "toContainsString",
        value: function toContainsString() {
            return "'%" + this.value + "%'";
        }
    }, {
        key: "toStartsWithString",
        value: function toStartsWithString() {
            return "'" + this.value + "%'";
        }
    }]);

    return SqlString;
}();

exports.default = SqlString;
//# sourceMappingURL=SqlString.js.map