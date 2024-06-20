import Question from "../../../../domain/entities/question/interface.question.entity";
import Repository from "./interface.repository";

export default interface QuestionRepository extends Repository<Question> {
    findById: (id: string | number) => Promise<Question>;
}