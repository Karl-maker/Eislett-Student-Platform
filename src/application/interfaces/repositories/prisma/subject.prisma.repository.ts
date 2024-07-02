import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import SubjectRepository, { SubjectFields, SubjectFilters } from "../interface/interface.subject.repository";
import Subject from "../../../../domain/entities/subject/interface.subject.entity";
import BasicSubject from "../../../../domain/entities/subject/basic.subject.entity";


const SubjectPrismaModel = Prisma.validator<Prisma.SubjectDefaultArgs>()({});

export type SubjectPrismaModelType = typeof SubjectPrismaModel;

export default class SubjectPrismaRepository implements SubjectRepository {
    private prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async deleteById(id: string | number): Promise<boolean> {
        try {
            const result = await this.prisma.subject.delete({
                where: {
                    id: Number(id)
                }
            });
            if(result) return true;
            return false;
        } catch (err) {
            return false; // Return false if an error occurs
        }
    };

    async findById (id: string | number) : Promise<Subject> {
        try {
            const found = await this.prisma.subject.findFirst({
                where: {
                    id: Number(id)
                }
            });

            if(!found) throw new NotFoundError('Subject not found');

            return this.fitModelToEntity(found);

        } catch(err) {
            throw err;
        }
    };

    async findMany(params: FindManyParams<SubjectFields, SubjectFilters>): Promise<FindManyResult<Subject>> {
        try {
            const { sort, page, filters } = params;
            
            const where: Prisma.SubjectWhereInput = {};
            if (filters.primarySubjectId) {
                where.SubjectPrimarySubject = {
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

    async save(entity: Subject): Promise<Subject> {
        try {
            if(entity.id) { // updating entity
                const saved = await this.prisma.subject.update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel<Prisma.SubjectUpdateInput>(entity)
                })
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma.subject.create({
                data: this.fitEntityToModel<Prisma.SubjectCreateInput>(entity)
            });
    
            return this.fitModelToEntity(saved);
        } catch(err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }
    
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