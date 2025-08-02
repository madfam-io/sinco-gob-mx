import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, verbose: true });
addFormats(ajv);

const schemaPath = path.resolve('schema/sinco.schema.json');
const dataPath = path.resolve('public/sincoData.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const validate = ajv.compile(schema);
const valid = validate(data);

function flattenErrors(errors = []) {
  return errors.map((e) => `${e.instancePath || '/'} ${e.message} ${e.params ? JSON.stringify(e.params) : ''}`).join('\n');
}

if (!valid) {
  console.error('Schema validation failed:\n' + flattenErrors(validate.errors));
  process.exit(1);
}

console.log('Schema validation passed.');
