
const fs = require('fs');
const env = Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL, ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY, SVC = env.SUPABASE_SERVICE_ROLE_KEY;
const stamp = Date.now();
const email = `demo.${stamp}@example.com`;
const password = 'DemoBrains2026!';

(async () => {
  const reg = await fetch('http://localhost:3000/api/register', {
    method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({firstName:'Andrea', lastName:'Reyes', email, company:'Northpoint Property Group', password})
  });
  console.log('register', reg.status, await reg.text());

  const tokRes = await fetch(`${URL_}/auth/v1/token?grant_type=password`, {
    method:'POST', headers:{'content-type':'application/json', apikey:ANON, Authorization:`Bearer ${ANON}`},
    body: JSON.stringify({email, password})
  });
  const tok = await tokRes.json();
  console.log('token', tokRes.status, !!tok.access_token);

  const mods = ['hms','pms','bms','iot','crm','pos'];
  const bill = await fetch('http://localhost:3000/api/user/billing', {
    method:'POST', headers:{'content-type':'application/json', Authorization:`Bearer ${tok.access_token}`},
    body: JSON.stringify({
      newModules: mods,
      purchasedModules: ['Frontdesk (HMS)','Landlord (PMS)','Sekyu (BMS)','Housekeeper (IoT)','Customer Relations (CRM)','Point of Sale (POS)'],
      paymentDetails: { brand:'Visa', last4:'4242', expMonth:12, expYear:2028 },
      amountCharged: 56500,
      description: 'Purchased modules: HMS, PMS, BMS, IOT, CRM, POS'
    })
  });
  console.log('billing', bill.status, (await bill.text()).slice(0,160));

  fs.writeFileSync('/tmp/demo-account.json', JSON.stringify({email, password, userId: tok.user?.id}, null, 2));
  console.log('USER', email, tok.user?.id);
})();
