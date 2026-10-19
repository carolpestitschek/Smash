// London uses its city boundary; UK keeps the broader original oval schematic.
document.querySelectorAll('[data-name="Club map"]').forEach(section=>{
 const options=[...section.querySelectorAll('[data-name=". Visual Picker item"]')];
 const boundary=section.querySelector('[data-name="London boundary"] img');
 const map=section.querySelector('[data-name="Illustrative London map"]');
 if(!boundary||options.length!==2)return;
 const mode=section.closest('main').classList.contains('desktop-view')?'desktop':'mobile';
 const oval=mode==='desktop'?'assets/desktop-5c699.png':'assets/mobile-40f13.png';
 const caption=[...map.children].find(n=>n.tagName==='P');
 options.forEach((option,index)=>{
  option.setAttribute('role','button');option.tabIndex=0;option.classList.add('map-region-option');
  const choose=()=>{
   boundary.src=index?oval:'assets/london-boundary.svg';
   caption.textContent=index?'UK / BROADER VIEW · SCHEMATIC':'LONDON / SCHEMATIC';
   options.forEach((item,i)=>{
    item.setAttribute('aria-pressed',String(i===index));
    item.style.backgroundColor=i===index?'#c0fb30':'#141614';
    item.style.color=i===index?'#080908':'#dadada';
    item.querySelectorAll('p').forEach(p=>p.style.color='inherit');
    const radio=item.querySelector('[data-name="Radio container ↓"]');
    radio.style.backgroundColor='transparent';radio.style.borderColor='currentColor';
    const dot=radio.querySelector('img');dot.style.visibility=i===index?'visible':'hidden';
   });
  };
  option.addEventListener('click',choose);
  option.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
  if(!index)choose();
 });
});
