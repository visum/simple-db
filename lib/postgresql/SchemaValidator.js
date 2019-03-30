"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonschema = _interopRequireDefault(require("jsonschema"));

var _tableJsonSchema = _interopRequireDefault(require("./tableJsonSchema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SchemaValidator {
  constructor(schema) {
    this.schema = schema;
    this.validator = new _jsonschema.default.Validator();
  }

  static validate(schema) {
    const validator = new SchemaValidator(schema);
    return validator.validate();
  }

  validate() {
    const validationResults = this.validator.validate(this.schema, _tableJsonSchema.default);

    if (validationResults.errors.length > 0) {
      const error = new Error("Schema Error");
      error.validationErrors = validationResults.errors;
      throw error;
    }
  }

}

exports.default = SchemaValidator;
//# sourceMappingURL=SchemaValidator.js.map