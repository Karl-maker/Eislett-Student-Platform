/**
 * @desc all entities have an id and createdAt
 */

export default interface Entity {
    id?: number | string;
    createdAt: Date;
}