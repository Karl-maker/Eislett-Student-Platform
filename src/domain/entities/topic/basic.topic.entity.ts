import Topic from "./interface.topic.entity";

export type BasicTopicParamsType = {
    name: string;
    description: string;
    id?: string | number;
    createdAt: Date;
}

export default class BasicTopic implements Topic {
    name: string;
    description: string;
    id?: string | number;
    createdAt: Date;
    
    constructor({
        name,
        description,
        id,
        createdAt
    }: BasicTopicParamsType){
        this.name = name;
        this.description = description;
        this.id = id;
        this.createdAt = createdAt;
    }
}