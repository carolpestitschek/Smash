document.querySelectorAll('[data-name="Page links"]').forEach(nav=>{
 [['gallery.html','Gallery'],['wish-list.html','Wish List']].forEach(([href,title])=>{const link=document.createElement('a');link.href=href;link.textContent=title;link.className=nav.querySelector('a')?.className||'';link.style.color='#dadada';nav.insertBefore(link,nav.querySelector('[data-name="Action"]'));});
});

// Keep home-page deep links working when opened on a different screen size.
if(document.querySelector('.desktop-view') && document.querySelector('.mobile-view')){
 const mobile=matchMedia('(max-width:767px)');
 const syncSection=()=>{
  const section=location.hash.match(/^#(?:desktop|mobile)-(home|games|tournaments|gear|clubs|connect)$/)?.[1];
  if(!section)return;
  const id=(mobile.matches?'mobile-':'desktop-')+section;
  const target=document.getElementById(id);
  if(target&&location.hash!=='#'+id){
   history.replaceState(history.state,'','#'+id);
   target.scrollIntoView();
  }
 };
 syncSection();
 addEventListener('hashchange',syncSection);
 mobile.addEventListener('change',syncSection);
}
