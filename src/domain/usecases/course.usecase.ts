import TopicRepository from "../../application/interfaces/repositories/interface/interface.topic.repository";
import Topic from "../entities/topic/interface.topic.entity";
import { CreateTopicDTO } from "../../application/interfaces/presenters/dto/topic/create.topic.dto";
import BasicTopic from "../entities/topic/basic.topic.entity";
import { UpdateTopicDTO } from "../../application/interfaces/presenters/dto/topic/update.topic.dto";
import CourseRepository from "../../application/interfaces/repositories/interface/interface.course.repository";
import BasicCourse from "../entities/course/basic.course.entity";
import Course from "../entities/course/interface.course.entity";
import { CreateCourseDTO } from "../../application/interfaces/presenters/dto/course/create.course.dto";
import { UpdateCourseDTO } from "../../application/interfaces/presenters/dto/course/update.course.dto";

export default class CourseUseCases {
    private courseRepository: CourseRepository;

    constructor(params: {
        courseRepository: CourseRepository
    }) {
        const {
            courseRepository
        } = params;

        this.courseRepository = courseRepository
    }

    async findById(id: number): Promise<Course> {
        try {
            const topic = await this.courseRepository.findById(id);
            return topic;
        } catch(err) {
            throw err
        }
    }


    async deleteById(id: string | number): Promise<Boolean> {
        try {
            const result = await this.courseRepository.deleteById(id);
            return result;
        } catch(err) {
            throw err;
        }
    }

    async create(data: CreateCourseDTO): Promise<Course> {
        try {
            const {
                name,
                description
            } = data;

            const course = new BasicCourse({
                name, description, createdAt: new Date()
            })

            let saved = await this.courseRepository.save(course);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async updateById(id: number, data: UpdateCourseDTO): Promise<Course> {
        try {
            const {
                name,
                description
            } = data;

            const course = await this.courseRepository.findById(id);

            course.id = id;
            course.name = name;
            course.description = description;

            let saved = await this.courseRepository.save(course);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async linkTopicToCourse(courseId: number, topicId: number) : Promise<boolean> {
        try {
            return await this.courseRepository.addTopic(courseId, topicId);
        } catch(err) {
            throw err;
        }
    }

    async unlinkTopicToCourse(courseId: number, topicId: number) : Promise<boolean> {
        try {
            return await this.courseRepository.removeTopic(courseId, topicId);
        } catch(err) {
            throw err;
        }
    }

    async findAll(pageNumber: number, pageSize: number, options: {
        subjectId?: string | number;
    }) {
        try {
            return await this.courseRepository.findMany({
                sort: {
                    field: 'name',
                    order: 'desc'
                },
                filters: {
                    subjectId: options.subjectId
                },
                page: {
                    size: pageSize,
                    number: pageNumber
                }
            });
        } catch(err) {
            throw err;
        }
    }
}