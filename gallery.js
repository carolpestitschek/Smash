const grid=document.querySelector('#gallery-grid');
const photos=window.galleryPhotos||[];
const viewer=document.querySelector('#photo-viewer');
const safeLink=value=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}};
photos.forEach(photo=>{
 const figure=document.createElement('figure');figure.className='gallery-photo';
 const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Enlarge '+(photo.caption||photo.alt||'photo'));
 const image=document.createElement('img');image.src=photo.src;image.alt=photo.alt||'';image.loading='lazy';image.decoding='async';button.append(image);figure.append(button);
 const caption=document.createElement('figcaption');const text=document.createElement('span');text.textContent=photo.caption||'';caption.append(text);
 if(photo.photographer){const url=safeLink(photo.photographerUrl);const credit=document.createElement(url?'a':'span');credit.className='photographer-credit';credit.textContent=(photo.photographer.startsWith('@')?photo.photographer:'@'+photo.photographer);if(url){credit.href=url;credit.target='_blank';credit.rel='noopener noreferrer';}credit.setAttribute('aria-label','Photo by '+photo.photographer);caption.append(credit);}
 figure.append(caption);grid.append(figure);
 button.addEventListener('click',()=>{const full=document.querySelector('#viewer-image');full.src=photo.src;full.alt=photo.alt||'';document.querySelector('#viewer-caption').textContent=[photo.caption,photo.photographer?'Photo by '+photo.photographer:''].filter(Boolean).join(' · ');viewer.showModal();});
});
document.querySelector('#gallery-empty').hidden=photos.length>0;
document.querySelector('#gallery-count').textContent=photos.length?`${photos.length} ${photos.length===1?'MOMENT':'MOMENTS'} / ON & OFF COURT`:'MORE MOMENTS TO COME';
document.querySelector('#close-photo').addEventListener('click',()=>viewer.close());
if(matchMedia('(max-width:767px)').matches)document.querySelectorAll('a[href*="#desktop-"]').forEach(a=>a.href=a.getAttribute('href').replace('#desktop-','#mobile-'));
