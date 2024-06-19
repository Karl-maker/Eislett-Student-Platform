import Student from "../../../../domain/entities/student/interface.student.entity";
import Repository from "./interface.repository";

export default interface StudentRepository extends Repository<Student> {
    findById: (id: string | number) => Promise<Student>;
    findByEmail: (email: string) => Promise<Student>;
}