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
function flight(position,velocity){load(0);last=0;cat={...position};vel={...velocity};arrowAngle=Math.atan2(vel.y,vel.x);body={x:cat.x-Math.cos(arrowAngle)*100,y:cat.y-Math.sin(arrowAngle)*100,vx:vel.x,vy:vel.y};resetRag();for(let n of rag){n.px=n.x-body.vx*.002;n.py=n.y-body.vy*.002}flying=true;}
flight({x:2000,y:100},{x:700,y:20});
let initial={...cat},speed={...vel},bodySpeed={x:body.vx,y:body.vy};requestRescue(arrowTip());
check(rescue!==null&&!attached&&!obAttached,'Predict rescue before exiting');
check(cat.x===initial.x&&cat.y===initial.y&&vel.x===speed.x&&vel.y===speed.y,'Request cannot teleport or freeze arrow');
let before=ob.distance;moveOB(.01);check(Math.abs(ob.distance-before)<=24.001,'OB speed bounded');
catchOB();check(cat.x===initial.x&&cat.y===initial.y,'Catch preserves arrow contact position');
check(body.vx===bodySpeed.x&&body.vy===bodySpeed.y,'Catch preserves ragdoll momentum');
before=ob.distance;for(let i=1;i<60;i++)frame(i*16);check(ob.distance===before,'Box stops after catch');
canvas.onpointerdown({clientX:500,clientY:200,pointerId:1});check(!attached&&!tethered&&!obAttached&&rescue===null,'Aiming releases catch');
cat={x:bounds.left-100,y:100};body.x=bounds.left+10;requestRescue(arrowTip());check(rescue===null&&!tethered,'Aiming outside map never reconnects old arrow');
for(let i=60;i<120;i++)frame(i*16);check(!tethered&&!obAttached,'Detached aiming remains free');
for(let [name,position,velocity] of [
 ['left',{x:-20,y:100},{x:-600,y:10}],
 ['right',{x:2020,y:100},{x:600,y:10}],
 ['top',{x:600,y:-250},{x:0,y:-600}],
 ['bottom',{x:600,y:930},{x:0,y:600}],
 ['corner',{x:2030,y:-250},{x:600,y:-600}]
]){flight(position,velocity);ob.distance=boundaryDistance(arrowTip());for(let i=1;i<500&&!obAttached;i++)frame(i*16);check(obAttached,name+' interception');check(rag.every(n=>Number.isFinite(n.x)&&Number.isFinite(n.y)),name+' stability');}
flight({x:2020,y:100},{x:800,y:0});ob.distance=boundaryDistance({x:bounds.left,y:100},'left');for(let i=1;i<600&&!obAttached;i++)frame(i*16);check(obAttached,'Late box must intercept after boundary deflection');
flight({x:300,y:100},{x:300,y:-100});rescue=100;attached=true;requestRescue(arrowTip());check(rescue===null,'Island attachment cancels interception');
load(0);before=ob.distance;for(let i=1;i<100;i++)frame(i*16);check(ob.distance===before,'Idle box remains still');
console.log('PASS: prediction without teleport, bounded pursuit, contact continuity, momentum, catch stop, aim release, four edges/corner, late interception, idle behavior');
`,sandbox);
