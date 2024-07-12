import TopicRepository from "../../application/interfaces/repositories/interface/interface.topic.repository";
import Topic from "../entities/topic/interface.topic.entity";
import { CreateTopicDTO } from "../../application/interfaces/presenters/dto/topic/create.topic.dto";
import BasicTopic from "../entities/topic/basic.topic.entity";
import { UpdateTopicDTO } from "../../application/interfaces/presenters/dto/topic/update.topic.dto";
import SubscriptionRepository from "../../application/interfaces/repositories/interface/interface.subscription.repository";
import Subscription from "../entities/subscription/interface.subscription.entity";
import BasicSubscription from "../entities/subscription/base.subscription.entity";
import { CreateSubscriptionDTO } from "../../application/interfaces/presenters/dto/subscription/create.subscription.dto";
import { UpdateSubscriptionDTO } from "../../application/interfaces/presenters/dto/subscription/update.subscription.dto";
import EmailSender from "../../application/services/email/interface.email";
import StudentRepository from "../../application/interfaces/repositories/interface/interface.student.repository";
import UnexpectedError from "../../application/services/error/unexpected.error";
import SubscriptionCreatedEmail from "../entities/email/subscription.created.email.entity";
import SubjectRepository from "../../application/interfaces/repositories/interface/interface.subject.repository";

export default class SubscriptionUseCases {
    private subscriptionRepository: SubscriptionRepository;
    private studentRepository: StudentRepository;
    private emailService: EmailSender;
    private subjectRepository: SubjectRepository;

    constructor(params: {
        subscriptionRepository: SubscriptionRepository,
        studentRepository: StudentRepository,
        emailService: EmailSender,
        subjectRepository: SubjectRepository
    }) {
        const {
            subscriptionRepository,
            emailService,
            studentRepository,
            subjectRepository
        } = params;

        this.subscriptionRepository = subscriptionRepository
        this.emailService = emailService
        this.studentRepository = studentRepository
        this.subjectRepository = subjectRepository
    }

    async sendSubscritpionCreatedEmail (subscription: Subscription): Promise<void> {
        try {
            const student = await this.studentRepository.findById(subscription.studentId);
            const subject = await this.subjectRepository.findById(subscription.subjectId)
            const email = new SubscriptionCreatedEmail({
                context: {
                    name: `${student.firstName} ${student.lastName}`,
                    expires: subscription.expiresAt,
                    subscriptionName: subject.name,
                    trialEnds: subscription.trial.end || undefined,
                    trialStarts: subscription.trial.start || undefined,
                    startsAt: subscription.startedAt
                },
                to: student.email,
            });
    
            // Create promises for both actions
            const emailPromise = this.emailService.send(email);
            // Use Promise.all to execute both actions
            const [emailResult] = await Promise.all([emailPromise]);
    
            if (!emailResult.success) throw new UnexpectedError('Issue Sending Subscription Email');
    
        } catch(err) {
            throw err;
        }
    }

    async findAll(pageNumber: number, pageSize: number, options: {
        studentId?: string | number;
    }) {
        try {
            return await this.subscriptionRepository.findMany({
                sort: {
                    field: 'expiresAt',
                    order: 'desc'
                },
                filters: {
                    studentId: options.studentId
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

    async findById(id: number): Promise<Subscription> {
        try {
            const topic = await this.subscriptionRepository.findById(id);
            return topic;
        } catch(err) {
            throw err
        }
    }


    async deleteById(id: string | number): Promise<Boolean> {
        try {
            const result = await this.subscriptionRepository.deleteById(id);
            return result;
        } catch(err) {
            throw err;
        }
    }

    async create(data: CreateSubscriptionDTO): Promise<Subscription> {
        try {
            const {
                subjectId,
                studentId,
                trial,
                expiresAt,
                canceledAt,
                autoRenew,
                status,
                startedAt
            } = data;

            const topic = new BasicSubscription({
                createdAt: new Date(),
                subjectId,
                studentId,
                trial,
                expiresAt,
                canceledAt,
                autoRenew,
                status,
                startedAt
            })

            let saved = await this.subscriptionRepository.save(topic);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async updateById(id: number, data: UpdateSubscriptionDTO): Promise<Subscription> {
        try {
            const {
                trial,
                expiresAt,
                canceledAt,
                autoRenew,
                status,
                startedAt
            } = data;

            const subscription = await this.subscriptionRepository.findById(id);

            if(trial) subscription.trial = trial;
            if(expiresAt) subscription.expiresAt = expiresAt;
            if(canceledAt) subscription.canceledAt = canceledAt;
            if(autoRenew) subscription.autoRenew = autoRenew;
            if(status) subscription.status = status;
            if(startedAt) subscription.startedAt = startedAt;

            let saved = await this.subscriptionRepository.save(subscription);

            return saved; 
        } catch(err) {
            throw err;
        }
    }
}