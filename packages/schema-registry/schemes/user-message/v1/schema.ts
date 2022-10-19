import { UserMessageType } from '@async-arch/types';
import { JSONSchemaType } from 'ajv';


export const userMessageSchema: JSONSchemaType<UserMessageType> = {
  type: "object",
  properties: {
    event_id: {type: "string"},
    event_version: { type: "integer", const: 1 },
    event_name: { type: "string", enum: ["user.created", "user.updated"] },
    event_time: {type: "string"},
    data: {
      type: "object",
      properties: {
        public_id: { type: "string" },
        username: { type: "string" },
        email: { type: "string" },
        role: { type: "string", enum: ["admin", "user"] }
      },
      required: ["public_id", "username", "email", "role"],
    }
  },
  required: ["event_id", "event_version", "event_name", "event_time", "data"],
  additionalProperties: false
}
