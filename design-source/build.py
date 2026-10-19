"""Convert the retained Figma reference to buildless HTML and ordinary CSS."""
from pathlib import Path
import re, html, json

ROOT=Path(__file__).parent
OUT=ROOT.parent
OUT.mkdir(exist_ok=True)
(OUT/'assets').mkdir(exist_ok=True)
fixed={'absolute':'position:absolute','relative':'position:relative','flex':'display:flex','block':'display:block','flex-col':'flex-direction:column','flex-wrap':'flex-wrap:wrap','items-start':'align-items:flex-start','items-end':'align-items:flex-end','items-center':'align-items:center','justify-between':'justify-content:space-between','justify-center':'justify-content:center','justify-end':'justify-content:flex-end','content-stretch':'align-content:stretch','content-start':'align-content:flex-start','shrink-0':'flex-shrink:0','self-stretch':'align-self:stretch','w-full':'width:100%','h-full':'height:100%','size-full':'width:100%;height:100%','min-w-full':'min-width:100%','min-w-px':'min-width:1px','max-w-none':'max-width:none','overflow-clip':'overflow:clip','whitespace-nowrap':'white-space:nowrap','font-normal':'font-weight:400','font-bold':'font-weight:700','not-italic':'font-style:normal','text-center':'text-align:center','border':'border-width:1px','border-0':'border-width:0','border-3':'border-width:3px','border-b':'border-bottom-width:1px','border-t':'border-top-width:1px','border-l-2':'border-left-width:2px','border-solid':'border-style:solid','border-dashed':'border-style:dashed','bg-clip-padding':'background-clip:padding-box','underline':'text-decoration-line:underline','decoration-solid':'text-decoration-style:solid','decoration-from-font':'text-decoration-thickness:from-font','cursor-pointer':'cursor:pointer','translate-y-full':'transform:translateY(100%)','inset-0':'inset:0','left-0':'left:0','top-0':'top:0','mb-0':'margin-bottom:0'}
def declaration(c):
 if c in fixed:return fixed[c]
 if c.startswith('['):return c[1:-1]
 m=re.fullmatch(r'([\w-]+)-\[(.*)\]',c)
 if not m:raise ValueError(c)
 k,v=m.groups();v=v.replace('\\/','/').replace('_',' ')
 # Figma token paths contain slashes, which must be escaped in CSS identifiers.
 v=re.sub(r'var\((--[^,]+),',lambda m:'var('+m[1].replace('/','-')+',',v)
 if v.startswith('calc('):v=re.sub(r'(?<=%)\s*-\s*', ' - ',v)
 if k=='font':
  family,weight=v.strip("'").split(':');return f'font-family:"{family}";font-weight:'+('700' if weight=='Bold' else '600' if weight=='SemiBold' else '400')
 if k=='text':return ('color:' if v.startswith('#') else 'font-size:')+v.removeprefix('length:')
 if k=='border':return 'border-color:'+v
 if k=='size':return 'width:'+v+';height:'+v
 props={'bg':'background-color','w':'width','h':'height','min-w':'min-width','gap':'gap','leading':'line-height','tracking':'letter-spacing','rounded':'border-radius','flex':'flex','inset':'inset','top':'top','left':'left','right':'right','bottom':'bottom','mb':'margin-bottom','p':'padding','px':'padding-left|padding-right','py':'padding-top|padding-bottom','pt':'padding-top','pb':'padding-bottom','pl':'padding-left','pr':'padding-right'}
 return ';'.join(p+':'+v for p in props[k].split('|'))

