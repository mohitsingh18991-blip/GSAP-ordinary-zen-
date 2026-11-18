import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, Menu, X, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function CoffeeOrb() {
  const host = useRef(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, el.clientWidth / el.clientHeight, .1, 100);
    camera.position.z = 5.2;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    const group = new THREE.Group(); scene.add(group);
    const beanGeo = new THREE.SphereGeometry(1, 64, 48);
    const beanMat = new THREE.MeshStandardMaterial({ color: 0x8b4e2c, roughness: .27, metalness: .08 });
    const bean = new THREE.Mesh(beanGeo, beanMat); bean.scale.set(1.05, .72, .48); group.add(bean);
    const seam = new THREE.Mesh(new THREE.TorusGeometry(.52, .025, 12, 100, Math.PI * 1.3), new THREE.MeshStandardMaterial({color:0x351b12, roughness:.8}));
    seam.rotation.set(.18, 0, .32); seam.scale.set(1.25,.82,.7); group.add(seam);
    const light = new THREE.PointLight(0xffd5a1, 95, 20); light.position.set(2,3,4); scene.add(light);
    scene.add(new THREE.AmbientLight(0xffe6cc, 1.3));
    const resize = () => { const w=el.clientWidth,h=el.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    window.addEventListener('resize', resize);
    let frame; const tick = () => { group.rotation.y += .003; group.rotation.x = Math.sin(Date.now()*.0005)*.12; renderer.render(scene,camera); frame=requestAnimationFrame(tick); }; tick();
    const move = (e) => { const r=el.getBoundingClientRect(); gsap.to(group.rotation,{x:((e.clientY-r.top)/r.height-.5)*.35,y:((e.clientX-r.left)/r.width-.5)*.5,duration:.7}); };
    el.addEventListener('pointermove',move);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize',resize); el.removeEventListener('pointermove',move); renderer.dispose(); beanGeo.dispose(); beanMat.dispose(); el.removeChild(renderer.domElement); };
  }, []);
  return <div className="orb-canvas" ref={host} aria-label="A slowly rotating three-dimensional coffee bean" />;
}

const products = [
  { name:'The Daily Ritual', type:'House blend · Medium roast', price:'₹650', note:'Chocolate, toasted almond, orange' },
  { name:'Quiet Hours', type:'Single origin · Light roast', price:'₹780', note:'Jasmine, stone fruit, honey' },
  { name:'Afterglow', type:'Single origin · Dark roast', price:'₹720', note:'Cocoa, caramel, soft spice' }
];

