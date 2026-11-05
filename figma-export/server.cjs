const http=require('http'),fs=require('fs'),path=require('path');
const out=path.join(__dirname,'screens');fs.mkdirSync(out,{recursive:true});
const screens=[];let n=0;
function add(role,route,label,extra=''){screens.push({id:String(++n).padStart(2,'0')+'-'+role+'-'+label,role,route,extra});}
['login','register','forgot-password'].forEach(p=>add('admin','/'+p,p));
const admin=['dashboard','system-coverage','units','owners-tenants','contracts','invoices','payments','repairs','parcels','announcements','reports','roles','audit-log','settings'];
admin.forEach(p=>add('admin','/admin/'+p,p));
add('admin','/units/unit-a-1205','unit-detail');
['profile','notifications','history','team'].forEach(p=>add('admin','/'+p,p));
for(const role of ['owner','tenant','user']){
 add(role,'/dashboard','dashboard');add(role,role==='owner'?'/owner/units':'/units','units');add(role,'/units/unit-a-1205','unit-detail');
 if(role!=='user'){add(role,role==='owner'?'/owner/contracts':'/contracts','contracts');add(role,role==='owner'?'/owner/expenses':'/invoices','invoices');add(role,'/parcels','parcels');}
 for(const p of ['maintenance','announcements','history','profile','notifications'])add(role,'/'+p,p==='maintenance'?'repairs':p);
}
for(const p of ['403','404','500'])add('admin','/error/'+p,'error-'+p);
add('tenant','/dashboard','system-maintenance','&maintenance=1');
fs.writeFileSync(path.join(__dirname,'manifest-screens.json'),JSON.stringify(screens,null,2));
const html=`<!doctype html><html><head><meta charset="utf-8"><title>CondoFlow — exporting all screens</title></head><body style="font:16px system-ui;margin:20px;background:#eef2f6"><h1>CondoFlow — Exporting all ${screens.length} screens</h1><p id="status">Preparing…</p><div id="frames"></div><script>
const screens=${JSON.stringify(screens)};let next=0,done=0;const active=new Map();
function start(){if(next>=screens.length)return;const s=screens[next++],frame=document.createElement('iframe');frame.style='width:1440px;height:1000px;border:0;display:block;margin:20px 0;background:white';frame.src='http://localhost:5189/figma-export.html?'+new URLSearchParams({id:s.id,role:s.role,route:s.route})+s.extra;active.set(s.id,frame);document.getElementById('frames').append(frame)}
window.addEventListener('message',e=>{if(!e.data.exportDone)return;const id=e.data.exportDone;if(!active.has(id))return;active.get(id).remove();active.delete(id);done++;document.getElementById('status').textContent=done+' / '+screens.length+' completed — '+id;start();if(done===screens.length){document.title='Completed: '+done+' CondoFlow screens';document.body.insertAdjacentHTML('beforeend','<h2>Complete — all '+done+' editable screen exports saved</h2>')}});start();start();
</script></body></html>`;
http.createServer((req,res)=>{res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','Content-Type');if(req.method==='OPTIONS'){res.end();return;}
if(req.url==='/save'&&req.method==='POST'){let body='';req.on('data',c=>body+=c);req.on('end',()=>{try{const data=JSON.parse(body);if(!screens.some(s=>s.id===data.id))throw Error('Invalid ID');const svg=data.svg;delete data.svg;fs.writeFileSync(path.join(out,data.id+'.json'),JSON.stringify(data));fs.writeFileSync(path.join(out,data.id+'.svg'),svg);console.log('Saved',data.id,data.items.length,'nodes',data.warnings.length,'image warnings');res.end('ok')}catch(e){res.statusCode=500;res.end(String(e))}});return;}
res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html)}).listen(5188,'::',()=>console.log('Export server http://localhost:5188 — '+screens.length+' screens'));

