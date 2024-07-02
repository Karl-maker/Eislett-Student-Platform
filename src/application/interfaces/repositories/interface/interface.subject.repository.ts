import Subject from "../../../../domain/entities/subject/interface.subject.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import Repository from "./interface.repository";

export type SubjectFilters = {
    primarySubjectId?: string | number;
}

export type SubjectFields = {
    createdAt: Date;
    id: number | string;
    name: string;
}

export default interface SubjectRepository extends Repository<Subject> {
    deleteById: (id: string | number)=> Promise<boolean>;
    findById: (id: string | number)=> Promise<Subject>;
    findMany: (params: FindManyParams<SubjectFields, SubjectFilters>)=> Promise<FindManyResult<Subject>>;
    addCourse: (id: number | string, courseId: number | string) => Promise<boolean>;
    removeCourse: (id: number | string, courseId: number | string) => Promise<boolean>;
}