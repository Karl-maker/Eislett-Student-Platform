import SubjectRepository from "../../application/interfaces/repositories/interface/interface.subject.repository";
import Subject from "../entities/subject/interface.subject.entity";
import BasicSubject from "../entities/subject/basic.subject.entity";
import { CreateSubjectDTO } from "../../application/interfaces/presenters/dto/subject/create.subject.dto";
import { UpdateSubjectDTO } from "../../application/interfaces/presenters/dto/subject/update.subject.dto";
import PrimarySubjectRepository from "../../application/interfaces/repositories/interface/interface.primary.subject.repository";
import PrimarySubject from "../entities/primary-subject/interface.primary.subject.entity";
import BasicPrimarySubject from "../entities/primary-subject/basic.primary.subject.entity";
import { CreatePrimarySubjectDTO } from "../../application/interfaces/presenters/dto/primary-subject/create.primary.subject.dto";
import { UpdatePrimarySubjectDTO } from "../../application/interfaces/presenters/dto/primary-subject/update.primary.subject.dto";

export default class PrimarySubjectUseCases {
    private primarySubjectRepository: PrimarySubjectRepository;

    constructor(params: {
        primarySubjectRepository: PrimarySubjectRepository
    }) {
        const {
            primarySubjectRepository
        } = params;

        this.primarySubjectRepository = primarySubjectRepository
    }

    async findById(id: number): Promise<PrimarySubject> {
        try {
            const primarySubject = await this.primarySubjectRepository.findById(id);
            return primarySubject;
        } catch(err) {
            throw err
        }
    }


    async deleteById(id: string | number): Promise<Boolean> {
        try {
            const result = await this.primarySubjectRepository.deleteById(id);
            return result;
        } catch(err) {
            throw err;
        }
    }

    async create(data: CreatePrimarySubjectDTO): Promise<PrimarySubject> {
        try {
            const {
                name,
                description
            } = data;

            const primarySubject = new BasicPrimarySubject({
                name, description, createdAt: new Date()
            })

            let saved = await this.primarySubjectRepository.save(primarySubject);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async updateById(id: number, data: UpdatePrimarySubjectDTO): Promise<PrimarySubject> {
        try {
            const {
                name,
                description
            } = data;

            const primarySubject = await this.primarySubjectRepository.findById(id);

            primarySubject.id = id;
            primarySubject.name = name;
            primarySubject.description = description;

            let saved = await this.primarySubjectRepository.save(primarySubject);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async linkSubjectToPrimarySubject(primarySubjectId: number, subjectId: number) : Promise<boolean> {
        try {
            return await this.primarySubjectRepository.addSubject(primarySubjectId, subjectId);
        } catch(err) {
            throw err;
        }
    }

    async unlinkSubjectToPrimarySubject(primarySubjectId: number, subjectId: number) : Promise<boolean> {
        try {
            return await this.primarySubjectRepository.removeSubject(primarySubjectId, subjectId);
        } catch(err) {
            throw err;
        }
    }

    async findAll(pageNumber: number, pageSize: number, options: {

    }) {
        try {
            return await this.primarySubjectRepository.findMany({
                sort: {
                    field: 'name',
                    order: 'desc'
                },
                filters: {},
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