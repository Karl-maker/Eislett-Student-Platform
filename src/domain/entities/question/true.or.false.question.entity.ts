import Topic from "../topic/interface.topic.entity";
import Question from "./interface.question.entity";

export type TrueOrFalseQuestionParamsType = {
    title: string;
    description?: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;
    id?: string | number;
    createdAt: Date;
    difficultyLevel: number;
    isTrue: boolean; 
    topics?: Topic[];
}

export default class TrueOrFalseQuestion implements Question {
    title: string;
    description?: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;
    id?: string | number;
    createdAt: Date;
    difficultyLevel: number;
    isTrue: boolean;
    topics?: Topic[];

    constructor({
        title,
        description,
        content,
        tags,
        totalPotentialMarks,
        id,
        createdAt,
        isTrue,
        difficultyLevel,
        topics
    }: TrueOrFalseQuestionParamsType) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.tags = tags;
        this.totalPotentialMarks = totalPotentialMarks;
        this.id = id;
        this.createdAt = createdAt;
        this.isTrue = isTrue;
        this.difficultyLevel = difficultyLevel;
        this.topics = topics;
    }
    
    async getMarksFromAnswer (answer: Boolean) : Promise<number> {
        return answer === this.isTrue ? this.totalPotentialMarks : 0;
    };
}