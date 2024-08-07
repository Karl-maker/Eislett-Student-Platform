import { CreateStudentDTO } from "../../application/interfaces/presenters/dto/student/create.student.dto";
import { UpdateStudentDTO } from "../../application/interfaces/presenters/dto/student/update.student.dto";
import StudentRepository from "../../application/interfaces/repositories/interface/interface.student.repository";
import EmailSender from "../../application/services/email/interface.email";
import NotFoundError from "../../application/services/error/not.found.error";
import UnexpectedError from "../../application/services/error/unexpected.error";
import config from "../../config";
import { generateCode } from "../../infrastructure/utils/code";
import { getDateTimeMinutesFromNow, isDateTimePassed } from "../../infrastructure/utils/date";
import BasicStudent from "../entities/student/basic.student.entity";
import Student from "../entities/student/interface.student.entity";
import ConfirmationEmail from "../entities/email/confirmation.email.entity";
import jwt from 'jsonwebtoken';
import RecoveryEmail from "../entities/email/recovery.email.entity";
import Storage from "../../application/services/storage/interface.storage.service";
import RewardUseCases from "./reward.usecase";
import ConflictError from "../../application/services/error/conflict.error";

export default class StudentUseCases {
    private studentRepository: StudentRepository;
    private emailService: EmailSender;
    private storage: Storage;
    private rewardUseCases: RewardUseCases;

    constructor(params: {
        studentRepository: StudentRepository,
        rewardUseCases: RewardUseCases,
        emailService: EmailSender,
        storage: Storage,
    }) {
        const {
            studentRepository,
            emailService,
            storage,
            rewardUseCases
        } = params;

        this.studentRepository = studentRepository;
        this.rewardUseCases = rewardUseCases;
        this.emailService = emailService;
        this.storage = storage;
    }

    async create(data: CreateStudentDTO): Promise<Student> {
        let foundStudent : Student;

        try {
            foundStudent = await this.studentRepository.findByEmail(data.email)
        } catch(err) {
            // probably not found
        }

        try {

            if(foundStudent) throw new ConflictError('Email already in use')

            const student = new BasicStudent({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                deactivated: false,
                confirmed: false,
            });
            const saved = await this.studentRepository.save(student);
            return saved;
        } catch(err) {
            throw err;
        }
    }

    async uploadProfileImage(studentId: number, data: Buffer, ext: string): Promise<Student> {
        try {
            const storageDetails = await this.storage.upload(data, ext);
            let student = await this.studentRepository.findById(studentId);
            student.profileImage = {
                url: storageDetails.location,
                key: storageDetails.key
            }

            student = await this.studentRepository.save(student);

            return student;

        } catch(err) {
            throw err;
        }
    }

    async updateConfirmationCode(student: Student): Promise<Student> {
        try {
            const code = generateCode(6);
            const email = new ConfirmationEmail({
                context: {
                    name: `${student.firstName} ${student.lastName}`,
                    code: code.split('')
                },
                to: student.email,
            });
    
            const currentStudent = await this.studentRepository.findById(Number(student.id));
            currentStudent.confirmation = {
                code,
                expiresAt: getDateTimeMinutesFromNow(15)
            };
    
            // Create promises for both actions
            const emailPromise = this.emailService.send(email);
            const updatePromise = this.studentRepository.save(currentStudent);
    
            // Use Promise.all to execute both actions
            const [emailResult, updatedStudent] = await Promise.all([emailPromise, updatePromise]);
    
            if (!emailResult.success) throw new UnexpectedError('Issue Sending Confirmation Email');
    
            return updatedStudent;
        } catch (err) {
            throw err;
        }
    }    

    async updateRecoveryCode(studentEmail: string): Promise<Student> {
        try {
            const student = await this.studentRepository.findByEmail(studentEmail)
            const code = generateCode(6);
            const email = new RecoveryEmail({
                context: {
                    name: `${student.firstName} ${student.lastName}`,
                    code: code.split('')
                },
                to: student.email,
            })
        
            const result = await this.emailService.send(email);
            if(!result.success) throw new UnexpectedError('Issue Sending Recovery Email')

            student.recovery = {
                code,
                expiresAt: getDateTimeMinutesFromNow(5)
            }

            return await this.studentRepository.save(student)
        } catch(err) {
            throw err;
        }
    }

    async confirm(code: string, id: string | number): Promise<Student> {
        try {
            const student = await this.studentRepository.findById(id);
            if(!student.confirmation) throw new UnexpectedError('No Confirmation Found');
            if(student.confirmation.code === code && !isDateTimePassed(student.confirmation.expiresAt)) {
                student.confirmed = true;
                return await this.studentRepository.save(student)
            }

            throw new NotFoundError('No Confirmation Found');
        } catch(err) {
            throw err
        }
    }

    async retrieveRecoveryToken(code: string, email: string): Promise<string> {
        try {
            const student = await this.studentRepository.findByEmail(email);
            if(!student.recovery) throw new NotFoundError('No Recovery Code Found');
            if(student.recovery.code === code && !isDateTimePassed(student.recovery.expiresAt)) {
                const token = jwt.sign({ user_id: student.id }, config.jwt.secret, { expiresIn: '30d' });
                student.recovery = undefined;
                await this.studentRepository.save(student)
                return token;
            }

            throw new NotFoundError('No Recovery Found');
        } catch(err) {
            throw err
        }
    }

    async login(email: string, password: string): Promise<string> {
        try {
            const student = await this.studentRepository.findByEmail(email);
            if (student.checkPassword(password)) {
                const token = jwt.sign({ user_id: student.id }, config.jwt.secret, { expiresIn: '30d' });
                return token;
            }
    
            throw new NotFoundError('Student Not Found');
        } catch (err) {
            throw err;
        }
    }

    async updateById(id: string | number, data: UpdateStudentDTO): Promise<Student> {
        try {
            const student = await this.studentRepository.findById(id);
            
            if(data.deactivate) student.deactivated = data.deactivate;
            if(data.firstName) student.firstName = data.firstName;
            if(data.lastName) student.lastName = data.lastName;
            if(data.password) student.password = data.password;
            if(data.displayName) student.displayName = data.displayName;

            const updated = await this.studentRepository.save(student);
            return updated;
        } catch(err) {
            throw err;
        }
    }

    async findById(id: string | number): Promise<Student> {
        try {
            const student = await this.studentRepository.findById(id);
            return student;
        } catch(err) {
            throw err;
        }
    }

    async findByEmail(email: string): Promise<Student> {
        try {
            const student = await this.studentRepository.findByEmail(email);
            return student;
        } catch(err) {
            throw err;
        }
    }

    async delete(id: string | number): Promise<Boolean> {
        try {
            const result = await this.studentRepository.deleteById(id);
            return result;
        } catch(err) {
            throw err;
        }
    }

    async redeemCoins(id: string | number, rewardId: string | number): Promise<Boolean> {
        try {

            const reward = await this.rewardUseCases.collectRewardById(Number(rewardId), Number(id));
            if(!reward) return false;

            const amount = reward.coinsRewareded;
            const result = await this.studentRepository.addCoins(id, amount)

            if(!result) return false;

            return true;
        } catch(err) {
            return false
        }
    }


}