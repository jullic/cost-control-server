import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Controller('records')
export class RecordsController {
	constructor(private readonly recordsService: RecordsService) {}

	@Post()
	create(@Body() createRecordDto: CreateRecordDto) {
		return this.recordsService.create(createRecordDto);
	}

	@Get()
	findAll(@Query() query: { startDate: string; lastDate: string }) {
		return this.recordsService.findAll(query.startDate, query.lastDate);
	}
	@Get('tags')
	findAllTags() {
		return this.recordsService.findTags();
	}

	@Get('income')
	findIncome(@Query() query: { startDate: string; lastDate: string }) {
		return this.recordsService.findAll(
			query.startDate,
			query.lastDate,
			'income',
		);
	}

	@Get('expense')
	findExpense(@Query() query: { startDate: string; lastDate: string }) {
		return this.recordsService.findAll(
			query.startDate,
			query.lastDate,
			'expense',
		);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateRecordDto) {
		return this.recordsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.recordsService.remove(id);
	}
}
