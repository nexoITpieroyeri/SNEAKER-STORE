/// <reference types="next" />
/// <reference types="next/image-types/global" />

import { Database } from '@/lib/supabase/types'

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    from<T extends keyof Database['public']['Tables']>(table: T): ReturnType<SupabaseClient<Database>['from']>
  }
}

declare module '@supabase/ssr' {
  interface SupabaseServerClient {
    from<T extends keyof Database['public']['Tables']>(table: T): ReturnType<SupabaseClient<Database>['from']>
  }
}
