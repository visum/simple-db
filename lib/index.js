"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SqliteDatabase", {
  enumerable: true,
  get: function () {
    return _Database.default;
  }
});
Object.defineProperty(exports, "Queryable", {
  enumerable: true,
  get: function () {
    return _Queryable.default;
  }
});

var _Database = _interopRequireDefault(require("./sqlite/Database"));

var _Queryable = _interopRequireDefault(require("./queryable/Queryable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map