import E from "../../../domain/entities/base/interface.entity";

export type SearchParams<Fields> = {
    sort: {
        field: keyof Fields;
        order: 'asc' | 'desc';
    };
    page: {
        number: number;
        size: number;
    };
    q: string;
}

export type SearchResult<Entity extends E> = {
    amount: number;
    data: Entity[];
}