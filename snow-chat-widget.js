/* Shared floating chat UI for all Snow pages. */
(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
#snowChatWidget{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:10000;color:#eff4ff;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:dark}
#snowChatWidget *{box-sizing:border-box}
#snowChatWidget button{font:inherit;cursor:pointer;color:#eff4ff;background:#25466d;border:1px solid #50759d;border-radius:10px;padding:9px 12px}
#snowChatWidget button:focus-visible,#snowChatWidget input:focus-visible,#snowChatWidget textarea:focus-visible{outline:2px solid #9ed7ff;outline-offset:2px}
#snowChatWidget #snowChatToggle{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:#416eac;border:1px solid #91bce9;box-shadow:0 6px 22px #0007;margin-left:auto;padding:0}
#snowChatWidget #snowChatToggle svg{width:27px;height:27px}
#snowChatWidget #snowChatPanel{width:min(370px,calc(100vw - 32px - env(safe-area-inset-right,0px)));height:min(540px,calc(100vh - 100px));height:min(540px,calc(100dvh - 100px - env(safe-area-inset-bottom,0px)));display:flex;flex-direction:column;background:#14243d;border:1px solid #45678b;border-radius:17px;box-shadow:0 12px 40px #0008;overflow:hidden;margin-bottom:10px}
#snowChatWidget #snowChatPanel[hidden]{display:none!important}
#snowChatWidget .sc-head{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#203c60;padding:12px 14px}
#snowChatWidget .sc-head strong{font-size:15px}
#snowChatWidget .sc-head button{padding:4px 10px;font-size:20px;line-height:1}
#snowChatWidget .sc-fields{padding:10px 12px;display:grid;gap:6px}
#snowChatWidget label{display:block;color:#b8cde5;font-size:12px;margin:0}
#snowChatWidget input,#snowChatWidget textarea{font:inherit;font-size:16px;width:100%;min-width:0;border:1px solid #466180;border-radius:9px;background:#0f1d32;color:#eff4ff;padding:8px 10px;margin:0}
#snowChatWidget #chatStatus{font-size:11px;color:#a7dcce;overflow-wrap:anywhere}
#snowChatWidget #chatMessages{flex:1;min-height:0;height:auto;max-height:none;overflow-y:auto;display:flex;flex-direction:column;gap:8px;margin:0 12px;padding:8px;border:1px solid #344c6c;border-radius:10px;background:#0f1d32;overscroll-behavior:contain}
#snowChatWidget .chat-message{flex-shrink:0;padding:9px;background:#1b304d;border:1px solid #38516f;border-radius:9px;overflow-wrap:anywhere}
#snowChatWidget .chat-meta{display:flex;justify-content:space-between;gap:8px;color:#a9c6e5;font-size:11px;margin-bottom:5px}
#snowChatWidget .chat-text{white-space:pre-wrap;font-size:13px;line-height:1.5}
#snowChatWidget .chat-empty{color:#a9c6e5;text-align:center;font-size:12px}
#snowChatWidget .sc-compose{padding:10px 12px;display:grid;gap:7px}
#snowChatWidget textarea{resize:none;min-height:48px}
#snowChatWidget .sc-actions{display:flex;gap:8px}
#snowChatWidget .sc-actions button:last-child{flex:1;background:#416eac}
#snowChatWidget .sc-note{font-size:10px;color:#9fb2cf;margin:0;line-height:1.3}
@media(max-width:480px){#snowChatWidget{right:calc(10px + env(safe-area-inset-right,0px));bottom:calc(10px + env(safe-area-inset-bottom,0px))}#snowChatWidget #snowChatPanel{width:min(370px,calc(100vw - 20px - env(safe-area-inset-right,0px)));height:min(500px,calc(100dvh - 84px - env(safe-area-inset-bottom,0px)))}#snowChatWidget #snowChatToggle{width:52px;height:52px}}
`;
document.head.append(css);
const root=document.createElement('aside');root.id='snowChatWidget';root.setAttribute('aria-label','눈송이 채팅');
root.innerHTML=`<section id="snowChatPanel" hidden aria-label="눈송이 실시간 채팅"><div class="sc-head"><strong>❄️ 눈송이 실시간 채팅</strong><button id="snowChatClose" type="button" aria-label="채팅 닫기">×</button></div><div class="sc-fields"><label for="chatNickname">닉네임 (최대 20자)</label><input id="chatNickname" maxlength="20" placeholder="눈송이" autocomplete="nickname"><div id="chatStatus" role="status">연결 전</div></div><div id="chatMessages" role="log" aria-live="polite"></div><div class="sc-compose"><label for="chatInput">메시지</label><textarea id="chatInput" maxlength="300" rows="2" placeholder="메시지를 입력하세요"></textarea><div class="sc-actions"><button type="button" id="chatRefresh">↻ 새로고침</button><button type="button" id="chatSend">전송 ❄️</button></div><p class="sc-note">공개 채팅 · 개인정보를 공유하지 마세요.</p></div></section><button id="snowChatToggle" type="button" aria-label="채팅 열기" aria-expanded="false" aria-controls="snowChatPanel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5A9 9 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke-width="2.8"/></svg></button>`;
document.body.append(root);
const panel=document.getElementById('snowChatPanel'),toggle=document.getElementById('snowChatToggle'),status=document.getElementById('chatStatus');
let loading=null;
function library(){
 if(window.supabase&&window.supabase.createClient)return Promise.resolve();
 if(!loading)loading=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';s.onload=()=>{if(window.supabase&&window.supabase.createClient)resolve();else{s.remove();reject(Error('채팅 라이브러리 오류'));}};s.onerror=()=>{s.remove();reject(Error('네트워크 연결을 확인해 주세요.'));};document.head.append(s);}).catch(e=>{loading=null;throw e;});
 return loading;
}
async function open(){
 panel.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','채팅 닫기');
 status.textContent='채팅 연결 중...';
 try{await library();if(panel.hidden)return;if(typeof window.loadSnowChat!=='function')throw Error('채팅 모듈을 불러오지 못했어요.');await window.loadSnowChat(true);if(!panel.hidden){const list=document.getElementById('chatMessages');list.scrollTop=list.scrollHeight;}}catch(e){status.textContent=e.message;}
}
function close(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','채팅 열기');toggle.focus();}
toggle.addEventListener('click',()=>panel.hidden?open():close());
document.getElementById('snowChatClose').addEventListener('click',close);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close();});
document.getElementById('chatRefresh').addEventListener('click',e=>{if(!window.supabase){e.stopImmediatePropagation();open();}},true);
function legacy(){if(location.hash==='#chat'){history.replaceState(null,'',location.pathname+location.search);open();}}
window.addEventListener('hashchange',legacy);
window.addEventListener('DOMContentLoaded',legacy);
})();
