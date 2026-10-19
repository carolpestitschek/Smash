// Adidas Metalbone 3.2 2023 — product reference from Favorita Padel.
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const category=[...repository.querySelectorAll('[data-name="Gear category"]')].find(el=>el.querySelector('[data-name="Category heading"]')?.textContent.includes('Rackets'));
 if(!category)return;
 const card=category.querySelector('[data-name="Gear item"]').cloneNode(true);category.append(card);
 if(!card)return;
 card.classList.add('metalbone-racket-card','oysho-bag-card');card.dataset.gearStatus='owned';card.dataset.addedOrder='11';
 card.querySelector('[data-name="Heading"] p').textContent='Adidas · Metalbone 3.2';
 const description=card.querySelector('[data-name="Paragraph"]>div');description.replaceChildren();
 ['2023 · Ale Galán · Diamond shape','Aluminised carbon with an EVA Soft Performance core. Octagonal Structure, Spin Blade texture and an adjustable Weight & Balance System.'].forEach((text,index)=>{const p=document.createElement('p');p.textContent=text;p.style.lineHeight='24px';if(!index)p.style.marginBottom='16px';description.append(p);});
 const anchor=card.querySelector('[data-name="Anchor"]');const link=document.createElement('a');link.href='https://www.favoritapadel.com.br/raquete-de-padel-adidas-metalbone-32-2023-ale-galan';link.target='_blank';link.rel='noopener noreferrer';link.className='gear-product-link';link.textContent='View racket ↗';anchor.replaceChildren(link);
 const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');artwork.replaceChildren();artwork.classList.add('bag-artwork');
 const viewport=document.createElement('div');viewport.className='bag-view';viewport.setAttribute('role','img');viewport.setAttribute('aria-label','Black, red and white Adidas Metalbone 3.2 racket, rotating on hover');artwork.append(viewport);
 renderProductSprite(viewport,'assets/adidas-metalbone-32-views.png',[[0,0,443,443],[443,0,444,443],[887,0,443,443],[1330,0,444,443],[0,443,443,444],[443,443,444,444],[887,443,443,444],[1330,443,444,444]],{anchor:'white-grip'});
});
