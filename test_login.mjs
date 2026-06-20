import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  const email = 'ichwal.admin@disguise.id';
  const password = 'wrongpassword';
  
  console.log(`Attempting to log in as ${email}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login failed:", JSON.stringify(error, null, 2));
    console.dir(error);
  } else {
    console.log("Login successful! User ID:", data.user.id);
  }
}

testLogin();
