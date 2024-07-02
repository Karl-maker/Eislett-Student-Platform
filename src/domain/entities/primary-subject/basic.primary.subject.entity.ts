import Subject from "../subject/interface.subject.entity";
import PrimarySubject from "./interface.primary.subject.entity";

export type BasicPrimarySubjectParamsType = {
    name: string;
    description: string;
    subjects?: Subject[];
    id?: string | number;
    createdAt: Date;
}

export default class BasicPrimarySubject implements PrimarySubject {
    name: string;
    description: string;
    subjects?: Subject[];
    id?: string | number;
    createdAt: Date;
    
    constructor({
        name,
        description,
        id,
        subjects,
        createdAt
    }: BasicPrimarySubjectParamsType){
        this.name = name;
        this.description = description;
        this.id = id;
        this.subjects = subjects;
        this.createdAt = createdAt;
    }
}