// Isolate each connected product silhouette before displaying an atlas frame.
// Atlas cells may be uneven; no neighbouring fragments are ever displayed.
window.renderProductSprite=async function(viewport,src,regions,{initial=0,inspect=false,anchor='base'}={}){
 const image=new Image();image.src=src;await image.decode();
 const source=document.createElement('canvas');source.width=image.naturalWidth;source.height=image.naturalHeight;
 const ctx=source.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
 const W=source.width,H=source.height,pixels=ctx.getImageData(0,0,W,H),labels=new Int32Array(W*H),queue=new Int32Array(W*H),parts=[];
 let id=0;
 for(let seed=0;seed<labels.length;seed++){
  if(labels[seed]||pixels.data[seed*4+3]<192)continue;
  id++;let head=0,tail=1;queue[0]=seed;labels[seed]=id;let left=W,right=0,top=H,bottom=0;
  while(head<tail){const pos=queue[head++],x=pos%W,y=Math.floor(pos/W);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(const next of [x?pos-1:-1,x<W-1?pos+1:-1,y?pos-W:-1,y<H-1?pos+W:-1])if(next>=0&&!labels[next]&&pixels.data[next*4+3]>=192){labels[next]=id;queue[tail++]=next;}
  }
  if(tail>1000)parts.push({id,left,right,top,bottom,count:tail});
 }
 const used=new Set();
 const frames=regions.map(([rx,ry,rw,rh])=>{
  const scores=new Map();
  for(let y=ry;y<Math.min(H,ry+rh);y++)for(let x=rx;x<Math.min(W,rx+rw);x++){const n=labels[y*W+x];if(n&&!used.has(n))scores.set(n,(scores.get(n)||0)+1);}
  const part=parts.filter(p=>!used.has(p.id)).sort((a,b)=>(scores.get(b.id)||0)-(scores.get(a.id)||0))[0];
  if(!part)throw new Error('Missing product silhouette');used.add(part.id);
  const width=part.right-part.left+1,height=part.bottom-part.top+1;
  const cell=document.createElement('canvas');cell.width=width;cell.height=height;
  const out=cell.getContext('2d').createImageData(width,height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const gx=part.left+x,gy=part.top+y,pos=gy*W+gx;
   // One-pixel antialias fringe is retained only beside this product.
   if(labels[pos]!==part.id&&!((gx&&labels[pos-1]===part.id)||(gx<W-1&&labels[pos+1]===part.id)||(gy&&labels[pos-W]===part.id)||(gy<H-1&&labels[pos+W]===part.id)))continue;
   out.data.set(pixels.data.subarray(pos*4,pos*4+4),(y*width+x)*4);
  }
  cell.getContext('2d').putImageData(out,0,0);return cell;
 });
 const scale=Math.min(240/Math.max(...frames.map(f=>f.width)),188/Math.max(...frames.map(f=>f.height)));
 viewport.replaceChildren();
 const layers=frames.map((frame,index)=>{const canvas=document.createElement('canvas');canvas.width=520;canvas.height=440;canvas.className='isolated-product-frame';canvas.dataset.frame=index;
  canvas.style.cssText=inspect?'width:260px;height:220px;':`position:absolute;inset:0;width:260px;height:220px;opacity:${index===initial?1:0}`;
  const context=canvas.getContext('2d');context.scale(2,2);let pivotX=frame.width/2;
  if(anchor==='white-grip'){
   const data=frame.getContext('2d').getImageData(0,0,frame.width,frame.height).data;let left=frame.width,right=0;
   for(let y=Math.floor(frame.height*.94);y<frame.height;y++)for(let x=0;x<frame.width;x++){const i=(y*frame.width+x)*4;if(data[i+3]>192&&data[i]>150&&data[i+1]>150&&data[i+2]>150){left=Math.min(left,x);right=Math.max(right,x);}}
   if(left<=right)pivotX=(left+right+1)/2;
  }
  context.drawImage(frame,130-pivotX*scale,208-frame.height*scale,frame.width*scale,frame.height*scale);viewport.append(canvas);return canvas;});
 if(inspect)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');let animations=[];
 const stop=()=>{animations.forEach(a=>a.cancel());animations=[];};
 const start=()=>{if(reduce.matches||!fine.matches||animations.length)return;layers.forEach((layer,index)=>{const keys=[];for(let i=0;i<=8;i++)keys.push({offset:i/8,opacity:(i+initial)%8===index?1:0,easing:'steps(1,end)'});animations.push(layer.animate(keys,{duration:2400,iterations:Infinity}));});};
 const target=viewport.parentElement;target.addEventListener('pointerenter',start);target.addEventListener('pointerleave',stop);reduce.addEventListener('change',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});if(target.matches(':hover'))start();
};
