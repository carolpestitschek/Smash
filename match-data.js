// User-supplied match/event screenshots, dated October 2026.
const replaceText=(root,from,to)=>{root.querySelectorAll('p,span').forEach(n=>{if(n.children.length===0&&n.textContent.trim()===from)n.textContent=to;});};
document.querySelectorAll('main').forEach(view=>{
 const featured=view.querySelector('[data-name="Featured next game"]');
 [['The next match goes here. Add a date, a club and a link when it’s booked.','My latest match: an evening game at Padel Social Club, Earls Court.'],['[AVAILABILITY]','Draw'],['FEATURED GAME','LAST GAME'],['[Day], [time]','15 Oct · 7–8 pm'],['[Club name] · [Area, city]','Padel Social Club · Earls Court'],['[FORMAT] / LEVEL [X–X] / [PLACES] AVAILABLE','DOUBLES / CAROL + KANISHK'],['Join on [platform]','Result not recorded'],['NEXT UP / [MATCH DATE]','LATEST MATCH / 15 OCT 2026']].forEach(([a,b])=>replaceText(featured,a,b));
 const statusRow=featured.querySelector('[data-name="Match status"]');
 statusRow.classList.add('latest-match-status');
 featured.querySelector('[data-name="Match details"] [data-name="Action"]')?.remove();
 const list=view.querySelector('[data-name="Upcoming game list"]');
 replaceText(list,'Next games','Recent games');replaceText(list,'ALL DATES TO BE CONFIRMED','OCTOBER 2026 / RECENT MATCHES');replaceText(list,'LEVEL / SPACES','RESULT');replaceText(list,'MATCH LINK','PARTNER');
 const games=[
  {when:'11 Oct · 7:30–9 am',name:'Morning doubles',location:'Racketeer · North Acton',result:'Won · 6–4, 6–3, 5–7',partner:'With Guillaume'},
  {when:'7 Oct · 7–8 am',name:'Morning doubles',location:'Racketeer · North Acton',result:'Won · 6–0, 6–1',partner:'With Kirsty'},
  {when:'5 Oct · 8–9 pm',name:'Evening doubles',location:'Racketeer · North Acton',result:'Result to add',partner:'Partner to add'}
 ];
 list.querySelectorAll('[data-name="Game entry"]').forEach((row,i)=>{
  const game=games[i];row.querySelectorAll('p').forEach(n=>{
   const t=n.textContent.trim();
   if(t==='[Date] · [Time]')n.textContent=game.when;
   if(['[Social doubles]','[Practice session]','[Weekend match]'].includes(t))n.textContent=game.name;
   if(t.startsWith('[Club]'))n.textContent=game.location;
   if(t==='[Level] · [Places available]')n.textContent=game.result;
   if(t==='View game ↗')n.textContent=game.partner;
  });
 });
 const tournaments=view.querySelector('[data-name="Upcoming tournaments"]');
 replaceText(tournaments,'A place for upcoming entries, partners and tournament plans. Everything below is waiting for your details.','The next challenge, and one already played. My tournament calendar and past entries.');
 const events=[
  {name:'North West London’s 1st Women’s Padel Tournament',date:'31 Oct 2026 · 11 am',venue:'Padel and Coffee',division:'Level 0–5 · Open',partner:'Partner: Anika V.',status:'Entry: You + 11/32 · £30',badge:'UPCOMING TOURNAMENT',link:'Event link to add'},
  {name:'Silver Wilson Master final',date:'3 Oct 2026 · 10 am',venue:'Padel Social Club · Earls Court',division:'Level 2–3 · Open',partner:'Partner: Anika V.',status:'',badge:'PAST TOURNAMENT',link:'Recap to add'}
 ];
 tournaments.querySelectorAll('[data-name="Tournament card"]').forEach((card,i)=>{
  const e=events[i];card.classList.toggle('past-tournament-card',i===1);
  [['UPCOMING SLOT',e.badge],['[Tournament name]',e.name],['[Next tournament name]',e.name],['[Date] · [Venue, city]',e.date+' · '+e.venue],['Division: [Category / level]','Division: '+e.division],['Partner: [Partner name]',e.partner],['Entry status: [To be confirmed]',e.status],['[Event / entry link] ↗',e.link]].forEach(([a,b])=>replaceText(card,a,b));
 });
 tournaments.querySelectorAll('.past-tournament-card [data-name="Paragraph"] p').forEach(p=>{if(!p.textContent.trim())p.remove();});
 const archive=view.querySelector('[data-name="Past tournaments"]');
 replaceText(archive,'NO RESULTS ADDED YET','PAST TOURNAMENT');
 const rows=archive.querySelectorAll('[data-name="Past tournament entry"]');
 if(rows[0]){[['[Past tournament]','Silver Wilson Master final'],['[Date] · [Venue] · [Division]','3 Oct 2026 · Earls Court · Level 2–3'],['Partner: [Name] · Result: [Result]','Partner: Anika V.'],['COMPLETED SLOT / UNFILLED','PAST TOURNAMENT'],['[Recap] ↗','Recap to add']].forEach(([a,b])=>replaceText(rows[0],a,b));}
 if(rows[1])rows[1].hidden=true;
 const profile=view.querySelector('[data-name="Player profile"]');replaceText(profile,'[High-Intermediate]','High-Intermediate');
 const walker=document.createTreeWalker(profile,NodeFilter.SHOW_TEXT);while(walker.nextNode())walker.currentNode.textContent=walker.currentNode.textContent.replace(/[\[\]]/g,'');
 // Fill confirmed club visit dates without inventing personal notes.
 view.querySelectorAll('[data-name="Club card"]').forEach(card=>{
  if(card.textContent.includes('Racketeer'))replaceText(card,'Visit: [Date to add]','Latest visit: 11 Oct 2026');
  if(card.textContent.includes('Padel Social Club – Earls Court'))replaceText(card,'Visit: [Date to add]','Latest visit: 15 Oct 2026');
  if(card.textContent.includes('Padel Social Club – Earls Court'))replaceText(card,'Earls Court · Empress Place · SW6 1TT\nVisit: [Date to add]\n[Your court notes]','Earls Court · Empress Place · SW6 1TT\nVisit: 15 Oct 2026\n[Your court notes]');
 });
});

