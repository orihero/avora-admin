import { Client, Account, Databases, Query, AppwriteException } from 'appwrite'

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT as string
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID as string
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID as string

export interface SessionData {
  sessionId: string
  userId: string
  expire: string
}

/** Appwrite document from user_profiles collection (raw shape). */
export interface UserProfileDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
  authId: string
  role: string
  phoneNumber?: string | null
  firstName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  avatarUrl?: string | null
}

export class AppwriteAuthDatasource {
  private readonly client: Client
  private readonly account: Account
  private readonly databases: Databases

  constructor() {
    if (!ENDPOINT || !PROJECT_ID) {
      throw new Error(
        'Missing VITE_APPWRITE_ENDPOINT or VITE_APPWRITE_PROJECT_ID. Check .env.'
      )
    }
    this.client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)
    this.account = new Account(this.client)
    this.databases = new Databases(this.client)
  }

  async login(email: string, password: string): Promise<SessionData> {
    try {
      const session = await this.account.createEmailPasswordSession(email, password)
      return {
        sessionId: session.$id,
        userId: session.userId,
        expire: session.expire,
      }
    } catch (error) {
      const isSessionAlreadyExists =
        error instanceof AppwriteException &&
        (error.type === 'user_session_already_exists' ||
          (error.code === 401 && error.message.includes('session is active')))
      if (isSessionAlreadyExists) {
        try {
          await this.account.deleteSession('current')
        } catch {
          // Ignore logout errors (e.g. 401 when cookie not sent)
        }
        const session = await this.account.createEmailPasswordSession(email, password)
        return {
          sessionId: session.$id,
          userId: session.userId,
          expire: session.expire,
        }
      }
      throw error
    }
  }

  async getCurrentSession(): Promise<SessionData | null> {
    try {
      const session = await this.account.getSession('current')
      return {
        sessionId: session.$id,
        userId: session.userId,
        expire: session.expire,
      }
    } catch {
      return null
    }
  }

  async getUserProfileByAuthId(authId: string): Promise<UserProfileDocument | null> {
    if (!DATABASE_ID) {
      return null
    }
    const { documents } = await this.databases.listDocuments<UserProfileDocument>(
      DATABASE_ID,
      'user_profiles',
      [Query.equal('authId', authId), Query.limit(1)]
    )
    return documents.length > 0 ? documents[0] : null
  }

  async logout(): Promise<void> {
    await this.account.deleteSession('current')
  }
}
