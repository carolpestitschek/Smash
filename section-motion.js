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
   if(target.dataset.name==='Player profile'){
    const lines=[...target.querySelectorAll('[data-name="Display title"] p')];
    const line=lines.at(-1);if(!line)return;
    const text=line.textContent.trim();line.classList.add('about-scramble-line');line.setAttribute('aria-label',text);
    const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');
    const glyphs=[...text].map(character=>{const span=document.createElement('span');span.textContent=character;span.style.whiteSpace='pre';span.style.width=character===' '?'.35em':undefined;visual.append(span);return span;});
    line.replaceChildren(visual);
    // Stable per-character widths prevent the heading from jumping as glyphs resolve.
    glyphs.forEach(span=>{span.style.width=span.getBoundingClientRect().width+'px';span.style.display='inline-block';span.style.textAlign='center';});
    const symbols='*+01<>/#';let frame=0;
    const finish=()=>{glyphs.forEach((span,i)=>span.textContent=text[i]);};
    const timer=setInterval(()=>{
     if(reduce.matches||document.hidden){clearInterval(timer);finish();return;}
     glyphs.forEach((span,i)=>{span.textContent=text[i]===' '?' ':frame>5+i*2?text[i]:symbols[(frame+i*3)%symbols.length];});
     frame++;if(frame>5+text.length*2){clearInterval(timer);finish();}
    },45);
    return;
   }
   const recent=target.dataset.name==='Upcoming game list';
   const targets=recent?[target.querySelector('[data-name="Schedule heading"]'),...target.querySelectorAll('[data-name="Game entry"]')].filter(Boolean):[...target.children].filter(el=>getComputedStyle(el).position!=='absolute');
   targets.forEach((el,index)=>{
    const animation=el.animate([
     {opacity:0,transform:recent&&index>0?'translateY(20px)':'translateY(24px)'},
     {opacity:1,transform:'translateY(0)'}
    ],{duration:600,delay:Math.min(index,3)*(recent?180:80),easing:'cubic-bezier(0.23, 1, 0.32, 1)',fill:'backwards'});
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
