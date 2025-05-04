export interface Permission {
  id: string
  name: string
  description: string
  slug: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[] | Permission[]
}

export interface User {
  id: string
  name: string
  loginId: string
  password: string
  isAdmin: boolean
  roles: string[]
}
