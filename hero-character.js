// A one-time symbol reveal and a quiet, synchronized mascot blink.
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('[data-name="Hero"]').forEach(hero=>{
  const targets=[...hero.querySelectorAll('[data-name="Display title"] p')];
  const paragraph=targets.find(p=>/happens/i.test(p.textContent));
  const word=paragraph?.querySelector('span')||paragraph;
  if(word){
   let played=false,timer;
   const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting||played||!word.getClientRects().length)return;
    document.fonts.ready.then(()=>{
     if(played||!word.getClientRects().length)return;played=true;observer.disconnect();
     const text=word.textContent.trim();if(reduce.matches)return;
     word.setAttribute('aria-label',text);const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');
     const glyphs=[...text].map(char=>{const span=document.createElement('span');span.textContent=char;span.style.whiteSpace='pre';visual.append(span);return span;});word.replaceChildren(visual);
     glyphs.forEach(span=>{span.style.width=span.getBoundingClientRect().width+'px';span.style.display='inline-block';span.style.textAlign='center';});
     let frame=0;const symbols='*+01<>/#';const finish=()=>{clearInterval(timer);glyphs.forEach((span,i)=>span.textContent=text[i]);};
     timer=setInterval(()=>{if(reduce.matches||document.hidden){finish();return;}glyphs.forEach((span,i)=>span.textContent=/[a-z]/i.test(text[i])&&frame<7+i*2?symbols[(frame+i*3)%symbols.length]:text[i]);if(++frame>7+text.length*2)finish();},45);
     reduce.addEventListener('change',()=>{if(reduce.matches)finish();});
    });
   },{threshold:.5});observer.observe(word);
  }
  const image=hero.querySelector('[data-name="Padel ball"] img');if(!image)return;
  fetch(image.src).then(r=>{if(!r.ok)throw Error('Ball unavailable');return r.text();}).then(text=>{
   const svg=document.importNode(new DOMParser().parseFromString(text,'image/svg+xml').documentElement,true);
   svg.setAttribute('class',image.className+' hero-mascot');svg.setAttribute('aria-hidden','true');svg.style.cssText=image.style.cssText;
   image.replaceWith(svg);const paths=svg.querySelectorAll('path'),eyes=[paths[2],paths[3]],animations=[];
   eyes[0].setAttribute('d','M44 42L44 48L44 54');eyes[0].setAttribute('stroke-width','6');
   eyes.forEach((eye,index)=>{
    eye.style.transformBox='fill-box';eye.style.transformOrigin='center';
    const open={d:'path("M44 42L44 48L44 54")',strokeWidth:'6px'};
    const wink={d:'path("M40 46L49 50L40 54")',strokeWidth:'3px'};
    const frames=index?[
     {transform:'scale(1,1)',offset:0},{transform:'scale(1,1)',offset:.72},
     {transform:'scale(1.02,.95)',offset:.755},{transform:'scale(1.02,.95)',offset:.79},
     {transform:'scale(1,1)',offset:.84},{transform:'scale(1,1)',offset:1}
    ]:[{...open,offset:0},{...open,offset:.72},{...wink,offset:.755},{...wink,offset:.79},{...open,offset:.84},{...open,offset:1}];
    animations.push(eye.animate(frames,{duration:5200,iterations:Infinity,easing:'cubic-bezier(.23,1,.32,1)'}));
   });
   let visible=false;const sync=()=>animations.forEach(a=>{if(reduce.matches){a.pause();a.currentTime=0;}else if(visible&&!document.hidden)a.play();else a.pause();});
   new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.3}).observe(svg);
   document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);sync();
  }).catch(()=>{});
 });
})();

