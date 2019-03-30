"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class SchemaUtils {
  static getTableName(name, version) {
    return `${name}_${version}`;
  }

  static getTableNameFromSchema(schema) {
    return SchemaUtils.getTableName(schema.name, schema.version);
  }

  static getPrimaryKeysFromSchema(schema) {
    return schema.primaryKeys;
  }

}

exports.default = SchemaUtils;
//# sourceMappingURL=SchemaUtils.js.map