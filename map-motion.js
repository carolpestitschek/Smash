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
  {name:'The Padel Yard – G4P – Vauxhall Square',area:'Vauxhall, London',address:'Vauxhall Square · SW8 2LX',courts:'Courts: 3 · Outdoor',url:'https://www.matchi.se/facilities/g4pvauxhallpadelyard?lang=en'},
  {name:'National Tennis Centre Padel',area:'Roehampton, London',address:'100 Priory Lane · SW15 5JQ',courts:'Pay & Play · No membership required',url:'https://clubspark.lta.org.uk/PadelNTC'},
  {name:'S3 Padel Brent Cross (Closed)',area:'Brent Cross, London',address:'Prince Charles Drive · NW4 3AY',courts:'Closed · Former venue',url:'https://socialsportssociety.com/venue/brent-cross/'},
  {name:'S3 Padel Wembley (Closed)',area:'Wembley Park, London',address:'Wembley Park Boulevard · HA9 0TG',courts:'Closed · Former venue',url:'https://socialsportssociety.com/'}
];
const pinReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-name="Map and selected club"]').forEach(section=>{
  const map=section.querySelector('[data-name="Illustrative London map"]');
  const detail=section.querySelector('[data-name="Selected club detail"]');
  const pins=[...map.querySelectorAll('[data-name="Illustrative location pin"]'),map.querySelector('[data-name="UK inset"] > p:last-child')];
  [[58,68],[39,74],[19,51],[40,23],[25,12],[10,29],[28,39],[47,65],[22,76],[49,17],[15,20]].forEach(([x,y],offset)=>{
    const pin=pins[0].cloneNode(true);
    pin.removeAttribute('data-node-id');
    pin.querySelector('p').removeAttribute('data-node-id');
    pin.querySelector('p').textContent=String.fromCharCode(69+offset);
    pin.style.left=x+'%';pin.style.top=y+'%';
    map.appendChild(pin);pins.push(pin);
  });
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
  footnote.hidden=true;
  select(0,false);
});
