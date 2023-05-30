export class CreateRecordDto {
	categoryName: string;
	tags: string[];
	name: string;
	date: Date;
	type: 'income' | 'expense';
	sum: number;
}
