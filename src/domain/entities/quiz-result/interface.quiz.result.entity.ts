import Entity from "../base/interface.entity";
import QuestionResult from "../question-result/interface.question.result.entity";

export default interface QuizResult extends Entity {
    studentId: number;
    questionResults: QuestionResult[];
}