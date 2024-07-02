import PrimarySubject from "../../../../domain/entities/primary-subject/interface.primary.subject.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import Repository from "./interface.repository";

export type PrimarySubjectFilters = {}

export type PrimarySubjectFields = {
    createdAt: Date;
    id: number | string;
    name: string;
}

export default interface PrimarySubjectRepository extends Repository<PrimarySubject> {
    deleteById: (id: string | number)=> Promise<boolean>;
    findById: (id: string | number)=> Promise<PrimarySubject>;
    findMany: (params: FindManyParams<PrimarySubjectFields, PrimarySubjectFilters>)=> Promise<FindManyResult<PrimarySubject>>;
    addSubject: (id: number | string, subjectId: number | string) => Promise<boolean>;
    removeSubject: (id: number | string, subjectId: number | string) => Promise<boolean>;
}