import * as assert from "assert";
import CountStatementCreator from "../sqlite/statements/CountStatementCreator";
import Queryable from "../queryable/Queryable";


exports["CountStatementCreator: IsEqualTo"] = () => {
    const queryable = new Queryable({ type: "table" }).column("columnName").isEqualTo("value");
    const countStatementCreator = new CountStatementCreator(queryable);
    const result = countStatementCreator.createStatement();
    const expected = `SELECT count(*) FROM "table" WHERE "columnName" = 'value'`;

    assert.equal(result, expected);
}

exports["CountStatementCreator: Empty"] = () => {
    const queryable = new Queryable({ type: "table" });
    const countStatementCreator = new CountStatementCreator(queryable);
    const result = countStatementCreator.createStatement();
    const expected = `SELECT count(*) FROM "table"`;

    assert.equal(result, expected);
}