classes={};assets=[];views=[]
for mode in ['desktop','mobile']:
 s=(ROOT/'reference'/f'{mode}.jsx').read_text()
 prefix=re.search(r'const assetPathPrefix = "([^"]+)"',s).group(1)
 imgs={name:'assets/'+mode+'-'+file for name,file in re.findall(r'const (\w+) = `\$\{assetPathPrefix\}/([^`]+)`;',s)}
 assets += [{'url':prefix+'/'+file,'path':'assets/'+mode+'-'+file} for _,file in re.findall(r'const (\w+) = `\$\{assetPathPrefix\}/([^`]+)`;',s)]
 s=s[s.index('  return (')+len('  return ('):s.rfind('  );')].strip()
 s=re.sub(r'\{`([^`]*)`\}',lambda m:html.escape(m[1]),s)
 imgs['imgLondonBoundary']='assets/london-boundary.svg'
 s=re.sub(r'src=\{(\w+)\}',lambda m:'src="'+imgs[m[1]]+'"',s)
 s=re.sub(r'style=\{\{ fontFeatureSettings: \'([^\']+)\' \}\}',lambda m:'style="font-feature-settings:'+html.escape(m[1],quote=True)+'"',s)
 def cssclass(m):
  ds=[]
  for c in m[1].split():
   ds.append(declaration(c))
  value=';'.join(ds)
  if value not in classes:classes[value]='f'+str(len(classes))
  return 'class="'+classes[value]+'"'
 s=re.sub(r'className="([^"]+)"',cssclass,s)
 s=re.sub(r'style=\{\{ fontVariationSettings: \'([^\']+)\' \}\}',lambda m:'style="font-variation-settings:'+html.escape(m[1],quote=True)+'"',s)
 s=s.replace('PLACEHOLDER EDITION','ON COURT, OFF DUTY')
 # Replace only the large home hero ball; keep the court rally illustration.
 s=re.sub(r'(data-name="Padel ball">\s*<img[^>]*src=")[^"]+', r'\g<1>assets/hero-winking-ball.svg', s, count=1)
 # Native navigation preserves all of the design's text and layout.
 targets={'Home':'home','Games':'games','Tournaments':'tournaments','Gear':'gear','Club Map':'clubs'}
 s=re.sub(r'<p([^>]*)>\s*(Home|Games|Tournaments|Gear|Club Map)\s*</p>',lambda m:'<a'+m[1]+' href="#'+mode+'-'+targets[m[2]]+'">'+m[2]+'</a>',s)
 section_ids={'Hero':'home','Featured next game':'games','Games and tournaments':'tournaments','Gear':'gear','Club map':'clubs','Connect and play':'connect'}
 for name,ident in section_ids.items():s=s.replace('data-name="'+name+'"','id="'+mode+'-'+ident+'" data-name="'+name+'"',1)
 views.append('<main class="'+mode+'-view">'+s+'</main>')
 css='\n'.join('.'+name+'{'+ds+'}' for ds,name in classes.items())
(ROOT/'assets-manifest.json').write_text(json.dumps(assets,indent=2))
reset='''*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid}html{scroll-behavior:smooth}body{margin:0;background:#080908;color:#dadada;font-family:"Space Grotesk",sans-serif}p,h1,h2,h3{margin:0}a{color:inherit;text-decoration:inherit}img{display:block;max-width:100%}button{font:inherit} .desktop-view{width:100%;max-width:1440px;margin:auto}.mobile-view{display:none} @media(max-width:767px){.desktop-view{display:none}.mobile-view{display:block;width:100%;max-width:767px;margin:auto}} @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'''
fonts='''@font-face{font-family:"Michroma";src:url("assets/michroma.woff2") format("woff2");font-weight:400;font-display:swap}@font-face{font-family:"Space Grotesk";src:url("assets/space-grotesk.woff2") format("woff2");font-weight:300 700;font-display:swap}@font-face{font-family:"IBM Plex Mono";src:url("assets/ibm-plex-mono.woff2") format("woff2");font-weight:400;font-display:swap}@font-face{font-family:"IBM Plex Mono";src:url("assets/ibm-plex-mono-semibold.woff2") format("woff2");font-weight:600;font-display:swap}'''
(OUT/'styles.css').write_text(fonts+'\n'+reset+'\n'+css+'\n'+(ROOT/'hover.css').read_text())
(OUT/'index.html').write_text('<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Smash Happens — Carol’s Padel Journal</title><meta name="description" content="Carol’s personal padel journal: games, gear and London court discoveries."><link rel="stylesheet" href="styles.css?v=43"></head><body>'+''.join(views)+'<script src="app.js"></script><script src="court-motion.js?v=4"></script><script src="hero-motion.js?v=2"></script><script src="section-motion.js?v=3"></script><script src="map-motion.js?v=9"></script><script src="map-region.js?v=1"></script><script src="club-pagination.js?v=1"></script><script src="footer-stickers.js?v=4"></script><script src="strava-button.js?v=3"></script><script src="match-data.js?v=6"></script><script src="profile-links.js?v=2"></script><script src="product-sprite.js?v=3"></script><script src="gear-data.js?v=5"></script><script src="shoe-data.js?v=8"></script><script src="head-bag-data.js?v=2"></script><script src="wilson-backpack-data.js?v=2"></script><script src="bullpadel-racket-data.js?v=2"></script><script src="on-shoe-data.js?v=2"></script><script src="lambo-racket-data.js?v=1"></script><script src="footwear-data.js?v=4"></script><script src="metalbone-racket-data.js?v=1"></script><script src="gear-controls.js?v=8"></script><script src="gallery-nav.js?v=2"></script><script src="interface-polish.js?v=1"></script></body></html>')
(OUT/'app.js').write_text('''// All verified club links are native anchors. Placeholder profiles remain unconfirmed.
document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
document.querySelectorAll('[data-name="Action"]').forEach(action=>{
 if(action.textContent.includes('Let’s play')){action.setAttribute('role','link');action.tabIndex=0;const go=()=>document.querySelector((innerWidth<768?'#mobile':'#desktop')+'-connect').scrollIntoView({behavior:'smooth'});action.addEventListener('click',go);action.addEventListener('keydown',e=>{if(e.key==='Enter')go()});action.style.cursor='pointer';}
});
''')
print(f'Built {OUT}: {len(classes)} CSS rules, {len(assets)} original assets.')
