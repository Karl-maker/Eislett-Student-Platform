import QuestionResult from "../question-result/interface.question.result.entity";
import QuizResult from "./interface.quiz.result.entity";

export type BasicTopicParamsType = {
    studentId: number;
    questionResults: QuestionResult[];
    id?: string | number;
    createdAt: Date;
}

export default class BasicQuizResult implements QuizResult {
    studentId: number;
    questionResults: QuestionResult[];
    id?: string | number;
    createdAt: Date;
    
    constructor({
        studentId,
        questionResults,
        id,
        createdAt
    }: BasicTopicParamsType){
        this.studentId = studentId;
        this.questionResults = questionResults;
        this.id = id;
        this.createdAt = createdAt;
    }
}