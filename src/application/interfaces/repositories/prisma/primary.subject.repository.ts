import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import PrimarySubjectRepository, { PrimarySubjectFields, PrimarySubjectFilters } from "../interface/interface.primary.subject.repository";
import PrimarySubject from "../../../../domain/entities/primary-subject/interface.primary.subject.entity";
import BasicPrimarySubject from "../../../../domain/entities/primary-subject/basic.primary.subject.entity";


const PrimarySubjectPrismaModel = Prisma.validator<Prisma.PrimarySubjectDefaultArgs>()({});

export type PrimarySubjectPrismaModelType = typeof PrimarySubjectPrismaModel;

export default class PrimarySubjectPrismaRepository implements PrimarySubjectRepository {
    private prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async deleteById(id: string | number): Promise<boolean> {
        try {
            const result = await this.prisma.primarySubject.delete({
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

    async findById (id: string | number) : Promise<PrimarySubject> {
        try {
            const found = await this.prisma.primarySubject.findFirst({
                where: {
                    id: Number(id)
                }
            });

            if(!found) throw new NotFoundError('Primary subject not found');

            return this.fitModelToEntity(found);

        } catch(err) {
            throw err;
        }
    };

    async findMany(params: FindManyParams<PrimarySubjectFields, PrimarySubjectFilters>): Promise<FindManyResult<PrimarySubject>> {
        try {
            const { sort, page, filters } = params;
            
            const where: Prisma.PrimarySubjectWhereInput = {};
    
            const total = await this.prisma.primarySubject.count({ where });
    
            const primarySubjects = await this.prisma.primarySubject.findMany({
                where,
                orderBy: {
                    [sort.field]: sort.order,
                },
                skip: (page.number - 1) * page.size,
                take: page.size,
            });
    
            return {
                amount: total,
                data: primarySubjects.map((primarySubject) => this.fitModelToEntity(primarySubject)),
            };
        } catch (err) {
            throw err;
        }
    };

    async addSubject (id: string | number, subjectId: string | number) : Promise<boolean> {
        try {
            const result = await this.prisma.subjectPrimarySubject.create({
                data: {
                    subject: {
                        connect: {
                            id: Number(subjectId)
                        }
                    },
                    primarySubject: {
                        connect: {
                            id: Number(id)
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

    async removeSubject (id: string | number, subjectId: string | number) : Promise<boolean> {
        try {
                const result = await this.prisma.subjectPrimarySubject.delete({
                    where: {
                        primarySubjectId_subjectId: {
                            primarySubjectId: Number(id),
                            subjectId: Number(subjectId),
                        }
                    }
                });
            if(result) return true;
            return false;
        } catch(err) {
            return false;
        }
    };

    async save(entity: PrimarySubject): Promise<PrimarySubject> {
        try {
            if(entity.id) { // updating entity
                const saved = await this.prisma.primarySubject.update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel<Prisma.PrimarySubjectUpdateInput>(entity)
                })
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma.primarySubject.create({
                data: this.fitEntityToModel<Prisma.PrimarySubjectCreateInput>(entity)
            });
    
            return this.fitModelToEntity(saved);
        } catch(err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }
    
    fitModelToEntity<Model>(model: Model): PrimarySubject {
        const prismaModel = model as Prisma.PrimarySubjectGetPayload<PrimarySubjectPrismaModelType>;

        return new BasicPrimarySubject({
            id: prismaModel.id,
            createdAt: prismaModel.createdAt,
            description: prismaModel.description,
            name: prismaModel.name
        })
    }
    fitEntityToModel<Model>(entity: PrimarySubject): Model {
        if(entity.id) {
            const updated: Prisma.PrimarySubjectUpdateInput = {
                description: entity.description,
                name: entity.name
            }

            return updated as Model;
        }

        const updated: Prisma.PrimarySubjectCreateInput = {
            description: entity.description,
            name: entity.name,
            createdAt: entity.createdAt
        }

        return updated as Model;
    }
    
}