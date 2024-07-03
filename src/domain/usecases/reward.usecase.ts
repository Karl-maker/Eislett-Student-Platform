import RewardRepository from "../../application/interfaces/repositories/interface/interface.reward.repository";
import { CreateRewardDTO } from "../../application/interfaces/presenters/dto/reward/create.reward.dto";
import Reward from "../entities/reward/interface.reward.entity";
import BasicReward from "../entities/reward/basic.reward.entity";
import BadRequestError from "../../application/services/error/bad.request.error";
import QuizResult from "../entities/quiz-result/interface.quiz.result.entity";
import QuestionUseCases from "./question.usecase";

export default class RewardUseCases {
    private rewardRepository: RewardRepository;
    private questionUseCases: QuestionUseCases;

    constructor(params: {
        rewardRepository: RewardRepository,
        questionUseCases: QuestionUseCases
    }) {
        const {
            rewardRepository,
            questionUseCases
        } = params;

        this.rewardRepository = rewardRepository;
        this.questionUseCases = questionUseCases;
    }

    async create(data: CreateRewardDTO): Promise<Reward> {
        try {
            const {
                title,
                message,
                coinsRewareded,
                isCollected,
                studentId
            } = data;

            const reward = new BasicReward({
                title,
                message,
                coinsRewareded,
                isCollected,
                studentId,
                createdAt: new Date()
            })

            let saved = await this.rewardRepository.save(reward);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async createFromQuizResult(data: QuizResult): Promise<Reward> {
        try {
            let rewardedCoins = 0;
            let totalPossibleMarks = 0;
            let topicFrequency: { [key: string]: number } = {};
    
            // Calculate total rewarded coins, total possible marks, and count topic frequency
            const promiseQuestions = Promise.all(data.questionResults.map(async (result) => {
                const question = await this.questionUseCases.findById(Number(result.questionId));
                const marksReceived = result.marksRecieved;
                const difficulty = question.difficultyLevel;
                const possibleMarks = question.totalPotentialMarks;
                
                rewardedCoins += Math.ceil((marksReceived / possibleMarks) * difficulty * 10);
                totalPossibleMarks += possibleMarks;
    
                question.topics.forEach(topic => {
                    if (topicFrequency[topic.name]) {
                        topicFrequency[topic.name]++;
                    } else {
                        topicFrequency[topic.name] = 1;
                    }
                });
            }));
    
            await promiseQuestions;
    
            // Determine the main topic based on frequency
            let mainTopic = Object.keys(topicFrequency).reduce((a, b) => topicFrequency[a] > topicFrequency[b] ? a : b);
    
            // Determine percentage of marks received
            const percentageReceived = (rewardedCoins / totalPossibleMarks) * 100;
    
            // Determine title and message based on the percentage of marks received
            let title = "Quiz Result";
            let message = "";
    
            if (percentageReceived >= 90) {
                title = "Excellent Performance";
                message = `Outstanding job in ${mainTopic}! You scored ${rewardedCoins} points out of a possible ${totalPossibleMarks} points (${percentageReceived.toFixed(2)}%).`;
            } else if (percentageReceived >= 75) {
                title = "Great Job";
                message = `Great effort in ${mainTopic}! You scored ${rewardedCoins} points out of a possible ${totalPossibleMarks} points (${percentageReceived.toFixed(2)}%).`;
            } else if (percentageReceived >= 50) {
                title = "Good Job";
                message = `Good effort in ${mainTopic}! You scored ${rewardedCoins} points out of a possible ${totalPossibleMarks} points (${percentageReceived.toFixed(2)}%).`;
            } else {
                title = "Keep Trying";
                message = `You scored ${rewardedCoins} points out of a possible ${totalPossibleMarks} points (${percentageReceived.toFixed(2)}%) in ${mainTopic}. Keep practicing!`;
            }
    
            const reward = new BasicReward({
                title: title,
                message: message,
                coinsRewareded: rewardedCoins,
                isCollected: false,
                studentId: data.studentId,
                createdAt: new Date()
            });
    
            let saved = await this.rewardRepository.save(reward);
    
            return saved; 
        } catch (err) {
            throw err;
        }
    }
    
    

    async collectRewardById(id: number, studentId: number): Promise<Reward> {
        try {

            const reward = await this.rewardRepository.findById(id);

            if(reward.studentId !== studentId) throw new BadRequestError(`Not student's reward`)
            if(reward.collect()) throw new BadRequestError('Already collected')

            let saved = await this.rewardRepository.save(reward);

            return saved; 
        } catch(err) {
            throw err;
        }
    }

    async findAll(pageNumber: number, pageSize: number, options: {
        studentId?: string | number;
    }) {
        try {
            return await this.rewardRepository.findMany({
                sort: {
                    field: 'createdAt',
                    order: 'desc'
                },
                filters: {
                    studentId: options.studentId
                },
                page: {
                    size: pageSize,
                    number: pageNumber
                }
            });
        } catch(err) {
            throw err;
        }
    }
}