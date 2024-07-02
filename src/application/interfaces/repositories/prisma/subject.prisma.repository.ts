import { Prisma, PrismaClient } from "@prisma/client";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import SubjectRepository, { SubjectFields, SubjectFilters } from "../interface/interface.subject.repository";
import Subject from "../../../../domain/entities/subject/interface.subject.entity";
import BasicSubject from "../../../../domain/entities/subject/basic.subject.entity";
import PrismaRepository from "./prisma.repository";


const SubjectPrismaModel = Prisma.validator<Prisma.SubjectDefaultArgs>()({});

export type SubjectPrismaModelType = typeof SubjectPrismaModel;

export default class SubjectPrismaRepository extends PrismaRepository<Subject> implements SubjectRepository {
    constructor(prisma: PrismaClient) {
        super(prisma, 'subject')
    }

    async findMany(params: FindManyParams<SubjectFields, SubjectFilters>): Promise<FindManyResult<Subject>> {
        try {
            const { sort, page, filters } = params;
            
            const where: Prisma.SubjectWhereInput = {};
            if (filters.primarySubjectId) {
                where.subjectPrimarySubject = {
                    some: {
                        primarySubjectId: Number(filters.primarySubjectId)
                    }
                };
            }
    
            const total = await this.prisma.subject.count({ where });
    
            const subjects = await this.prisma.subject.findMany({
                where,
                orderBy: {
                    [sort.field]: sort.order,
                },
                skip: (page.number - 1) * page.size,
                take: page.size,
            });
    
            return {
                amount: total,
                data: subjects.map((subject) => this.fitModelToEntity(subject)),
            };
        } catch (err) {
            throw err;
        }
    };

    async addCourse (id: string | number, courseId: string | number) : Promise<boolean> {
        try {
            const result = await this.prisma.subjectCourse.create({
                data: {
                    subject: {
                        connect: {
                            id: Number(id)
                        }
                    },
                    course: {
                        connect: {
                            id: Number(courseId)
                        }
                    }
                }
            });
            if(result) return true;
            return false;
        } catch(err) {
            return false;
        }
    };

    async removeCourse (id: string | number, courseId: string | number) : Promise<boolean> {
        try {
                const result = await this.prisma.subjectCourse.delete({
                    where: {
                        subjectId_courseId: {
                            courseId: Number(courseId),
                            subjectId: Number(id),
                        }
                    }
                });
            if(result) return true;
            return false;
        } catch(err) {
            return false;
        }
    };
    
    fitModelToEntity<Model>(model: Model): Subject {
        const prismaModel = model as Prisma.SubjectGetPayload<SubjectPrismaModelType>;

        return new BasicSubject({
            id: prismaModel.id,
            createdAt: prismaModel.createdAt,
            description: prismaModel.description,
            name: prismaModel.name
        })
    }
    fitEntityToModel<Model>(entity: Subject): Model {
        if(entity.id) {
            const updated: Prisma.SubjectUpdateInput = {
                description: entity.description,
                name: entity.name
            }

            return updated as Model;
        }

        const updated: Prisma.SubjectCreateInput = {
            description: entity.description,
            name: entity.name,
            createdAt: entity.createdAt
        }

        return updated as Model;
    }
    
}