import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { join } from 'path';
import * as fs from 'fs';

// https://4sii.tistory.com/693
@Injectable()
export class ExcelService {
  private toPlainForExcel(input: any): any {
    if (typeof input === 'bigint') return input.toString();
    if (input instanceof Date) return input;
    if (typeof Buffer !== 'undefined' && (Buffer as any).isBuffer && (Buffer as any).isBuffer(input)) {
      return (input as Buffer).toString('base64');
    }
    if (Array.isArray(input)) return input.map((v) => this.toPlainForExcel(v));
    if (input && typeof input === 'object') {
      const out: any = {};
      for (const [k, v] of Object.entries(input)) {
        out[k] = this.toPlainForExcel(v);
      }
      return out;
    }
    return input;
  }
  async createExcelFile(prefix: string, data: Array<string | Buffer>) {
    // 파일 작명
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `${prefix}_${formattedDate}.xlsx`;

    // temp 임시 폴더 없다면 생성, 있다면 무시
    fs.mkdirSync(join(process.cwd(), `temp`), { recursive: true });
    const filePath = join(process.cwd(), `temp/${filename}`);

    // filePath 위치에 엑셀 다운로드
    const wb = XLSX.utils.book_new();
    const rows = Array.isArray(data) ? data : [data];
    const plain = rows.map((row) => this.toPlainForExcel(row));
    const newWorksheet = XLSX.utils.json_to_sheet(plain);
    XLSX.utils.book_append_sheet(wb, newWorksheet, 'Sheet1');
    const wbOptions: any = { bookType: 'xlsx', type: 'binary' };
    XLSX.writeFile(wb, filePath, wbOptions);
    const file = fs.createReadStream(filePath);
    return { filename, filePath, file };
  }
}
