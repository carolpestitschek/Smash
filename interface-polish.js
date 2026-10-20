// Shared motion for the existing arrow glyphs, without introducing new artwork.
document.querySelectorAll('[data-name="Action"],.tactical-strava,.gallery-pill').forEach(action=>{
 action.querySelectorAll('p,span').forEach(label=>{
  label.textContent=label.textContent.replace(/\s*\[profile(?:\s+link)?\]/gi,'').replace('My Playtomic profile','My Playtomic');
  if(label.textContent.trim()==='↗'){
   label.classList.add('diagonal-action-arrow');label.setAttribute('aria-hidden','true');action.classList.add('diagonal-arrow-trigger');
  }
 });
});
// Connection buttons share the original Playtomic footprint.
document.querySelectorAll('[data-name="Connect and play"] [data-name="Action"]>p:first-child').forEach(label=>{if(label.textContent.trim()==='My Playtomic')label.textContent='Playtomic';});
document.querySelectorAll('[data-name="Hero"] [data-name="Profile actions"] [data-name="Action"]>p:first-child').forEach(label=>{if(label.textContent.trim()==='My Playtomic')label.textContent='Playtomic';});
// Keep the closing invitation on its own line and animate only the title mark.
document.querySelectorAll('[data-name="Connect and play"]').forEach(section=>{
 const copy=[...section.querySelectorAll('p')].find(p=>p.textContent.includes('Always up for a good rally.'));
 if(copy){const text=copy.textContent.trim(),ending='Let’s get a game in.';if(text.includes(ending)){copy.textContent=text.replace(ending,'').trim();copy.append(document.createElement('br'),document.createTextNode(ending));}}
 const title=section.querySelector('[data-name="Display title"]');
 const line=title&&[...title.querySelectorAll('p')].find(p=>p.textContent.includes('More padel.*'));
 if(line){line.textContent='More padel.';const star=document.createElement('span');star.className='connect-title-star';star.textContent='*';line.append(star);title.classList.add('connect-title-motion');}
});
