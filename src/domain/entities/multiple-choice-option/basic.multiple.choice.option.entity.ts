import MultipleChoiceOption from "./interface.multiple.choice.option.entity";

export type BasicMultipleChoiceOptionParamsType = {
    content: string;
    isCorrect: boolean;
    id?: string | number;
    questionId: number;
}

export default class BasicMultipleChoiceOption implements MultipleChoiceOption {
    content: string;
    isCorrect: boolean;
    id?: string | number;
    createdAt: Date;
    questionId: number;

    constructor({
        content,
        isCorrect,
        id,
        questionId
    }: BasicMultipleChoiceOptionParamsType) {
        this.content = content;
        this.isCorrect = isCorrect;
        this.id = id;
        this.createdAt = new Date();
        this.questionId = questionId;
    }

}