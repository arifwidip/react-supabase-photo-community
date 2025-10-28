export type Profile = {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Photo = {
  id: string
  user_id: string
  image_url: string
  title: string | null
  description: string | null
  created_at: string
  profiles?: Profile
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at'>
        Update: Partial<Omit<Photo, 'id' | 'created_at'>>
      }
    }
  }
}