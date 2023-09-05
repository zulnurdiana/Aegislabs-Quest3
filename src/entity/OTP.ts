import { Entity, ObjectIdColumn, Column, CreateDateColumn, ObjectId } from "typeorm";


@Entity()
export class OTP {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    otp: string;

    @Column('text')
    user_id?: ObjectId;

    @Column()
    email?: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    expiresAt?: Date;
    

    constructor(data: Partial<OTP>){
        Object.assign(this,data)
    }
}
