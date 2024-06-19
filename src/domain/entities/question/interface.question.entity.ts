import Entity from "../base/interface.entity";

export default interface Question extends Entity {
    title: string;
    description?: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;

    getMarksFromAnswer: (answer: any) => Promise<number>;
}