import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import QuestionUseCases from "../../../domain/usecases/question.usecase";
import QuestionPrismaRepository from "../../../application/interfaces/repositories/prisma/question.prisma.repository";
import { CreateQuestionDTO } from "../../../application/interfaces/presenters/dto/question/create.question.dto";
import { UpdateQuestionDTO } from "../../../application/interfaces/presenters/dto/question/update.question.dto";
import MultipleChoiceOptionPrismaRepository from "../../../application/interfaces/repositories/prisma/multiple.choice.option.repository";
import { FindByDifficultyAndTopicsDTO } from "../../../application/interfaces/presenters/dto/question/find.by.difficulty.and.topics.dto";
import QuizUseCases from "../../../domain/usecases/quiz.usecase";
import { GenerateQuizDTO } from "../../../application/interfaces/presenters/dto/quiz/generate.quiz.dto";

const prisma = new PrismaClient();

const quizUseCases = new QuizUseCases({
    questionRepository: new QuestionPrismaRepository(prisma)
})

const generate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            topicIds,
            difficultyLevel,
            amountOfQuestions,
            difficultyRange
        } = req.body as GenerateQuizDTO
        const results = await quizUseCases.generate(difficultyLevel, topicIds, amountOfQuestions, difficultyRange);
        
        res.json(results);
    } catch (err) {
        next(err)
    }
}

const QuizController = {
    generate
}

export default QuizController;