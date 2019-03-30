import * as assert from "assert";
import SelectStatementCreator from "../../postgresql/statements/SelectStatementCreator";
import Queryable from "../../queryable/Queryable";


exports["SelectStatementCreator: isEqualTo."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isEqualTo("value");
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" = 'value' LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: isNotEqualTo."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isNotEqualTo("value");
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" != 'value' LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: contains."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").contains("value");
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" LIKE '%value%' ESCAPE '\\' LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: startsWith."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").startsWith("value");
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" LIKE 'value%' ESCAPE '\\' LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: endsWith."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").endsWith("value");
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" LIKE '%value' ESCAPE '\\' LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: isGreaterThan."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isGreaterThan(0);
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" > 0 LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: isGreaterThanOrEqualTo."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isGreaterThanOrEqualTo(0);
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" >= 0 LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: isLessThan."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isLessThan(0);
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" < 0 LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: isLessThanOrEqualTo."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isLessThanOrEqualTo(0);
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" <= 0 LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: isIn with array."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isIn(["John", "Jane"]);
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" IN ('John', 'Jane') LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: isNotIn with array."] = () => {
    const queryable = new Queryable({ query: { type: "table" } }).column("columnName").isNotIn(["John", "Jane"]);
    const selectStatementCreator = new SelectStatementCreator(queryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" NOT IN ('John', 'Jane') LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}


exports["SelectStatementCreator: isIn with queryable."] = () => {
    const queryable = new Queryable({ query: { type: "other_table" } }).select({ id: "id" });
    const rootQueryable = new Queryable({ query: { type: "table" } }).column("columnName").isIn(queryable);
    const selectStatementCreator = new SelectStatementCreator(rootQueryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" IN (SELECT "id" AS id FROM "other_table" LIMIT -1 OFFSET 0) LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}

exports["SelectStatementCreator: isNotIn with queryable."] = () => {
    const queryable = new Queryable({ query: { type: "other_table" } }).select({ id: "id" });
    const rootQueryable = new Queryable({ query: { type: "table" } }).column("columnName").isNotIn(queryable);
    const selectStatementCreator = new SelectStatementCreator(rootQueryable);
    const { sql } = selectStatementCreator.createStatement();
    const expected = `SELECT * FROM "table" WHERE "columnName" NOT IN (SELECT "id" AS id FROM "other_table" LIMIT -1 OFFSET 0) LIMIT -1 OFFSET 0`;

    assert.equal(sql, expected);
}