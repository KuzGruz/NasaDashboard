import { QueryPagination } from '../../types/types'

export function getPagination({ page, limit }: QueryPagination) {
    page = Math.abs(page) || 1
    limit = Math.abs(limit) || 10
    const offset = (page - 1) * limit

    return { offset, limit }
}
