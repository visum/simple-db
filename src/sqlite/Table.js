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

        if (lifeCycleDelegate == null || typeof lifeCycleDelegate !== "object"){
            lifeCycleDelegate = {};
        }

        this.name = SchemaUtils.getTableNameFromSchema(schema);
        this.database = database;
        this.sqliteDatabaseWrapper = new Sqlite3Wrapper(this.database);
        this.primaryKeys = schema.primaryKeys;
        this.lifeCycleDelegate = lifeCycleDelegate;
    }

    addAsync(entity) {
        let response;

        return invokeMethodAsync(
            this.lifeCycleDelegate,
            "canEntityBeAddedAsync",
            [entity],
            true
        ).then(() => {
            return invokeMethodAsync(
                this.lifeCycleDelegate,
                "prepareEntityToBeAddedAsync",
                [entity],
                entity
            );
        }).then((entity) => {
            const { sql, values } = InsertStatementCreator.createStatement({
                tableName: this.name,
                entity,
                primaryKeys: this.primaryKeys
            });

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }).then((result) => {
            response = result;

            return invokeMethodAsync(
                this.lifeCycleDelegate,
                "entityAddedAsync",
                [entity, result],
                result
            ).catch((error)=>{
                // Swallow errors.
            }); 
        }).then(() => {
            return response;
        });

    }

    removeAsync(entity) {
        let response;

        return invokeMethodAsync(
            this.lifeCycleDelegate,
            "canEntityBeRemovedAsync",
            [entity],
            true
        ).then(() => {
            return invokeMethodAsync(
                this.lifeCycleDelegate,
                "prepareEntityToBeRemovedAsync",
                [entity],
                entity
            );
        }).then((entity) => {
            const { sql, values } = DeleteStatementCreator.createStatement({
                tableName: this.name,
                entity,
                primaryKeys: this.primaryKeys
            });

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }).then((result) => {
            response = result;

            return invokeMethodAsync(
                this.lifeCycleDelegate,
                "entityRemovedAsync",
                [entity, result],
                result
            ).catch((error)=>{
                // Swallow errors.
            }); 
        }).then(() => {
            return response;
        });

    }

    updateAsync(entity) {
        let response;

        return invokeMethodAsync(
            this.lifeCycleDelegate,
            "canEntityBeUpdatedAsync",
            [entity],
            true
        ).then(() => {
            return invokeMethodAsync(
                this.lifeCycleDelegate,
                "prepareEntityToBeUpdatedAsync",
                [entity],
                entity
            );
        }).then((entity) => {
            const { sql, values } = UpdateStatementCreator.createStatement({
                tableName: this.name,
                entity,
                primaryKeys: this.primaryKeys
            });

            return this.sqliteDatabaseWrapper.runAsync(sql, values);
        }).then((result) => {
            response = result;

            return invokeMethodAsync(
                this.lifeCycleDelegate,
                "entityUpdatedAsync",
                [entity, result],
                result
            ).catch((error)=>{
                // Swallow errors.
            }); 
        }).then(() => {
            return response;
        });

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