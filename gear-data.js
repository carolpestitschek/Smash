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
 image.remove();renderProductSprite(viewport,'assets/oysho-brown-bag-views.png',[[0, 0, 520, 440], [530, 0, 460, 440], [1020, 0, 260, 440], [1300, 0, 474, 440], [0, 447, 520, 440], [530, 447, 460, 440], [1020, 447, 260, 440], [1300, 447, 474, 440]]);
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
