import { TransactionMessageType } from '@async-arch/types';
import { JSONSchemaType } from 'ajv';


export const transactionMessageSchema: JSONSchemaType<TransactionMessageType> = {
  type: "object",
  properties: {
    event_id: {type: "string"},
    event_version: { type: "integer", const: 1 },
    event_name: { type: "string", enum: [
      "transaction.credit", "transaction.debit", "transaction.payout"
    ]},
    event_time: {type: "string"},
    data: {
      type: "object",
      properties: {
        publicId: { type: "string" },
        createdAt: { type: "string" },
        amount: { type: "integer" },
        type: { type: "string", enum: ["credit", "debit", "payout"] },
        userPublicId: { type: "string" },
        taskPublicId: { type: "string" },
        billingCycleId: { type: "string" },
      },
      required: ["publicId", "createdAt", "amount", "type", "userPublicId", "taskPublicId", "billingCycleId"],
    }
  },
  required: ["event_id", "event_version", "event_name", "event_time", "data"],
  additionalProperties: false
}