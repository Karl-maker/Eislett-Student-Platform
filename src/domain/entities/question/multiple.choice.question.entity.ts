import { MultipleChoiceOption } from "@prisma/client";
import Question from "./interface.question.entity";

export type MultipleChoiceQuestionParamsType = {
    title: string;
    description?: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;
    id?: string | number;
    createdAt: Date;
    options: MultipleChoiceOption[]; 
}

export default class MultipleChoiceQuestion implements Question {
    title: string;
    description?: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;
    id?: string | number;
    createdAt: Date;
    options: MultipleChoiceOption[]; 

    constructor({
        title,
        description,
        content,
        tags,
        totalPotentialMarks,
        id,
        createdAt,
        options
    }: MultipleChoiceQuestionParamsType) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.tags = tags;
        this.totalPotentialMarks = totalPotentialMarks;
        this.id = id;
        this.createdAt = createdAt;
        this.options = options;
    }
    
    async getMarksFromAnswer(answer: number[]): Promise<number> {
        let totalScore = 0;

        answer.forEach(a => {
            // Find the option with the matching ID
            const option = this.options.find(opt => opt.id === a);
        
            if (option) {
              // Check if the option is correct
              if (option.isCorrect) {
                // Increase the total score if the option is correct
                totalScore += 1;
              } else {
                // Decrease the total score if the option is incorrect
                totalScore -= 1;
              }
            } else {
              // Decrease the total score if the answer ID does not match any option
              totalScore -= 1;
            }
        });

        return totalScore < 0 ? 0 : totalScore;
    }
}
