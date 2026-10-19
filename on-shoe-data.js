// On THE ROGER Pro 2 — specifications and references supplied by Carol.
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const category=[...repository.querySelectorAll('[data-name="Gear category"]')].find(el=>el.querySelector('[data-name="Category heading"]')?.textContent.includes('Shoes'));
 if(!category)return;
 const card=[...category.querySelectorAll('[data-name="Gear item"]')].find(el=>el.querySelector('[data-name="Heading"]')?.textContent.includes('['));
 if(!card)return;
 card.classList.add('on-shoe-card','oysho-bag-card');card.dataset.gearStatus='current';card.dataset.addedOrder='6';
 card.querySelector('[data-name="Heading"] p').textContent='On · THE ROGER Pro 2';
 const description=card.querySelector('[data-name="Paragraph"]>div');description.replaceChildren();
 ['White / Malibu · 3ME10302840','Breathable mesh, a reinforced toe and lateral TPU support. Foam cushioning and an open herringbone tread for hard-court play.'].forEach((text,index)=>{const p=document.createElement('p');p.textContent=text;p.style.lineHeight='24px';if(!index)p.style.marginBottom='16px';description.append(p);});
 card.querySelector('[data-name="Anchor"]').replaceChildren();
 const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');artwork.replaceChildren();artwork.classList.add('bag-artwork');
 const viewport=document.createElement('div');viewport.className='bag-view';viewport.setAttribute('role','img');viewport.setAttribute('aria-label','White and Malibu On THE ROGER Pro 2 shoe, rotating on hover');artwork.append(viewport);
 const sheet=new Image();sheet.src='assets/on-roger-pro-2-views.png';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 let layers=[],rotations=[];
 const stop=()=>{rotations.forEach(animation=>animation.cancel());rotations=[];};
 const start=()=>{
  if(reduce.matches||!fine.matches||rotations.length||!layers.length)return;
  layers.forEach((layer,index)=>{const keys=[];for(let i=0;i<=8;i++)keys.push({offset:i/8,opacity:i%8===index?1:0,easing:'steps(1,end)'});rotations.push(layer.animate(keys,{duration:2400,iterations:Infinity}));});
 };
 sheet.onload=()=>{
  const cw=Math.floor(sheet.naturalWidth/4),ch=Math.floor(sheet.naturalHeight/2);
  // Every frame is read from an isolated cell: adjacent views can never leak in.
  const cells=Array.from({length:8},(_,index)=>{
   const cell=document.createElement('canvas');cell.width=cw;cell.height=ch;const ctx=cell.getContext('2d',{willReadFrequently:true});ctx.drawImage(sheet,Math.round((index%4)*sheet.naturalWidth/4),Math.round(Math.floor(index/4)*sheet.naturalHeight/2),cw,ch,0,0,cw,ch);
   const pixels=ctx.getImageData(0,0,cw,ch).data;let left=cw,right=0,top=ch,bottom=0;
   for(let y=0;y<ch;y++)for(let x=0;x<cw;x++)if(pixels[(y*cw+x)*4+3]>48){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
   return {cell,left,right,top,bottom};
  });
  const scale=Math.min(240/Math.max(...cells.map(c=>c.right-c.left+1)),188/Math.max(...cells.map(c=>c.bottom-c.top+1)));
  layers=cells.map(({cell,left,right,top,bottom},index)=>{
   const canvas=document.createElement('canvas');canvas.width=520;canvas.height=440;canvas.style.cssText=`position:absolute;inset:0;width:260px;height:220px;opacity:${index?0:1}`;
   const ctx=canvas.getContext('2d');ctx.scale(2,2);ctx.drawImage(cell,130-(left+right+1)*scale/2,208-(bottom+1)*scale,cw*scale,ch*scale);viewport.append(canvas);return canvas;
  });
  if(artwork.matches(':hover'))start();
 };
 artwork.addEventListener('pointerenter',start);artwork.addEventListener('pointerleave',stop);reduce.addEventListener('change',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
});
