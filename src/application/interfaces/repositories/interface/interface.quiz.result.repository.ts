import QuestionResult from "../../../../domain/entities/question-result/interface.question.result.entity";
import QuizResult from "../../../../domain/entities/quiz-result/interface.quiz.result.entity";
import Repository from "./interface.repository";

export type QuizResultFilters = {
    studentId: number;
}

export type QuizResultFields = {
    createdAt: Date;
    id: number | string;
}

export default interface QuizResultRepository extends Repository<QuizResult> {

}