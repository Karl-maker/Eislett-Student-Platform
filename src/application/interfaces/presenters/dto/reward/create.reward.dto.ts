export type CreateRewardDTO = {
    title: string;
    message: string;
    coinsRewareded: number;
    isCollected: boolean;
    studentId: number | string;
}