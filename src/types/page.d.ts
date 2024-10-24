type Page<T extends Record<string, unknown> = Record<string, never>> = {
  params?: Promise<Record<string, string | string[]>>
  searchParams?: Promise<Record<string, string>>
} & T
