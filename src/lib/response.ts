import { NextResponse } from 'next/server'

const status =
  (code: number) =>
  <T>(data?: T, init?: ResponseInit) =>
    NextResponse.json(data ?? null, { status: code, ...init })

const Ok = status(200)
const Created = status(201)
const NoContent = () => new NextResponse(null, { status: 204 })
const BadRequest = status(400)
const Unauthorized = status(401)
const Forbidden = status(403)
const NotFound = status(404)
const MethodNotAllowed = status(405)
const Conflict = status(409)
const UnprocessableEntity = status(422)
const InternalServerError = status(500)

const Status = <T>(code: number, data?: T, init?: ResponseInit) =>
  status(code)(data, init)

export {
  Ok,
  Created,
  NoContent,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  Conflict,
  UnprocessableEntity,
  InternalServerError,
  Status
}
