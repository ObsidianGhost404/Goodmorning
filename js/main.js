import * as THREE from 'three';

window.addEventListener('load',()=>{setTimeout(()=>{document.getElementById('loader').classList.add('done');document.body.classList.add('loaded')},1500)});
document.getElementById('year').textContent=new Date().getFullYear();

const cursor=document.getElementById('cursor'),ring=document.getElementById('cursorRing');let mx=0,my=0,rx=0,ry=0;
window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`});
(function animateRing(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(animateRing)})();
document.querySelectorAll('a,button,[data-tilt]').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'))});

const nav=document.getElementById('nav');window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});
const burger=document.getElementById('burger'),mobileMenu=document.getElementById('mobileMenu');
burger.addEventListener('click',()=>{burger.classList.toggle('open');mobileMenu.classList.toggle('open')});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');mobileMenu.classList.remove('open')}));

const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${(i%4)*.08}s`;io.observe(el)});

const counterIO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=+el.dataset.count,dur=1600,start=performance.now();(function tick(now){const p=Math.min((now-start)/dur,1);el.textContent=Math.floor(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)})(start);counterIO.unobserve(el)})},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>counterIO.observe(el));

document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1000px) rotateX(${-y*8}deg) rotateY(${x*8}deg) translateY(-4px)`});card.addEventListener('mouseleave',()=>{card.style.transform=''})});
document.querySelectorAll('[data-magnetic]').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.25}px,${y*.25}px)`});el.addEventListener('mouseleave',()=>{el.style.transform=''})});

const canvas=document.getElementById('hero-canvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setSize(window.innerWidth,window.innerHeight);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,100);camera.position.set(0,0,8);
scene.add(new THREE.AmbientLight(0xffffff,.4));const l1=new THREE.PointLight(0x7c3aed,40,30);l1.position.set(4,3,4);scene.add(l1);const l2=new THREE.PointLight(0x06b6d4,40,30);l2.position.set(-4,-2,3);scene.add(l2);const l3=new THREE.PointLight(0xec4899,30,30);l3.position.set(0,4,-3);scene.add(l3);
const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.15,.36,220,40,2,3),new THREE.MeshPhysicalMaterial({color:0x151525,metalness:.9,roughness:.15,clearcoat:1,clearcoatRoughness:.1,emissive:0x2a0a4a,emissiveIntensity:.4}));scene.add(knot);
const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(2.4,1),new THREE.MeshBasicMaterial({color:0x7c3aed,wireframe:true,transparent:true,opacity:.12}));scene.add(shell);
const ringGroup=new THREE.Group();[[3.2,0x06b6d4],[3.7,0xec4899]].forEach(([r,c],i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.012,16,200),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.5}));ring.rotation.x=Math.PI/2+i*.4;ring.rotation.y=i*.6;ringGroup.add(ring)});scene.add(ringGroup);
const pCount=900,pPos=new Float32Array(pCount*3);for(let i=0;i<pCount*3;i++)pPos[i]=(Math.random()-.5)*24;const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xffffff,size:.025,transparent:true,opacity:.6,sizeAttenuation:true}));scene.add(particles);
function layout(){const w=window.innerWidth,h=window.innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);const offset=w>900?2.6:0;knot.position.x=shell.position.x=ringGroup.position.x=offset;const s=w>900?1:.6;knot.scale.setScalar(s);shell.scale.setScalar(s);ringGroup.scale.setScalar(s)}layout();window.addEventListener('resize',layout);
let tx=0,ty=0;window.addEventListener('mousemove',e=>{tx=(e.clientX/window.innerWidth-.5)*2;ty=(e.clientY/window.innerHeight-.5)*2});let scrollY=0;window.addEventListener('scroll',()=>{scrollY=window.scrollY},{passive:true});
const clock=new THREE.Clock();function render(){const t=clock.getElapsedTime();knot.rotation.x=t*.25;knot.rotation.y=t*.35;knot.position.y=Math.sin(t*.8)*.2-scrollY*.002;shell.rotation.y=-t*.12;shell.rotation.z=t*.08;shell.position.y=knot.position.y;ringGroup.rotation.y=t*.2;ringGroup.rotation.x=Math.sin(t*.3)*.3;ringGroup.position.y=knot.position.y;particles.rotation.y=t*.02;particles.rotation.x=t*.01;camera.position.x+=(tx*.6-camera.position.x)*.05;camera.position.y+=(-ty*.4-camera.position.y)*.05;camera.lookAt(knot.position.x*.6,0,0);renderer.render(scene,camera);requestAnimationFrame(render)}render();
