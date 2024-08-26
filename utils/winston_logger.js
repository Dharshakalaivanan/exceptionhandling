import { format, transports, createLogger } from 'winston';
import * as dotenv from 'dotenv';
dotenv.config();
const { combine, timestamp, printf, splat } = format;
const myFormat = printf(({ level, message, timestamp, meta }) => {
  return `${timestamp} ${level}: ${message} ${JSON.stringify(meta)}`;
});
const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), splat(), myFormat),
  transports: [new transports.Console()]
});
export default logger;
export function metaLogFormatter(code, error, httpErrorCode, httpEndpoint, additionalInfo) {
  const meta = { CODE: code };
  if (error) {
    meta['error'] = error + additionalInfo;
  }
  if (httpErrorCode) {
    meta['HTTP_ERRORCODE'] = httpErrorCode;
  }
  if (httpEndpoint) {
    meta['HTTP_ENDPOINT'] = httpEndpoint;
  }
  if (process.env.ENVIRONMENT) {
    meta['ENVIRONMENT'] = process.env.ENVIRONMENT;
  }
  return meta;
}