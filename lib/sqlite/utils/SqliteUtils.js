"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SqliteUtils = function () {
    function SqliteUtils() {
        _classCallCheck(this, SqliteUtils);
    }

    _createClass(SqliteUtils, null, [{
        key: "escapeStringValue",
        value: function escapeStringValue(value) {
            if (typeof value === "string") {
                return "'" + value.replace(/\'/, "''") + "'";
            } else {
                return value.toString();
            }
        }
    }, {
        key: "escapeName",
        value: function escapeName(name) {
            if (typeof name === "string") {
                return "\"" + name.replace(/\"/, "\"") + "\"";
            }
            return name;
        }
    }]);

    return SqliteUtils;
}();

exports.default = SqliteUtils;
//# sourceMappingURL=SqliteUtils.js.map