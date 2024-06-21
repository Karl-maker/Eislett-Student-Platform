import Question from "../question/interface.question.entity";
import Quiz from "./interface.quiz.entity";

export type GeneratedQuizParamsType = {
    difficultyLevel: number;
    difficultyRange: number;
    questions: Question[];
    amountOfQuestions: number;
    topicIds: number[];
    id?: string | number;
    createdAt: Date;
}

export default class GeneratedQuiz implements Quiz {
    difficultyLevel: number;
    difficultyRange: number;
    questions: Question[];
    amountOfQuestions: number;
    topicIds: number[];
    id?: string | number;
    createdAt: Date;

    constructor({
        difficultyLevel,
        difficultyRange,
        questions,
        amountOfQuestions,
        topicIds,
        id,
        createdAt
    }: GeneratedQuizParamsType) {
        this.difficultyRange = difficultyRange;
        this.amountOfQuestions = amountOfQuestions;
        this.id = id;
        this.createdAt = createdAt;
        this.questions = questions;
        this.difficultyLevel = difficultyLevel;
        this.topicIds = topicIds;
    }
}
