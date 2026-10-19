// User-approved Déité Peach views and verified product details.
document.querySelectorAll('[data-name="Equipment repository"]').forEach(repository=>{
 const shoes=[...repository.querySelectorAll('[data-name="Gear category"]')].find(category=>category.querySelector('[data-name="Category heading"]')?.textContent.includes('Shoes'));
 if(!shoes)return;
 const card=shoes.querySelector('[data-name="Gear item"]');card.classList.add('oysho-bag-card','deite-shoe-card');
 const artwork=card.querySelector('[data-name="Illustrative product placeholder"]');
 artwork.replaceChildren();artwork.classList.add('bag-artwork');
 const viewport=document.createElement('div');viewport.className='bag-view';
 const image=document.createElement('img');image.src='assets/deite-peach-right-facing-views.png';image.alt='Déité Peach padel shoe in cream, peach and yellow';image.className='bag-render';
 viewport.appendChild(image);artwork.appendChild(viewport);
 viewport.setAttribute('role','img');viewport.setAttribute('aria-label',image.alt);image.remove();
 renderProductSprite(viewport,'assets/deite-peach-right-facing-views.png',[[0,0,310,460],[310,0,490,460],[800,0,560,460],[1360,0,414,460],[0,475,310,412],[310,475,480,412],[790,475,560,412],[1350,475,424,412]],{initial:2});

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
