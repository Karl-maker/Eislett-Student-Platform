import Subject from "./interface.subject.entity";
import Course from "./interface.subject.entity";

export type BasicSubjectParamsType = {
    name: string;
    description: string;
    courses?: Course[];
    id?: string | number;
    createdAt: Date;
}

export default class BasicSubject implements Subject {
    name: string;
    description: string;
    courses?: Course[];
    id?: string | number;
    createdAt: Date;
    
    constructor({
        name,
        description,
        id,
        courses,
        createdAt
    }: BasicSubjectParamsType){
        this.name = name;
        this.description = description;
        this.id = id;
        this.courses = courses;
        this.createdAt = createdAt;
    }
}