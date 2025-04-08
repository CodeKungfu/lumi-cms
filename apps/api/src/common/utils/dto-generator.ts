import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString } from 'class-validator';
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
  Object.defineProperty(DynamicDto, 'name', { value: `${tableName.split('_').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('')}PageDto` });
  const numericFields = Object.keys(prisma[tableName].fields).filter(field => 
    ['Int', 'BigInt', 'Float', 'Decimal'].includes(prisma[tableName].fields[field].typeName)
  );
  const modelFields = Object.keys(prisma[tableName].fields).map(key => ({
    name: key,
    description: key, // 可以自定义中文描述
  }));
  for (const field of modelFields) {
    const name = field.name;
    const desc = field.description || name;

    Object.defineProperty(DynamicDto.prototype, name, {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    ApiProperty({ description: desc, required: false })(DynamicDto.prototype, name);
    Type(() =>  numericFields.includes(field.name) ? Number: String)(DynamicDto.prototype, name);
    IsOptional()(DynamicDto.prototype, name);
    IsString()(DynamicDto.prototype, name);
  }

  return DynamicDto;
}

export function generateDto(tableName: string) {
  class DynamicDto {}
  
  Object.defineProperty(DynamicDto, 'name', { value: `${tableName.split('_').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('')}Dto` });
  const modelFields = Object.keys(prisma[tableName].fields).map(key => ({
    name: key,
    description: key,
  }));

  const numericFields = Object.keys(prisma[tableName].fields).filter(field => 
    ['Int', 'BigInt', 'Float', 'Decimal'].includes(prisma[tableName].fields[field].typeName)
  );

  for (const field of modelFields) {
    Object.defineProperty(DynamicDto.prototype, field.name, {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    // 使用 lazy resolver 避免循环依赖
    ApiProperty({ 
      description: field.description,
      required: false,
      type: () => numericFields.includes(field.name) ? Number: String // 使用函数包装类型
    })(DynamicDto.prototype, field.name);
    
    Type(() => String)(DynamicDto.prototype, field.name);
    IsOptional()(DynamicDto.prototype, field.name);
  }

  return DynamicDto;
}