/**
 * Failure types for Result-based error handling.
 * Domain and data layers use these; no framework dependencies.
 */

export abstract class Failure {
  abstract readonly message: string
  abstract readonly code?: string
}

export class ServerFailure extends Failure {
  readonly message: string
  readonly code = 'SERVER_ERROR'

  constructor(message: string) {
    super()
    this.message = message
  }
}

export class NetworkFailure extends Failure {
  readonly message: string
  readonly code = 'NETWORK_ERROR'

  constructor(message: string) {
    super()
    this.message = message
  }
}

export class ValidationFailure extends Failure {
  readonly message: string
  readonly code = 'VALIDATION_ERROR'

  constructor(message: string) {
    super()
    this.message = message
  }
}

export class AccessDeniedFailure extends Failure {
  readonly message: string
  readonly code = 'ACCESS_DENIED'

  constructor(message: string) {
    super()
    this.message = message
  }
}
