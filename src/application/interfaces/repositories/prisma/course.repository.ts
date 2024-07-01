import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import Topic from "../../../../domain/entities/topic/interface.topic.entity";
import CourseRepository, { CourseFields, CourseFilters } from "../interface/interface.course.repository";
import Course from "../../../../domain/entities/course/interface.course.entity";
import BasicCourse from "../../../../domain/entities/course/basic.course.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";


const CoursePrismaModel = Prisma.validator<Prisma.CourseDefaultArgs>()({});

export type CoursePrismaModelType = typeof CoursePrismaModel;

export default class CoursePrismaRepository implements CourseRepository {
    private prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async deleteById(id: string | number): Promise<boolean> {
        try {
            const result = await this.prisma.course.delete({
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

    async findById (id: string | number) : Promise<Course> {
        try {
            const found = await this.prisma.course.findFirst({
                where: {
                    id: Number(id)
                }
            });

            if(!found) throw new NotFoundError('Course not found');

            return this.fitModelToEntity(found);

        } catch(err) {
            throw err;
        }
    };

    async findMany(params: FindManyParams<CourseFields, CourseFilters>): Promise<FindManyResult<Course>> {
        try {
            const { sort, page, filters } = params;
            
            const where: Prisma.CourseWhereInput = {};
            if (filters.subjectId) {
                where.SubjectCourse = {
                    some: {
                        subjectId: Number(filters.subjectId)
                    }
                };
            }
    
            const total = await this.prisma.course.count({ where });
    
            const courses = await this.prisma.course.findMany({
                where,
                orderBy: {
                    [sort.field]: sort.order,
                },
                skip: (page.number - 1) * page.size,
                take: page.size,
            });
    
            return {
                amount: total,
                data: courses.map((course) => this.fitModelToEntity(course)),
            };
        } catch (err) {
            throw err;
        }
    };

    async addTopic (id: string | number, topicId: string | number) : Promise<boolean> {
        try {
            const result = await this.prisma.courseTopic.create({
                data: {
                    topic: {
                        connect: {
                            id: Number(topicId)
                        }
                    },
                    course: {
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

    async removeTopic (id: string | number, topicId: string | number) : Promise<boolean> {
        try {
            const result = await this.prisma.courseTopic.delete({
                where: {
                    topicId_courseId: {
                        courseId: Number(id),
                        topicId: Number(topicId),
                    }
                }
            });
            if(result) return true;
            return false;
        } catch(err) {
            return false;
        }
    };

    async save(entity: Course): Promise<Course> {
        try {
            if(entity.id) { // updating entity
                const saved = await this.prisma.course.update({
                    where: {
                        id: Number(entity.id)
                    },
                    data: this.fitEntityToModel<Prisma.CourseUpdateInput>(entity)
                })
    
                return this.fitModelToEntity(saved);
            }
    
            const saved = await this.prisma.course.create({
                data: this.fitEntityToModel<Prisma.CourseCreateInput>(entity)
            });
    
            return this.fitModelToEntity(saved);
        } catch(err: any) {
            throw new UnexpectedError(err['message'], err);
        }
    }
    
    fitModelToEntity<Model>(model: Model): Course {
        const prismaModel = model as Prisma.CourseGetPayload<CoursePrismaModelType>;

        return new BasicCourse({
            id: prismaModel.id,
            createdAt: prismaModel.createdAt,
            description: prismaModel.description,
            name: prismaModel.name
        })
    }
    fitEntityToModel<Model>(entity: Course): Model {
        if(entity.id) {
            const updated: Prisma.CourseUpdateInput = {
                description: entity.description,
                name: entity.name
            }

            return updated as Model;
        }

        const updated: Prisma.CourseCreateInput = {
            description: entity.description,
            name: entity.name,
            createdAt: entity.createdAt
        }

        return updated as Model;
    }
    
}