// Touch screens get occasional motion only while visible and idle.
(() => {
 const touch=matchMedia('(hover: none), (pointer: coarse)'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const visible=new Set(),registered=new WeakSet(),animations=new Set();let timer,index=0;
 const allowed=()=>touch.matches&&!reduce.matches&&!document.hidden;
 const stop=()=>{animations.forEach(a=>a.cancel());animations.clear();};
 const track=animation=>{animations.add(animation);animation.onfinish=()=>animations.delete(animation);};
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)visible.add(e.target);else{visible.delete(e.target);e.target.getAnimations().forEach(a=>a.cancel());e.target.querySelectorAll('canvas').forEach(c=>c.getAnimations().forEach(a=>a.cancel()));}}),{threshold:.65});
 function register(){document.querySelectorAll('.bag-view,.wish-product-view,.diagonal-action-arrow,.plain-tournament-arrow,.gear-group-heading>span,[data-name="Tournament banner"]>p,[data-name="Hero"] [data-name="Padel ball"] img,.footer-sticker img').forEach(el=>{if(registered.has(el))return;registered.add(el);observer.observe(el);});}
 function pulse(){
  if(!allowed())return;
  const elements=[...visible].filter(el=>el.getClientRects().length&&!el.closest('[hidden],.is-dragging'));
  const products=elements.filter(el=>el.matches('.bag-view,.wish-product-view')&&el.querySelectorAll('canvas').length);
  if(products.length){const product=products[index++%products.length],layers=[...product.querySelectorAll('canvas')],initial=Math.max(0,layers.findIndex(c=>Number(c.style.opacity)===1));
   layers.forEach((layer,i)=>{const keys=Array.from({length:layers.length+1},(_,step)=>({offset:step/layers.length,opacity:(step+initial)%layers.length===i?1:0,easing:'steps(1,end)'}));track(layer.animate(keys,{duration:3200,iterations:1}));});
  }
  elements.filter(el=>el.matches('.diagonal-action-arrow,.plain-tournament-arrow')).forEach(el=>track(el.animate([{transform:'translate(0,0)'},{transform:'translate(3px,-3px)',offset:.5},{transform:'translate(0,0)'}],{duration:600,easing:'cubic-bezier(.77,0,.175,1)'})));
  const playful=elements.filter(el=>el.matches('.gear-group-heading>span,[data-name="Tournament banner"]>p,[data-name="Hero"] [data-name="Padel ball"] img,.footer-sticker img'));
  if(playful.length){const el=playful[index%playful.length],base=getComputedStyle(el).transform;track(el.animate([{transform:base==='none'?'rotate(0deg)':base},{transform:(base==='none'?'':base)+' rotate(10deg)',offset:.5},{transform:base==='none'?'rotate(0deg)':base}],{duration:700,easing:'cubic-bezier(.77,0,.175,1)'}));}
  timer=setTimeout(pulse,9000);
 }
 function settle(){clearTimeout(timer);stop();if(allowed())timer=setTimeout(pulse,1600);}
 ['scroll','pointerdown','pointermove','keydown'].forEach(event=>window.addEventListener(event,settle,{passive:true}));
 document.addEventListener('visibilitychange',settle);touch.addEventListener('change',settle);reduce.addEventListener('change',settle);
 new MutationObserver(register).observe(document.body,{childList:true,subtree:true});register();settle();
})();
