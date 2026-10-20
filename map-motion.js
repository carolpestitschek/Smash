// Pin interactions use the same verified club content as the directory.
const mapClubs = [
  {name:'Padel Social Club – Earls Court',area:'Earls Court, London',address:'Empress Place · SW6 1TT',courts:'Courts: 6 · 2 indoor / 4 outdoor',url:'https://padelsocial.club/pages/earls-court'},
  {name:'Padium – Canary Wharf',area:'Canary Wharf, London',address:'10 Bank Street · E14 4DE',courts:'View court details on the club website.',url:'https://www.padium.com/contact'},
  {name:'Rocket Padel Ilford',area:'Ilford, London',address:'The Drive · IG1 3PS',courts:'Courts: 12 · Indoor',url:'https://www.rocketpadel.com/club/ilford'},
  {name:'S3 Padel Finchley Road',area:'West Hampstead, London',address:'255 Finchley Road · NW3 6LU',courts:'Courts: 10 · Outdoor',url:'https://socialsportssociety.com/venue/finchley-road/'},
  {name:'Padel Box Bermondsey',area:'South Bermondsey, London',address:'Rollins Street · SE15 1EP',courts:'Courts: 5 · Indoor',url:'https://www.padelbox.club/home'},
  {name:'Rocket Padel Battersea',area:'Battersea, London',address:'Circus Road West · SW11 8AL',courts:'Courts: 4 · Indoor',url:'https://www.rocketpadel.com/contact'},
  {name:'Rocks Lane Chiswick Padel',area:'Chiswick, London',address:'60 Chiswick Common Road · W4 1RZ',courts:'Courts: 8 outdoor / 4 covered',url:'https://rockslane.co.uk/chiswick/padel/'},
  {name:'The 108 Padel',area:'Brent Cross, London',address:'Brent Terrace · NW2 1LT',courts:'Courts: 6 · Indoor',url:'https://the108.co.uk/'},
  {name:'Encourt Padel & Wellness Club',area:'Radlett, Hertfordshire',address:'Unit GH, Ventura Park · AL2 2DB',courts:'Courts: 7 · Indoor',url:'https://encourtpadel.co.uk/about/'},
  {name:'PADELHUB Slough',area:'Slough, Berkshire',address:'Unit 1, Albion Close · SL2 5DT',courts:'View court details on the club website.',url:'https://www.padelhub.uk/locations'},
  {name:'Racketeer',area:'North Acton, London',address:'55–61 North Acton Road · NW10 6PH',courts:'View court details on the club website.',url:'https://www.racketeer.club/'},
  {name:'The Padel Yard – G4P',area:'Vauxhall, London',address:'Vauxhall Square · SW8 2LX',courts:'Courts: 3 · Outdoor',url:'https://www.matchi.se/facilities/g4pvauxhallpadelyard?lang=en'},
  {name:'National Tennis Centre Padel',area:'Roehampton, London',address:'100 Priory Lane · SW15 5JQ',courts:'Pay & Play · No membership required',url:'https://clubspark.lta.org.uk/PadelNTC'},
  {name:'S3 Padel Brent Cross (Closed)',area:'Brent Cross, London',address:'Prince Charles Drive · NW4 3AY',courts:'Closed · Former venue',url:'https://socialsportssociety.com/venue/brent-cross/'},
  {name:'S3 Padel Wembley (Closed)',area:'Wembley Park, London',address:'Wembley Park Boulevard · HA9 0TG',courts:'Closed · Former venue',url:'https://socialsportssociety.com/'}
];
const latestClubVisits={"The Padel Yard – G4P":"13 Aug 2025","Padel Social Club – Earls Court":"15 Oct 2026", "Racketeer":"11 Oct 2026","Rocket Padel Ilford": "8 Sep 2026", "PADELHUB Slough": "25 Aug 2025", "National Tennis Centre Padel": "28 Apr 2026", "Padel Box Bermondsey": "30 Aug 2025", "Rocks Lane Chiswick Padel": "24 Jul 2025"};
const pinReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-name="Map and selected club"]').forEach(section=>{
  const map=section.querySelector('[data-name="Illustrative London map"]');
  const detail=section.querySelector('[data-name="Selected club detail"]');
  const action=detail.querySelector('[data-name="Action"]');
  const originalLink=action?.querySelector('a');
  if(originalLink){
   const link=document.createElement('a');link.className=action.className;link.dataset.name='Action';link.href=originalLink.href;link.target='_blank';link.rel='noopener noreferrer';
   const label=originalLink.querySelector('p');label.textContent='Club website';link.append(label);
   const arrow=action.querySelector(':scope>p');if(arrow)link.append(arrow);action.replaceWith(link);
  }
  const pins=[...map.querySelectorAll('[data-name="Illustrative location pin"]'),map.querySelector('[data-name="UK inset"] > p:last-child')];
  // Approximate club-area coordinates projected onto the London boundary.
  const locations=[[-.196,51.486],[-.015,51.507],[.065,51.58],[-.181,51.55],[-.052,51.482],[-.146,51.482],[-.258,51.494],[-.229,51.568],[-.326,51.68],[-.59,51.51],[-.261,51.532],[-.123,51.486],[-.25,51.458],[-.219,51.577],[-.283,51.557]];
  for(let offset=0;offset<11;offset++){
   const pin=pins[0].cloneNode(true);pin.removeAttribute('data-node-id');pin.querySelector('p').removeAttribute('data-node-id');pin.querySelector('p').textContent=String.fromCharCode(69+offset);map.append(pin);pins.push(pin);
  }
  const northWest=pins[3];northWest.textContent='D';map.append(northWest);map.querySelector('[data-name="UK inset"]')?.remove();
  const lines=document.createElementNS('http://www.w3.org/2000/svg','svg');lines.classList.add('club-pin-leaders');lines.setAttribute('aria-hidden','true');map.prepend(lines);
  function positionPins(){
   const boundary=map.querySelector('[data-name="London boundary"]'),w=map.clientWidth,h=map.clientHeight;if(!w)return;
   const size=w<500?28:34,minDistance=size*1.45+8;
   const points=locations.map(([lon,lat])=>{const x=boundary.offsetLeft+(lon+.51)/.845*boundary.offsetWidth,y=boundary.offsetTop+(51.692-lat)/.406*boundary.offsetHeight;return {ax:x,ay:y,x:Math.max(size,x),y:Math.max(size+28,y)};});
   for(let pass=0;pass<90;pass++)for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
    const a=points[i],b=points[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>=minDistance)continue;if(d<.1){dx=1;dy=.5;d=Math.hypot(dx,dy);}const push=(minDistance-d)/2+.1;a.x-=dx/d*push;a.y-=dy/d*push;b.x+=dx/d*push;b.y+=dy/d*push;
   }
   lines.setAttribute('viewBox',`0 0 ${w} ${h}`);lines.replaceChildren();
   points.forEach((p,i)=>{
    p.x=Math.max(size,Math.min(w-size,p.x));p.y=Math.max(size+28,Math.min(h-38,p.y));
    const pin=pins[i];pin.style.cssText=`left:${p.x-size/2}px;top:${p.y-size/2}px;width:${size}px;height:${size}px;`;
    if(Math.hypot(p.x-p.ax,p.y-p.ay)>5){const line=document.createElementNS(lines.namespaceURI,'line');for(const [key,value] of Object.entries({x1:p.ax,y1:p.ay,x2:p.x,y2:p.y}))line.setAttribute(key,value);lines.append(line);}
   });
  }
  new ResizeObserver(positionPins).observe(map);positionPins();
  let selectionAnimation;
  const activationAnimations=new Map();
  detail.setAttribute('aria-live','polite');detail.setAttribute('aria-atomic','true');
  function select(index,animate=true){
    const club=mapClubs[index];
    const view=section.closest('main');
    view.querySelectorAll('[data-name="Club directory"] [data-name="Club region"] [data-name="Status"]').forEach(badge=>{
      badge.classList.toggle('selected-pin-badge',badge.textContent.trim()==='PIN '+String.fromCharCode(65+index));
    });
    pins.forEach((pin,i)=>{pin.setAttribute('aria-pressed',String(i===index));});
    detail.querySelector(':scope > p').textContent=`PIN ${String.fromCharCode(65+index)} / SELECTED CLUB`;
    detail.querySelector('[data-name="Display title"] p').textContent=club.name;
    const location=detail.querySelector('[data-name="Display title"]').nextElementSibling;
    location.children[0].textContent=club.area;location.children[1].textContent=club.address;
    detail.querySelector('[data-name="Club details"] > p').textContent=club.courts;
    detail.querySelector('a').href=club.url;
    detail.querySelectorAll('[data-name="Club details"] p').forEach(p=>{if(/^(?:Latest visit|Visit):/.test(p.textContent.trim()))p.textContent=latestClubVisits[club.name]?'Latest visit: '+latestClubVisits[club.name]:'Visit: [Date to add]';});
    detail.querySelectorAll('[data-name="Club details"] p').forEach(p=>{if(p.textContent.includes('[Your notes'))p.remove();});
    if(animate&&!pinReducedMotion.matches){
      selectionAnimation?.cancel();
      selectionAnimation=detail.animate([{opacity:0.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});
      const pin=pins[index];activationAnimations.get(pin)?.cancel();
      // A crisp single activation, with no repeated pulse or glow.
      activationAnimations.set(pin,pin.animate([{outline:'0px solid #c0fb30',outlineOffset:'0px'},{outline:'2px solid #c0fb30',outlineOffset:'5px'}],{duration:220,easing:'cubic-bezier(0.23, 1, 0.32, 1)'}));
    }
  }
  pins.forEach((pin,index)=>{
    pin.classList.add('club-pin');pin.setAttribute('role','button');pin.tabIndex=0;
    pin.setAttribute('aria-label',`Show ${mapClubs[index].name}`);
    pin.addEventListener('click',()=>select(index));
    pin.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();select(index);}
      if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(event.key)){
        event.preventDefault();pins[(index+(['ArrowRight','ArrowDown'].includes(event.key)?1:pins.length-1))%pins.length].focus();
      }
    });
  });
  const footnote=map.querySelector(':scope > p:last-child');
  if(footnote)footnote.hidden=true;
  select(0,false);
});
