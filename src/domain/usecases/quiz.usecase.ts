import QuestionRepository from "../../application/interfaces/repositories/interface/interface.question.repository";
import Quiz from "../entities/quiz/interface.quiz.entity";
import { generateRangeOfNumbersArray } from "../../infrastructure/utils/range";
import GeneratedQuiz from "../entities/quiz/generated.quiz.entity";
import logger from "../../application/services/log";

export default class QuizUseCases {
    private questionRepository: QuestionRepository;

    constructor(params: {
        questionRepository: QuestionRepository
    }) {
        const {
            questionRepository
        } = params;

        this.questionRepository = questionRepository;
    }

    async generate(difficulty: number, topicIds: number[], amount: number, range: number): Promise<Quiz> {
        try {
            const difficultyRange = generateRangeOfNumbersArray(difficulty * 100, range * 100).map((tier) => tier / 100)
            const questions = await this.questionRepository.findForQuizGeneration(difficultyRange, topicIds, amount);
            return new GeneratedQuiz({
                difficultyLevel: difficulty,
                difficultyRange: range,
                questions, 
                amountOfQuestions: amount,
                topicIds,
                createdAt: new Date()
            })
        } catch(err) {
            throw err;
        }
    }
}