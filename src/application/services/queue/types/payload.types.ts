import QuizResult from "../../../../domain/entities/quiz-result/interface.quiz.result.entity";
import Student from "../../../../domain/entities/student/interface.student.entity"

export const StudentCreateEvent = 'student-create';
export const QuizResultCreateEvent = 'quiz-result-create';
export const QuizResultUpdateEvent = 'quiz-result-update';

export type StudentCreatePayload = {
    student: Student;
};

export type QuizResultCreatePayload = {
    quizResult: QuizResult;
};

export type QuizResultUpdatePayload = {
    quizResult: QuizResult;
};