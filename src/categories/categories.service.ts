import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateCategoryDto) {
		const old = await this.prismaService.category.findUnique({
			where: { name: dto.name },
		});
		if (old) {
			throw new BadRequestException('Already exist');
		}
		return await this.prismaService.category.create({
			data: { name: dto.name },
		});
	}

	async findAll() {
		return await this.prismaService.category.findMany();
	}
}
