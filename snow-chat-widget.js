/* 눈송이 공통 카카오톡 오픈채팅 링크 */
(function(){
'use strict';
const URL='https://open.kakao.com/o/gtLYfvph';
if(document.getElementById('snowChatWidget'))return;
const style=document.createElement('style');
style.textContent=`
#snowChatWidget{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:10000;font:700 14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
#snowChatWidget .snow-kakao-link{display:flex;align-items:center;justify-content:center;gap:8px;padding:0 18px;height:54px;border-radius:28px;background:#FEE500;color:#191919;text-decoration:none;border:1px solid #e5ce00;box-shadow:0 5px 20px #0005;transition:transform .15s}
#snowChatWidget .snow-kakao-link:hover{transform:translateY(-2px)}
#snowChatWidget .snow-kakao-link:focus-visible{outline:3px solid #fff;outline-offset:3px}
#snowChatWidget svg{width:27px;height:27px;flex-shrink:0}
@media(max-width:480px){#snowChatWidget{right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px))}#snowChatWidget .snow-kakao-link{width:54px;padding:0}#snowChatWidget .snow-kakao-text{display:none}}
@media(prefers-reduced-motion:reduce){#snowChatWidget .snow-kakao-link{transition:none;transform:none}}
`;
document.head.append(style);
const root=document.createElement('aside');root.id='snowChatWidget';root.setAttribute('aria-label','눈송이 커뮤니티');
const link=document.createElement('a');link.className='snow-kakao-link';link.href=URL;link.target='_blank';link.rel='noopener noreferrer';link.title='눈송이 카카오톡 오픈채팅 참여';link.setAttribute('aria-label','눈송이 카카오톡 오픈채팅 참여 (새 창)');
link.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 4C8.82 4 3 8.53 3 14.12c0 3.56 2.37 6.7 5.95 8.5l-1.2 4.68c-.11.43.37.75.73.5l5.58-3.76c.64.08 1.28.12 1.94.12 7.18 0 13-4.53 13-10.1S23.18 4 16 4Z"/><g fill="#FEE500"><circle cx="10.5" cy="14" r="1.5"/><circle cx="16" cy="14" r="1.5"/><circle cx="21.5" cy="14" r="1.5"/></g></svg><span class="snow-kakao-text">오픈채팅</span>';
root.append(link);document.body.append(root);
function legacy(){if(location.hash==='#chat'){history.replaceState(null,'',location.pathname+location.search);link.focus();}}
window.addEventListener('hashchange',legacy);legacy();
})();
