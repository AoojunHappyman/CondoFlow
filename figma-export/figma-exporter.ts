// Temporary authoring utility: preserve rendered geometry as editable design primitives.
const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const visibleColor=(s:string)=>s&&s!=='transparent'&&s!=='rgba(0, 0, 0, 0)';
export async function exportScreen(id:string){
 const root=document.getElementById('root')!, W=1440,H=Math.ceil(Math.max(root.scrollHeight,root.getBoundingClientRect().height,900));
 const items:any[]=[], warnings:string[]=[];let svgParts:string[]=[];
 const imageCache=new Map<string,string>();
 async function imageData(url:string){if(imageCache.has(url))return imageCache.get(url)!;try{const res=await fetch(url);if(!res.ok)throw new Error('Image '+res.status);const blob=await res.blob();const data=await new Promise<string>((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(String(fr.result));fr.onerror=reject;fr.readAsDataURL(blob)});imageCache.set(url,data);return data;}catch{warnings.push(url);return url;}}
 async function walk(el:Element){
  const cs=getComputedStyle(el), r=el.getBoundingClientRect();if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return;if(r.width<=0||r.height<=0){if(cs.overflow==='visible')for(const child of el.children)await walk(child);return;}
  const x=r.x+scrollX,y=r.y+scrollY,w=r.width,h=r.height;if(x>=W||x+w<=0)return;
  const name=el.getAttribute('aria-label')||el.getAttribute('title')||el.tagName.toLowerCase();
  if(el.tagName.toLowerCase()==='svg'){
   const clone=el.cloneNode(true) as SVGElement; const source=[el,...el.querySelectorAll('*')],dest=[clone,...clone.querySelectorAll('*')];
   source.forEach((s,i)=>{const c=getComputedStyle(s);for(const k of ['fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','font-family','font-size','font-weight','color']){const v=c.getPropertyValue(k);if(v)dest[i].setAttribute(k,v)}dest[i].removeAttribute('class');dest[i].removeAttribute('style')});
   clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width',String(w));clone.setAttribute('height',String(h));
   const markup=new XMLSerializer().serializeToString(clone);items.push({type:'svg',name,x,y,w,h,svg:markup});svgParts.push(`<g transform="translate(${x} ${y})">${markup}</g>`);return;
  }
  const radius=parseFloat(cs.borderTopLeftRadius)||0,border=parseFloat(cs.borderTopWidth)||0;
  const gradient=cs.backgroundClip!=='text'&&cs.backgroundImage.includes('gradient')?(cs.backgroundImage.match(/rgba?\([^)]+\)/g)||[]):[];
  if(visibleColor(cs.backgroundColor)||border||gradient.length){const gradientId='g'+items.length;items.push({type:'rect',name,x,y,w,h,fill:cs.backgroundColor,gradient,stroke:border?cs.borderTopColor:null,strokeWidth:border,radius,opacity:Number(cs.opacity)});if(gradient.length)svgParts.push(`<defs><linearGradient id="${gradientId}" x2="1" y2="1">${gradient.map((c,i)=>`<stop offset="${i/Math.max(1,gradient.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`);svgParts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${gradient.length?'url(#'+gradientId+')':visibleColor(cs.backgroundColor)?cs.backgroundColor:'none'}" ${border?`stroke="${cs.borderTopColor}" stroke-width="${border}"`:''}/>`)}
  if(el instanceof HTMLImageElement){const data=await imageData(el.currentSrc||el.src);items.push({type:'image',name,x,y,w,h,data,radius,fit:cs.objectFit});svgParts.push(`<image x="${x}" y="${y}" width="${w}" height="${h}" href="${esc(data)}" preserveAspectRatio="${cs.objectFit==='contain'?'xMidYMid meet':'xMidYMid slice'}"/>`);return;}
  if(el instanceof HTMLInputElement&&['checkbox','radio','range'].includes(el.type)){return;}
  if(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement||el instanceof HTMLSelectElement){let content=el instanceof HTMLSelectElement?el.selectedOptions[0]?.textContent:el.value||el.placeholder;if(el instanceof HTMLInputElement&&el.type==='password'&&el.value)content='•'.repeat(el.value.length);if(content){const tx=x+(parseFloat(cs.paddingLeft)||0),ty=y+(h-parseFloat(cs.fontSize))/2;addText(content,tx,ty,w-16,parseFloat(cs.fontSize)*1.6,cs,el instanceof HTMLInputElement&&!el.value?'#94a3b8':cs.color)}return;}
  for(const child of el.childNodes){if(child.nodeType===Node.TEXT_NODE&&child.textContent?.trim()){
   const str=child.textContent;const range=document.createRange();let lines:{s:string,x:number,y:number,w:number,h:number}[]=[];
   for(let i=0;i<str.length;i++){range.setStart(child,i);range.setEnd(child,i+1);const rr=range.getBoundingClientRect();if(rr.width===0||rr.height===0)continue;const prev=lines[lines.length-1];if(prev&&Math.abs(prev.y-(rr.y+scrollY))<2){prev.s+=str[i];prev.w=rr.right+scrollX-prev.x;prev.h=Math.max(prev.h,rr.height)}else lines.push({s:str[i],x:rr.x+scrollX,y:rr.y+scrollY,w:rr.width,h:rr.height});}
   for(const line of lines)if(line.s.trim()&&(!(cs.overflow==='hidden'||cs.overflowY==='hidden')||line.y<r.bottom+scrollY-3))addText(line.s,line.x,line.y,line.w,line.h,cs,cs.color);
  }else if(child instanceof Element)await walk(child);}
 }
 function addText(text:string,x:number,y:number,w:number,h:number,cs:CSSStyleDeclaration,color:string){if(cs.backgroundClip==='text')color=cs.backgroundImage.match(/rgba?\([^)]+\)/)?.[0]||'#0284c7';const font=cs.fontFamily.split(',')[0].replace(/["']/g,'').trim(),size=parseFloat(cs.fontSize),weight=parseInt(cs.fontWeight)||400;items.push({type:'text',name:text.slice(0,70),text,x,y,w,h,font,size,weight,color,lineHeight:parseFloat(cs.lineHeight)||size*1.5});svgParts.push(`<text x="${x}" y="${y+h*.77}" font-family="${esc(font)},sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" xml:space="preserve">${esc(text)}</text>`)}
 await walk(root);
 const data={id,width:W,height:H,items,warnings,svg:`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#f8fafc"/>${svgParts.join('')}</svg>`};
 const res=await fetch('http://localhost:5188/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!res.ok)throw new Error(await res.text());window.parent.postMessage({exportDone:id,count:items.length},'*');
}
