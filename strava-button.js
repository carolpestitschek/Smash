// Profile destination is configured once and shared by both layouts.
const stravaProfileUrl = 'https://strava.app.link/oAFwxEmti7b';
document.querySelectorAll('[data-name="Player profile"] [data-name="Introduction"]').forEach(intro=>{
 const button=document.createElement(stravaProfileUrl?'a':'button');
 button.className='tactical-strava';
 if(stravaProfileUrl){button.href=stravaProfileUrl;button.target='_blank';button.rel='noopener noreferrer';}
 else{button.type='button';button.disabled=true;button.title='Strava profile link to add';}
 const label=document.createElement('span');label.textContent='Follow my Strava';
 const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
 button.append(label,arrow);
 ['tl','tr','bl','br'].forEach(c=>{const corner=document.createElement('i');corner.className=c;corner.setAttribute('aria-hidden','true');button.appendChild(corner);});
 intro.appendChild(button);
});
