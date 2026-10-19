// User-provided player profile.
const playtomicProfile='https://app.playtomic.com/profile/user/6733151?utm_campaign=share&utm_source=app_ios';
document.querySelectorAll('[data-name="Action"]').forEach(action=>{
 if(!action.textContent.includes('Playtomic [profile'))return;
 const link=document.createElement('a');link.className=action.className;link.setAttribute('data-name','Action');
 link.href=playtomicProfile;link.target='_blank';link.rel='noopener noreferrer';
 while(action.firstChild)link.appendChild(action.firstChild);
 link.querySelector('p').textContent='My Playtomic profile';action.replaceWith(link);
});

// Keep hero action labels free of placeholder annotations.
document.querySelectorAll('[data-name="Hero"] [data-name="Action"] p').forEach(p=>{p.textContent=p.textContent.replace(/\s*\[profile\]/g,'').replace('My Playtomic profile','My Playtomic');});
