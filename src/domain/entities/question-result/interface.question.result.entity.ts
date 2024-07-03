import Entity from "../base/interface.entity";

export default interface QuestionResult extends Entity {
    questionId: number | string;
    quizResultId: number | string;
    marksRecieved: number;
}