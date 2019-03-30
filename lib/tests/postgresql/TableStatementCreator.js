"use strict";

var assert = _interopRequireWildcard(require("assert"));

var _TableStatementCreator = _interopRequireDefault(require("../../postgresql/statements/TableStatementCreator"));

var _person = _interopRequireDefault(require("./testSchemas/person"));

var _address = _interopRequireDefault(require("./testSchemas/address"));

var _phoneNumber = _interopRequireDefault(require("./testSchemas/phoneNumber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

exports["SchemaToPGFactory: Person Schema."] = () => {
  const schemaToPGFactory = new _TableStatementCreator.default(_person.default);
  const createTableStatement = schemaToPGFactory.createTableStatement();
  const expectedSql = `CREATE TABLE IF NOT EXISTS "person_0.0.1" ("id" SERIAL, "firstName" TEXT, "lastName" TEXT, "dateOfBirth" INTEGER, PRIMARY KEY("id"))`;
  assert.equal(createTableStatement.sql, expectedSql);
};

exports["PG SchemaToPGFactory: Address Schema."] = () => {
  const schemaToPGFactory = new _TableStatementCreator.default(_address.default);
  const createTableStatement = schemaToPGFactory.createTableStatement();
  const expectedSql = `CREATE TABLE IF NOT EXISTS "address_0.0.1" ("id" SERIAL, "address" TEXT, "city" TEXT, "state" INTEGER, "zipCode" INTEGER, "personId" INTEGER NOT NULL, PRIMARY KEY("id"), FOREIGN KEY ("personId") REFERENCES "person_0.0.1" ("id"))`;
  assert.equal(createTableStatement.sql, expectedSql);
};

exports["PG SchemaToPGFactory: Phone Number Schema."] = () => {
  const schemaToPGFactory = new _TableStatementCreator.default(_phoneNumber.default);
  const createTableStatement = schemaToPGFactory.createTableStatement();
  const expectedSql = `CREATE TABLE IF NOT EXISTS "address_0.0.1" ("id" SERIAL, "type" TEXT, "personId" INTEGER NOT NULL, PRIMARY KEY("id"), UNIQUE ("personId","type"), FOREIGN KEY ("personId") REFERENCES "person_0.0.1" ("id"))`;
  assert.equal(createTableStatement.sql, expectedSql);
};
//# sourceMappingURL=TableStatementCreator.js.map