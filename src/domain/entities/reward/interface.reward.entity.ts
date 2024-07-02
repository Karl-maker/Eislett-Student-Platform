import Entity from "../base/interface.entity";
import Topic from "../topic/interface.topic.entity";

export default interface Reward extends Entity {
    title: string;
    message: string;
    coinsRewareded: number;
    isCollected: boolean;
    studentId: number | string;

    collect: () => boolean;
}