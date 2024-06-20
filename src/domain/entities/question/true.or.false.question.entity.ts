import Question from "./interface.question.entity";

export type TrueOrFalseQuestionParamsType = {
    title: string;
    description?: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;
    id?: string | number;
    createdAt: Date;
    
    isTrue: boolean; 
}

export default class TrueOrFalseQuestion implements Question {
    title: string;
    description?: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;
    id?: string | number;
    createdAt: Date;
    isTrue: boolean;

    constructor({
        title,
        description,
        content,
        tags,
        totalPotentialMarks,
        id,
        createdAt,
        isTrue
    }: TrueOrFalseQuestionParamsType) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.tags = tags;
        this.totalPotentialMarks = totalPotentialMarks;
        this.id = id;
        this.createdAt = createdAt;
        this.isTrue = isTrue;
    }
    
    async getMarksFromAnswer (answer: Boolean) : Promise<number> {
        return answer === this.isTrue ? this.totalPotentialMarks : 0;
    };
}