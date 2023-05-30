import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecordsService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateRecordDto) {
		const tags = dto.tags;
		try {
			for (const tag of tags) {
				const old = await this.prismaService.tag.findFirst({
					where: { name: tag },
				});
				if (!old) {
					await this.prismaService.tag.create({
						data: { name: tag },
					});
				}
			}
		} catch (error) {}
		try {
			console.log(dto);
			const newRecord = await this.prismaService.record.create({
				data: { ...dto },
			});
			return newRecord;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async findAll(
		startDate: string,
		lastDate: string,
		type?: 'income' | 'expense',
	) {
		try {
			const [sDay, sMonth, sYear] = startDate.split('-').reverse();
			const sDate = new Date(+sYear, +sMonth - 1, +sDay);

			const [lDay, lMonth, lYear] = lastDate.split('-').reverse();
			const lDate = new Date(+lYear, +lMonth - 1, +lDay);
			if (!type) {
				return await this.prismaService.record.findMany({
					where: {
						deleted: false,
						AND: {
							date: { gte: sDate },
							AND: { date: { lte: lDate } },
						},
					},
					include: { category: true },
					orderBy: { date: 'desc' },
				});
			} else {
				return await this.prismaService.record.findMany({
					where: {
						deleted: false,
						AND: {
							type,
							AND: {
								date: { gte: sDate },
								AND: { date: { lte: lDate } },
							},
						},
					},
					include: { category: true },
					orderBy: { date: 'desc' },
				});
			}
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async findTags() {
		return await this.prismaService.tag.findMany();
	}

	async update(id: string, dto: UpdateRecordDto) {
		const tags = dto.tags;

		const oldRecord = await this.prismaService.record.findUnique({
			where: { id },
		});

		const isChangedSum = dto.sum && !(oldRecord.sum === dto.sum);
		const changedSumDates = [...oldRecord.changedSumDates, new Date()];

		try {
			if (tags) {
				for (const tag of tags) {
					const old = await this.prismaService.tag.findFirst({
						where: { name: tag },
					});
					if (!old) {
						await this.prismaService.tag.create({
							data: { name: tag },
						});
					}
				}
			}
		} catch (error) {
			console.log(error, 1);
		}

		try {
			if (isChangedSum) {
				return await this.prismaService.record.update({
					where: { id },
					data: { ...dto, changedSum: true, changedSumDates },
				});
			}
			return await this.prismaService.record.update({
				where: { id },
				data: { ...dto },
			});
		} catch (error) {
			console.log(error);
			throw new BadRequestException(error.message);
		}
	}

	async remove(id: string) {
		try {
			return await this.prismaService.record.update({
				where: { id },
				data: { deleted: true, deleteDate: new Date() },
			});
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}
