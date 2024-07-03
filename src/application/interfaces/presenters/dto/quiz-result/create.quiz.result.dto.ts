export interface CreateQuizResultDTO {
    results: {
        marksRecieved: number;
        questionId: number;
    }[]
}