const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lasndpkizduwifvrpovl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhc25kcGtpemR1d2lmdnJwb3ZsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQxODI5NiwiZXhwIjoyMDg2OTk0Mjk2fQ.j54FksL0ObOUagQ4QX6doCujL5MYrKNLW_JECHys7kk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRpc() {
    const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
    if (error) {
        console.log('RPC exec_sql does NOT exist or failed:', error.message);
    } else {
        console.log('RPC exec_sql exists!');
    }
}

checkRpc();
