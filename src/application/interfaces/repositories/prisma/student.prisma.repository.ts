import { Prisma, PrismaClient } from "@prisma/client";
import { SearchParams, SearchResult } from "../../types/search.type";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import Student from "../../../../domain/entities/student/interface.student.entity";
import BasicStudent from "../../../../domain/entities/student/basic.student.entity";
import StudentRepository from "../interface/interface.student.repository";
import PrismaRepository from "./prisma.repository";


const StudentPrismaModel = Prisma.validator<Prisma.StudentDefaultArgs>()({});

export type StudentPrismaModelType = typeof StudentPrismaModel;

export default class StudentPrismaRepository extends PrismaRepository<Student> implements StudentRepository {
    
    constructor(prisma: PrismaClient) {
        super(prisma, 'student')
    }
    
    async addCoins(id: string | number, amount: number): Promise<Boolean> {
        try {
            const result = await this.prisma.student.update({
                where: { id: Number(id) },
                data: { coins: { increment: amount } }
            });
    
            return result ? true : false;
        } catch (err) {
            return false; 
        }
    };    
    

    async findByEmail (email: string) : Promise<Student> {
        try {
            const found = await this.prisma.student.findFirst({
                where: {
                    email
                }
            });

            if(!found) throw new NotFoundError('Student not found');

            return this.fitModelToEntity(found);

        } catch(err) {
            throw err;
        }
    };
    
    fitModelToEntity<Model>(model: Model): Student {
        const prismaModel = model as Prisma.StudentGetPayload<StudentPrismaModelType>;
        let confirmation = undefined;
        let recovery = undefined;
        let profileImage = undefined;

        if(prismaModel.confirmationCode && prismaModel.confirmationExpiresAt) confirmation = {
            expiresAt: prismaModel.confirmationExpiresAt,
            code: prismaModel.confirmationCode,
        }

        if(prismaModel.recoveryCode && prismaModel.recoveryExpiresAt) recovery = {
            expiresAt: prismaModel.recoveryExpiresAt,
            code: prismaModel.recoveryCode,
        }

        if(prismaModel.profileImageKey && prismaModel.profileImageUrl) profileImage = {
            url: prismaModel.profileImageUrl,
            key: prismaModel.profileImageKey,
        }

        return new BasicStudent({
            id: prismaModel.id,
            email: prismaModel.email,
            createdAt: prismaModel.createdAt,
            deactivated: prismaModel.deactivate,
            hashPassword: prismaModel.hashPassword,
            firstName: prismaModel.firstName,
            lastName: prismaModel.lastName,
            confirmation,
            recovery,
            confirmed: prismaModel.confirmed,
            displayName: prismaModel.displayName,
            profileImage,
            coins: prismaModel.coins
        })
    }
    fitEntityToModel<Model>(entity: Student): Model {
        if(entity.id) {
            const updated: Prisma.StudentUpdateInput = {
                firstName: entity.firstName,
                lastName: entity.lastName,
                deactivate: entity.deactivated,
                email: entity.email,
                hashPassword: entity.hashPassword,
                confirmationCode: entity.confirmation?.code,
                confirmationExpiresAt: entity.confirmation?.expiresAt,
                confirmed: entity.confirmed,
                recoveryExpiresAt: entity.recovery?.expiresAt || null,
                recoveryCode: entity.recovery?.code || null,
                displayName: entity.displayName || null,
                profileImageUrl: entity.profileImage ? entity.profileImage.url : null,
                profileImageKey: entity.profileImage ? entity.profileImage.key : null,
            }

            return updated as Model;
        }

        const updated: Prisma.StudentCreateInput = {
            firstName: entity.firstName,
            lastName: entity.lastName,
            deactivate: entity.deactivated,
            email: entity.email,
            hashPassword: entity.hashPassword,
            displayName: entity.displayName,
        }

        return updated as Model;
    }
    
}