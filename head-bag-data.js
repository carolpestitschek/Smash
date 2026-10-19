// HEAD Pro Padel Bag L — product photo and description supplied by Carol.
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const category=[...repository.querySelectorAll('[data-name="Gear category"]')].find(el=>el.querySelector('[data-name="Category heading"]')?.textContent.includes('Accessories'));
 if(!category)return;
 const card=[...category.querySelectorAll('[data-name="Gear item"]')].find(el=>el.querySelector('[data-name="Heading"]')?.textContent.includes('['));
 if(!card)return;
 card.classList.add('head-bag-card','oysho-bag-card');card.dataset.gearStatus='current';card.dataset.addedOrder='3';
 card.querySelector('[data-name="Heading"] p').textContent='HEAD · Pro Padel Bag L';
 const description=card.querySelector('[data-name="Paragraph"]>div');description.replaceChildren();
 ['Navy · Large padel bag','A sleeker shape in navy, designed to carry your padel racquets in style.'].forEach((text,index)=>{const p=document.createElement('p');p.textContent=text;p.style.lineHeight='24px';if(!index)p.style.marginBottom='16px';description.append(p);});
 card.querySelector('[data-name="Anchor"]').replaceChildren();
 const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');artwork.replaceChildren();artwork.classList.add('bag-artwork');
 const viewport=document.createElement('div');viewport.className='bag-view';viewport.setAttribute('role','img');viewport.setAttribute('aria-label','Navy HEAD Pro Padel Bag L, rotating on hover');artwork.append(viewport);
 renderProductSprite(viewport,'assets/head-pro-padel-bag-l-views.png',[[0, 0, 443, 443], [443, 0, 444, 443], [887, 0, 443, 443], [1330, 0, 444, 443], [0, 443, 443, 444], [443, 443, 444, 444], [887, 443, 443, 444], [1330, 443, 444, 444]]);
});
