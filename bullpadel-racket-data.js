// Bullpadel Neuron 02 Edge — supplied photos; specs from the linked Sportega listing.
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const category=[...repository.querySelectorAll('[data-name="Gear category"]')].find(el=>el.querySelector('[data-name="Category heading"]')?.textContent.includes('Rackets'));
 if(!category)return;
 const card=[...category.querySelectorAll('[data-name="Gear item"]')].find(el=>el.querySelector('[data-name="Heading"]')?.textContent.includes('['));
 if(!card)return;
 card.classList.add('bullpadel-racket-card','oysho-bag-card');card.dataset.gearStatus='current';card.dataset.addedOrder='5';
 card.querySelector('[data-name="Heading"] p').textContent='Bullpadel · Neuron 02 Edge';
 const description=card.querySelector('[data-name="Paragraph"]>div');description.replaceChildren();
 ['370 g · X-Tend Carbon 3K · MultiEVA','An attacking racket for advanced play, with a diamond head and head-light balance. Black with orange details.'].forEach((text,index)=>{const p=document.createElement('p');p.textContent=text;p.style.lineHeight='24px';if(!index)p.style.marginBottom='16px';description.append(p);});
 const anchor=card.querySelector('[data-name="Anchor"]');const link=document.createElement('a');link.href='https://www.sportega.co.uk/bullpadel-neuron-02-edge-padel-racket/d1522172';link.target='_blank';link.rel='noopener noreferrer';link.className='gear-product-link';link.textContent='View racket ↗';anchor.replaceChildren(link);
 const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');artwork.replaceChildren();artwork.classList.add('bag-artwork');
 const viewport=document.createElement('div');viewport.className='bag-view';viewport.setAttribute('role','img');viewport.setAttribute('aria-label','Black and orange Bullpadel Neuron 02 racket, rotating on hover');artwork.append(viewport);
 const sheet=new Image();sheet.src='assets/bullpadel-neuron-transparent-views.png';
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
   // The butt cap, rather than the head silhouette, defines the vertical rotation axis.
   let gripLeft=cw,gripRight=0;
   const gripTop=Math.max(top,bottom-Math.round((bottom-top)*.035));
   for(let y=gripTop;y<=bottom;y++)for(let x=0;x<cw;x++)if(pixels[(y*cw+x)*4+3]>128){gripLeft=Math.min(gripLeft,x);gripRight=Math.max(gripRight,x);}
   const pivotX=gripLeft<=gripRight?(gripLeft+gripRight+1)/2:(left+right+1)/2;
   return {cell,left,right,top,bottom,pivotX};
  });
  const scale=Math.min(240/Math.max(...cells.map(c=>c.right-c.left+1)),188/Math.max(...cells.map(c=>c.bottom-c.top+1)));
  layers=cells.map(({cell,left,right,top,bottom,pivotX},index)=>{
   const canvas=document.createElement('canvas');canvas.width=520;canvas.height=440;canvas.style.cssText=`position:absolute;inset:0;width:260px;height:220px;opacity:${index?0:1}`;
   canvas.dataset.pivot='130,208';const ctx=canvas.getContext('2d');ctx.scale(2,2);ctx.drawImage(cell,130-pivotX*scale,208-(bottom+1)*scale,cw*scale,ch*scale);viewport.append(canvas);return canvas;
  });
  if(artwork.matches(':hover'))start();
 };
 artwork.addEventListener('pointerenter',start);artwork.addEventListener('pointerleave',stop);reduce.addEventListener('change',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
});
