// User-supplied bag render, with product details verified on Oysho.
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const accessories=[...repository.querySelectorAll('[data-name="Gear category"]')].find(category=>category.querySelector('[data-name="Category heading"]')?.textContent.includes('Accessories'));
 if(!accessories)return;
 const card=accessories.querySelector('[data-name="Gear item"]');card.classList.add('oysho-bag-card');
 const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');
 artwork.replaceChildren();artwork.classList.add('bag-artwork');
 const viewport=document.createElement('div');viewport.className='bag-view';
 const image=document.createElement('img');image.src='assets/oysho-brown-bag-views.png';image.alt='Brown Oysho technical sport bag with carry handles, shoulder strap and front mesh pocket';image.className='bag-render';
 viewport.appendChild(image);artwork.appendChild(viewport);
 // Eight-angle turntable from the user's supplied image, with no distortion.
 const frames=[[0,0,520,440],[530,0,460,440],[1020,0,260,440],[1300,0,474,440],
               [0,447,520,440],[530,447,460,440],[1020,447,260,440],[1300,447,474,440]];
 // Visible alpha bounds, not sheet-cell edges, define the fixed ground line.
 const visibleBounds=[[44,68,498,410],[17,63,435,443],[20,64,242,430],[27,74,430,437],[45,21,497,361],[14,19,446,377],[13,18,246,385],[40,15,438,399]];
 const layers=frames.map(([x,y,w,h],index)=>{
  const frame=document.createElement('div');frame.className='bag-angle';
  frame.style.width=(w*.5)+'px';frame.style.opacity=index?'0':'1';
  const img=document.createElement('img');img.src=image.src;img.alt='';img.draggable=false;
  const [left,top,right,bottom]=visibleBounds[index];
  const ground=208;
  const centerCorrection=(w-left-right)*.25;
  img.style.transform=`translate(${-x*.5+centerCorrection}px, ${-y*.5+ground-bottom*.5}px)`;
  // Clip the source cell before translating so adjacent rows never leak in.
  img.style.clipPath=`inset(${y*.5}px ${(1774-x-w)*.5}px ${(887-y-h)*.5}px ${x*.5}px)`;
  frame.appendChild(img);viewport.appendChild(frame);return frame;
 });
 image.remove();
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 let rotations=[];
 const stop=()=>{rotations.forEach(a=>a.cancel());rotations=[];};
 const start=()=>{
  if(reduce.matches||!fine.matches||rotations.length)return;
  layers.forEach((layer,index)=>{
   const keys=[];
   for(let i=0;i<=8;i++)keys.push({offset:i/8,opacity:i%8===index?1:0,easing:'steps(1,end)'});
   rotations.push(layer.animate(keys,{duration:2400,iterations:Infinity}));
  });
 };
 artwork.addEventListener('pointerenter',start);artwork.addEventListener('pointerleave',stop);
 reduce.addEventListener('change',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});

 card.querySelector('[data-name="Status"] p').textContent='CURRENT GEAR';
 card.querySelector('[data-name="Heading"] p').textContent='Oysho · Technical sport bag';
 const paragraphs=card.querySelector('[data-name="Paragraph"]');
 const description=paragraphs.querySelector('div');
 description.replaceChildren();
 ['Brown · 33L · 30 × 50 × 22 cm','Carry handles, an adjustable removable shoulder strap and mesh pockets. A separate ventilated compartment keeps shoes or worn kit apart.'].forEach(text=>{const p=document.createElement('p');p.style.lineHeight='24px';p.textContent=text;description.appendChild(p);});
 description.firstChild.style.marginBottom='16px';
 const anchor=card.querySelector('[data-name="Anchor"]');const link=document.createElement('a');
 link.href='https://www.oysho.com/gb/technical-sport-bag-l14111780?pelement=223474513&colorId=100';link.target='_blank';link.rel='noopener noreferrer';link.textContent='View on Oysho ↗';link.className='gear-product-link';anchor.replaceChildren(link);
 const guidance=repository.querySelector('[data-name="Repository guidance"] p');
 if(guidance)guidance.textContent='CURRENT & PREVIOUS GEAR / BUILDING THE KIT NOTEBOOK';
});
