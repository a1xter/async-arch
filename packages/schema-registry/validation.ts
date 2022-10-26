import Ajv from "ajv"
import addFormats from "ajv-formats"
import { taskMessageSchema } from './schemes/task-message/v1/schema';
import { transactionMessageSchema } from './schemes/transaction-message/v1/schema';
import { userMessageSchema } from './schemes/user-message/v1/schema'

export const ajv = new Ajv();
addFormats(ajv, ["date", "time"])
ajv.addSchema(userMessageSchema, "user.message")
ajv.addSchema(taskMessageSchema, "task.message")
ajv.addSchema(transactionMessageSchema, "transaction.message")