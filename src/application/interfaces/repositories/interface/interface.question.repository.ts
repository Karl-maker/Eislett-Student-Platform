import Question from "../../../../domain/entities/question/interface.question.entity";
import Repository from "./interface.repository";

export default interface QuestionRepository extends Repository<Question> {
    //findManyByIds: (id: string[] | number[]) => Promise<Question>;
}