import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
	controllers: [RecordsController],
	providers: [RecordsService, PrismaService],
})
export class RecordsModule {}
