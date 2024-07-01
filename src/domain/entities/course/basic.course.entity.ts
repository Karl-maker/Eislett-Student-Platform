import Topic from "../topic/interface.topic.entity";
import Course from "./interface.course.entity";

export type BasicCourseParamsType = {
    name: string;
    description: string;
    topics?: Topic[];
    id?: string | number;
    createdAt: Date;
}

export default class BasicCourse implements Course {
    name: string;
    description: string;
    topics?: Topic[];
    id?: string | number;
    createdAt: Date;
    
    constructor({
        name,
        description,
        id,
        topics,
        createdAt
    }: BasicCourseParamsType){
        this.name = name;
        this.description = description;
        this.id = id;
        this.topics = topics;
        this.createdAt = createdAt;
    }
}