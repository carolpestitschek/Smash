// Group products by category and order by their lifecycle status.
document.querySelectorAll('[data-name="Equipment repository"]').forEach((repository,repoIndex)=>{
 const grid=repository.querySelector('[data-name="Gear categories"]');
 const entries=[];
 grid.querySelectorAll('[data-name="Gear category"]').forEach(category=>{
  const heading=category.querySelector('[data-name="Category heading"]');
  const name=heading.querySelector('p').textContent.trim();
  category.querySelectorAll('[data-name="Gear item"]').forEach(card=>{
   const title=card.querySelector('[data-name="Heading"]').textContent.trim();
   const filled=!title.includes('[');
   // Set data-gear-status to current, owned or archived for each real product.
   const lifecycle=filled?(card.dataset.gearStatus||'current'):'placeholder';
   card.dataset.gearStatus=lifecycle;
   const badge=card.querySelector('[data-name="Status"]');
   const labels={current:'CURRENTLY USING',owned:'OWNED · NOT IN USE',archived:'ARCHIVED',collection:'COLLECTION',placeholder:'TO BE ADDED'};
   badge.querySelector('p').textContent=labels[lifecycle];
   badge.classList.add('gear-status-'+lifecycle);
   const entry=document.createElement('div');entry.className='gear-entry';
   entry.append(card);
   entries.push({entry,name,title,filled,status:lifecycle,added:Number(card.dataset.addedOrder)||(card.classList.contains('deite-shoe-card')?2:card.classList.contains('oysho-bag-card')?1:0)});
  });
 });
 grid.replaceChildren();grid.classList.add('gear-sorted-grid');
 const groups=new Map();
 ['Rackets','Shoes','Accessories'].filter(name=>entries.some(e=>e.name===name)).forEach(name=>{const section=document.createElement('section');section.className='gear-category-group';const heading=document.createElement('div');heading.className='gear-group-heading';const title=document.createElement('h3');title.textContent=name;const star=document.createElement('span');star.textContent='✦';star.setAttribute('aria-hidden','true');heading.append(title,star);const cards=document.createElement('div');cards.className='gear-group-cards';section.append(heading,cards);grid.append(section);groups.set(name,{section,cards});});
 const toolbar=document.createElement('div');toolbar.className='gear-controls';
 const makeSelect=(label,options)=>{
  const field=document.createElement('label');field.append(document.createTextNode(label));
  const select=document.createElement('select');
  options.forEach(([value,text])=>{const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);});
  field.append(select);toolbar.append(field);return select;
 };
 const category=makeSelect('Category',[['all','All categories'],...Array.from(new Set(entries.map(e=>e.name))).sort().map(n=>[n,n])]);
 const status=makeSelect('Item status',[['all','All statuses'],['current','Currently using'],['collection','Collection'],['owned','Owned · not in use'],['archived','Archived']]);
 const sort=makeSelect('Sort by',[['default','Item status'],['alpha','Alphabetical · A–Z'],['oldest','Oldest added'],['newest','Newest added']]);
 const count=document.createElement('span');count.className='gear-result-count';count.setAttribute('aria-live','polite');toolbar.append(count);
 grid.before(toolbar);
 const empty=document.createElement('p');empty.className='gear-empty';empty.textContent='No items in this selection yet.';empty.hidden=true;grid.after(empty);
 const render=()=>{
  const ordered=[...entries].sort((a,b)=>{
   if(sort.value==='default'){
    const rank={current:0,collection:1,owned:2,archived:3,placeholder:4};
    const difference=rank[a.status]-rank[b.status];if(difference)return difference;
   }
   if(sort.value==='oldest'||sort.value==='newest')return (sort.value==='oldest'?1:-1)*(a.added-b.added)||a.title.localeCompare(b.title);
   return a.title.localeCompare(b.title)||a.name.localeCompare(b.name);
  });
  let shown=0;
  ordered.forEach(item=>{
   const visible=(category.value==='all'||item.name===category.value)&&(status.value==='all'||item.status===status.value);
   item.entry.hidden=!visible;if(visible)shown++;groups.get(item.name).cards.append(item.entry);
  });
  groups.forEach(({section,cards})=>{section.hidden=![...cards.children].some(entry=>!entry.hidden);});
  count.textContent=`${shown} ${shown===1?'item':'items'}`;empty.hidden=shown!==0;
 };
 [category,status,sort].forEach(select=>select.addEventListener('change',()=>{render();observeCards();}));render();
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),revealed=new WeakSet(),animations=new Set();
 const observer=new IntersectionObserver(changes=>{
  changes.forEach(({target,isIntersecting})=>{
   if(!isIntersecting||target.hidden||revealed.has(target))return;
   revealed.add(target);observer.unobserve(target);if(reduce.matches)return;
   const visible=[...target.parentElement.children].filter(el=>!el.hidden),index=visible.indexOf(target),columns=innerWidth<768?1:3;
   const animation=target.animate([{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay:(index%columns)*180,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'});
   animations.add(animation);animation.onfinish=()=>animations.delete(animation);
  });
 },{rootMargin:'0px 0px -48px 0px'});
 function observeCards(){entries.forEach(({entry})=>{if(!entry.hidden&&!revealed.has(entry))observer.observe(entry);});}
 const stop=()=>{animations.forEach(a=>a.cancel());animations.clear();};
 reduce.addEventListener('change',()=>{if(reduce.matches)stop();});document.addEventListener('keydown',stop,{capture:true});
 observeCards();
});
