// User-approved Déité Peach views and verified product details.
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const shoes=[...repository.querySelectorAll('[data-name="Gear category"]')].find(category=>category.querySelector('[data-name="Category heading"]')?.textContent.includes('Shoes'));
 if(!shoes)return;
 const card=shoes.querySelector('[data-name="Gear item"]');card.classList.add('oysho-bag-card','deite-shoe-card');
 const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');
 artwork.replaceChildren();artwork.classList.add('bag-artwork');
 const viewport=document.createElement('div');viewport.className='bag-view';
 const image=document.createElement('img');image.src='assets/deite-peach-views.png';image.alt='Déité Peach padel shoe in cream, peach and yellow';image.className='bag-render';
 viewport.appendChild(image);artwork.appendChild(viewport);
 // Eight-angle turntable from the user's supplied image, with no distortion.
 const frames=[[0,0,310,460],[310,0,490,460],[800,0,560,460],[1360,0,414,460],
               [0,475,310,412],[310,475,480,412],[790,475,480,412],[1270,475,504,412]];
 const visibleBounds=[[15,100,300,433],[15,100,490,443],[0,140,560,433],[0,110,414,440],
                      [20,20,280,340],[10,20,480,345],[0,55,480,290],[0,55,504,290]];
 viewport.setAttribute('role','img');viewport.setAttribute('aria-label',image.alt);
 // Per-view isolation polygons exclude neighbouring products inside uneven cells.
 // Coordinates refer to the original sheet, before centring and baseline offsets.
 const isolationPolygons=[
  [[55,85],[250,85],[290,195],[310,425],[275,452],[5,452],[0,345],[15,185]],
  [[575,85],[765,85],[805,165],[810,355],[770,415],[625,455],[320,455],[305,405],[310,315],[400,225],[500,150]],
  [[1030,110],[1150,140],[1290,130],[1345,190],[1365,415],[1310,460],[815,460],[800,415],[800,260],[860,230],[965,190]],
  [[1510,75],[1665,75],[1760,170],[1774,425],[1710,465],[1530,450],[1390,395],[1348,330],[1348,260],[1400,155]],
  [[80,485],[225,485],[280,620],[295,790],[245,825],[50,825],[15,770],[35,590]],
  [[440,490],[550,485],[660,540],[760,575],[795,690],[735,775],[455,825],[320,790],[320,700],[355,560]],
  [[910,535],[1190,535],[1270,575],[1270,695],[1210,760],[900,765],[805,715],[785,620],[830,560]],
  [[1400,535],[1695,535],[1765,575],[1774,690],[1700,755],[1400,765],[1280,715],[1265,630],[1300,575]]
 ];
 const layers=frames.map(([x,y,w,h],index)=>{
  const frame=document.createElement('div');frame.className='bag-angle';
  frame.style.width=(w*.45)+'px';frame.style.overflow='visible';frame.style.opacity=index===2?'1':'0';
  const img=document.createElement('img');img.src=image.src;img.alt='';img.draggable=false;
  const [left,top,right,bottom]=visibleBounds[index];
  const ground=208;
  const centerCorrection=(w-left-right)*.225;
  img.style.transform=`translate(${-x*.45+centerCorrection}px, ${-y*.45+ground-bottom*.45}px)`;
  // Clip the source cell before translating so adjacent rows never leak in.
  img.style.width='798.3px';img.style.height='399.15px';
  img.style.clipPath='polygon('+isolationPolygons[index].map(([px,py])=>`${px*.45}px ${py*.45}px`).join(',')+')';
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
   for(let i=0;i<=8;i++)keys.push({offset:i/8,opacity:(i+2)%8===index?1:0,easing:'steps(1,end)'});
   rotations.push(layer.animate(keys,{duration:2400,iterations:Infinity}));
  });
 };
 artwork.addEventListener('pointerenter',start);artwork.addEventListener('pointerleave',stop);
 reduce.addEventListener('change',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});

 card.querySelector('[data-name="Status"] p').textContent='CURRENT GEAR';
 card.querySelector('[data-name="Heading"] p').textContent='Déité · Peach';
 const paragraphs=card.querySelector('[data-name="Paragraph"]');
 const description=paragraphs.querySelector('div');
 description.replaceChildren();
 ['Peach · Cream & yellow','Padel-specific shoes with wrap-around soles for lateral stability, breathable mesh and multidirectional grip.'].forEach(text=>{const p=document.createElement('p');p.style.lineHeight='24px';p.textContent=text;description.appendChild(p);});
 description.firstChild.style.marginBottom='16px';
 const anchor=card.querySelector('[data-name="Anchor"]');const link=document.createElement('a');
 link.href='https://deite.co.uk/products/peach?variant=50952654881106';link.target='_blank';link.rel='noopener noreferrer';link.textContent='View on Déité ↗';link.className='gear-product-link';anchor.replaceChildren(link);
 const guidance=repository.querySelector('[data-name="Repository guidance"] p');
 if(guidance)guidance.textContent='CURRENT & PREVIOUS GEAR / BUILDING THE KIT NOTEBOOK';
});
