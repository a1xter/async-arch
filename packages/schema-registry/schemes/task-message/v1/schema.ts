import { TaskMessageType } from '@async-arch/types';
import { JSONSchemaType } from 'ajv';

export const taskMessageSchema: JSONSchemaType<TaskMessageType> = {
  type: "object",
  properties: {
    event_id: { type: "string" },
    event_version: { type: "integer", const: 1 },
    event_name: { type: "string", enum: ["task.added", "task.finished", "task.reassigned"] },
    event_time: { type: "string" },
    data: {
      type: "object",
      properties: {
        id: { type: "integer" },
        publicId: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        status: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        userId: { type: "string" },
      },
      required: [
        "id", "publicId", "title", "description", "status",
        "createdAt", "updatedAt", "userId"
      ],
    }
  },
  required: ["event_id", "event_version", "event_name", "event_time", "data"],
  additionalProperties: false
}
