import Topic from "../topic/interface.topic.entity";
import Reward from "./interface.Reward.entity";

export type BasicRewardParamsType = {
    title: string;
    message: string;
    coinsRewareded: number;
    isCollected: boolean;
    studentId: number | string;
    id?: string | number;
    createdAt: Date;
}

export default class BasicReward implements Reward {
    title: string;
    message: string;
    coinsRewareded: number;
    isCollected: boolean;
    studentId: number | string;
    id?: string | number;
    createdAt: Date;
    
    constructor({
        title,
        message,
        coinsRewareded,
        isCollected,
        studentId,
        id,
        createdAt
    }: BasicRewardParamsType){
        this.title = title;
        this.message = message;
        this.id = id;
        this.coinsRewareded = coinsRewareded;
        this.isCollected = isCollected;
        this.studentId = studentId;
        this.createdAt = createdAt;
    }
}