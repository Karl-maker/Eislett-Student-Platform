import Topic from "../../../../domain/entities/topic/interface.topic.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import Repository from "./interface.repository";

export type TopicFilters = {
    courseId?: string | number;
}

export type TopicFields = {
    createdAt: Date;
    id: number | string;
    name: string;
}

export default interface TopicRepository extends Repository<Topic> {
    deleteById: (id: string | number)=> Promise<boolean>;
    findById: (id: string | number)=> Promise<Topic>;
    findMany: (params: FindManyParams<TopicFields, TopicFilters>)=> Promise<FindManyResult<Topic>>;
    connectToQuestion: (id: number | string, questionId: number | string) => Promise<boolean>;
    disconnectToQuestion: (id: number | string, questionId: number | string) => Promise<boolean>;
}