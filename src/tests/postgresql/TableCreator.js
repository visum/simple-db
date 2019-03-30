import * as assert from "assert";
import TableCreator from "../../postgresql/TableCreator";
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "test_user",
  password: "test_user_pass",
  database: "tests",
  port: 5432
});

const otherTable = {
  name: "other_table",
  label: "Other Table",
  description: "Some other great table",
  version: "1.0.0",
  columns: [
    {
      type: "INTEGER",
      name: "id",
      label: "Identifier"
    },
    {
      type: "TEXT",
      name: "text",
      label: "Text",
      description: "Some Description."
    }
  ],
  primaryKeys: ["id"]
};

const testSchema = {
  name: "table",
  label: "Table",
  description: "Some great description.",
  version: "1.0.1",
  columns: [
    {
      type: "INTEGER",
      name: "id",
      label: "Identifier"
    },
    {
      type: "TEXT",
      name: "text",
      label: "Text",
      description: "Some Description."
    },
    {
      type: "REAL",
      name: "real",
      label: "Float",
      isNullable: false
    },
    {
      type: "INTEGER",
      name: "manyToOne",
      label: "Many To One Identifier",
      isNullable: false
    },
    {
      type: "INTEGER",
      name: "oneToOne",
      label: "One to One Identifier",
      isNullable: false
    }
  ],
  primaryKeys: ["id"],
  unique: {},
  foreignKeys: {
    manyToOne: {
      label: "Source",
      source: {
        name: "other_table",
        version: "1.0.0",
        label: "Many",
        column: "id"
      }
    },
    oneToOne: {
      label: "Source",
      source: {
        name: "other_table",
        version: "1.0.0",
        label: "One",
        column: "id"
      }
    }
  }
};

const dropTablesAsync = async () => {
  await TableCreator.dropTableIfExistsAsync({
    schema: testSchema,
    database: pool
  });
  await TableCreator.dropTableIfExistsAsync({
    schema: otherTable,
    database: pool
  });
};

exports['clean'] = dropTablesAsync;

exports["TableCreator: createTableIfNotExistsAsync."] = async () => {
  const tableCreator = new TableCreator({
    schema: otherTable,
    database: pool
  });

  try {
    await tableCreator.createTableIfNotExistsAsync();
  } catch (e) {
    console.log(e);
  }
  return;
};

exports[
  "TableCreator: createTableIfNotExistsAsync with foreign keys."
] = async () => {
  const otherTableCreator = new TableCreator({
    schema: otherTable,
    database: pool
  });

  const tableCreator = new TableCreator({
    schema: testSchema,
    database: pool
  });

  await otherTableCreator.createTableIfNotExistsAsync();
  return await tableCreator.createTableIfNotExistsAsync();
};

exports["TableCreator: createTableIfNotExistsAsync twice."] = async () => {
  const tableCreator = new TableCreator({
    schema: otherTable,
    database: pool
  });

  await tableCreator.createTableIfNotExistsAsync();
  return await tableCreator.createTableIfNotExistsAsync();
};

exports["TableCreator: createTableIfNotExistsAsync then Drop"] = async () => {
  const tableCreator = new TableCreator({
    schema: otherTable,
    database: pool
  });

  await tableCreator.createTableIfNotExistsAsync();
  return await tableCreator.dropTableIfExistsAsync();
};
