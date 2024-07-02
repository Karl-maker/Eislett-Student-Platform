import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import Repository from "../interface/interface.repository";
import E from "../../../../domain/entities/base/interface.entity";

export default abstract class PrismaRepository<Entity extends E> implements Repository<Entity> {
    prisma: PrismaClient;
    private model: string

    constructor(prisma: PrismaClient, model: string) {
        this.prisma = prisma;
        this.model = model;
    }

    async deleteById(id: string | number): Promise<boolean> {
        try {
            const result = await this.prisma[this.model].delete({
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

    async findById(id: string | number) : Promise<Entity> {
        try {
            const found = await this.prisma[this.model].findFirst({
                where: {
                    id: Number(id)
                }
            });

            if(!found) throw new NotFoundError(`Item not found`);

            return this.fitModelToEntity(found);

        } catch(err) {
            throw err;
        }
    };

    /**
     * @note for filters this needs to be implemented 
     */

    async findMany(params: FindManyParams<any, any>): Promise<FindManyResult<Entity>> {
        try {
            const { sort, page } = params;
            
            const where = {};
    
            const total = await this.prisma[this.model].count({ where });
            const items = await this.prisma[this.model].findMany({
                where,
                orderBy: {
                    [sort.field]: sort.order,
                },
                skip: (page.number - 1) * page.size,
                take: page.size,
            });
    
            return {
                amount: total,
                data: items.map((item) => this.fitModelToEntity(item)),
            };
        } catch (err) {
            throw err;
        }
    };

    async save(entity: Entity): Promise<Entity> {
        try {
            if(entity.id) { // updating entity
                const saved = await this.prisma[this.model].update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel(entity)
                })
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma[this.model].create({
                data: this.fitEntityToModel(entity)
            });
    
            return this.fitModelToEntity(saved);
        } catch(err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }

    async deleteMany(where: Prisma.PrismaClientKnownRequestError): Promise<number> {
        try {
            const result = await this.prisma[this.model].deleteMany({ where });
            return result.count;
        } catch (err) {
            throw new UnexpectedError(err['message'], err);
        }
    }


    async findFirst(where: Prisma.PrismaClientKnownRequestError): Promise<Entity | null> {
        try {
            const found = await this.prisma[this.model].findFirst({ where });
            return found ? this.fitModelToEntity(found) : null;
        } catch (err) {
            throw err;
        }
    }

    async count(where: Prisma.PrismaClientKnownRequestError): Promise<number> {
        try {
            return await this.prisma[this.model].count({ where });
        } catch (err) {
            throw new UnexpectedError(err['message'], err);
        }
    }

    async update(id: string | number, data: Partial<Entity>): Promise<Entity> {
        try {
            const updated = await this.prisma[this.model].update({
                where: {
                    id: Number(id)
                },
                data: this.fitEntityToModel(data as Entity)
            });

            return this.fitModelToEntity(updated);
        } catch (err) {
            throw new UnexpectedError(err['message'], err);
        }
    }

    abstract fitModelToEntity<Model>(model: Model): Entity;
    abstract fitEntityToModel<Model>(entity: Entity): Model;
}