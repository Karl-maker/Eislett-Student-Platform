import Entity from "../base/interface.entity";

export default interface Email<ContextType> extends Entity {
    template: {
        name: string;
        ext: string;
    };
    context: ContextType;
    subject: string;
    to: string;
    from: string;
}