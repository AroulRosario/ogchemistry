import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Supabase environment variables are missing! Dashboard will not work.')
} else {
    console.log('Admin Dashboard: Configured with Service Role access.')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
