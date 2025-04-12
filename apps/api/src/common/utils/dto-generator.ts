import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString, IsNumber, IsArray, IsDate } from 'class-validator';
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

  for (const key of Object.keys(prismaFields)) {
    const fieldType = prismaFields[key].typeName;
    const isNumber = ['Int', 'BigInt', 'Float', 'Decimal'].includes(fieldType);
    const isDate = fieldType === 'DateTime';

    // ✅ 特别处理 DateTime 为数组范围查询
    if (isDate) {
      ApiProperty({
        description: `${key} 时间范围`,
        required: false,
        type: [Date],
      })(DynamicDto.prototype, key);
      Transform(({ value }) => {
        if (!value) return [];
        try {
          const arr = typeof value === 'string' ? JSON.parse(value) : value;
          return Array.isArray(arr) ? arr.map(item => new Date(item)) : [];
        } catch (e) {
          return [];
        }
      })(DynamicDto.prototype, key);
      IsOptional()(DynamicDto.prototype, key);
      IsArray()(DynamicDto.prototype, key);
      IsDate({ each: true })(DynamicDto.prototype, key);
      continue;
    }

    ApiProperty({
      description: key,
      required: false,
      type: () => (isNumber ? Number : String),
    })(DynamicDto.prototype, key);

    Type(() => (isNumber ? Number : String))(DynamicDto.prototype, key);
    IsOptional()(DynamicDto.prototype, key);

    if (['Int', 'BigInt'].includes(fieldType)) {
      IsInt()(DynamicDto.prototype, key);
    } else if (['Float', 'Decimal'].includes(fieldType)) {
      IsNumber()(DynamicDto.prototype, key);
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