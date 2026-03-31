import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
  console.log('Checking profiles...');
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, email, role, service_type');
  if (pErr) console.error(pErr);
  else console.log(profiles);

  console.log('\nChecking bookings...');
  const { data: bookings, error: bErr } = await supabase.from('bookings').select('*');
  if (bErr) console.error("Bookings error", bErr);
  else console.log("Total Bookings:", bookings.length, bookings);
}

checkDb();
