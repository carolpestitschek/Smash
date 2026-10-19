// Four clubs per page. Map selection opens the page containing that club.
document.querySelectorAll('[data-name="Club directory"]').forEach(directory=>{
 const entries=directory.querySelector('[data-name="Club entries"]');
 const cards=[...entries.querySelectorAll('[data-name="Club card"]')];
 const pages=Math.ceil(cards.length/4);let page=0;
 const nav=document.createElement('nav');nav.className='club-pagination';nav.setAttribute('aria-label','Club notebook pages');
 const status=document.createElement('p');status.className='club-page-status';status.setAttribute('aria-live','polite');
 const controls=document.createElement('div');controls.className='club-page-controls';
 const makeButton=(label,aria,action)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',aria);b.addEventListener('click',action);controls.appendChild(b);return b;};
 const previous=makeButton('←','Previous club page',()=>show(page-1));
 const numbers=Array.from({length:pages},(_,i)=>makeButton(String(i+1),'Club page '+(i+1),()=>show(i)));
 const next=makeButton('→','Next club page',()=>show(page+1));
 function show(value){page=Math.max(0,Math.min(pages-1,value));cards.forEach((card,i)=>card.hidden=Math.floor(i/4)!==page);
  status.textContent=`${page*4+1}–${Math.min((page+1)*4,cards.length)} OF ${cards.length} CLUBS`;
  previous.disabled=page===0;next.disabled=page===pages-1;
  numbers.forEach((button,i)=>{if(i===page)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
 }
 nav.append(status,controls);entries.after(nav);show(0);
 const observer=new MutationObserver(()=>{const selected=cards.findIndex(card=>card.querySelector('.selected-pin-badge'));if(selected>=0&&Math.floor(selected/4)!==page)show(Math.floor(selected/4));});
 observer.observe(entries,{subtree:true,attributes:true,attributeFilter:['class']});
});
