import QueryFactory from "./factory/QueryFactory";
import OperationBuilder from "./builder/OperationBuilder";

export default class Queryable {

    constructor({
        type = "any",
        query = {
            expression: null,
            select: {},
            limit: Infinity,
            offset: 0,
            orderBy: []
        },
        provider = null
    }) {
        this.type = type;
        this.factory = new QueryFactory();
        this.query = query;
        this.provider = provider;
    }

    assertProvider(){
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
        return new Queryable({
            type: this.type,
            provider: this.provider,
            query: {
                expression: this.query.expression == null ? null : this.query.expression.clone(),
                select: Object.assign({}, this.query.select),
                limit: this.query.limit,
                offset: this.query.offset,
                orderBy: this.query.orderBy.slice()
            }
        });
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
        const queryable = this.clone();
        queryable.query.limit = take;

        return queryable;
    }

    skip(skip) {
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

    toArrayAsync() {
        this.assertProvider();

        return this.provider.toArrayAsync(this);
    }

    getFirstAsync(){
        this.assertProvider();

        return this.provider.getFirstAsync(this);
    }

    getCountAsync() {
        this.assertProvider();

        return this.provider.getCountAsync(this);
    }

    removeAsync() {
        this.assertProvider();

        return this.provider.removeAsync(this);
    }

    updateAsync(entity) {
        this.assertProvider();

        return this.provider.updateAsync(this, entity);
    }

}
