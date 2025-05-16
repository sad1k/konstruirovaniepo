import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeProductIdNullable1700000000000 implements MigrationInterface {
    name = 'MakeProductIdNullable1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "productId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "productId" SET NOT NULL`);
    }
} 