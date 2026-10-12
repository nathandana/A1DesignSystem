// Shared fixture sizes. Counts are strict so a demo cannot silently truncate data.
export const DATASET_SIZES = Object.freeze({ small: 10, medium: 100, large: 1000 })
export const DATASET_COUNTS = Object.freeze([7, 10, 25, 50, 100, 250, 500, 1000])
export const MAX_ITEMS = DATASET_SIZES.large

export function datasetCount(size = 'medium') {
  const count = typeof size === 'string' ? DATASET_SIZES[size] : size
  if (!Number.isInteger(count) || count < 0 || count > MAX_ITEMS) {
    throw new RangeError(`Use small, medium, large or an integer from 0 to ${MAX_ITEMS}.`)
  }
  return count
}
