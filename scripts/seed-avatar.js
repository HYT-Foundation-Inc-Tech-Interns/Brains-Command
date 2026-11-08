
const fs = require('fs');
const env = Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL, SVC = env.SUPABASE_SERVICE_ROLE_KEY;
const { userId } = JSON.parse(fs.readFileSync('/tmp/demo-account.json','utf8'));

(async () => {
  const buf = fs.readFileSync('public/services/resource-staff.jpg');
  const path = `${userId}/avatar-demo.jpg`;
  const up = await fetch(`${URL_}/storage/v1/object/avatars/${path}`, {
    method:'POST',
    headers:{ Authorization:`Bearer ${SVC}`, 'content-type':'image/jpeg', 'x-upsert':'true' },
    body: buf
  });
  console.log('upload', up.status, (await up.text()).slice(0,120));

  const publicUrl = `${URL_}/storage/v1/object/public/avatars/${path}`;
  const patch = await fetch(`${URL_}/rest/v1/profiles?id=eq.${userId}`, {
    method:'PATCH',
    headers:{ apikey:SVC, Authorization:`Bearer ${SVC}`, 'content-type':'application/json', Prefer:'return=minimal' },
    body: JSON.stringify({ avatar_url: publicUrl })
  });
  console.log('profile patch', patch.status, publicUrl);
})();
