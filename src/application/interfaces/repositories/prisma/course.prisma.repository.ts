import { Prisma, PrismaClient } from "@prisma/client";
import UnexpectedError from "../../../services/error/unexpected.error";
import NotFoundError from "../../../services/error/not.found.error";
import Topic from "../../../../domain/entities/topic/interface.topic.entity";
import CourseRepository, { CourseFields, CourseFilters } from "../interface/interface.course.repository";
import Course from "../../../../domain/entities/course/interface.course.entity";
import BasicCourse from "../../../../domain/entities/course/basic.course.entity";
import { FindManyParams, FindManyResult } from "../../types/find.many.type";
import PrismaRepository from "./prisma.repository";


const CoursePrismaModel = Prisma.validator<Prisma.CourseDefaultArgs>()({});

export type CoursePrismaModelType = typeof CoursePrismaModel;

export default class CoursePrismaRepository extends PrismaRepository<Course> implements CourseRepository {

    constructor(prisma: PrismaClient) {
        super(prisma, 'course')
    }

    async findMany(params: FindManyParams<CourseFields, CourseFilters>): Promise<FindManyResult<Course>> {
        try {
            const { sort, page, filters } = params;
            
            const where: Prisma.CourseWhereInput = {};
            if (filters.subjectId) {
                where.subjectCourse = {
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