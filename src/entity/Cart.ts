import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()

export class Cart {
   @ObjectIdColumn()
  _id: ObjectId;

 @Column('text')
  user_id?: ObjectId;

  @Column('text')
  product_id?: ObjectId;

  // @Column()
  // quantity: number = 1; 

  // @Column()
  // totalAmount: number; 

  @Column()
  createdAt: Date; 


   constructor(data: Partial<Cart>){
        Object.assign(this,data)
    }
}