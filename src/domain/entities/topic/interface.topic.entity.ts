import Entity from "../base/interface.entity";

export default interface Topic extends Entity {
    name: string;
    description: string;
}