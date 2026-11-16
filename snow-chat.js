/* 눈송이 실시간 채팅 - Supabase Realtime */
(function(){
'use strict';
const URL = 'https://nntycscsxhmgkixighbd.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_6q-xpfWfJpORnvtMjM7jHw_xO_d6WMW';
const TABLE = 'snow_chat_messages';
const NICK_KEY = 'snow-chat-nickname-v1';
let client = null, channel = null, opened = false, lastSent = 0;
let records = new Map();
const get = id => document.getElementById(id);
function status(text){const e=get('chatStatus');if(e)e.textContent=text;}
function formatDate(time){try{return new Date(time).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
function draw(){
 const root=get('chatMessages');if(!root)return;
 const atBottom=root.scrollTop+root.clientHeight>=root.scrollHeight-75;
 root.replaceChildren();
 const msgs=Array.from(records.values()).sort((a,b)=>a.id-b.id).slice(-100);
 if(!msgs.length){const el=document.createElement('p');el.className='chat-empty';el.textContent='아직 메시지가 없어요. 첫 인사를 남겨 주세요!';root.appendChild(el);}
 for(const m of msgs){
   const article=document.createElement('article');article.className='chat-message';
   const header=document.createElement('div');header.className='chat-meta';
   const user=document.createElement('strong');user.textContent=m.nickname||'모험가';
   const date=document.createElement('span');date.textContent=formatDate(m.created_at);
   const body=document.createElement('div');body.className='chat-text';body.textContent=m.content||'';
   header.append(user,date);article.append(header,body);root.appendChild(article);
 }
 if(atBottom)root.scrollTop=root.scrollHeight;
}
async function refresh(){
 if(!client)return;
 const result=await client.from(TABLE).select('id,nickname,content,created_at').order('id',{ascending:false}).limit(100);
 if(result.error)throw result.error;
 for(const item of result.data||[]) records.set(item.id,item);
 if(records.size>120){const keep=Array.from(records.keys()).sort((a,b)=>b-a).slice(0,100);const next=new Map();keep.forEach(id=>next.set(id,records.get(id)));records=next;}
 draw();
}
function connect(){
 if(channel||!client)return;
 channel=client.channel('snow-public-chat-'+Math.random().toString(36).slice(2))
 .on('postgres_changes',{event:'INSERT',schema:'public',table:TABLE},payload=>{
   const item=payload.new;
   if(!item||!item.id)return;
   records.set(item.id,item);draw();
 })
 .subscribe((s)=>{
   if(s==='SUBSCRIBED')status('● 실시간 연결됨 · 메시지가 자동 표시됩니다.');
   else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT')status('연결이 지연되고 있어요. 새로고침을 눌러주세요.');
   else if(s==='CLOSED')status('실시간 연결이 종료되었습니다.');
 });
}
window.loadSnowChat=async function(force){
 if(!opened||!client){
   opened=true;
   if(!window.supabase||!window.supabase.createClient){status('채팅 라이브러리를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.');return;}
   client=window.supabase.createClient(URL,PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
   connect();
 }
 if(force||records.size===0){
   status('메시지를 불러오는 중...');
   try{await refresh();if(channel&&channel.state==='joined')status('● 실시간 연결됨 · 메시지가 자동 표시됩니다.');else status('메시지 로드 완료 · 연결 중...');}
   catch(err){status('채팅 테이블 연결 실패: '+(err.message||'Supabase SQL 설정을 확인해 주세요.'));}
 }
};
window.sendSnowMessage=async function(){
 const button=get('chatSend'),nickname=get('chatNickname').value.trim(),message=get('chatInput').value.trim();
 if(!nickname||nickname.length>20){status('닉네임은 1~20자로 입력해 주세요.');return;}
 if(!message||message.length>300){status('메시지는 1~300자로 입력해 주세요.');return;}
 if(Date.now()-lastSent<3000){status('3초 후에 다시 메시지를 전송할 수 있어요.');return;}
 if(!client){status('연결 중입니다.');return;}
 button.disabled=true;
 try{
  const response=await client.from(TABLE).insert({nickname:nickname,content:message});
  if(response.error)throw response.error;
  lastSent=Date.now();get('chatInput').value='';
  try{localStorage.setItem(NICK_KEY,nickname);}catch(e){}
  status('전송 완료 · 실시간 채팅 연결 중');
  await refresh();
 }catch(err){status('전송 실패: '+(err.message||'테이블과 RLS 설정을 확인해 주세요.'));}
 finally{button.disabled=false;}
};
window.addEventListener('DOMContentLoaded',function(){
 try{get('chatNickname').value=localStorage.getItem(NICK_KEY)||'';}catch(e){}
 get('chatSend').addEventListener('click',window.sendSnowMessage);
 get('chatRefresh').addEventListener('click',()=>window.loadSnowChat(true));
 get('chatInput').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();window.sendSnowMessage();}});
 get('chatNickname').addEventListener('change',function(){try{localStorage.setItem(NICK_KEY,this.value.trim().slice(0,20));}catch(e){}});
});
})();