import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RecordsModule } from './records/records.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
	imports: [RecordsModule, CategoriesModule],
	providers: [PrismaService],
})
export class AppModule {}
