import Entity from "../base/interface.entity";
import Topic from "../topic/interface.topic.entity";

export default interface Question extends Entity {
    title: string;
    description?: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;
    difficultyLevel: number;
    topics?: Topic[];

    getMarksFromAnswer: (answer: any) => Promise<number>;
}