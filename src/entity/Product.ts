import { Entity, ObjectIdColumn, Column,  ObjectId } from "typeorm";

@Entity()
export class Product {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    nama_produk: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column('text')
    img_url?: string;

    @Column('text')
    user_id?: ObjectId;

    @Column()
    stock: number;


    constructor(data: Partial<Product>) {
        Object.assign(this, data);
    }
}
