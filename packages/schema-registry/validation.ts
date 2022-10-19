import { UserMessageType } from '@async-arch/types';
import Ajv, { JSONSchemaType } from "ajv"

export function isDataValid(schema: JSONSchemaType<UserMessageType>, data: any) {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  return !!validate(data);
}