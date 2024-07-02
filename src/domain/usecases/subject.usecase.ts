import SubjectRepository from "../../application/interfaces/repositories/interface/interface.subject.repository";
import Subject from "../entities/subject/interface.subject.entity";
import BasicSubject from "../entities/subject/basic.subject.entity";
import { CreateSubjectDTO } from "../../application/interfaces/presenters/dto/subject/create.subject.dto";
import { UpdateSubjectDTO } from "../../application/interfaces/presenters/dto/subject/update.subject.dto";

export default class SubjectUseCases {
    private subjectRepository: SubjectRepository;

    constructor(params: {
        subjectRepository: SubjectRepository
    }) {
        const {
            subjectRepository
        } = params;

        this.subjectRepository = subjectRepository
    }

    async findById(id: number): Promise<Subject> {
        try {
            const subject = await this.subjectRepository.findById(id);
            return subject;
        } catch(err) {
            throw err
        }
    }


    async deleteById(id: string | number): Promise<Boolean> {
        try {
            const result = await this.subjectRepository.deleteById(id);
            return result;
        } catch(err) {
            throw err;
        }
    }

    async create(data: CreateSubjectDTO): Promise<Subject> {
        try {
            const {
                name,
                description
            } = data;

            const subject = new BasicSubject({
                name, description, createdAt: new Date()
            })

            let saved = await this.subjectRepository.save(subject);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async updateById(id: number, data: UpdateSubjectDTO): Promise<Subject> {
        try {
            const {
                name,
                description
            } = data;

            const subject = await this.subjectRepository.findById(id);

            subject.id = id;
            subject.name = name;
            subject.description = description;

            let saved = await this.subjectRepository.save(subject);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async linkSubjectToCourse(courseId: number, subjectId: number) : Promise<boolean> {
        try {
            return await this.subjectRepository.addCourse(subjectId, courseId);
        } catch(err) {
            throw err;
        }
    }

    async unlinkSubjectToCourse(courseId: number, subjectId: number) : Promise<boolean> {
        try {
            return await this.subjectRepository.removeCourse(subjectId, courseId);
        } catch(err) {
            throw err;
        }
    }

    async findAll(pageNumber: number, pageSize: number, options: {
        primarySubjectId?: string | number;
    }) {
        try {
            return await this.subjectRepository.findMany({
                sort: {
                    field: 'name',
                    order: 'desc'
                },
                filters: {
                    primarySubjectId: options.primarySubjectId
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