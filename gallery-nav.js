// Add page links only to the homepage footer; the top header is static HTML.
document.querySelectorAll('[data-name="Footer"] [data-name="Page links"]').forEach(nav=>{
 [['gallery.html','Gallery'],['wish-list.html','Wish List']].forEach(([href,title])=>{if(nav.querySelector(`a[href="${href}"]`))return;const link=document.createElement('a');link.href=href;link.textContent=title;link.className=nav.querySelector('a')?.className||'';nav.append(link);});
});
(()=>{
 const mobile=matchMedia('(max-width:767px)');
 const homepage=!!document.querySelector('.desktop-view');
 const sectionId=hash=>hash.match(/^#(?:(?:desktop|mobile)-)?(home|games|tournaments|gear|clubs|connect)$/)?.[1];
 const jump=()=>{if(!homepage)return;const section=sectionId(location.hash);if(!section)return;const target=document.getElementById(`${mobile.matches?'mobile':'desktop'}-${section}`);if(!target)return;history.replaceState(history.state,'',section==='home'?'./':'#'+section);if(section==='home')window.scrollTo({top:0,behavior:'instant'});else target.scrollIntoView({behavior:'instant'});};
 document.addEventListener('click',event=>{const a=event.target.closest('a');if(!a||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const url=new URL(a.href,location.href),section=sectionId(url.hash);if(!section||url.origin!==location.origin)return;if(!homepage){url.hash=section;a.href=url.href;return;}if(url.pathname!==location.pathname&&url.pathname!==location.pathname.replace(/index\.html$/,''))return;const target=document.getElementById(`${mobile.matches?'mobile':'desktop'}-${section}`);if(!target)return;event.preventDefault();history.pushState(null,'',section==='home'?'./':'#'+section);const behavior=matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth';if(section==='home')window.scrollTo({top:0,behavior});else target.scrollIntoView({behavior});});
 jump();addEventListener('hashchange',jump);addEventListener('popstate',jump);mobile.addEventListener('change',jump);
})();
