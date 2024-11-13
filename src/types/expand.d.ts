type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

type ExpandRec<T> = T extends infer O
  ? { [K in keyof O]: ExpandRec<O[K]> }
  : never
