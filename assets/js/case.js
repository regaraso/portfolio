(() => {
 const english=new URLSearchParams(location.search).get('lang')==='en';
 const localize=value=>{
  if(Array.isArray(value))return value.map(localize);
  if(!value||typeof value!=='object')return value;
  return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,english&&Object.hasOwn(value,key+'En')?value[key+'En']:localize(item)]));
 };
 const source=window.CASES[document.body.dataset.case||'recuerdo']||window.CASES.recuerdo;
 const c={...localize(source),meta:source.meta};
 const copy=(ru,en)=>english?en:ru;
 const home=english?'/?lang=en':'/';
 const work=id=>`/work/${id}/${english?'?lang=en':''}`;
 if(english)document.title=`${c.id==='recuerdo'?'TINI':c.id==='aspro'?'Aspro.Cloud':c.title} | Regina Tarasova`;
 const variant=document.body.dataset.variant;
 const arrow='<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 13 13 1M1 1h12v12" stroke="currentColor" stroke-width="1.5"/></svg>';
 const fullSizes='(max-width: 760px) calc(100vw - 32px), calc(100vw - 96px)';
 const columnSizes='(max-width: 760px) calc(100vw - 32px), (max-width: 1100px) calc(100vw - 376px), calc(92vw - 386px)';
 const halfSizes='(max-width: 760px) calc(100vw - 32px), (max-width: 1100px) calc((100vw - 400px) / 2), calc((92vw - 410px) / 2)';
 const image=(im,lazy=true,sizes=columnSizes)=>{
  const source=window.CASE_IMAGE_SOURCES?.[im.src];
  const variants=source?.variants||[];
  const fallback=variants.find(v=>v.width>=1280)||variants.at(-1);
  return `<img src="${fallback?.src||im.src}" ${source?`srcset="${variants.map(v=>`${v.src} ${v.width}w`).join(', ')}" sizes="${sizes}"`:''} alt="${im.alt||''}" width="${source?.width||im.width}" height="${source?.height||im.height}" ${lazy?'loading="lazy"':'fetchpriority="high"'} decoding="async">`;
 };
 const figure=(im,lazy=true,sizes=columnSizes)=>`<div class="case-image">${image(im,lazy,sizes)}</div>`;
 const meta=()=>`<dl class="case-meta">${c.meta.map(m=>variant==='03'&&c.id==='recuerdo'&&m.label==='Клиент'?`<div class="project-origin"><dd>${copy('Самостоятельный концепт','Independent Concept')}</dd></div>`:`<div><dt>${english?m.labelEn:variant==='03'&&m.label==='Состав работ'?'Носители':m.label}</dt><dd>${english?m.valueEn:m.value}</dd></div>`).join('')}</dl>`;
 const title=()=>`<h1>${c.artist?c.artist+' — ':''}${c.title}</h1>`;
 const intro=`<div class="case-intro">${title()}<p>${c.summary}</p></div>`;
 const collagePositions=['left:7.8%;top:0%;width:44.7%','left:38.8%;top:6%;width:58.4%','left:0%;top:23.2%;width:100%','left:11.9%;top:46.3%;width:48.9%','left:68%;top:72%;width:31%'];
 const legacyCollage=`<div class="collage-drag" data-collage>${(c.sections.find(s=>s.id==='formats')?.images||[]).map((im,i)=>image(im,true,columnSizes).replace('<img ',`<img class="collage-drag__layer" data-z="${i+1}" data-drag style="${collagePositions[i]};z-index:${i+1}" `)).join('')}</div>`;
 const sections=c.sections.map((s,i)=>variant==='03'&&s.id==='cover'?'':`<section class="case-section section-${s.id}" id="section-${i}">${document.body.dataset.theme==='dark'&&s.id==='cd'?'':`<h2>${s.title}</h2>`}${variant==='03'&&s.id==='formats'?legacyCollage:`<div class="section-images">${s.images.map(im=>figure(im,true,['booklet','cassette','digital','outdoor'].includes(s.id)?columnSizes:halfSizes)).join('')}${(s.steps||[]).map(step=>`<div class="process-step"><h3>${step.title}</h3><p>${step.text}</p></div>`).join('')}${(s.videos||[]).map((src,i)=>`<video data-src="${src}" controls muted loop playsinline preload="none" aria-label="${s.title} — ${copy('видео','video')} ${i+1}"><source src="${src}" type="video/mp4"></video>`).join('')}</div>`}</section>`).join('');
 let content='';
 if(variant==='03')content=`<div class="case-full-hero">${figure(c.hero||c.sections.find(s=>s.id==='cover').images[1],false,fullSizes)}</div>${intro}<div class="context-layout"><aside class="project-context"><p class="case-description">${c.description}</p>${meta()}</aside><div class="case-chapters">${sections}</div></div>`;
 if(c.placeholder)content=`<div class="case-full-hero">${figure(c.hero,false,fullSizes)}</div><div class="placeholder-intro">${intro}${c.external?`<a class="case-secondary" href="${c.external.href}" target="_blank" rel="noopener">${copy('На Behance','On Behance')}${arrow}</a>`:''}</div>`;
 const relatedIds=[c.id==='nebo'?'recuerdo':'nebo',c.id==='aspro'?'recuerdo':'aspro'];
 const related=`<section class="return-work"><a class="return-title" href="${home}#portfolio"><span>${copy('К избранным работам','Selected Work')}</span><h2>${copy('Назад в портфолио','Back to Portfolio')}</h2></a><div class="related-grid">${relatedIds.map(id=>{
  const project=localize(window.CASES[id]);
  const cover=id==='recuerdo'?project.sections.find(s=>s.id==='cover').images[1]:project.hero;
  const name=id==='recuerdo'?'TINI — Recuerdo':project.title;
  const caption=id==='recuerdo'?copy('Самостоятельный концепт','Independent Concept'):id==='nebo'?copy('Небо Рекордс','Nebo Records'):'Aspro.Cloud';
  return `<div class="related-card"><div class="related-cover">${image(cover,true,'(max-width: 760px) calc(100vw - 32px), calc((100vw - 144px) / 2)')}</div><a href="${id==='aspro'?home+'#portfolio':work(id)}"><div><h3>${name}</h3></div><p>${caption}</p></a></div>`;
 }).join('')}</div></section>`;
 document.getElementById('app').innerHTML=`<main class="case-main" id="top">${variant==='03'?'':`<a class="case-back" href="${home}#portfolio"><span>${copy('Портфолио','Portfolio')}</span></a>`}${content}${related}</main>`;
 if(variant==='03'){document.querySelectorAll('.section-vinyl .case-image').forEach(b=>{if(b.querySelector('img').src.includes('vinyl_grey_marble_spin'))b.classList.add('vinyl-hero__record');});
 const record=document.querySelector('.section-vinyl .vinyl-hero__record');
 if(record){const sleeve=record.previousElementSibling;const pair=document.createElement('div');pair.className='vinyl-pair';sleeve.before(pair);sleeve.classList.add('vinyl-sleeve');pair.append(sleeve,record);}
 }
 // Fetch approaching videos, play only while visible, and stop when off screen.
 const videos=[...document.querySelectorAll('video[data-src]')];
 const loading=new IntersectionObserver(entries=>entries.forEach(({target:v,isIntersecting})=>{
  if(!isIntersecting)return;
  if(!v.getAttribute('src')){v.src=v.dataset.src;v.muted=true;v.preload='auto';v.load();}loading.unobserve(v);
 }),{rootMargin:'400px 0px'});
 const playback=new IntersectionObserver(entries=>entries.forEach(({target:v,isIntersecting})=>{
  if(isIntersecting&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
   if(!v.getAttribute('src')){v.src=v.dataset.src;v.load();}
   v.muted=true;v.play().catch(()=>{});
  }else v.pause();
 }),{threshold:.15});
 videos.forEach(v=>{loading.observe(v);playback.observe(v);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());});
})();
