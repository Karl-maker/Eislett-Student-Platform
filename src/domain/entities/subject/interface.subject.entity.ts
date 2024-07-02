import Entity from "../base/interface.entity";
import Course from "../course/interface.course.entity";

export default interface Subject extends Entity {
    name: string;
    description: string;
    courses?: Course[];
}