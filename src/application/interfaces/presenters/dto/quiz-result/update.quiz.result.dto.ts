export interface UpdateQuizResultDTO {
    results: {
        marksRecieved: number;
        questionId: number;
    }[]
}