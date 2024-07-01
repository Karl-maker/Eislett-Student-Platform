import Entity from "../base/interface.entity";
import Topic from "../topic/interface.topic.entity";

export default interface Course extends Entity {
    name: string;
    description: string;
    topics?: Topic[];
}