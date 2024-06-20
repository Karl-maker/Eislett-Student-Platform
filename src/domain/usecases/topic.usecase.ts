import TopicRepository from "../../application/interfaces/repositories/interface/interface.topic.repository";
import Topic from "../entities/topic/interface.topic.entity";
import { CreateTopicDTO } from "../../application/interfaces/presenters/dto/topic/create.topic.dto";
import BasicTopic from "../entities/topic/basic.topic.entity";
import { UpdateTopicDTO } from "../../application/interfaces/presenters/dto/topic/update.topic.dto";

export default class TopicUseCases {
    private topicRepository: TopicRepository;

    constructor(params: {
        topicRepository: TopicRepository
    }) {
        const {
            topicRepository
        } = params;

        this.topicRepository = topicRepository
    }

    async findById(id: number): Promise<Topic> {
        try {
            const topic = await this.topicRepository.findById(id);
            return topic;
        } catch(err) {
            throw err
        }
    }


    async deleteById(id: string | number): Promise<Boolean> {
        try {
            const result = await this.topicRepository.deleteById(id);
            return result;
        } catch(err) {
            throw err;
        }
    }

    async create(data: CreateTopicDTO): Promise<Topic> {
        try {
            const {
                name,
                description
            } = data;

            const topic = new BasicTopic({
                name, description, createdAt: new Date()
            })

            let saved = await this.topicRepository.save(topic);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async updateById(id: number, data: UpdateTopicDTO): Promise<Topic> {
        try {
            const {
                name,
                description
            } = data;

            const topic = await this.topicRepository.findById(id);

            topic.id = id;
            topic.name = name;
            topic.description = description;

            let saved = await this.topicRepository.save(topic);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async linkTopicToQuestion(topicId: number, questionId: number) : Promise<boolean> {
        try {
            return await this.topicRepository.connectToQuestion(topicId, questionId);
        } catch(err) {
            throw err;
        }
    }

    async unlinkTopicToQuestion(topicId: number, questionId: number) : Promise<boolean> {
        try {
            return await this.topicRepository.disconnectToQuestion(topicId, questionId);
        } catch(err) {
            throw err;
        }
    }
}