import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import PrimarySubjectRepository, { PrimarySubjectFields, PrimarySubjectFilters } from "../interface/interface.primary.subject.repository";
import PrimarySubject from "../../../../domain/entities/primary-subject/interface.primary.subject.entity";
import BasicPrimarySubject from "../../../../domain/entities/primary-subject/basic.primary.subject.entity";
import PrismaRepository from "./prisma.repository";


const PrimarySubjectPrismaModel = Prisma.validator<Prisma.PrimarySubjectDefaultArgs>()({});

export type PrimarySubjectPrismaModelType = typeof PrimarySubjectPrismaModel;

export default class PrimarySubjectPrismaRepository extends PrismaRepository<PrimarySubject> implements PrimarySubjectRepository {

    constructor(prisma: PrismaClient) {
        super(prisma, 'primarySubject')
    }

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