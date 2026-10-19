const footwearProducts=[
  {
    "name": "ASICS · GEL-DEDICATE 9 PADEL",
    "status": "archived",
    "added": 8,
    "subtitle": "White / silver · 1042A318-101",
    "description": "A streamlined padel shoe with TRUSSTIC stability technology and cushioning for comfortable court movement.",
    "image": "asics-gel-dedicate-9-views.png",
    "url": "https://www.asics.com/gb/en-gb/gel-dedicate-9-padel/p/1042A318-101.html"
  },
  {
    "name": "Adidas · Crazyquick Boost",
    "status": "archived",
    "added": 9,
    "subtitle": "White / silver / pink · JP9588",
    "description": "BOOST cushioning, a supportive Slingframe and an Adituff reinforced toe. Adiwear rubber provides durable court grip.",
    "image": "adidas-crazyquick-boost-views.png",
    "url": "https://www.padelonline.uk/adidas-ladies-crazyquick-boost-padel-shoes"
  },
  {
    "name": "HEAD · Motion Pro BOA",
    "status": "owned",
    "added": 10,
    "subtitle": "White / grey · Padel 2024",
    "description": "Dual BOA fit adjustment, DynaFoam cushioning and a MONDO-developed Motion Tread sole, with lateral support for padel.",
    "image": "head-motion-pro-boa-views.png"
  }
];
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const category=[...repository.querySelectorAll('[data-name="Gear category"]')].find(el=>el.querySelector('[data-name="Category heading"]')?.textContent.includes('Shoes'));
 if(!category)return;
 footwearProducts.forEach(product=>{
  const card=category.querySelector('[data-name="Gear item"]').cloneNode(true);category.append(card);card.className=category.querySelector('[data-name="Gear item"]').className;card.dataset.gearStatus=product.status;card.dataset.addedOrder=product.added;
  card.querySelector('[data-name="Heading"] p').textContent=product.name;
  const desc=card.querySelector('[data-name="Paragraph"]>div');desc.replaceChildren();[product.subtitle,product.description].forEach((text,index)=>{const p=document.createElement('p');p.textContent=text;p.style.lineHeight='24px';if(!index)p.style.marginBottom='16px';desc.append(p);});
  const anchor=card.querySelector('[data-name="Anchor"]');anchor.replaceChildren();if(product.url){const a=document.createElement('a');a.href=product.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='View product ↗';a.className='gear-product-link';anchor.append(a);}
  const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');artwork.replaceChildren();artwork.classList.add('bag-artwork');const viewport=document.createElement('div');viewport.className='bag-view';viewport.setAttribute('role','img');viewport.setAttribute('aria-label',product.name+', rotating on hover');artwork.append(viewport);
  renderProductSprite(viewport,'assets/'+product.image,[[0,0,400,450],[400,0,480,450],[880,0,470,450],[1350,0,424,450],[0,450,400,437],[400,450,480,437],[880,450,470,437],[1350,450,424,437]],{initial:2});
 });
});
