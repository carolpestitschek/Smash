// All verified club links are native anchors. Placeholder profiles remain unconfirmed.
document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
document.querySelectorAll('[data-name="Action"]').forEach(action=>{
 if(action.textContent.includes('Let’s play')){action.setAttribute('role','link');action.tabIndex=0;const go=()=>document.querySelector((innerWidth<768?'#mobile':'#desktop')+'-connect').scrollIntoView({behavior:'smooth'});action.addEventListener('click',go);action.addEventListener('keydown',e=>{if(e.key==='Enter')go()});action.style.cursor='pointer';}
});
