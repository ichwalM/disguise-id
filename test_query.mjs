import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log('Querying mst_users...');
  const { data, error } = await supabase.from('mst_users').select('*');
  if (error) {
    console.error('Error querying mst_users:', error);
  } else {
    console.log('Success. Found', data.length, 'users:');
    console.log(data);
  }
}

testQuery();
