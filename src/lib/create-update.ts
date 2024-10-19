export default function createUpdate(data: Record<string, unknown>) {
  let UpdateExpression: string | undefined = 'SET'
  const AttributeUpdates: Record<string, string> = {}
  const ExpressionAttributeValues: Record<string, unknown> = {}

  for (const key in data) {
    if (data[key]) {
      UpdateExpression += ` #${key} = :${key},`
      AttributeUpdates[`#${key}`] = key
      ExpressionAttributeValues[`:${key}`] = data[key]
    }
  }

  UpdateExpression = UpdateExpression.slice(0, -1)

  if (UpdateExpression === 'SE') {
    UpdateExpression = undefined
  }

  return [
    UpdateExpression,
    AttributeUpdates,
    ExpressionAttributeValues
  ] as const
}
