import QuizResult from "../../../../domain/entities/quiz-result/interface.quiz.result.entity";
import Student from "../../../../domain/entities/student/interface.student.entity"
import Subscription from "../../../../domain/entities/subscription/interface.subscription.entity";

export const StudentCreateEvent = 'student-create';
export const QuizResultCreateEvent = 'quiz-result-create';
export const QuizResultUpdateEvent = 'quiz-result-update';
export const SubscriptionCreateEvent = 'subscription-create';

export type StudentCreatePayload = {
    student: Student;
};

export type QuizResultCreatePayload = {
    quizResult: QuizResult;
};

export type QuizResultUpdatePayload = {
    quizResult: QuizResult;
};

export type SubscriptionCreatePayload = {
    subscription: Subscription;
};