// Keep the past tournament's original single diagonal-arrow glyph.
document.querySelectorAll('.past-tournament-card [data-name="Tournament banner"]>p').forEach(icon=>{
 icon.textContent='↗';icon.classList.add('plain-tournament-arrow');icon.setAttribute('aria-hidden','true');
});

// Club visit dates supplied by Carol.
const addedClubVisits={"The Padel Yard – G4P":"13 Aug 2025","Rocket Padel Ilford": "8 Sep 2026", "PADELHUB Slough": "25 Aug 2025", "National Tennis Centre Padel": "28 Apr 2026", "Padel Box Bermondsey": "30 Aug 2025", "Rocks Lane Chiswick Padel": "24 Jul 2025"};
document.querySelectorAll('[data-name="Club card"]').forEach(card=>{for(const [name,date] of Object.entries(addedClubVisits))if(card.textContent.includes(name))replaceText(card,'Visit: [Date to add]','Latest visit: '+date);});

// Roll only the score digits; the real result remains the accessible label.
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),active=new Set();
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;observer.unobserve(entry.target);
  if(reduce.matches)return;
  const reveal=entry.target.animate([{opacity:0},{opacity:1}],{duration:250,delay:(Number(entry.target.dataset.scoreOrder)+1)*180,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'});
  active.add(reveal);reveal.onfinish=()=>active.delete(reveal);
  entry.target.querySelectorAll('.score-digit-track').forEach((track,index)=>{
   const animation=track.animate([{transform:'translateY(0)'},{transform:`translateY(-${track.dataset.steps*1.5}em)`}],{duration:700,delay:(Number(entry.target.dataset.scoreOrder)+1)*180+index*45,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'});
   active.add(animation);animation.onfinish=()=>active.delete(animation);
  });
 }),{rootMargin:'0px 0px -64px 0px'});
 document.querySelectorAll('[data-name="Upcoming game list"] [data-name="Game entry"] p, [data-name="Club directory"] p').forEach(p=>{
  const text=p.textContent.trim();if(!/^Won ·/.test(text)&&!text.includes("15 PLACES I'VE PLAYED"))return;
  p.setAttribute('aria-label',text);p.classList.add('animated-match-score');
  const list=p.closest('[data-name="Upcoming game list"]');
  p.dataset.scoreOrder=list?[...list.querySelectorAll('[data-name="Game entry"]')].indexOf(p.closest('[data-name="Game entry"]')):0;
  const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');
  for(const character of text){
   if(!/\d/.test(character)){visual.append(document.createTextNode(character));continue;}
   const digit=document.createElement('span');digit.className='score-digit';
   const track=document.createElement('span');track.className='score-digit-track';const steps=10+Number(character);track.dataset.steps=steps;track.style.transform=`translateY(-${steps*1.5}em)`;
   for(let i=0;i<=steps;i++){const n=document.createElement('span');n.textContent=i%10;track.append(n);}
   digit.append(track);visual.append(digit);
  }
  p.replaceChildren(visual);observer.observe(p);
 });
 const stop=()=>{active.forEach(a=>a.cancel());active.clear();};
 reduce.addEventListener('change',()=>{if(reduce.matches)stop();});
 document.addEventListener('keydown',stop,{capture:true});
})();
