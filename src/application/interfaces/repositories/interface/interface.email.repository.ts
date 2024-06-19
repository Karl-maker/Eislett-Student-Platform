import Email from "../../../../domain/entities/email/interface.email.entity";
import { SearchParams, SearchResult } from "../../types/search.type";
import Repository from "./interface.repository";

export type EmailSearchFilter = {
    to?: string;
    from?: string;
}

export default interface EmailRepository extends Repository<Email<any>> {
    search: (params: SearchParams<Email<any>>, filter?: EmailSearchFilter) => Promise<SearchResult<Email<any>>>;
    findById: (id: string | number) => Promise<Email<any>>;
}