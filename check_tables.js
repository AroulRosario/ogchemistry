const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lasndpkizduwifvrpovl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhc25kcGtpemR1d2lmdnJwb3ZsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQxODI5NiwiZXhwIjoyMDg2OTk0Mjk2fQ.j54FksL0ObOUagQ4QX6doCujL5MYrKNLW_JECHys7kk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    const tables = ['assignments', 'notifications', 'certificates', 'achievements', 'user_achievements', 'quizzes', 'discussion_replies'];
    for (const table of tables) {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error && error.code === '42P01') {
            console.log(`Table ${table} does NOT exist.`);
        } else if (error) {
            console.log(`Table ${table} error:`, error.message);
        } else {
            console.log(`Table ${table} exists.`);
        }
    }
}

checkTables();
