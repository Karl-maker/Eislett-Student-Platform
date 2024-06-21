import Entity from "../base/interface.entity";
import Question from "../question/interface.question.entity";

export default interface Quiz extends Entity {
    difficultyLevel: number;
    difficultyRange: number;
    questions: Question[];
    amountOfQuestions: number;
    topicIds: number[];
}