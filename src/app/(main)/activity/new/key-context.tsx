'use client'

import { createContext, useCallback, useMemo, useState } from 'react'

type Key = { id: string; sk: string } | undefined

const KeyContext = createContext<{
  key: Key
  setKey: (key: Key) => void
}>({ key: undefined, setKey: () => {} })

const KeyContextProvider = ({
  children,
  initialKey
}: {
  children: React.ReactNode
  initialKey: Key
}) => {
  const [_key, _setKey] = useState<Key>(initialKey)

  const setKey = useCallback((key: Key) => {
    if (!key) {
      _setKey(undefined)
      return
    }

    _setKey({
      id: encodeURIComponent(key.id),
      sk: encodeURIComponent(key.sk)
    })
  }, [])

  const key = useMemo(() => {
    return _key
      ? {
          id: decodeURIComponent(_key.id),
          sk: decodeURIComponent(_key.sk)
        }
      : undefined
  }, [_key])

  return (
    <KeyContext.Provider value={{ key, setKey }}>
      {children}
    </KeyContext.Provider>
  )
}

export { KeyContext, KeyContextProvider }
