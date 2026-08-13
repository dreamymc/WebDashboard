import { fetchSheet2BuildPlan } from '../lib/google-sheets';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const data = await fetchSheet2BuildPlan();
  console.log(JSON.stringify(data, null, 2));
}

run();
