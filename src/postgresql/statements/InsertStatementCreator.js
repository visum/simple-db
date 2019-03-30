import PgSQLUtils from "../utils/PostgreSQLUtils";

export default class InsertStatementCreator {
  constructor({ entity, tableName, primaryKeys }) {
    this.entity = entity;
    this.tableName = tableName;
    this.primaryKeys = primaryKeys;
  }

  static createStatement(options) {
    const insertStatementCreator = new InsertStatementCreator(options);
    return insertStatementCreator.createStatement();
  }

  createStatement() {
    const entity = this.entity;
    const keys = Object.keys(entity);
    const values = keys.map(key => {
      return entity[key];
    });

    const escapedKeys = keys.map(key => {
      return PgSQLUtils.escapeName(key);
    });

    const placeHolderArray = keys
      .map((item, index) => `$${index + 1}`)
      .join(", ");
    
    return {
      sql: `INSERT INTO ${PgSQLUtils.escapeName(
        this.tableName
      )} ( ${escapedKeys.join(", ")} ) VALUES ( ${placeHolderArray} ) RETURNING *`,
      values: values
    };
  }
}
