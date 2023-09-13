import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

 @Column('text')
  user_id?: ObjectId;

  @Column('text')
  product_id?: ObjectId;

  @Column('text')
  session_id?: string;

  @Column()
  status: string; 

  @Column()
  quantity: number; 

  @Column()
  totalAmount: number; 

  @Column()
  createdAt: Date; 


    constructor(data: Partial<Order>){
        Object.assign(this,data)
    }
}
