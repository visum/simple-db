import * as assert from "assert";
import CountStatementCreator from "../sqlite/statements/CountStatementCreator";
import Queryable from "../queryable/Queryable";


exports["CountStatementCreator: IsEqualTo"] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isEqualTo("value");
    const countStatementCreator = new CountStatementCreator(queryable);
    const { sql } = countStatementCreator.createStatement();
    const expected = `SELECT count(*) FROM "table" WHERE "columnName" = 'value'`;

    assert.equal(sql, expected);
}

exports["CountStatementCreator: Empty"] = () => {
    const queryable = new Queryable({ query: { type: "table" } });
    const countStatementCreator = new CountStatementCreator(queryable);
    const { sql } = countStatementCreator.createStatement();
    const expected = `SELECT count(*) FROM "table"`;

    assert.equal(sql, expected);
}
