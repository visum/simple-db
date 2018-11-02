"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sqlite3Wrapper = function () {
    function Sqlite3Wrapper(database) {
        _classCallCheck(this, Sqlite3Wrapper);

        this.database = database;
    }

    _createClass(Sqlite3Wrapper, [{
        key: "runAsync",
        value: function runAsync(sql) {
            var _this = this;

            var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            return new Promise(function (resolve, reject) {
                return _this.database.run(sql, values, function (error) {
                    if (error != null) {
                        reject(error);
                    } else {
                        resolve(this);
                    }
                });
            });
        }
    }, {
        key: "allAsync",
        value: function allAsync(sql) {
            var _this2 = this;

            var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            return new Promise(function (resolve, reject) {
                return _this2.database.all(sql, values, function (error, result) {
                    if (error != null) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        }
    }]);

    return Sqlite3Wrapper;
}();

exports.default = Sqlite3Wrapper;
//# sourceMappingURL=Sqlite3Wrapper.js.map