// Generate the initial Russian HTML from the same content/templates used by the browser.
// Run after changing site.js, home.js, case.js or cases.js: node scripts/build-static-content.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const site=read('assets/js/site.js');
const home=read('assets/js/home.js');
const caseSource=read('assets/js/case.js');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const context=(dataset,pathname)=>{
 const fragments={};
 const app={innerHTML:''};
 const ctx={URLSearchParams,location:{pathname,search:''},innerWidth:1440,innerHeight:900,addEventListener(){},matchMedia:()=>({matches:false}),window:{},document:{body:{dataset,insertAdjacentHTML:(position,html)=>fragments[position]=html},getElementById:id=>id==='app'?app:null,querySelector:()=>null,querySelectorAll:()=>[]}};
 vm.createContext(ctx);
 // Only evaluate content and shell templates, never browser interactions or animations.
 vm.runInContext(site.slice(0,site.indexOf('const menu =')),ctx);
 return {ctx,fragments,app};
};
const marked=(name,content)=>`<!--static:${name}-->${content}<!--/static:${name}-->`;
function fill(html,name,content,initial){
 const start=`<!--static:${name}-->`,end=`<!--/static:${name}-->`;
 const a=html.indexOf(start),b=html.indexOf(end);
 if(a>=0&&b>=a)return html.slice(0,a)+marked(name,content)+html.slice(b+end.length);
 if(!html.includes(initial))throw Error('Missing insertion point '+name);
 return html.replace(initial,initial.replace('></','>'+marked(name,content)+'</'));
}
function shell(html,fragments){
 for(const [name,key] of [['header','afterbegin'],['footer','beforeend']]){
  const content=`<div data-static-shell="${name}" style="display:contents">${fragments[key]}</div>`;
  const re=new RegExp(`<!--static:${name}-->[\\s\\S]*?<!--/static:${name}-->`);
  if(re.test(html)) html=html.replace(re,marked(name,content));
  else if(name==='header') html=html.replace(/(<body[^>]*>)/,`$1\n${marked(name,content)}`);
  else html=html.replace(/(<script src="(?:\/)?assets\/js\/(?:lenis|cases)[^"]*"[^>]*>)/,`${marked(name,content)}\n$1`);
 }
 return html;
}
{
 const {ctx,fragments}=context({page:'home'},'/');
 const data=vm.runInContext('C',ctx);
 let html=read('index.html');
 const expression=prefix=>{const line=home.split('\n').find(l=>l.startsWith(prefix));if(!line)throw Error(prefix);return vm.runInContext(line.slice(line.indexOf(' = ')+3).replace(/;$/,''),ctx);};
 html=fill(html,'cases',expression("document.querySelector('.cases').innerHTML"),'<section class="cases" aria-label="Портфолио"></section>');
 html=fill(html,'jobs',expression("$('jobs').innerHTML"),'<div id="jobs"></div>');
 const order=[0,3,2,9,4,5,1,8,7,10,6,11];
 html=fill(html,'skills',order.map(i=>`<li>${escape(data.skills[i])}</li>`).join(''),'<ul id="skl"></ul>');
 html=fill(html,'about',data.about.map(p=>`<p>${escape(p)}</p>`).join(''),'<div class="ab-txt" id="abt"></div>');
 html=html.replace(/(<p class="vh" id="desc">)[\s\S]*?(<\/p>)/,`$1${escape(data.desc.join(' '))}$2`);
 html=html.replace(/(<p id="wtxt">)[\s\S]*?(<\/p>)/,`$1${data.desc.map(escape).join('<br>')}$2`);
 html=shell(html,fragments);
 fs.writeFileSync('index.html',html);
}
for(const id of ['recuerdo','nebo','aspro']){
 const {ctx,fragments,app}=context({root:'/',footer:'static',variant:'03',theme:id==='recuerdo'?'dark':'light',case:id},`/work/${id}/`);
 vm.runInContext(read('assets/js/cases.js'),ctx);
 vm.runInContext(read('assets/js/case-images.js'),ctx);
 // Stop as soon as the complete page markup is produced, before attaching interactions.
 const stop=caseSource.indexOf(" if(variant==='03'){document.querySelectorAll");
 if(stop<0)throw Error('Case render boundary missing');
 vm.runInContext(caseSource.slice(0,stop)+'})();',ctx);
 let html=read(`work/${id}/index.html`);
 html=fill(html,'case',app.innerHTML,'<div id="app"></div>');
 html=shell(html,fragments);
 fs.writeFileSync(`work/${id}/index.html`,html);
}
console.log('Generated static content for home and 3 cases.');
