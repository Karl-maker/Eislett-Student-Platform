import E from "../../../domain/entities/base/interface.entity";

export type FindManyParams<Fields, Filters> = {
    sort: {
        field: keyof Fields;
        order: 'asc' | 'desc';
    };
    page: {
        number: number;
        size: number;
    };
    filters: Filters;
}

export type FindManyResult<Entity extends E> = {
    amount: number;
    data: Entity[];
}