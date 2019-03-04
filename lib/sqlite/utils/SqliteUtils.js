"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class SqliteUtils {
  static escapeValue(value) {
    if (typeof value === "string") {
      return `'${value.replace(/\'/, "''")}'`;
    } else {
      return value.toString();
    }
  }

  static escapeName(name) {
    if (typeof name === "string") {
      return `"${name.replace(/\"/, "\"")}"`;
    }

    return name;
  }

}

exports.default = SqliteUtils;
//# sourceMappingURL=SqliteUtils.js.map