// The mascot dodges the pointer on desktop, then springs back to its anchor.
(() => {
 const fine=matchMedia('(hover: hover) and (pointer: fine)'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('[data-name="Hero"] [data-name="Padel ball"]').forEach(ball=>{
  let current={x:0,y:0},velocity={x:0,y:0},target={x:0,y:0},raf=0,last=0,inside=false,lastParticle=0;
  const particles=new Set();
  const trail=time=>{
   const speed=Math.hypot(velocity.x,velocity.y);if(reduce.matches||speed<18||time-lastParticle<45||particles.size>=18)return;lastParticle=time;
   const size=3+Math.random()*3,pixel=document.createElement('span');pixel.className='hero-ball-pixel';pixel.setAttribute('aria-hidden','true');
   const dx=velocity.x/speed,dy=velocity.y/speed;
   pixel.style.cssText=`position:absolute;pointer-events:none;width:${size}px;height:${size}px;background:#c0fb30;left:${ball.offsetLeft+ball.offsetWidth/2+current.x-dx*ball.offsetWidth*.55+(Math.random()-.5)*18}px;top:${ball.offsetTop+ball.offsetHeight/2+current.y-dy*ball.offsetHeight*.55+(Math.random()-.5)*18}px;z-index:1`;
   ball.parentElement.append(pixel);particles.add(pixel);
   const animation=pixel.animate([{opacity:.65,transform:'translate(0,0) scale(1)'},{opacity:0,transform:`translate(${-dx*22+(Math.random()-.5)*16}px,${-dy*22+(Math.random()-.5)*16}px) scale(.25)`}],{duration:600,easing:'cubic-bezier(.23,1,.32,1)'});
   animation.onfinish=()=>{pixel.remove();particles.delete(pixel);};
  };
  const frame=time=>{
   const dt=Math.min((time-(last||time))/1000,.032);last=time;
   for(const axis of ['x','y']){velocity[axis]+=(100*(target[axis]-current[axis])-10*velocity[axis])*dt;current[axis]+=velocity[axis]*dt;}
   ball.style.transform=`translate(${current.x}px,${current.y}px)`;trail(time);
   if(Math.hypot(current.x-target.x,current.y-target.y,velocity.x,velocity.y)<.15){current={...target};velocity={x:0,y:0};ball.style.transform=`translate(${target.x}px,${target.y}px)`;raf=0;last=0;return;}
   raf=requestAnimationFrame(frame);
  };
  const move=event=>{
   if(!fine.matches||reduce.matches)return;
   const rect=ball.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
   let dx=cx-event.clientX,dy=cy-event.clientY,length=Math.hypot(dx,dy);
   if(length<8){dx=event.clientX<cx?1:-1;dy=-.6;length=Math.hypot(dx,dy);}
   target={x:dx/length*46,y:dy/length*36};inside=true;if(!raf)raf=requestAnimationFrame(frame);
  };
  const reset=()=>{inside=false;target={x:0,y:0};if(!raf)raf=requestAnimationFrame(frame);};
  // A stationary hit area prevents pointerenter/leave chatter as the artwork dodges.
  const area=document.createElement('div');area.className='hero-ball-hit-area';area.style.cssText=`position:absolute;left:${ball.offsetLeft-30}px;top:${ball.offsetTop-30}px;width:${ball.offsetWidth+60}px;height:${ball.offsetHeight+60}px;z-index:2;`;
  ball.parentElement.append(area);area.addEventListener('pointerenter',move);area.addEventListener('pointermove',move);area.addEventListener('pointerleave',reset);
  const sync=()=>{particles.forEach(p=>p.remove());particles.clear();cancelAnimationFrame(raf);raf=0;last=0;target=current={x:0,y:0};velocity={x:0,y:0};ball.style.transform='';area.style.pointerEvents=fine.matches&&!reduce.matches?'auto':'none';};
  fine.addEventListener('change',sync);reduce.addEventListener('change',sync);document.addEventListener('visibilitychange',()=>{if(document.hidden)sync();});
  new ResizeObserver(()=>{area.style.left=ball.offsetLeft-30+'px';area.style.top=ball.offsetTop-30+'px';area.style.width=ball.offsetWidth+60+'px';area.style.height=ball.offsetHeight+60+'px';}).observe(ball);sync();
 });
})();
