import { HydratedDocument, Model, QueryFilter, QueryOptions } from "mongoose";

export abstract class AbstractRepository<T> {
    protected constructor(
        private readonly model: Model<T, any, any, any, HydratedDocument<T, any>, any, any>
    ) {}

    async create(data: Partial<T>) {
        return this.model.create(data);
    }

    async update(filter: QueryFilter<T>, newData: Partial<T>, options?: QueryOptions<T>) {
        return this.model.findOneAndUpdate(filter, newData, options);
    }

    async delete(filter: QueryFilter<T>) {
        return this.model.deleteOne(filter);
    }

    async getOne(filter: QueryFilter<T>) {
        return this.model.findOne(filter);
    }
}