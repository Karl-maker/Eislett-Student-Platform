import QuestionRepository from "../../application/interfaces/repositories/interface/interface.question.repository";
import Question from "../entities/question/interface.question.entity";
import { CreateQuestionDTO } from "../../application/interfaces/presenters/dto/question/create.question.dto";
import TrueOrFalseQuestion from "../entities/question/true.or.false.question.entity";
import MultipleChoiceQuestion from "../entities/question/multiple.choice.question.entity";
import BasicMultipleChoiceOption from "../entities/multiple-choice-option/basic.multiple.choice.option.entity";
import { UpdateQuestionDTO } from "../../application/interfaces/presenters/dto/question/update.question.dto";
import MultipleChoiceOptionRepository from "../../application/interfaces/repositories/interface/interface.multiple.choice.option";

export default class QuestionUseCases {
    private questionRepository: QuestionRepository;
    private multipleChoiceOptionRepository: MultipleChoiceOptionRepository;

    constructor(params: {
        questionRepository: QuestionRepository,
        multipleChoiceOptionRepository: MultipleChoiceOptionRepository
    }) {
        const {
            questionRepository,
            multipleChoiceOptionRepository
        } = params;

        this.questionRepository = questionRepository;
        this.multipleChoiceOptionRepository = multipleChoiceOptionRepository;
    }

    async findById(id: number): Promise<Question> {
        try {
            const question = await this.questionRepository.findById(id);
            return question;
        } catch(err) {
            throw err
        }
    }


    async deleteById(id: string | number): Promise<Boolean> {
        try {
            const result = await this.questionRepository.deleteById(id);
            return result;
        } catch(err) {
            throw err;
        }
    }

    async create(data: CreateQuestionDTO): Promise<Question> {
        try {
            let question : Question;
            const {
                title,
                description,
                content,
                tags,
                totalPotentialMarks,
                type,
                isTrue,
                multipleChoiceOptions,
                difficultyLevel
            } = data;

            if(type === 'true_or_false') question = new TrueOrFalseQuestion({
                title,
                description,
                content,
                tags,
                totalPotentialMarks,
                isTrue,
                createdAt: new Date(),
                difficultyLevel
            }) 
            else question = new MultipleChoiceQuestion({
                title,
                description,
                content,
                tags,
                totalPotentialMarks,
                difficultyLevel,
                createdAt: new Date(),
                options: multipleChoiceOptions.map((choice) => {
                    return new BasicMultipleChoiceOption({
                        id: undefined,
                        content: choice.content,
                        isCorrect: choice.isCorrect,
                    })
                })
            }) 

            let saved = await this.questionRepository.save(question);

            if(type === 'multiple_choice') {
                const multipleChoiceQuestion = question as MultipleChoiceQuestion;
                const createQuestionsAsync = multipleChoiceQuestion.options.map(async (option) => {
                    option.questionId = Number(saved.id);
                    await this.multipleChoiceOptionRepository.save(option)
                })
                await Promise.all(createQuestionsAsync);
                saved = await this.questionRepository.findById(saved.id);
            }

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async updateById(id: number, data: UpdateQuestionDTO): Promise<Question> {
        try {
            let question : Question;
            const {
                title,
                description,
                content,
                tags,
                totalPotentialMarks,
                type,
                isTrue,
                multipleChoiceOptions,
                difficultyLevel
            } = data;

            if(type === 'true_or_false') question = new TrueOrFalseQuestion({
                id,
                title,
                description,
                content,
                tags,
                totalPotentialMarks,
                isTrue,
                createdAt: new Date(),
                difficultyLevel
            }) 
            else question = new MultipleChoiceQuestion({
                id,
                title,
                description,
                content,
                tags,
                totalPotentialMarks,
                difficultyLevel,
                createdAt: new Date(),
                options: multipleChoiceOptions.map((choice) => {
                    return new BasicMultipleChoiceOption({
                        content: choice.content,
                        isCorrect: choice.isCorrect,
                        id: choice.id
                    })
                })
            }) 

            if(type === 'multiple_choice' && multipleChoiceOptions) {
                const listOfOptions = await this.multipleChoiceOptionRepository.findAllByQuestionId(Number(id));
                const multipleChoiceQuestion = question as MultipleChoiceQuestion;
                
                // Extract the IDs from multipleChoiceQuestion.options
                const questionOptionIds = multipleChoiceQuestion.options.map(option => option.id);
                
                // Iterate through listOfOptions and delete the ones not in questionOptionIds

                await Promise.all(
                    listOfOptions.map(async (option) =>{
                        if (!questionOptionIds.includes(option.id)) {
                            await this.multipleChoiceOptionRepository.deleteById(Number(option.id));
                        }
                    })
                )

                await Promise.all(
                    multipleChoiceOptions.map(async (option) => {
                        const multipleChoice = new BasicMultipleChoiceOption({
                            questionId: id,
                            content: option.content,
                            isCorrect: option.isCorrect,
                            id: option.id 
                        })
                        await this.multipleChoiceOptionRepository.save(multipleChoice)
                    })
                );
                
            }

            const saved = await this.questionRepository.save(question);
            return saved;
        } catch(err) {
            throw err;
        }
    }
}