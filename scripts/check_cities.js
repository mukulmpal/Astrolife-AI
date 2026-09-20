const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data } = await supabase.from('cities').select('name, admin1_code').in('name', ['Kanpur', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']);
  console.log(data);
}
run();
