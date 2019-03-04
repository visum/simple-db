"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Sqlite3Wrapper = _interopRequireDefault(require("./Sqlite3Wrapper"));

var _TableCreator = _interopRequireDefault(require("./TableCreator"));

var _Table = _interopRequireDefault(require("./Table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Database {
  constructor({
    database,
    schemas
  }) {
    this.database = database;
    this.sqliteDatabaseWrapper = new _Sqlite3Wrapper.default(database);
    this.schemas = Array.isArray(schemas) ? schemas : [];
  }

  hasSchema(schema) {
    return this.getSchema(schema) != null;
  }

  removeSchema(schema) {
    const index = this.schemas.findIndex(() => {
      return schema.name == innerSchema && schema.version == innerSchema.version;
    });

    if (index > -1) {
      this.schemas.splice(index, 1);
    }
  }

  getSchema(schema) {
    return this.schemas.find(innerSchema => {
      return schema.name == innerSchema.name && schema.version == innerSchema.version;
    });
  }

  getSchemas() {
    return this.schemas.slice(0);
  }

  addSchema(schema) {
    this.schemas.push(schema);
  }

  removeAsync(schema) {
    this.removeSchema(schema);
  }

  async createTableFromSchemaAsync(schema) {
    return await _TableCreator.default.createTableIfNotExistsAsync({
      database: this.database,
      schema
    });
  }

  async createTablesFromSchemasAsync() {
    return await this.schemas.reduce((promise, schema) => {
      return promise.then(() => {
        return this.createTableFromSchemaAsync(schema);
      });
    }, Promise.resolve());
  }

  async dropTableFromSchemaAsync(schema) {
    return await _TableCreator.default.dropTableIfExistsAsync({
      database: this.database,
      schema
    });
  }

  getTable(name, version) {
    const schema = this.getSchema({
      name,
      version
    });

    if (schema == null) {
      throw new Error("Unable to find table.");
    }

    const database = this.database;
    return new _Table.default({
      database: database,
      schema
    });
  }

}

exports.default = Database;
//# sourceMappingURL=Database.js.map