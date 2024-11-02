export default function createUpdate(data: Record<string, unknown>) {
  let UpdateExpression: string | undefined = 'SET'
  const ExpressionAttributeNames: Record<string, string> = {}
  const ExpressionAttributeValues: Record<string, unknown> = {}

  for (const key in data) {
    if (data[key]) {
      UpdateExpression += ` #${key} = :${key},`
      ExpressionAttributeNames[`#${key}`] = key
      ExpressionAttributeValues[`:${key}`] = data[key]
    }
  }

  UpdateExpression = UpdateExpression.slice(0, -1)

  if (UpdateExpression === 'SE') {
    UpdateExpression = undefined
  }

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  } as const
}
