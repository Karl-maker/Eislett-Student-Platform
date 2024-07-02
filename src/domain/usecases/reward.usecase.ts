import RewardRepository from "../../application/interfaces/repositories/interface/interface.reward.repository";
import { CreateRewardDTO } from "../../application/interfaces/presenters/dto/reward/create.reward.dto";
import Reward from "../entities/reward/interface.reward.entity";
import BasicReward from "../entities/reward/basic.reward.entity";
import BadRequestError from "../../application/services/error/bad.request.error";

export default class RewardUseCases {
    private rewardRepository: RewardRepository;

    constructor(params: {
        rewardRepository: RewardRepository
    }) {
        const {
            rewardRepository
        } = params;

        this.rewardRepository = rewardRepository
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