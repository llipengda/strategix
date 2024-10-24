type Page<T extends Record<string, unknown> = Record<string, never>> = {
  params?: Record<string, string | string[]>
  searchParams?: Record<string, string>
} & T
