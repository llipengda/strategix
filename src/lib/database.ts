import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  type PutCommandInput,
  type QueryCommandInput,
  UpdateCommand,
  type UpdateCommandInput
} from '@aws-sdk/lib-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AMAZON_REGION!,
  credentials: {
    accessKeyId: process.env.AMAZON_KEY!,
    secretAccessKey: process.env.AMAZON_SECRET!
  }
})

const TABLE_NAME = process.env.AMAZON_TABLE_NAME!

const docClient = DynamoDBDocumentClient.from(client)

export async function add<T extends Record<string, unknown>>(
  item: T,
  cmd?: Omit<PutCommandInput, 'TableName' | 'Item'>
) {
  await docClient.send(
    new PutCommand({
      ...cmd,
      TableName: TABLE_NAME,
      Item: item
    })
  )
}

export async function scan<T>() {
  const data = await docClient.send(
    new ScanCommand({
      TableName: TABLE_NAME
    })
  )
  return data.Items?.map(i => unmarshall(i)) as T[]
}

export async function get<T>(key: Record<string, unknown>) {
  const cmd = new GetCommand({
    TableName: TABLE_NAME,
    Key: key
  })
  const data = await docClient.send(cmd)
  return data.Item as T | undefined
}

export async function query<T>(command: Omit<QueryCommandInput, 'TableName'>) {
  if (command.ExpressionAttributeValues) {
    command = {
      ...command,
      ExpressionAttributeValues: Object.fromEntries(
        Object.entries(command.ExpressionAttributeValues).map(
          ([key, value]) => [key, marshall(value)]
        )
      )
    }
  }

  const cmd = new QueryCommand({
    TableName: TABLE_NAME,
    ...command
  })

  const data = await docClient.send(cmd)
  return data.Items?.map(i => unmarshall(i)) as T[]
}

export async function update(command: Omit<UpdateCommandInput, 'TableName'>) {
  const cmd = new UpdateCommand({
    TableName: TABLE_NAME,
    ...command
  })
  await docClient.send(cmd)
}

export async function del(key: Record<string, unknown>) {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: key
    })
  )
}
