import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const schemaPath = path.resolve('schema/sinco.schema.json');
const dataPath = path.resolve('public/sincoData.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error('Schema validation failed:', ajv.errorsText(validate.errors, { separator: '\n' }));
  process.exit(1);
}

console.log('Schema validation passed.');
