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
 renderProductSprite(viewport,'assets/on-roger-pro-2-views.png',[[0,0,400,450],[400,0,480,450],[880,0,470,450],[1350,0,424,450],[0,450,400,437],[400,450,480,437],[880,450,470,437],[1350,450,424,437]],{initial:2});
});
