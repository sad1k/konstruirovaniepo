import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTables1699999999999 implements MigrationInterface {
    name = 'CreateOrdersTables1699999999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "total" decimal(10,2) NOT NULL,
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_orders" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "productId" uuid,
                "quantity" integer NOT NULL,
                "price" decimal(10,2) NOT NULL,
                "orderId" uuid NOT NULL,
                CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_order_items_orders" FOREIGN KEY ("orderId") 
                    REFERENCES "orders"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }
} 