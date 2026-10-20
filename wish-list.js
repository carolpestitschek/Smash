(() => {
 const items=window.wishListItems||[],board=document.querySelector('#wish-board'),search=document.querySelector('#wish-search'),category=document.querySelector('#wish-category'),empty=document.querySelector('#wish-empty'),count=document.querySelector('#wish-count'),dialog=document.querySelector('#wish-details'),content=document.querySelector('#wish-detail-content');
 const renderSprite=(viewport,item)=>{
  const image=new Image();image.src=item.sprite;image.decode().then(()=>{
   const regions=Array.from({length:8},(_,i)=>{const x=Math.round(i%4*image.naturalWidth/4),y=Math.round(Math.floor(i/4)*image.naturalHeight/2);return [x,y,Math.round((i%4+1)*image.naturalWidth/4)-x,Math.round((Math.floor(i/4)+1)*image.naturalHeight/2)-y];});
   return window.renderProductSprite(viewport,item.sprite,regions,{initial:item.initial??2});
  }).catch(()=>{viewport.textContent='';const img=document.createElement('img');img.src=item.image;img.alt=item.name;viewport.append(img);});
 };
 const storageKey='smash-wish-positions-v1';let saved={},layer=1;
 try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};}catch{}
 const persist=()=>{try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{}};
 const safeUrl=value=>{try{const url=new URL(value,location.href);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}};
 function show(item){
  content.replaceChildren();
  if(item.spritePhotos){const photo=document.createElement('div');photo.className='wish-atlas-photo';photo.style.backgroundImage=`url("${item.sprite}")`;content.append(photo);const gallery=document.createElement('div');gallery.className='wish-detail-photos';[0,1,4,6].forEach((frame,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','View product photo '+(i+1));const view=document.createElement('div');view.className='wish-atlas-photo';view.style.backgroundImage=`url("${item.sprite}")`;const position=`${frame%4*100/3}% ${frame<4?0:100}%`;view.style.backgroundPosition=position;button.append(view);button.addEventListener('click',()=>photo.style.backgroundPosition=position);gallery.append(button);});content.append(gallery);}
  if(item.image){const img=document.createElement('img');img.src=item.image;img.alt=item.name;content.append(img);}
  if(item.photos?.length){const gallery=document.createElement('div');gallery.className='wish-detail-photos';item.photos.forEach((src,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','View product photo '+(i+1));const img=document.createElement('img');img.src=src;img.alt='';button.append(img);button.addEventListener('click',()=>{content.querySelector(':scope>img').src=src;});gallery.append(button);});content.append(gallery);}
  const tag=document.createElement('p');tag.textContent=item.category||'Other';const title=document.createElement('h2');title.id='wish-detail-title';title.textContent=item.name;content.append(tag,title);
  for(const text of [item.price,item.description])if(text){const p=document.createElement('p');p.textContent=text;content.append(p);}
  const specs=document.createElement('dl');Object.entries(item.specs||{}).forEach(([key,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;specs.append(dt,dd);});content.append(specs);
  const url=item.url&&safeUrl(item.url);if(url){const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.className='gallery-pill';link.textContent='View item ↗';content.append(link);}
  dialog.showModal();
 }
 document.querySelector('.wish-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 const pieces=items.map((item,index)=>{
  const button=document.createElement('button');button.type='button';button.className='wish-sticker';button.setAttribute('aria-label',item.name+'. Click for details. Use arrow keys to move.');
  const img=document.createElement('img');img.src=item.image||'';img.alt='';img.draggable=false;const name=document.createElement('span');name.textContent=item.name;if(item.sprite){const viewport=document.createElement('div');viewport.className='wish-product-view';viewport.setAttribute('aria-hidden','true');button.append(viewport,name);renderSprite(viewport,item);}else button.append(img,name);board.append(button);
  const initial={x:item.x??((index*0.27+.08)%.8),y:item.y??((index*.23+.1)%.7)};let pos={...initial,...saved[item.id]},drag=null,suppress=false;
  const render=()=>{button.style.transform=`translate(${pos.x*Math.max(0,board.clientWidth-button.offsetWidth)}px,${pos.y*Math.max(0,board.clientHeight-button.offsetHeight)}px) rotate(${item.angle??(index%2?7:-7)}deg)`;};
  const save=()=>{saved[item.id]={...pos};persist();};
  button.addEventListener('pointerdown',e=>{if(e.button!==0)return;suppress=false;button.focus({preventScroll:true});drag={x:e.clientX,y:e.clientY,start:{...pos}};button.setPointerCapture(e.pointerId);button.style.zIndex=++layer;});
  button.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5)suppress=true;if(!suppress)return;button.classList.add('is-dragging');pos.x=Math.max(0,Math.min(1,drag.start.x+dx/Math.max(1,board.clientWidth-button.offsetWidth)));pos.y=Math.max(0,Math.min(1,drag.start.y+dy/Math.max(1,board.clientHeight-button.offsetHeight)));render();});
  const drop=()=>{if(!drag)return;drag=null;button.classList.remove('is-dragging');save();};
  button.addEventListener('pointerup',drop);button.addEventListener('pointercancel',()=>{suppress=true;drop();});button.addEventListener('lostpointercapture',drop);
  button.addEventListener('click',()=>{if(suppress){suppress=false;return;}show(item);});
  button.addEventListener('keydown',e=>{const step=e.shiftKey?.08:.02,delta={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[e.key];if(delta){e.preventDefault();pos.x=Math.max(0,Math.min(1,pos.x+delta[0]));pos.y=Math.max(0,Math.min(1,pos.y+delta[1]));render();save();}else if(e.key==='Enter'||e.key===' ')suppress=false;});
  img.addEventListener('load',render);render();return {item,button,render,reset(){pos={...initial};render();}};
 });
 function filter(){let total=0;const query=search.value.trim().toLocaleLowerCase();pieces.forEach(({item,button})=>{const visible=(category.value==='all'||(item.category||'Other')===category.value)&&[item.name,item.description,item.category].filter(Boolean).join(' ').toLocaleLowerCase().includes(query);button.hidden=!visible;if(visible)total++;});count.textContent=`${total} ${total===1?'item':'items'}`;empty.hidden=total>0;empty.querySelector('h2').textContent=items.length?'No finds match this search.':'Space for the next obsession.';empty.querySelector('p').textContent=items.length?'Try another search or category.':'My wish list is taking shape. The first finds will land here soon.';pieces.forEach(p=>p.render());}
 search.addEventListener('input',filter);category.addEventListener('change',filter);
 document.querySelector('#wish-reset').addEventListener('click',()=>{saved={};persist();pieces.forEach(p=>p.reset());});
 new ResizeObserver(()=>pieces.forEach(p=>p.render())).observe(board);filter();
})();
