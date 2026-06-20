import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  console.log('Attempting signup...');
  const { data, error } = await supabase.auth.signUp({
    email: 'operator.baru@disguise.id',
    password: 'Password123!',
  });

  if (error) {
    console.error('Signup error:', error);
  } else {
    console.log('Signup success:', data.user?.id);
  }
}

testSignup();
