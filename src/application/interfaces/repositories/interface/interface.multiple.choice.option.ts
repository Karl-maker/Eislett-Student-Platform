import MultipleChoiceOption from "../../../../domain/entities/multiple-choice-option/interface.multiple.choice.option.entity";
import Repository from "./interface.repository";

export default interface MultipleChoiceOptionRepository extends Repository<MultipleChoiceOption> {
    findAllByQuestionId : (questionId: number) => Promise<MultipleChoiceOption[]>;
    deleteById : (id: number) => Promise<boolean>;
}