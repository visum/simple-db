import Provider from "./Provider";
import Queryable from "../queryable/Queryable";
import Sqlite3Wrapper from "./Sqlite3Wrapper";
import InsertStatementCreator from "./statements/InsertStatementCreator";
import UpdateStatementCreator from "./statements/UpdateStatementCreator";
import DeleteStatementCreator from "./statements/DeleteStatementCreator";
import SchemaUtils from "./utils/SchemaUtils";
import invokeMethodAsync from "./utils/invokeMethodAsync";

export default class Table {
    constructor({ database, schema, lifeCycleDelegate }) {

        if (lifeCycleDelegate == null || typeof lifeCycleDelegate !== "object") {
            lifeCycleDelegate = {};
        }

        this.name = SchemaUtils.getTableNameFromSchema(schema);
        this.database = database;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(this.database);
        this.primaryKeys = schema.primaryKeys;
        this.lifeCycleDelegate = lifeCycleDelegate;
    }

    async addAsync(entity) {

        await invokeMethodAsync(
            this.lifeCycleDelegate,
            "canEntityBeAddedAsync",
            [entity],
            true
        );

        const alteredEntity = await invokeMethodAsync(
            this.lifeCycleDelegate,
            "prepareEntityToBeAddedAsync",
            [entity],
            entity
        );

        const { sql, values } = InsertStatementCreator.createStatement({
            tableName: this.name,
            entity: alteredEntity,
            primaryKeys: this.primaryKeys
        });

        const result = await this.sqliteDatabaseWrapper.runAsync(sql, values);

        return await invokeMethodAsync(
            this.lifeCycleDelegate,
            "entityAddedAsync",
            [alteredEntity, result],
            result
        );

    }

    async removeAsync(entity) {

        await invokeMethodAsync(
            this.lifeCycleDelegate,
            "canEntityBeRemovedAsync",
            [entity],
            true
        );

        const alteredEntity = await invokeMethodAsync(
            this.lifeCycleDelegate,
            "prepareEntityToBeRemovedAsync",
            [entity],
            entity
        );

        const { sql, values } = DeleteStatementCreator.createStatement({
            tableName: this.name,
            entity: alteredEntity,
            primaryKeys: this.primaryKeys
        });

        const result = await this.sqliteDatabaseWrapper.runAsync(sql, values);

        return invokeMethodAsync(
            this.lifeCycleDelegate,
            "entityRemovedAsync",
            [alteredEntity, result],
            result
        );

    }

    async updateAsync(entity) {
        await invokeMethodAsync(
            this.lifeCycleDelegate,
            "canEntityBeUpdatedAsync",
            [entity],
            true
        );

        const alteredEntity = await invokeMethodAsync(
            this.lifeCycleDelegate,
            "prepareEntityToBeUpdatedAsync",
            [entity],
            entity
        );

        const { sql, values } = UpdateStatementCreator.createStatement({
            tableName: this.name,
            entity: alteredEntity,
            primaryKeys: this.primaryKeys
        });

        const result = await this.sqliteDatabaseWrapper.runAsync(sql, values);

        return await invokeMethodAsync(
            this.lifeCycleDelegate,
            "entityUpdatedAsync",
            [alteredEntity, result],
            result
        );

    }

    getQueryProvider() {
        return new Provider({
            database: this.database,
            refineQueryable: this.lifeCycleDelegate.refineQueryable
        });
    }

    where() {
        const provider = this.getQueryProvider();

        return new Queryable({
            query: {
                type: this.name,
                expression: null,
                select: {},
                limit: -1,
                offset: 0,
                orderBy: []
            },
            provider: provider
        });
    }

}