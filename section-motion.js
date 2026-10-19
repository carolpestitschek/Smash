// Reveal content once, leaving full-width section backgrounds stationary.
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const running=new Set();
 const stop=()=>{running.forEach(a=>a.cancel());running.clear();};
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{
   if(!isIntersecting)return;
   observer.unobserve(target);
   if(reduce.matches)return;
   [...target.children].filter(el=>getComputedStyle(el).position!=='absolute').forEach((el,index)=>{
    const animation=el.animate([
     {opacity:0,transform:'translateY(24px)'},
     {opacity:1,transform:'translateY(0)'}
    ],{duration:600,delay:Math.min(index,3)*80,easing:'cubic-bezier(0.23, 1, 0.32, 1)',fill:'backwards'});
    running.add(animation);animation.onfinish=()=>running.delete(animation);
   });
  });
 },{threshold:0,rootMargin:'0px 0px -64px 0px'});
 document.querySelectorAll('main > div > [data-name]').forEach(section=>{
  if(['Navigation','Hero','Footer'].includes(section.dataset.name))return;
  const bounds=section.getBoundingClientRect();
  if(bounds.height&&bounds.bottom>0)observer.observe(section);
 });
 reduce.addEventListener('change',()=>{if(reduce.matches)stop();});
 document.addEventListener('keydown',stop,{capture:true});
 document.addEventListener('focusin',stop);
 window.addEventListener('hashchange',stop);
})();
