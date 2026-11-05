figma.showUI(__html__,{width:440,height:300});
function rgba(css){const m=String(css||'').match(/[\d.]+/g);if(!m||m.length<3)return {r:0,g:0,b:0,a:0};return{r:+m[0]/255,g:+m[1]/255,b:+m[2]/255,a:m.length>3?+m[3]:1}}
function paint(css){const c=rgba(css);return{type:'SOLID',color:{r:c.r,g:c.g,b:c.b},opacity:c.a}}
function bytes(data){const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',str=data.split(',')[1];let bits=0,value=0,out=[];for(const ch of str){const v=chars.indexOf(ch);if(v<0)continue;value=(value<<6)|v;bits+=6;if(bits>=8){bits-=8;out.push((value>>bits)&255)}}return new Uint8Array(out)}
figma.ui.onmessage=async msg=>{
 if(msg.type!=='import')return;
 try{
 const fonts=await figma.listAvailableFontsAsync();const loaded=new Set(),issues=[];
 async function resolveFont(family,weight){const choices=fonts.filter(f=>f.fontName.family===family);const names=weight>=700?['Bold','SemiBold','Semi Bold','Medium','Regular']:weight>=600?['SemiBold','Semi Bold','Bold','Medium','Regular']:weight>=500?['Medium','Regular']:['Regular','Light'];let selected;for(const style of names){const f=choices.find(f=>f.fontName.style===style);if(f){selected=f.fontName;break}}if(!selected){selected={family:'Inter',style:'Regular'};if(!issues.includes(family))issues.push(family)}const key=selected.family+'/'+selected.style;if(!loaded.has(key)){await figma.loadFontAsync(selected);loaded.add(key)}return selected;}
 for(const s of msg.screens)for(const i of s.items)if(i.type==='text')await resolveFont(i.font,i.weight);
 const page=figma.createPage();page.name='CondoFlow — All Screens';await figma.setCurrentPageAsync(page);
 let x=100,y=100,maxH=0,col=0;const created=[],iconComponents=new Map();
 for(const s of msg.screens){
  const frame=figma.createFrame();frame.name=s.id;frame.resize(s.width,s.height);frame.x=x;frame.y=y;frame.fills=[{type:'SOLID',color:{r:.973,g:.98,b:.988}}];frame.clipsContent=true;page.appendChild(frame);
  for(const i of s.items){let node;
   if(i.type==='text'){node=figma.createText();node.fontName=await resolveFont(i.font,i.weight);node.fontSize=i.size;node.characters=i.text;node.fills=[paint(i.color)];node.lineHeight={unit:'PIXELS',value:i.lineHeight};node.textAutoResize='WIDTH_AND_HEIGHT';}
   else if(i.type==='svg'){node=figma.createNodeFromSvg(i.svg);node.resize(Math.max(.01,i.w),Math.max(.01,i.h));}
   else if(i.type==='image'){if(!i.data.startsWith('data:'))continue;node=figma.createRectangle();node.resize(Math.max(.01,i.w),Math.max(.01,i.h));node.cornerRadius=Math.min(i.radius||0,i.w/2,i.h/2);const image=figma.createImage(bytes(i.data));node.fills=[{type:'IMAGE',imageHash:image.hash,scaleMode:i.fit==='contain'?'FIT':'FILL'}];}
   else if(i.type==='rect'){node=figma.createRectangle();node.resize(Math.max(.01,i.w),Math.max(.01,i.h));node.cornerRadius=Math.min(i.radius||0,i.w/2,i.h/2);node.fills=[paint(i.fill)];if(i.gradient&&i.gradient.length>1)node.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[1,0,0],[0,1,0]],gradientStops:i.gradient.map((c,j)=>{const v=rgba(c);return{position:j/(i.gradient.length-1),color:{r:v.r,g:v.g,b:v.b,a:v.a}}})}];if(i.stroke&&i.strokeWidth){node.strokes=[paint(i.stroke)];node.strokeWeight=i.strokeWidth;node.strokeAlign='INSIDE';}node.opacity=i.opacity;}
   if(!node)continue;frame.appendChild(node);node.name=i.name||i.type;node.x=i.x;node.y=i.type==='text'?i.y-(i.lineHeight-i.h)/2:i.y;
  }
  created.push(frame);x+=s.width+100;maxH=Math.max(maxH,s.height);col++;if(col===5){col=0;x=100;y+=maxH+150;maxH=0;}
  figma.ui.postMessage({status:'นำเข้าแล้ว '+created.length+' / '+msg.screens.length+' หน้าจอ'});
 }
 figma.currentPage.selection=[created[0]];figma.viewport.scrollAndZoomIntoView([created[0]]);
 figma.ui.postMessage({status:'เสร็จแล้ว '+created.length+' หน้าจอ'+(issues.length?' — ฟอนต์ที่หาไม่พบและใช้ Inter แทน: '+issues.join(', '):' — ใช้ฟอนต์ต้นฉบับครบ')});
 }catch(e){figma.ui.postMessage({status:'Import stopped: '+e.message});}
};
