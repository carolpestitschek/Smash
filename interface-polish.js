// Shared motion for the existing arrow glyphs, without introducing new artwork.
document.querySelectorAll('[data-name="Action"],.tactical-strava,.gallery-pill').forEach(action=>{
 action.querySelectorAll('p,span').forEach(label=>{
  label.textContent=label.textContent.replace(/\s*\[profile(?:\s+link)?\]/gi,'').replace('My Playtomic profile','My Playtomic');
  if(label.textContent.trim()==='↗'){
   label.classList.add('diagonal-action-arrow');label.setAttribute('aria-hidden','true');action.classList.add('diagonal-arrow-trigger');
  }
 });
});
