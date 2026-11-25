
import type {
    HydratedDocument,
    Model,
    QueryFilter,
    UpdateQuery,
    DeleteResult
} from "mongoose";

export abstract class AbstractRepository<T> {
    protected constructor(
        protected readonly model: Model<T>
    ) {}

    async create(data: Partial<T>): Promise<HydratedDocument<T>> {
        return this.model.create(data);
    }

    async update(
        filter: QueryFilter<T>,
        newData: UpdateQuery<T>,
        options: { new?: boolean } = {}
    ): Promise<HydratedDocument<T> | null> {
        return this.model.findOneAndUpdate(
            filter,
            newData,
            {
                ...options,
                new: options.new ?? false
            }
        );
    }

    async delete(filter: QueryFilter<T>): Promise<DeleteResult> {
        return this.model.deleteOne(filter);
    }

    async getOne(
        filter: QueryFilter<T>
    ): Promise<HydratedDocument<T> | null> {
        return this.model.findOne(filter);
    }
}
