import Entity from "../base/interface.entity";
import Subject from "../subject/interface.subject.entity";

export default interface PrimarySubject extends Entity {
    name: string;
    description: string;
    subjects?: Subject[];
}