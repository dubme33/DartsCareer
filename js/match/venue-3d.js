/* Static venue geometry, built once per venue. Board and dart physics stay in their existing modules. */
(function(root){
 'use strict';
 // One surround definition for the active target and every neighbouring station.
 function createSurround(T,own=o=>o){
  const make=(name,geometry,options)=>{const m=new T.Mesh(own(geometry),own(new T.MeshStandardMaterial(options)));m.name=name;return m;};
  const body=make('surround-body',new T.CylinderGeometry(2.1,2.1,.14,128),{color:0x111718,roughness:.98});
  body.rotation.x=Math.PI/2;body.position.z=-.13;body.receiveShadow=true;
  const attributes={position:[],normal:[],uv:[]};
  for(let i=0;i<8;i++){const ring=new T.RingGeometry(1.65,1.91,8,1,i*Math.PI/4+.18,.38),g=ring.toNonIndexed();for(const name of Object.keys(attributes))attributes[name].push(...g.getAttribute(name).array);ring.dispose();g.dispose();}
  const geometry=new T.BufferGeometry();for(const [name,values]of Object.entries(attributes))geometry.setAttribute(name,new T.Float32BufferAttribute(values,name==='uv'?2:3));geometry.computeBoundingSphere();
  const panels=make('surround-panels',geometry,{color:0x303638,roughness:.98});panels.position.z=-.049;
  const rim=make('surround-rim',new T.TorusGeometry(2.07,.014,6,128),{color:0x262c2e,roughness:.95});rim.position.z=-.05;
  const face=make('surround-skin',new T.CircleGeometry(2.1,128),{color:0xffffff,roughness:.98,transparent:true,alphaTest:.01});face.position.z=-.047;face.receiveShadow=true;face.visible=false;
  return{body,panels,rim,face};
 }
 function create(T,{type='floor',boardTexture=null,board=null,surround=null,anisotropy=1,textureLimit=4096,data=null}={}){
  const group=new T.Group(),owned=new Set(),solid=[],lit=[],floor=-10.18,surroundCopies=[],boardCopies=[];
  const stationNumbers=Array.from({length:16},(_,i)=>i+1),stationX=n=>(n-7)*9.4,neighbours=stationNumbers.filter(n=>n!==7);
  let scoreCanvas=null,scoreTexture=null,lastScore='',neighborMaterial=null,disposed=false;
  const track=o=>{owned.add(o);return o;},color=c=>new T.Color(c);
  const palette={accent:'#d5222a',secondary:'#f0bd18',deep:'#101820',mid:'#202a34',stage:'#07111a',stageGlow:'#203541',score:'#a9f272',scoreBackground:'#111b1b',...data?.palette};
  const appearanceKey=type==='tv'?JSON.stringify(data?.palette||null):null;
  const mix=(a,b,amount)=>color(a).lerp(color(b),amount).getStyle();
  const lighter=(value,amount)=>{const hsl=color(value).getHSL({},T.SRGBColorSpace);return new T.Color().setHSL(hsl.h,hsl.s,Math.min(.75,hsl.l+amount),T.SRGBColorSpace).getStyle();};
  const wall=mix(palette.mid,palette.stageGlow,.55),facet=lighter(wall,.14),seam=mix(palette.deep,wall,.28);
  const mesh=(geometry,material,x=0,y=0,z=0)=>{const m=new T.Mesh(track(geometry),material);m.position.set(x,y,z);group.add(m);return m;};
  function box(x,y,z,w,h,d,c,glow=false,angle=0){const g=new T.BoxGeometry(w,h,d).toNonIndexed();if(angle)g.rotateZ(angle);g.translate(x,y,z);const p=g.getAttribute('position'),n=g.getAttribute('normal'),rgb=color(c);(glow?lit:solid).push({p:Array.from(p.array),n:Array.from(n.array),c:Array.from({length:p.count*3},(_,i)=>[rgb.r,rgb.g,rgb.b][i%3])});g.dispose();}
  function finish(parts,basic=false){if(!parts.length)return;const g=new T.BufferGeometry(),p=parts.flatMap(a=>a.p),n=parts.flatMap(a=>a.n),c=parts.flatMap(a=>a.c);g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(n,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.computeBoundingSphere();mesh(g,track(basic?new T.MeshBasicMaterial({vertexColors:true}):new T.MeshStandardMaterial({vertexColors:true,roughness:.94,metalness:.03})));}
  function configureTexture(t){t.colorSpace=T.SRGBColorSpace;t.anisotropy=anisotropy;t.minFilter=T.LinearMipmapLinearFilter;t.magFilter=T.LinearFilter;return t;}
  function texture(w,h,paint,scale=1){const c=document.createElement('canvas'),shrink=Math.min(1,textureLimit/Math.max(w,h));c.width=w*shrink;c.height=h*shrink;const ctx=c.getContext('2d');ctx.scale(scale*shrink,scale*shrink);paint(ctx,w/scale,h/scale);return configureTexture(track(new T.CanvasTexture(c)));}
  function plane(tex,w,h,x,y,z,basic=true){return mesh(new T.PlaneGeometry(w,h),track(basic?new T.MeshBasicMaterial({map:tex,toneMapped:false}):new T.MeshStandardMaterial({map:tex,roughness:.96})),x,y,z);}
  function planeBatch(tex,w,h,positions,atlas=null){
   const arrays={position:[],normal:[],uv:[]};
   positions.forEach(([x,y,z],i)=>{const base=new T.PlaneGeometry(w,h),g=base.toNonIndexed();base.dispose();g.translate(x,y,z);
    if(atlas){const uv=g.getAttribute('uv'),col=i%atlas[0],row=Math.floor(i/atlas[0]);for(let j=0;j<uv.count;j++)uv.setXY(j,(uv.getX(j)+col)/atlas[0],(uv.getY(j)+atlas[1]-1-row)/atlas[1]);}
    for(const name of Object.keys(arrays))arrays[name].push(...g.getAttribute(name).array);g.dispose();
   });
   const geometry=new T.BufferGeometry();for(const [name,values]of Object.entries(arrays))geometry.setAttribute(name,new T.Float32BufferAttribute(values,name==='uv'?2:3));geometry.computeBoundingSphere();
   return mesh(geometry,track(new T.MeshBasicMaterial({map:tex,toneMapped:false})));
  }
  function repeatTarget(source,list){
   const copies=track(new T.InstancedMesh(source.geometry,source.material,neighbours.length)),translation=new T.Matrix4(),matrix=new T.Matrix4();
   copies.name=source.name+'-neighbours';copies.visible=source.visible;copies.receiveShadow=source.receiveShadow;
   source.updateMatrix();neighbours.forEach((n,i)=>{translation.makeTranslation(stationX(n),0,0);matrix.multiplyMatrices(translation,source.matrix);copies.setMatrixAt(i,matrix);});copies.computeBoundingSphere();group.add(copies);list.push({source,copies});
  }
  function fit(c,text,x,y,width,size=36){c.font=`700 ${size}px Arial`;while(size>14&&c.measureText(text).width>width)c.font=`700 ${--size}px Arial`;if(c.measureText(text).width>width){const chars=Array.from(text);while(chars.length&&c.measureText(chars.join('')+'…').width>width)chars.pop();text=chars.join('')+'…';}c.fillText(text,x,y);}
  function logo(){return texture(4096,2048,(c,w,h)=>{c.fillStyle='#082d29';c.fillRect(0,0,w,h);c.fillStyle='#bcf879';c.beginPath();c.moveTo(45,55);c.lineTo(454,26);c.lineTo(432,45);c.lineTo(48,73);c.fill();c.textAlign='center';c.font='900 80px Arial';c.fillStyle='#f4ffff';c.fillText('DARTS',256,145);c.fillStyle='#a9f178';c.fillText('CAREER',256,224);},8);}
  const logoTexture=logo();
  const carpet=texture(512,512,(c,w,h)=>{let seed=54017;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};c.fillStyle='#555b60';c.fillRect(0,0,w,h);for(let i=0;i<60000;i++){const n=50+Math.floor(rnd()*65);c.fillStyle=`rgb(${n},${n+3},${n+5})`;c.fillRect(rnd()*w,rnd()*h,1,1);}});carpet.wrapS=carpet.wrapT=T.RepeatWrapping;carpet.repeat.set(30,22);
  const ground=plane(carpet,type==='tv'?92:180,65,type==='tv'?-8:14,floor-(type==='tv'?1:.18),17,false);ground.rotation.x=-Math.PI/2;
  function mat(x){box(x,floor-.08,7.0,3.8,.05,15.8,0x252d33);box(x,floor-.044,13.94,3.8,.022,.12,0xe9e9dd,true);}
  if(type==='tv'){
   // The audience is behind the camera. Only the stage backdrop stands behind the board.
   // One wall plane avoids parallax seams between the board area and its sides.
   const wallOffset=1.18,wallZ=-1.7+wallOffset;
   const wallBox=(x,y,z,...dimensions)=>box(x,y,z+wallOffset,...dimensions);
   const wallPlane=(tex,w,h,x,y,z)=>plane(tex,w,h,x,y,z+wallOffset);
   const backdrop=texture(4096,2048,(c,w,h)=>{
    c.save();c.beginPath();c.ellipse(w/2,h,w/2,h,0,Math.PI,Math.PI*2);c.closePath();c.clip();
    const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,mix(palette.deep,wall,.8));g.addColorStop(.5,facet);g.addColorStop(1,wall);c.fillStyle=g;c.fillRect(0,0,w,h);
    for(const [points,fill]of [[[[0,.85],[.15,.28],[.45,.6],[.3,1]],mix(wall,facet,.6)],[[[.1,0],[.38,.1],[.53,.74],[.35,.5]],wall],[[[.49,0],[.76,0],[.7,.49],[.57,.65]],lighter(facet,.05)],[[[.6,.65],[.93,.35],[1,.75],[.77,1]],facet]]){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x*w,y*h):c.moveTo(x*w,y*h));c.closePath();c.fillStyle=fill;c.fill();}
    c.strokeStyle=seam;c.lineWidth=12;c.lineCap='round';for(const angle of [-2.7,-2.22,-1.78,-1.3,-.83,-.36]){c.beginPath();c.moveTo(w*.51,h*1.03);c.lineTo(w*.51+Math.cos(angle)*w,h*1.03+Math.sin(angle)*w);c.stroke();}
    c.lineWidth=11;for(const r of [200,360,520]){c.beginPath();c.ellipse(w*.51,h*1.03,r,r*.66,0,Math.PI,Math.PI*2);c.stroke();}c.restore();
   },4);const back=plane(backdrop,36,18,0,floor+9,wallZ);back.material.transparent=true;back.material.alphaTest=.5;back.material.alphaToCoverage=true;
   back.name='tv-backdrop';
   box(0,floor-.5,12,57,.7,30,0x20272b);
   const stageFloor=plane(carpet,57,30,0,floor-.14,12,false);stageFloor.rotation.x=-Math.PI/2;
   mat(0);box(-2.0,floor-.04,7,.06,.02,15.8,palette.secondary,true);box(2.0,floor-.04,7,.06,.02,15.8,palette.secondary,true);
   // Side panels are geometric colour bands rather than animated/video walls.
   for(const sign of [-1,1]){wallBox(sign*9,-4,-1.48,16,.4,.1,palette.accent,true,sign*.44);wallBox(sign*11,-1.5,-1.46,10,.3,.1,palette.secondary,true,-sign*.6);wallPlane(logoTexture,5,2.5,sign*6.8,-4.5,-1.2);}
   wallPlane(logoTexture,6.4,3.2,0,5.0,-1.25);
   scoreCanvas=document.createElement('canvas');scoreCanvas.width=Math.min(4096,textureLimit);scoreCanvas.height=scoreCanvas.width/2;scoreCanvas.getContext('2d').scale(scoreCanvas.width/768,scoreCanvas.height/384);scoreTexture=configureTexture(track(new T.CanvasTexture(scoreCanvas)));
   const screens=track(new T.MeshBasicMaterial({map:scoreTexture,toneMapped:false}));for(const sign of [-1,1]){wallBox(sign*6.8,1.1,-1.23,7.15,4.15,.55,0x09151f);mesh(new T.PlaneGeometry(6.8,3.85),screens,sign*6.8,1.1,-.94+wallOffset);}
   wallBox(0,9.4,-.9,36,.35,.5,0x454c55);for(const sign of [-1,1])wallBox(sign*17.6,-.4,-.9,.35,19.6,.5,0x454c55);
   for(let i=0;i<16;i++)wallBox(-17+i*2.2,9.4,-.57,1.7,.10,.12,0x79818b,false,i%2?.4:-.4);
   for(const x of [-14,-8,-3,3,8,14]){wallBox(x,8.7,-.1,1.8,1.1,1,0x202c34);wallBox(x,8.64,.42,1.55,.85,.04,0xe7f6f1,true);}
   for(const sign of [-1,1])for(const offset of [0,3]){const x=sign*(12+offset);box(x,floor+.45,.8,1.0,.8,1,0x132027);box(x,floor+.9,.8,.65,.07,.7,offset?palette.accent:palette.secondary,true);wallBox(x,-6.7,-1.44,1.0,4,.05,offset?palette.accent:palette.secondary,true,-sign*.28);}
  }else{
   box(14,2,-1.65,176,26,.35,0x101419);
   for(let i=0;i<220;i++)box(-74+i*.8,2,-1.25,.38,26,.28,i%2===0?0x171d22:0x11171c);
   neighborMaterial=board?.face.material||track(new T.MeshStandardMaterial({map:boardTexture,roughness:.94}));
   const target=board||{face:new T.Mesh(track(new T.CircleGeometry(170/130,192)),neighborMaterial)};
   if(!board){target.face.name='board-face';target.face.position.z=.003;}
   for(const source of Object.values(surround||createSurround(T,track)))repeatTarget(source,surroundCopies);
   for(const source of Object.values(target))repeatTarget(source,boardCopies);
   const labels=texture(2048,512,c=>{c.fillStyle='#e7edf0';c.fillRect(0,0,2048,512);c.fillStyle='#1a2830';c.font='700 70px Arial';c.textAlign='center';stationNumbers.forEach((n,i)=>c.fillText('BOARD '+n,(i%4)*512+256,Math.floor(i/4)*128+91));});
   planeBatch(labels,5.2,1.3,stationNumbers.map(n=>[stationX(n),2.95,-.49]),[4,4]);
   planeBatch(logoTexture,4.8,2.4,stationNumbers.map(n=>[stationX(n),-5.7,-.49]));
   for(const n of stationNumbers){
    const x=stationX(n);box(x,floor+7.0,-.65,8.2,14,.24,0x0d4c8b);box(x-4.15,floor+7,-.62,.16,14.2,.48,0x42515d);box(x+4.15,floor+7,-.62,.16,14.2,.48,0x42515d);
    box(x-3.4,floor-.04,0,.35,.18,3.0,0x36404b);box(x+3.4,floor-.04,0,.35,.18,3.0,0x36404b);mat(x);
    box(x,4.6,-.15,4,.2,1.4,0x3c454e);box(x,4.48,.04,3.7,.07,1.1,0xe7f0f6,true);
   }
  }
  finish(solid);finish(lit,true);group.traverse(m=>{m.updateMatrix();m.matrixAutoUpdate=false;});
  function updateScore(value){if(!scoreCanvas||!value||disposed)return false;const signature=JSON.stringify(value);if(signature===lastScore)return false;lastScore=signature;const c=scoreCanvas.getContext('2d');c.fillStyle=palette.scoreBackground;c.fillRect(0,0,768,384);c.fillStyle=palette.accent;c.fillRect(20,70,728,3);c.fillRect(20,182,728,3);c.fillRect(20,294,728,3);c.fillStyle='#a6c2d4';c.font='700 23px Arial';c.fillText('SETS  LEGS    SCORE',430,46);
   for(let i=0;i<2;i++){const y=146+i*112;c.fillStyle=value.turn===i?palette.score:'#f1f5ff';fit(c,String(value.names[i]).toUpperCase(),28,y,350,38);c.font='700 44px Arial';c.fillText(String(value.sets[i]),456,y);c.fillText(String(value.legs[i]),550,y);c.font='700 64px Arial';c.textAlign='right';c.fillText(String(value.scores[i]),738,y+3);c.textAlign='left';}
   c.fillStyle='#a5c4d8';c.textAlign='center';c.font='700 25px Arial';c.fillText('FIRST TO '+value.target+(value.setsMode?' SETS':' LEGS'),384,349);c.textAlign='left';scoreTexture.needsUpdate=true;return true;}
  updateScore(data);
  return{root:group,type,appearanceKey,updateScore,setBoardTexture(value){if(neighborMaterial&&neighborMaterial.map!==value){neighborMaterial.map=value;neighborMaterial.needsUpdate=true;}},
   syncSurround(){[...surroundCopies,...boardCopies].forEach(({source,copies})=>{copies.visible=source.visible;});},
   widePose(aspect=1){const narrow=Math.max(1,.75/Math.max(.35,aspect)),tvDistance=aspect>=.9?Math.max(24.5,11.25/(Math.tan(Math.PI/10)*aspect)):24.5*narrow;return type==='tv'?{position:new T.Vector3(0,.4,tvDistance),look:new T.Vector3(0,-.7,-.8),fov:36}:{position:new T.Vector3(9,1.5,28*narrow),look:new T.Vector3(-4,-2,-.8),fov:42};},
   getState(){let meshes=0,triangles=0;group.traverse(m=>{if(m.isMesh){meshes++;triangles+=(m.geometry.index?m.geometry.index.count:m.geometry.getAttribute('position').count)/3*(m.isInstancedMesh?m.count:1);}});return{type,meshes,triangles,resources:owned.size,score:lastScore?JSON.parse(lastScore):null,palette:type==='tv'?{...palette}:null,decoratedCenter:!!group.getObjectByName('tv-backdrop'),neighbourSurrounds:surroundCopies.length?neighbours.length:0,stationNumbers:type==='floor'?[...stationNumbers]:[],sharedBoardMaterial:!!board,textureQuality:{logo:[logoTexture.image.width,logoTexture.image.height],anisotropy}};},
   dispose(){if(disposed)return;disposed=true;group.removeFromParent();owned.forEach(r=>r.dispose?.());owned.clear();}};
 }
 root.matchVenue3D=Object.freeze({create,createSurround});
})(globalThis);
