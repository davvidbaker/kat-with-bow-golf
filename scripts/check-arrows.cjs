const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/index.html'),'utf8');
const elements={},context=new Proxy({},{get:()=>()=>{}});
const canvas={getContext:()=>context,getBoundingClientRect:()=>({left:0,top:0,width:1100,height:540}),setPointerCapture:()=>{}};
const sandbox={document:{querySelector:()=>canvas,getElementById:id=>elements[id]??={style:{}}},Image:class{},requestAnimationFrame:()=>{},Math,console};
vm.createContext(sandbox);
vm.runInContext(html.split('<script>')[1].split('</script>')[0],sandbox);
vm.runInContext(`
function check(value,message){if(!value)throw Error(message)}
load(0);flying=true;cat={x:600,y:0};vel={x:300,y:-100};arrowAngle=Math.atan2(vel.y,vel.x);body={x:500,y:0,vx:100,vy:0};resetRag();
canvas.onpointerdown({clientX:500,clientY:200,pointerId:1});
check(oldArrows.length===1&&!tethered,'Detach archives old arrow and releases tether');
const arrow=oldArrows[0];check(arrow.vx===300&&arrow.vy===-100,'Old arrow keeps momentum');
stepOldArrows(.02);check(arrow.x>600&&arrow.y<0&&!arrow.stuck,'Old arrow keeps flying while aiming');
canvas.onpointercancel();canvas.onpointerdown({clientX:500,clientY:200,pointerId:1});check(oldArrows.length===1,'Canceled drag must not duplicate old arrow');
canvas.onpointermove({clientX:400,clientY:300});const preview=shotState(drag);canvas.onpointerup({clientX:400,clientY:300});
check(cat.x===preview.origin.x&&cat.y===preview.origin.y&&arrowAngle===preview.angle,'New arrow matches aiming preview');
check(oldArrows.length===1,'New shot retains previous arrow');
oldArrows=[{x:600,y:surface(levels[0].p[0],600)-40,vx:0,vy:300,angle:Math.PI/2,stuck:false}];for(let i=0;i<30;i++)stepOldArrows(.016);
const landed={...oldArrows[0]};check(landed.stuck,'Old arrow sticks in terrain');for(let i=0;i<30;i++)stepOldArrows(.016);check(oldArrows[0].x===landed.x&&oldArrows[0].y===landed.y,'Landed arrow stays in level');
oldArrows=[{x:bounds.right-50,y:50,vx:800,vy:0,angle:0,stuck:false}];stepOldArrows(.1);check(oldArrows[0].stuck,'Old arrow stays at boundary');
load(0);shots=2;oldArrows=[{x:levels[0].t[0]-32,y:levels[0].t[1],vx:20,vy:0,angle:0,stuck:false}];flying=true;attached=false;vel={x:150,y:0};stepOldArrows(.016);
check(won&&oldArrows[0].stuck&&score[0]===2,'Old arrow can complete hole');check(!attached&&vel.x===150,'Old-arrow win does not freeze current flight');
load(1);check(oldArrows.length===0,'Next hole clears previous course arrows');
console.log('PASS: detached-arrow momentum, canceled aim, matching release, terrain/boundary persistence, old-arrow target hit, course reset');
`,sandbox);
