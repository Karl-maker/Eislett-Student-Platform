export type UpdateQuestionDTO = {
    title: string;
    description: string;
    content: string;
    tags: string[];
    totalPotentialMarks: number;
    type: 'multiple_choice' | 'true_or_false';
    isTrue?: boolean;
    multipleChoiceOptions?: {
        content: string;
        isCorrect: boolean;
        id?: number;
    }[]
}