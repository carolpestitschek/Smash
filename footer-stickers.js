const paperFilter=document.createElement('div');paperFilter.setAttribute('aria-hidden','true');paperFilter.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';paperFilter.innerHTML="<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><filter id=\"footer-paper\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" color-interpolation-filters=\"sRGB\"><feImage href=\"assets/footer-paper-soft-texture.png\" preserveAspectRatio=\"none\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" result=\"paper\"/><feComponentTransfer in=\"paper\" result=\"creased\"><feFuncR type=\"linear\" slope=\"1\" intercept=\"0\"/><feFuncG type=\"linear\" slope=\"1\" intercept=\"0\"/><feFuncB type=\"linear\" slope=\"1\" intercept=\"0\"/></feComponentTransfer><feComposite in=\"creased\" in2=\"SourceGraphic\" operator=\"in\" result=\"texture\"/><feBlend in=\"SourceGraphic\" in2=\"texture\" mode=\"multiply\"/></filter></svg>\n";document.body.append(paperFilter);
// A lightweight sticker board with mouse, touch and keyboard dragging.
const stickerReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const stickerSet=[
 ['carol-padel-globe','Carol Padel globe — Play Connect Repeat',.05,.2,155,-9],
 ['racket-lime','Lime padel racket',.75,.05,145,10],
 ['cp-orbit','CP orbit',.34,.05,155,-7],
 ['play-padel-repeat-white','Play padel repeat',.2,.65,145,7],
 ['smiley','Smiley face',.57,.66,120,-10],
 ['padel-lifestyle','Padel is a lifestyle',.81,.7,175,8],
 ['sparkle','Lime sparkle',.52,.12,85,12]
];
document.querySelectorAll('[data-name="Footer"]').forEach(footer=>{
 const board=document.createElement('div');board.className='footer-sticker-board';board.setAttribute('aria-label','Rearrange the padel stickers');
 const tools=document.createElement('div');tools.className='sticker-board-tools';
 const hint=document.createElement('p');hint.textContent='GRAB A STICKER. MAKE IT YOURS.';
 const help=document.createElement('span');help.textContent='Drag to move · Arrow keys when focused';
 const reset=document.createElement('button');reset.type='button';reset.textContent='Reset ↺';
 tools.append(hint,help,reset);
 const colophon=footer.querySelector('[data-name="Colophon"]');footer.insertBefore(board,colophon);footer.insertBefore(tools,colophon);
 let topLayer=1;const pieces=[];
 stickerSet.forEach(([asset,label,initialX,initialY,width,angle])=>{
  const button=document.createElement('button');button.type='button';button.className='footer-sticker';button.setAttribute('aria-label',label+' sticker. Drag or use arrow keys to move.');
  button.style.width=`clamp(70px, ${width/13.12}vw, ${width}px)`;
  const img=document.createElement('img');img.src=`assets/stickers/${asset}.svg`;img.alt='';img.draggable=false;img.style.transform=`rotate(${angle}deg)`;button.appendChild(img);board.appendChild(button);
  const state={x:initialX,y:initialY};let drag=null;
  function render(){const maxX=Math.max(0,board.clientWidth-button.offsetWidth);const maxY=Math.max(0,board.clientHeight-button.offsetHeight);button.style.transform=`translate(${state.x*maxX}px, ${state.y*maxY}px)`;}
  function drop(event){if(!drag)return;drag=null;button.classList.remove('is-dragging');img.style.transform=`rotate(${angle}deg)`;if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);}
  button.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();button.focus({preventScroll:true});const rect=button.getBoundingClientRect();drag={dx:event.clientX-rect.left,dy:event.clientY-rect.top};button.setPointerCapture(event.pointerId);button.style.zIndex=String(++topLayer);button.classList.add('is-dragging');img.style.transform=stickerReducedMotion.matches?`rotate(${angle}deg)`:`rotate(${angle-5}deg) scale(1.08)`;});
  button.addEventListener('pointermove',event=>{if(!drag)return;const rect=board.getBoundingClientRect();const maxX=Math.max(1,board.clientWidth-button.offsetWidth);const maxY=Math.max(1,board.clientHeight-button.offsetHeight);state.x=Math.max(0,Math.min(1,(event.clientX-rect.left-drag.dx)/maxX));state.y=Math.max(0,Math.min(1,(event.clientY-rect.top-drag.dy)/maxY));render();});
  button.addEventListener('pointerup',drop);button.addEventListener('pointercancel',drop);button.addEventListener('lostpointercapture',event=>{if(drag)drop(event);});
  button.addEventListener('keydown',event=>{const delta=event.shiftKey?.08:.02;const direction={ArrowLeft:[-delta,0],ArrowRight:[delta,0],ArrowUp:[0,-delta],ArrowDown:[0,delta]}[event.key];if(!direction)return;event.preventDefault();state.x=Math.max(0,Math.min(1,state.x+direction[0]));state.y=Math.max(0,Math.min(1,state.y+direction[1]));button.style.zIndex=String(++topLayer);render();});
  img.addEventListener('load',render);pieces.push({render,reset:()=>{state.x=initialX;state.y=initialY;render();}});render();
 });
 new ResizeObserver(()=>pieces.forEach(piece=>piece.render())).observe(board);
 reset.addEventListener('click',()=>pieces.forEach(piece=>piece.reset()));
});
