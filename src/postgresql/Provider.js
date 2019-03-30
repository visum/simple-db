import SelectStatementCreator from "./statements/SelectStatementCreator";
import PgWrapper from "./PgWrapper";
import CountStatementCreator from "./statements/CountStatementCreator";
import DeleteWhereStatementCreator from "./statements/DeleteWhereStatementCreator";
import UpdateWhereStatementCreator from "./statements/UpdateWhereStatementCreator";
import Queryable from "../../lib/queryable/Queryable";
import invokeMethodAsync from "./utils/invokeMethodAsync";
import invokeMethod from "./utils/invokeMethod";

export default class Provider {
    constructor({
        database,
        lifeCycleDelegate
    }) {
        if (database == null) {
            throw new Error("Null Exception: database cannot be null.");
        }

        this.database = database;
        this.pgDatabaseWrapper = new PgWrapper(this.database);
        this.lifeCycleDelegate = lifeCycleDelegate;
    }

    async _prepareQueryable(queryable) {
        await invokeMethodAsync(
            this.lifeCycleDelegate,
            "canQueryAsync",
            [queryable]
        );

        return this._safelyRefineQueryable(queryable);
    }

    _safelyRefineQueryable(queryable) {
        try {
            const alteredQueryable = invokeMethod(
                this.lifeCycleDelegate,
                "refineQueryable",
                [queryable],
                queryable
            );

            if (!(alteredQueryable instanceof Queryable)) {
                throw new Error("Expected to have a queryable returned on refine Queryable.");
            }

            return alteredQueryable;
        } catch (error) {
            throw error;
        }
    }

    async toArrayAsync(queryable) {
        queryable = await this._prepareQueryable(queryable);
        const { sql } = SelectStatementCreator.createStatement(queryable);
        return await this.pgDatabaseWrapper.allAsync(sql);
    }

    async getFirstAsync(queryable) {
        const results = await this.toArrayAsync(queryable);
        return results[0] || null
    }

    async getCountAsync(queryable) {
        queryable = await this._prepareQueryable(queryable);

        const { sql } = CountStatementCreator.createStatement(queryable);
        const results = await this.pgDatabaseWrapper.allAsync(sql);

        return results[0]["count"];
    }

    getSqlAndValues(queryable) {
        queryable = this._safelyRefineQueryable(queryable);

        return SelectStatementCreator.createStatement(queryable);
    }

    async removeAsync(queryable) {
        await invokeMethodAsync(
            this.lifeCycleDelegate,
            "canEntitiesBeRemovedAsync",
            [queryable]
        );

        queryable = await this._prepareQueryable(queryable);

        const { sql } = DeleteWhereStatementCreator.createStatement(queryable);
        const result = await this.pgDatabaseWrapper.allAsync(sql);

        await invokeMethodAsync(
            this.lifeCycleDelegate,
            "entitiesRemovedAsync",
            [queryable, result]
        );

        return result;
    }

    async updateAsync(queryable, updates) {
        await invokeMethodAsync(
            this.lifeCycleDelegate,
            "canEntitiesBeUpdatedAsync",
            [queryable]
        );

        queryable = await this._prepareQueryable(queryable);

        const { sql, values } = UpdateWhereStatementCreator.createStatement(queryable, updates);
        const result = await this.pgDatabaseWrapper.runAsync(sql, values);

        await invokeMethodAsync(
            this.lifeCycleDelegate,
            "entitiesUpdatedAsync",
            [queryable, result]
        );

        return result;
    }

}