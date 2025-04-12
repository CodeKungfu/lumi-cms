import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString, IsNumber } from 'class-validator';
import { prisma } from 'src/prisma';

export function generatePageDto(tableName: string) {
  class DynamicDto {
    @ApiProperty({ description: '当前页码', default: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageNum: number = 1;

    @ApiProperty({ description: '每页数量', default: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number = 10;

    @ApiProperty({ description: '排序字段', required: false })
    @Type(() => String)
    @IsOptional()
    orderByColumn?: string;

    @ApiProperty({ description: '排序方式(asc/desc)', required: false })
    @Type(() => String)
    @IsOptional()
    isAsc?: string;
  }

  // ✅ 动态命名类名
  Object.defineProperty(DynamicDto, 'name', {
    value: `${tableName.split('_').map(part =>
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join('')}PageDto`,
  });

  const prismaFields = prisma[tableName].fields;
  const numericFields = Object.keys(prismaFields).filter(field =>
    ['Int', 'BigInt', 'Float', 'Decimal'].includes(prismaFields[field].typeName)
  );

  for (const key of Object.keys(prismaFields)) {
    const desc = key;

    // ✨ 关键点：不设置 prototype 默认值，而是仅添加装饰器
    ApiProperty({ description: desc, required: false })(DynamicDto.prototype, key);
    Type(() => numericFields.includes(key) ? Number : String)(DynamicDto.prototype, key);
    IsOptional()(DynamicDto.prototype, key);

    // 注意：这里根据字段类型设置不同验证器
    if (numericFields.includes(key)) {
      IsInt()(DynamicDto.prototype, key); // 你也可以用 IsNumber() 更宽松
    } else {
      IsString()(DynamicDto.prototype, key);
    }
  }

  return DynamicDto;
}

export function generateDto(tableName: string) {
  class DynamicDto {}

  // 设置类名
  Object.defineProperty(DynamicDto, 'name', {
    value: `${tableName
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')}Dto`,
  });

  const prismaFields = prisma[tableName].fields;

  const numericFields = Object.keys(prismaFields).filter(field =>
    ['Int', 'BigInt', 'Float', 'Decimal'].includes(prismaFields[field].typeName)
  );

  for (const fieldName of Object.keys(prismaFields)) {
    const isNumber = numericFields.includes(fieldName);

    // 不再使用 defineProperty，不设置默认值
    ApiProperty({
      description: fieldName,
      required: false,
      type: () => (isNumber ? Number : String),
    })(DynamicDto.prototype, fieldName);

    Type(() => (isNumber ? Number : String))(DynamicDto.prototype, fieldName);
    IsOptional()(DynamicDto.prototype, fieldName);

    if (isNumber) {
      IsInt()(DynamicDto.prototype, fieldName); // 如果你更希望支持 float 等宽松数字，可用 IsNumber()
    } else {
      IsString()(DynamicDto.prototype, fieldName);
    }
  }

  return DynamicDto;
}

export class InfoDto {
  @ApiProperty({
    description: 'id',
  })
  @Type(() => Number)
  @IsNumber()
  id: number;
}