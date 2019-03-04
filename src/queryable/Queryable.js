import QueryFactory from "./NodeFactory";
import OperationBuilder from "./OperationBuilder";
import CompositeNode from "../../lib/queryable/abstractSyntaxTree/CompositeNode";

const defaultQuery = {
    type: "any",
    expression: null,
    select: {},
    limit: -1,
    offset: 0,
    orderBy: []
};

export default class Queryable {

    constructor({
        query,
        provider = null
    }) {
        this.factory = new QueryFactory();
        this.query = Object.assign({}, defaultQuery, query);
        this.query.expression = query.expression || null;
        this.provider = provider;
    }

    assertProvider() {
        if (this.provider == null) {
            throw new Error("Null Exception: Cannot retrieve results, the provider is null.");
        }
    }

    and() {
        if (this.query.expression != null && this.query.expression.type !== "and") {

            const andNode = this.factory.createAndNode();
            const queryable = this.clone();

            andNode.children.push(queryable.query.expression);
            queryable.query.expression = andNode;
            return queryable;

        } else if (this.query.expression != null && this.query.expression.type === "and") {
            return this;
        } else {
            this.query.expression = this.factory.createAndNode();
            return this;
        }

    }

    or() {
        if (this.query.expression != null && this.query.expression.type !== "or") {

            const orNode = this.factory.createOrNode();
            const queryable = this.clone();

            orNode.children.push(queryable.query.expression);
            queryable.query.expression = orNode;
            return queryable;

        } else if (this.query.expression != null && this.query.expression.type === "or") {
            return this;
        } else {
            this.query.expression = this.factory.createOrNode();
            return this;
        }

    }

    clone() {
        const queryable = new Queryable({
            provider: this.provider,
            query: {
                type: this.query.type,
                expression: this.query.expression == null ? null : this.query.expression.clone(),
                select: Object.assign({}, this.query.select),
                limit: this.query.limit,
                offset: this.query.offset,
                orderBy: this.query.orderBy.slice()
            }
        });
        return queryable;
    }

    column(column) {
        if (column == null) {
            throw new Error("Null Exception: column cannot be null.");
        }

        const builder = new OperationBuilder(this, column);
        return builder;
    }

    select(selectMapping) {
        const queryable = this.clone();
        queryable.query.select = selectMapping;

        return queryable;
    }

    take(take) {
        if (typeof take !== "number") {
            throw new Error("Illegal Argument: expected a number.");
        }

        const queryable = this.clone();
        queryable.query.limit = take;

        return queryable;
    }

    skip(skip) {
        if (typeof skip !== "number") {
            throw new Error("Illegal Argument: expected a number.");
        }

        const queryable = this.clone();
        queryable.query.offset = skip;

        return queryable;
    }

    orderByAsc(column) {
        const queryable = this.clone();
        queryable.query.orderBy.push({
            "type": "ASC",
            "column": column
        });

        return queryable;
    }

    orderByDesc(column) {
        const queryable = this.clone();
        queryable.query.orderBy.push({
            "type": "DESC",
            "column": column
        });

        return queryable;
    }

    async toArrayAsync() {
        this.assertProvider();

        return await this.provider.toArrayAsync(this);
    }

    async getFirstAsync() {
        this.assertProvider();

        return await this.provider.getFirstAsync(this);
    }

    async getCountAsync() {
        this.assertProvider();

        return await this.provider.getCountAsync(this);
    }

    async removeAsync() {
        this.assertProvider();

        return await this.provider.removeAsync(this);
    }

    async updateAsync(updates) {
        this.assertProvider();

        return await this.provider.updateAsync(this, updates);
    }

    toJson(){
        return JSON.stringify(this.query);
    }

    static fromObject(query) {
        query.expression = CompositeNode.fromObject(query.expression);

        const queryable = new Queryable({
            provider: this.provider,
            query: query
        });

        return queryable;
    }

    static fromJson(jsonQuery) {
        const query = JSON.parse(jsonQuery);
        return Queryable.fromObject(query);
    }

}
