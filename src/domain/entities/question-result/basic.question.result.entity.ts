import QuestionResult from "./interface.question.result.entity";

export type BasicQuestionResultParamsType = {
    questionId: number | string;
    quizResultId: number | string;
    marksRecieved: number;
    id?: string | number;
    createdAt: Date;
}

export default class BasicQuestionResult implements QuestionResult {
    questionId: number | string;
    quizResultId: number | string;
    marksRecieved: number;
    id?: string | number;
    createdAt: Date;

    constructor({
        questionId,
        quizResultId,
        marksRecieved,
        id,
        createdAt
    }: BasicQuestionResultParamsType) {
        this.marksRecieved = marksRecieved;
        this.questionId = questionId;
        this.quizResultId = quizResultId;
        this.id = id;
        this.createdAt = createdAt;
    }
}
