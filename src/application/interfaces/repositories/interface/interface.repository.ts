import E from "../../../../domain/entities/base/interface.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";

export default interface Repository<Entity extends E> {
    deleteById(id: string | number): Promise<boolean>;
    findById(id: string | number) : Promise<Entity>;
    findMany(params: FindManyParams<any, any>): Promise<FindManyResult<Entity>>;
    update(id: string | number, data: Partial<Entity>): Promise<Entity>;
    count(where: any): Promise<number>;
    findFirst(where: any): Promise<Entity | null>;
    deleteMany(where: any): Promise<number>;
    save(entity: Entity) : Promise<Entity>;
    fitModelToEntity<Model>(model: Model): Entity;
    fitEntityToModel<Model>(entity: Entity): Model;
}