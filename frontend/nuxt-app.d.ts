export {}
declare global {
  type Maybe<T> = null | undefined | T

  type Pagination = {
    current_page: number
    per_page: number
    last_page: number
    total?: number
  }
}

declare module '*.json' {
  const value: any
  export default value
}
