// Wilson Roland Garros Super Tour backpack — references supplied by Carol.
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const category=[...repository.querySelectorAll('[data-name="Gear category"]')].find(el=>el.querySelector('[data-name="Category heading"]')?.textContent.includes('Accessories'));
 if(!category)return;
 const card=category.querySelector('[data-name="Gear item"]').cloneNode(true);category.append(card);
 if(!card)return;
 card.classList.add('wilson-backpack-card','oysho-bag-card');card.dataset.gearStatus='current';card.dataset.addedOrder='4';
 card.querySelector('[data-name="Heading"] p').textContent='Wilson · Roland Garros Super Tour';
 const description=card.querySelector('[data-name="Paragraph"]>div');description.replaceChildren();
 ['Tennis backpack · WR8026101001','Cream, navy and clay-orange details, with Roland Garros branding, padded shoulder straps and a carry handle.'].forEach((text,index)=>{const p=document.createElement('p');p.textContent=text;p.style.lineHeight='24px';if(!index)p.style.marginBottom='16px';description.append(p);});
 card.querySelector('[data-name="Anchor"]').replaceChildren();
 const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');artwork.replaceChildren();artwork.classList.add('bag-artwork');
 const viewport=document.createElement('div');viewport.className='bag-view';viewport.setAttribute('role','img');viewport.setAttribute('aria-label','Cream, navy and clay-orange Wilson Roland Garros Super Tour backpack, rotating on hover');artwork.append(viewport);
 renderProductSprite(viewport,'assets/wilson-roland-garros-backpack-views.png',[[0, 0, 443, 443], [443, 0, 444, 443], [887, 0, 443, 443], [1330, 0, 444, 443], [0, 443, 443, 444], [443, 443, 444, 444], [887, 443, 443, 444], [1330, 443, 444, 444]]);
});
