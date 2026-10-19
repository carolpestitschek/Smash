document.querySelectorAll('[data-name="Page links"]').forEach(nav=>{
 [['gallery.html','Gallery'],['wish-list.html','Wish List']].forEach(([href,title])=>{const link=document.createElement('a');link.href=href;link.textContent=title;link.className=nav.querySelector('a')?.className||'';link.style.color='#dadada';nav.insertBefore(link,nav.querySelector('[data-name="Action"]'));});
});
