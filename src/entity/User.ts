import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";

@Entity()
export class User {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    nama: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    verified: boolean = false;

    @Column('text')
    refresh_token?: string;

    constructor(data: Partial<User>){
        Object.assign(this,data)
    }
}
