import { format } from 'date-fns';
import { Buffer } from 'node:buffer';

const bufferModule = require('node:buffer');

if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = Buffer;
}

Date.prototype.toJSON = function () {
  return format(this, 'yyyy-MM-dd HH:mm:ss');
};

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
