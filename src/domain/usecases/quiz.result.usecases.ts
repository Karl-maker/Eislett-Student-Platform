import QuizResultRepository from "../../application/interfaces/repositories/interface/interface.quiz.result.repository";
import QuizResult from "../entities/quiz-result/interface.quiz.result.entity";
import BasicQuizResult from "../entities/quiz-result/basic.quiz.result.entity";
import BasicQuestionResult from "../entities/question-result/basic.question.result.entity";
import { CreateQuizResultDTO } from "../../application/interfaces/presenters/dto/quiz-result/create.quiz.result.dto";
import { UpdateQuizResultDTO } from "../../application/interfaces/presenters/dto/quiz-result/update.quiz.result.dto";

export default class QuizResultUseCases {
    private quizResultRepository: QuizResultRepository;

    constructor(params: {
        quizResultRepository: QuizResultRepository
    }) {
        const {
            quizResultRepository
        } = params;

        this.quizResultRepository = quizResultRepository
    }

    async create(studentId: number, data: CreateQuizResultDTO): Promise<QuizResult> {
        try {
            const {
                results
            } = data;

            const questionResults = results.map((result) => {
                return new BasicQuestionResult({
                    createdAt: new Date(),
                    questionId: result.questionId,
                    marksRecieved: result.marksRecieved,
                    quizResultId: ""
                });
            })

            const quizResult = new BasicQuizResult({
                studentId,
                questionResults,
                createdAt: new Date()
            })

            let saved = await this.quizResultRepository.save(quizResult);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async updateResultsById(id: number, studentId: number, data: UpdateQuizResultDTO): Promise<QuizResult> {
        try {
            const {
                results
            } = data;

            const questionResults = results.map((result) => {
                return new BasicQuestionResult({
                    createdAt: new Date(),
                    questionId: result.questionId,
                    marksRecieved: result.marksRecieved,
                    quizResultId: id
                });
            })

            const quizResult = new BasicQuizResult({
                id,
                studentId,
                questionResults,
                createdAt: new Date()
            })

            let saved = await this.quizResultRepository.save(quizResult);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

}