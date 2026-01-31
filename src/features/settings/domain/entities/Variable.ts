/**
 * Variable domain entity (matches Appwrite variables collection document).
 * Uses flexible attributes so any collection fields can be displayed.
 */

export interface Variable {
  id: string
  createdAt: string
  updatedAt: string
  /** All other document attributes from the variables collection */
  attributes: Record<string, unknown>
}
