/* IP-only visit logging. Private IP-only visit logging. */
(function(){
'use strict';
const ENABLED = true;
if(!ENABLED || location.origin !== 'https://pneco.github.io') return;
function record(){
 if(document.visibilityState === 'hidden' || !navigator.onLine) return;
 try{
 fetch("https://nntycscsxhmgkixighbd.supabase.co/rest/v1/rpc/snow_record_visit",{
 method:'POST',headers:{apikey:"sb_publishable_6q-xpfWfJpORnvtMjM7jHw_xO_d6WMW",'Content-Type':'application/json'},
 body:'{}',credentials:'omit',referrerPolicy:'no-referrer',keepalive:true
 }).catch(()=>{});
 }catch(e){}
}
if(document.visibilityState === 'visible') record();
else document.addEventListener('visibilitychange',function onVisible(){if(document.visibilityState==='visible'){document.removeEventListener('visibilitychange',onVisible);record();}});
})();