export default function App() {
  const [menuOpen,setMenuOpen] = useState(false);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *',{y:38,opacity:0,duration:1,stagger:.13,ease:'power3.out',delay:.15});
      gsap.from('.hero-visual',{scale:.82,opacity:0,duration:1.4,ease:'power3.out',delay:.25});
      gsap.utils.toArray('.reveal').forEach(el => gsap.fromTo(el,{y:48,opacity:0},{y:0,opacity:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 84%'}}));
      gsap.to('.story-image',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:true}});
      gsap.to('.marquee-track',{xPercent:-22,ease:'none',scrollTrigger:{trigger:'.marquee',start:'top bottom',end:'bottom top',scrub:true}});
    });
    return () => ctx.revert();
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return <main>
    <nav className="nav">
      <a className="brand" href="#top" onClick={closeMenu}>ordinary<span>zen</span><i>®</i></a>
      <div className={`nav-links ${menuOpen?'open':''}`}>
        <a href="#story" onClick={closeMenu}>Our philosophy</a><a href="#coffee" onClick={closeMenu}>The coffee</a><a href="#visit" onClick={closeMenu}>Find us</a>
      </div>
      <a className="nav-cta" href="#coffee">Explore coffee <ArrowUpRight size={15}/></a>
      <button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
    </nav>

    <section className="hero" id="top">
      <div className="hero-grain" />
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line"/> A LITTLE LESS ORDINARY</p>
        <h1>Find your<br/><em>quiet.</em></h1>
        <p className="hero-description">Coffee for the moments in between. Thoughtfully sourced, slowly made, and best enjoyed without rushing.</p>
        <a href="#story" className="round-link">Discover our ritual <span><ArrowDown size={17}/></span></a>
      </div>
      <div className="hero-visual"><div className="orb-halo"/><CoffeeOrb/><div className="vertical-note">SLOW DOWN · SIP DEEPLY · REPEAT</div><div className="hero-stamp">OZ<br/><small>EST. 2024</small></div></div>
      <div className="hero-bottom"><span>01 / 03</span><span>CRAFTED FOR THE EVERYDAY</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="intro" id="story">
      <div className="section-kicker reveal">01 — THE ORDINARY, REIMAGINED</div>
      <div className="intro-grid">
        <h2 className="reveal">A pause is<br/>a <em>powerful</em><br/>thing.</h2>
        <div className="intro-copy reveal"><p>We believe the best parts of life aren't loud. They're the first sip before the day begins, the familiar cup held in both hands, the small space you make just for yourself.</p><p>Ordinary Zen is an invitation to find something special in the everyday. One considered cup at a time.</p><a className="text-link" href="#coffee">A little about our coffee <ArrowUpRight size={16}/></a></div>
      </div>
    </section>

    <section className="story">
      <div className="story-image" role="img" aria-label="Warm sunlight falling across freshly brewed coffee" />
      <div className="story-caption"><span>THE ART OF SLOW</span><span>MADE WITH INTENTION, ALWAYS.</span></div>
    </section>

    <section className="manifesto">
      <p className="eyebrow reveal">A SMALL MANIFESTO</p>
      <h2 className="reveal">Good things take<br/>their <em>own sweet time.</em></h2>
      <p className="manifesto-foot reveal">No shortcuts. No noise. Just good coffee and a moment to call your own.</p>
    </section>

    <section className="coffee-section" id="coffee">
      <div className="coffee-head"><div><p className="section-kicker reveal">02 — THE GOOD STUFF</p><h2 className="reveal">Meet your<br/><em>everyday.</em></h2></div><p className="coffee-side reveal">A few favourites, roasted with care<br/>and ready for your ritual.</p></div>
      <div className="product-grid">{products.map((p,i)=><article className="product reveal" key={p.name}><div className={`product-art art-${i+1}`}><span className="bag-label">ORDINARY ZEN<small>COFFEE / INDIA</small><b>{['01','02','03'][i]}</b></span><div className="bag-seal">OZ</div></div><div className="product-meta"><div><h3>{p.name}</h3><p>{p.type}</p></div><span>{p.price}</span></div><p className="tasting">{p.note}</p></article>)}</div>
      <p className="coming-soon">OUR ONLINE STORE IS BREWING — COMING SOON</p>
    </section>

    <section className="marquee"><div className="marquee-track">MAKE ROOM FOR A MOMENT <span>✳</span> MAKE ROOM FOR A MOMENT <span>✳</span> MAKE ROOM FOR A MOMENT <span>✳</span></div></section>

    <section className="visit" id="visit"><div className="visit-left"><p className="eyebrow"><span className="eyebrow-line"/> 03 — COME AS YOU ARE</p><h2>Take the<br/>long <em>way.</em></h2><p>Good coffee tastes even better when there's nowhere else you need to be.</p><a href="mailto:hello@ordinaryzen.coffee" className="round-link">Say hello <span><ArrowUpRight size={17}/></span></a></div><div className="visit-right"><div className="sun-disc"/><span className="visit-note">YOUR NEXT<br/>FAVOURITE<br/>RITUAL AWAITS.</span></div></section>

    <footer><a className="brand footer-brand" href="#top">ordinary<span>zen</span><i>®</i></a><span>FIND YOUR QUIET. © 2026 ORDINARY ZEN COFFEE.</span><a href="https://instagram.com" aria-label="Instagram"><Instagram size={18}/></a></footer>
  </main>;
}