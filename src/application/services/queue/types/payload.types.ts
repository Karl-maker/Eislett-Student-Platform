import Student from "../../../../domain/entities/student/interface.student.entity"

export type StudentCreatePayload = {
    student: Student;
};

export const StudentCreateEvent = 'student-create';