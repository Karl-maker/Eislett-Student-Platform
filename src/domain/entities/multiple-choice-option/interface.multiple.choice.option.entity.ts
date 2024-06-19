import Entity from "../base/interface.entity";

export default interface MultipleChoiceOption extends Entity {
    content: string;
    isCorrect: boolean;
    questionId: number;
}