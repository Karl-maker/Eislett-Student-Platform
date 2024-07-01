import Course from "../../../../domain/entities/course/interface.course.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import Repository from "./interface.repository";

export type CourseFilters = {
    subjectId?: string | number;
}

export type CourseFields = {
    createdAt: Date;
    id: number | string;
    name: string;
}

export default interface CourseRepository extends Repository<Course> {
    deleteById: (id: string | number)=> Promise<boolean>;
    findById: (id: string | number)=> Promise<Course>;
    findMany: (params: FindManyParams<CourseFields, CourseFilters>)=> Promise<FindManyResult<Course>>;
    addTopic: (id: number | string, topicId: number | string) => Promise<boolean>;
    removeTopic: (id: number | string, topicId: number | string) => Promise<boolean>;
}