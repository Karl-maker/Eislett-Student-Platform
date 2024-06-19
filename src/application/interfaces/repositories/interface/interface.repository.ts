import E from "../../../../domain/entities/base/interface.entity";

export default interface Repository<Entity extends E> {
    save(entity: Entity) : Promise<Entity>;
    fitModelToEntity<Model>(model: Model): Entity;
    fitEntityToModel<Model>(entity: Entity): Model;
}