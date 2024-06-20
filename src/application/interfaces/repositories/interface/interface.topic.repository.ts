import Topic from "../../../../domain/entities/topic/interface.topic.entity";
import Repository from "./interface.repository";

export default interface TopicRepository extends Repository<Topic> {
    deleteById: (id: string | number)=> Promise<boolean>;
    findById: (id: string | number)=> Promise<Topic>;
    connectToQuestion: (id: number | string, questionId: number | string) => Promise<boolean>;
    disconnectToQuestion: (id: number | string, questionId: number | string) => Promise<boolean>;
}