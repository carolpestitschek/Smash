// Separate editions stay separate products, with their own lifecycle status.
(()=>{
 const products=[
  {category:'Courtwear',name:'Nike · Court Naomi Osaka Skirt',status:'current',order:18,image:'nike-naomi-osaka-skirt-views.png',details:['Cream / forest green · Pleated tennis skirt','Cream pleats with a contrasting green waistband, Naomi Osaka details and lime-and-lilac rope ties.']},
  {category:'Courtwear',name:'Nike · Court Naomi Osaka Cropped Jersey',status:'collection',order:17,image:'nike-naomi-osaka-jersey-views.png',details:['Forest green / yellow · Cropped jersey','A loose, cropped silhouette with a V-neck, mesh panels and elbow-length sleeves. Yellow 97 graphics, Nike details and Naomi Osaka branding.']},
  {category:'Rackets',name:'HEAD · Extreme Motion Paula Josemaría',status:'owned',order:16,image:'head-extreme-paula-views.png',details:['Limited edition · Beige / grey · Diamond · 38 mm','Co-designed with Paula Josemaría. A 494 cm² head and 268 mm balance, with Auxetic, Power Foam, Extreme Spin and a Soft Butt Cap. Includes Pro Spin Strips.']},
  {category:'Courtwear',name:'Adidas · Lavender long-sleeve dress',status:'current',order:13,image:'adidas-lavender-dress-views.png',details:['Lavender / black / white · Long-sleeve tennis dress','Mesh sleeves, shoulder cut-outs and a pleated skirt.']},
  {category:'Rackets',name:'Babolat · Counter Viper 2025',status:'owned',order:14,image:'babolat-counter-viper-2025-views.png',details:['2025 · Green / black · Hybrid · 365 g ±10 g · 38 mm','Even balance and a rough surface for advanced players. 3K carbon, Vibrabsorb System with SMAC, Holes Pattern System and 3D Spin technology.']},
  {category:'Rackets',name:'Babolat · Counter Viper 2024',status:'owned',order:15,image:'babolat-counter-viper-2024-views.png',details:['2024 · Yellow / black · Hybrid','3K carbon construction with a triple-density EVA core, 3D Spin+ texture, Holes Pattern System, SMAC vibration absorption and a removable Smart Buttcap strap.']}
 ];
 document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
  const grid=repository.querySelector('[data-name="Gear categories"]');
  const racket=[...grid.children].find(el=>el.querySelector('[data-name="Category heading"]')?.textContent.includes('Rackets'));
  if(!racket)return;
  const template=racket.querySelector('[data-name="Gear item"]');
  products.forEach(product=>{
   let category=[...grid.children].find(el=>el.querySelector('[data-name="Category heading"] p')?.textContent.trim()===product.category);
   if(!category){category=racket.cloneNode(false);const heading=racket.querySelector('[data-name="Category heading"]').cloneNode(true);heading.querySelector('p').textContent=product.category;category.append(heading);grid.append(category);}
   const card=template.cloneNode(true);card.className=template.className;card.classList.add('oysho-bag-card','additional-gear-card');card.dataset.gearStatus=product.status;card.dataset.addedOrder=product.order;
   card.querySelector('[data-name="Heading"] p').textContent=product.name;
   const description=card.querySelector('[data-name="Paragraph"]>div');description.replaceChildren();
   product.details.forEach((text,i)=>{const p=document.createElement('p');p.textContent=text;p.style.lineHeight='24px';if(!i)p.style.marginBottom='16px';description.append(p);});
   card.querySelector('[data-name="Anchor"]').replaceChildren();
   const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');artwork.replaceChildren();artwork.classList.add('bag-artwork');
   const viewport=document.createElement('div');viewport.className='bag-view';viewport.setAttribute('role','img');viewport.setAttribute('aria-label',product.name);artwork.append(viewport);category.append(card);
   const src='assets/'+product.image;const image=new Image();image.src=src;
   image.decode().then(()=>{const w=image.naturalWidth,h=image.naturalHeight;const regions=Array.from({length:8},(_,i)=>{const x=Math.floor((i%4)*w/4),y=Math.floor(Math.floor(i/4)*h/2);return [x,y,Math.floor(((i%4)+1)*w/4)-x,Math.floor((Math.floor(i/4)+1)*h/2)-y];});return renderProductSprite(viewport,src,regions);}).catch(error=>console.error('Product artwork could not load',product.name,error));
  });
 });
})();
