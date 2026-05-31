'use client';

import { TextAlignCenter } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

/*
  FONTS – add to layout.tsx / _document.tsx:
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
*/

// ── Palette ──────────────────────────────────────────────
const G1     = '#073670';   // gold dark
const G2     = '#20236b';   // gold light
const G3     = '#af90dd';   // gold pale
const ROSE   = '#557bdb';   // terracotta rose accent
const SAGE   = '#7A9E8A';   // sage green accent
const BLUE   = '#99bde1';   // dusty blue accent
const CREAM  = '#ddd9cd';
const STONE  = '#635e9a';
const STONE2 = '#e7e3c4';
const INK    = '#193b59';
const INK2   = '#08121c';
const MUTED  = '#0a284f';
const BORDER = '#070a17';

// ── Types ─────────────────────────────────────────────────
interface PetalProps        { x:string; y:string; size:number; rotate:number; opacity:number; color?:string; }
interface GoldLineProps     { width?:number; my?:number; color?:string; }
interface SectionTitleProps { children:React.ReactNode; sub?:string; light?:boolean; accent?:string; }
interface VenuePhotoProps   { src:string; alt:string; style?:React.CSSProperties; overlay?:string; }
interface TimelineItemProps { time:string; title:string; desc:string; last:boolean; color:string; icon:string; }
interface EnvelopeProps     { onOpen:()=>void; }
interface FadeInProps       { children:React.ReactNode; delay?:number; style?:React.CSSProperties; }

// ── FadeIn on scroll ──────────────────────────────────────
function FadeIn({ children, delay = 0, style }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); }}, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ── Petal ─────────────────────────────────────────────────
function Petal({ x, y, size, rotate, opacity, color = G2 }: PetalProps) {
  return (
    <div style={{
      position:'absolute', left:x, top:y, pointerEvents:'none',
      width:size, height:size*1.7,
      borderRadius:'50% 50% 48% 52% / 62% 62% 38% 38%',
      background:`linear-gradient(140deg,${color}55,${color}18)`,
      transform:`rotate(${rotate}deg)`, opacity,
    }}/>
  );
}

// ── Gold line ─────────────────────────────────────────────
function GoldLine({ width=120, my=16, color=G1 }: GoldLineProps) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, margin:`${my}px auto`, width:'fit-content' }}>
      <div style={{ width:width/2, height:1, background:`linear-gradient(to right,transparent,${color})` }}/>
      <div style={{ width:50, height:50, borderRadius:'50%', background:color, flexShrink:0 }}/>
      <div style={{ width:width/2, height:1, background:`linear-gradient(to left,transparent,${color})` }}/>
    </div>
  );
}

// ── Section title ─────────────────────────────────────────
function SectionTitle({ children, sub, light=false, accent=G1 }: SectionTitleProps) {
  const c = light ? CREAM : INK;
  return (
    <div style={{ textAlign:'center', marginBottom:52 }}>
      {sub && <p style={{
        fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'5px',
        textTransform:'uppercase', color:accent, marginBottom:14,
      }}>{sub}</p>}
      <h2 style={{
        fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,5vw,50px)',
        fontWeight:400, color:c, margin:0, lineHeight:1.1,
      }}>{children}</h2>
      <GoldLine color={accent}/>
    </div>
  );
}

// ── Venue photo ───────────────────────────────────────────
function VenuePhoto({ src, alt, style, overlay }: VenuePhotoProps) {
  return (
    <div style={{ borderRadius:4, overflow:'hidden', position:'relative', ...style }}>
      <img src={src} alt={alt} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy"/>
      <div style={{ position:'absolute', inset:0, background: overlay || `linear-gradient(to bottom,transparent 55%,${INK}40)` }}/>
    </div>
  );
}

// ── Timeline item ─────────────────────────────────────────
function TimelineItem({ time, title, desc, last, color, icon }: TimelineItemProps) {
  return (
    <div style={{ display:'flex', gap:20, position:'relative' }}>
      {!last && <div style={{ position:'absolute', left:19, top:46, bottom:-24, width:1, background:`linear-gradient(to bottom,${color}60,${BORDER})` }}/>}
      <div style={{ flexShrink:0 }}>
        <div style={{
          width:40, height:40, borderRadius:'50%',
          background:`linear-gradient(135deg,${color}25,${color}10)`,
          border:`2px solid ${color}60`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16,
        }}>{icon}</div>
      </div>
      <div style={{ paddingBottom: last ? 0 : 28 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:color, letterSpacing:'2px', textTransform:'uppercase', margin:'8px 0 2px' }}>{time}</p>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:500, color:INK, margin:'0 0 4px' }}>{title}</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:MUTED, margin:0, lineHeight:1.6 }}>{desc}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  ENVELOPE
// ══════════════════════════════════════════════
function Envelope({ onOpen }: EnvelopeProps) {
  const [hover, setHover]     = useState(false);
  const [opening, setOpening] = useState(false);
  const [phase, setPhase]     = useState(0);

  const handleClick = () => {
    if (opening) return;
    setOpening(true); setPhase(1);
    setTimeout(()=>setPhase(2), 850);
    setTimeout(()=>setPhase(3), 1500);
    setTimeout(()=>onOpen(),    2100);
  };

  const flapAngle = phase>=1 ? -178 : 0;
  const cardY     = phase>=2 ? -200 : 24;
  const cardScale = phase>=2 ? 1.07 : 0.90;
  const cardOp    = phase>=2 ? 1 : 0;
  const envOp     = phase>=3 ? 0 : 1;

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', flexDirection:'column',
      background:`linear-gradient(160deg,#FBF6EE 0%,#F5EBD8 40%,#EEE0CB 100%)`,
      position:'relative', overflow:'hidden',
    }}>
      {/* background decorative circles */}
      <div style={{ position:'absolute', top:-120, right:-120, width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle,${G2}18,transparent 70%)`, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:-80, left:-80, width:380, height:380, borderRadius:'50%', background:`radial-gradient(circle,${ROSE}12,transparent 70%)`, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:'30%', left:'5%', width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle,${SAGE}10,transparent 70%)`, pointerEvents:'none' }}/>

      {/* petals */}
      <Petal x="4%"  y="8%"  size={70}  rotate={28}  opacity={0.5} color={G2}/>
      <Petal x="83%" y="6%"  size={55}  rotate={-38} opacity={0.4} color={ROSE}/>
      <Petal x="7%"  y="72%" size={60}  rotate={65}  opacity={0.4} color={SAGE}/>
      <Petal x="81%" y="75%" size={75}  rotate={-22} opacity={0.4} color={G1}/>
      <Petal x="44%" y="3%"  size={35}  rotate={12}  opacity={0.3} color={BLUE}/>
      <Petal x="52%" y="88%" size={45}  rotate={-55} opacity={0.35} color={ROSE}/>
      <Petal x="20%" y="45%" size={28}  rotate={80}  opacity={0.25} color={G2}/>
      <Petal x="72%" y="40%" size={32}  rotate={-15} opacity={0.25} color={SAGE}/>

      {/* dot grid */}
      <div style={{ position:'absolute', inset:0, opacity:0.3, backgroundImage:`radial-gradient(circle,${G1}44 1px,transparent 1px)`, backgroundSize:'38px 38px', pointerEvents:'none' }}/>

      {/* header text */}
      <div style={{ textAlign:'center', marginBottom:44, position:'relative', zIndex:2, opacity:envOp, transition:'opacity 0.5s' }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'6px', textTransform:'uppercase', color:MUTED, marginBottom:14 }}>
          Vous êtes cordialement invités
        </p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,7vw,56px)', fontWeight:300, color:INK, margin:0, lineHeight:1.15 }}>
          Bechir <span style={{ color:G1, fontStyle:'italic' }}>&amp;</span> Roua
        </h1>
        <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:14 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:ROSE, display:'inline-block', opacity:0.7 }}/>
          <span style={{ width:8, height:8, borderRadius:'50%', background:G1,   display:'inline-block', opacity:0.7 }}/>
          <span style={{ width:8, height:8, borderRadius:'50%', background:SAGE, display:'inline-block', opacity:0.7 }}/>
        </div>
      </div>

      {/* envelope */}
      <div
        onClick={handleClick}
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        style={{
          position:'relative', zIndex:10, 
          width: 'min(460px, 92vw)',   // ← Agrandie
          cursor: opening ? 'default' : 'pointer',
          opacity: envOp, 
          transform: hover&&!opening ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
          transition:'all 0.35s',
        }}
      >
        {/* peeking card */}
        <div style={{
          position:'absolute', left:'10%', right:'10%', top:0, bottom:'8%',
          background:'linear-gradient(160deg,#FFFDF9,#FBF5EA)',
          borderRadius:'4px 4px 0 0',
          border:`1px solid ${BORDER}`,
          transform:`translateY(${cardY}px) scale(${cardScale})`,
          opacity:cardOp,
          transition:'transform 0.7s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s',
          zIndex:5, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          padding:28, textAlign:'center',
          boxShadow:'0 12px 48px rgba(44,36,23,0.18)',
        }}>
          {/* colored bar top */}
          <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:3, background:`linear-gradient(to right,${ROSE},${G1},${SAGE})`, borderRadius:'0 0 3px 3px' }}/>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:'5px', textTransform:'uppercase', color:G1, margin:'12px 0 0' }}>Faire-part de mariage</p>
          <div style={{ margin:'14px 0 10px', width:36, height:1, background:G1 }}/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:400, color:INK, lineHeight:1.25, margin:0 }}>Bechir<br/><span style={{ fontStyle:'italic', color:G1 }}>&amp; Roua</span></p>
          <div style={{ margin:'10px 0 14px', width:36, height:1, background:G1 }}/>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:MUTED, letterSpacing:'3px' }}>27 · 06 · 2026</p>
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            {[ROSE, G1, SAGE, BLUE].map((c,i)=>(
              <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:c, opacity:0.6 }}/>
            ))}
          </div>
        </div>

        {/* envelope body */}
        <div style={{
          position:'relative', paddingTop:'80%', borderRadius:8,
          boxShadow: hover&&!opening ? '0 28px 70px rgba(210, 191, 159, 0.22)' : '0 10px 40px rgba(189, 182, 172, 0.14)',
          transition:'box-shadow 0.35s', overflow:'hidden',
        }}>
          {/* body */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(155deg,#FDF8F0,#EEE0C8)', border:`1px solid ${BORDER}`, borderRadius:8 }}/>
          {/* subtle inner pattern */}
          <div style={{ position:'absolute', inset:0, opacity:0.06, backgroundImage:`repeating-linear-gradient(45deg,${INK} 0px,${INK} 1px,transparent 1px,transparent 8px)`, borderRadius:8 }}/>
          {/* bottom inside triangle */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'54%', background:'linear-gradient(165deg,#EDE0C5,#E0CDA8)', clipPath:'polygon(0% 100%,50% 0%,100% 100%)' }}/>
          {/* left flap */}
          <div style={{ position:'absolute', bottom:0, left:0, width:'73%', height:'60%', background:'linear-gradient(140deg,#E8DABC,#D9C89A)', clipPath:'polygon(0% 100%,0% 0%,100% 100%)' }}/>
          {/* right flap */}
          <div style={{ position:'absolute', bottom:0, right:0, width:'73%', height:'60%', background:'linear-gradient(220deg,#E8DABC,#D9C89A)', clipPath:'polygon(100% 100%,100% 0%,0% 100%)' }}/>

          {/* TOP FLAP */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:'56%',
            transformOrigin:'50% 0%',
            transform:`rotateX(${flapAngle}deg)`,
            transition:'transform 0.9s cubic-bezier(0.6,0.01,0,1)',
            transformStyle:'preserve-3d', zIndex:20,
          }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(175deg,#FBF5E8,#EDE0C5)', clipPath:'polygon(0% 0%,50% 100%,100% 0%)', backfaceVisibility:'hidden' }}/>
            {/* colored top edge */}
            <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:2, background:`linear-gradient(to right,${ROSE},${G1},${SAGE})`, backfaceVisibility:'hidden' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,#CEC09E,#B8AA82)', clipPath:'polygon(0% 0%,50% 100%,100% 0%)', backfaceVisibility:'hidden', transform:'rotateX(180deg)' }}/>
          </div>

          {/* Wax seal */}
          <div style={{
            position:'absolute', top:'35%', left:'50%',
            transform:'translate(-50%,-50%)',
            zIndex: phase>=1 ? 0 : 30,
            opacity: phase>=1 ? 0 : 1,
            transition:'opacity 0.35s',
          }}>
            <div style={{
              width:70, height:70, borderRadius:'50%',
              background:`conic-gradient(from 0deg,${ROSE},${G1},${G2},${G1},${ROSE})`,
              boxShadow:`0 3px 16px ${G1}60,inset 0 1px 3px rgba(241, 241, 192, 0.35)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              position:'relative',
            }}>
              <div style={{ position:'absolute', inset:5, borderRadius:'50%', border:`1px solid rgba(160, 159, 187, 0.5)`, background:`radial-gradient(circle at 35% 35%,${G2},${G1})` }}/>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:'white', position:'relative', letterSpacing:'-1px' }}>B&R</span>
            </div>
          </div>

          {/* hint */}
          <div style={{ position:'absolute', bottom:12, left:0, right:0, textAlign:'center', zIndex:10 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, margin:0 }}>
              {opening ? '✦ ✦ ✦' : 'Cliquer pour ouvrir'}
            </p>
          </div>
        </div>
      </div>

      {/* date */}
      <div style={{ marginTop:32, textAlign:'center', zIndex:2, position:'relative', opacity:envOp, transition:'opacity 0.5s' }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:300, color:MUTED, letterSpacing:'5px', margin:0 }}>
          27 · 06 · 2026
        </p>
        
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  RSVP FORM
// ══════════════════════════════════════════════
function RSVPForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:'', guests:'1', attendance:'yes', diet:'' });

  const inputStyle = {
    width:'100%', boxSizing:'border-box' as const,
    padding:'14px 18px',
    border:`1.5px solid ${BORDER}`,
    borderRadius:6, background:'white',
    fontFamily:"'DM Sans',sans-serif",
    fontSize:15, color:INK, outline:'none',
    transition:'border-color 0.2s, box-shadow 0.2s',
  };

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'48px 24px' }}>
      <div style={{
        width:80, height:80, borderRadius:'50%',
        background:`linear-gradient(135deg,${ROSE},${G1})`,
        display:'flex', alignItems:'center', justifyContent:'center',
        margin:'0 auto 24px', fontSize:34, color:'white',
        boxShadow:`0 8px 32px ${G1}40`,
      }}>✓</div>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:400, color:INK, margin:'0 0 12px' }}>
        Merci {form.name.split(' ')[0]} !
      </h3>
      <p style={{ fontFamily:"'DM Sans',sans-serif", color:MUTED, fontSize:15 }}>
        Votre présence a bien été confirmée. À bientôt !
      </p>
    </div>
  );

  return (
    <div style={{ maxWidth:520, margin:'0 auto' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <input style={inputStyle} placeholder="Votre nom et prénom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <select style={{...inputStyle,cursor:'pointer'}} value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})}>
            {['1','2','3','4'].map(n=>(
              <option key={n} value={n}>{n} personne{n>'1'?'s':''}</option>
            ))}
          </select>
          <select style={{...inputStyle,cursor:'pointer'}} value={form.attendance} onChange={e=>setForm({...form,attendance:e.target.value})}>
            <option value="yes">Je serai présent(e)</option>
            <option value="no">Je ne pourrai pas venir</option>
          </select>
        </div>
        <textarea style={{...inputStyle,height:100,resize:'vertical',lineHeight:1.6}} placeholder="Allergies ou régimes alimentaires (facultatif)" value={form.diet} onChange={e=>setForm({...form,diet:e.target.value})}/>
        <button
          onClick={()=>form.name.trim()&&setSubmitted(true)}
          style={{
            padding:'17px 32px',
            background: form.name.trim() ? `linear-gradient(135deg,${ROSE},${G1})` : BORDER,
            color: form.name.trim() ? 'white' : MUTED,
            border:'none', borderRadius:6,
            fontFamily:"'DM Sans',sans-serif",
            fontSize:12, letterSpacing:'3px', textTransform:'uppercase' as const,
            cursor: form.name.trim() ? 'pointer' : 'default',
            transition:'all 0.25s',
            boxShadow: form.name.trim() ? `0 6px 24px ${ROSE}40` : 'none',
          }}
        >Confirmer ma présence</button>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:MUTED, textAlign:'center' as const, margin:0 }}>
          Répondre avant le <strong style={{color:INK}}>5 Jui 2026</strong>
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  WEDDING PAGE
// ══════════════════════════════════════════════
function WeddingPage() {
  const [visible, setVisible]       = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [hoveredNav, setHoveredNav]   = useState<string|null>(null);
  const [hovDiscover, setHovDiscover] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTimeout(()=>setVisible(true), 60);
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id:string) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});

  const navLinks = [
    {id:'ceremony',label:'Cérémonie'},
    {id:'program', label:'Programme'},
    {id:'venue',   label:'Le Lieu'},
    {id:'gallery', label:'Galerie'},
    {id:'rsvp',    label:'RSVP'},
  ];

  return (
    <div style={{ background:CREAM, color:INK, fontFamily:"'DM Sans',sans-serif", opacity:visible?1:0, transition:'opacity 0.9s ease',maxWidth: '100vw',
      overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        padding: navScrolled ? '12px 44px' : '22px 44px',
        background: navScrolled ? 'rgba(159, 151, 238, 0.97)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(14px)' : 'none',
        borderBottom: navScrolled ? `1px solid ${BORDER}`:'none',
        transition:'all 0.35s',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:400, color:INK, letterSpacing:'0.04em' }}>
          B<span style={{color:G1}}>&amp; </span>R
        </span>
        <div style={{ display:'flex', gap:18, alignItems:'center' }}>
          {navLinks.map(l=>(
            <button key={l.id} onClick={()=>scrollTo(l.id)}
              style={{
                background:'none', border:'none', cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'2.5px',
                textTransform:'uppercase', padding:0, transition:'color 0.2s',
                color: hoveredNav===l.id ? G1 : MUTED,
              }}
              onMouseEnter={()=>setHoveredNav(l.id)}
              onMouseLeave={()=>setHoveredNav(null)}
            >{l.label}</button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        textAlign:'center', padding:'120px 24px 80px',
        position:'relative', overflow:'hidden',
        background:`linear-gradient(170deg,#FAF6EE 0%,#F4EADA 50%,#EDE1CC 100%)`,
      }}>
        {/* big bg rings */}
        {[700,540,380].map((s,i)=>(
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            width:s, height:s, borderRadius:'50%',
            border:`1px solid ${G1}${18+i*8}`,
            pointerEvents:'none',
          }}/>
        ))}
        {/* color blobs */}
        <div style={{ position:'absolute', top:'-10%', right:'-8%', width:360, height:360, borderRadius:'50%', background:`radial-gradient(circle,${ROSE}20,transparent 70%)`, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-5%', left:'-6%', width:300, height:300, borderRadius:'50%', background:`radial-gradient(circle,${SAGE}18,transparent 70%)`, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'20%', left:'8%',  width:180, height:180, borderRadius:'50%', background:`radial-gradient(circle,${BLUE}14,transparent 70%)`, pointerEvents:'none' }}/>

        <Petal x="4%"  y="18%" size={90} rotate={28}  opacity={0.35} color={ROSE}/>
        <Petal x="80%" y="12%" size={70} rotate={-30} opacity={0.3}  color={G2}/>
        <Petal x="9%"  y="62%" size={55} rotate={58}  opacity={0.25} color={SAGE}/>
        <Petal x="83%" y="66%" size={80} rotate={-48} opacity={0.28} color={G1}/>
        <Petal x="48%" y="4%"  size={38} rotate={14}  opacity={0.22} color={BLUE}/>

        {/* dot grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle,${G1}22 1px,transparent 1px)`, backgroundSize:'42px 42px', opacity:0.45, pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex:2 }}>
          <FadeIn delay={0.1}>
            <p style={{ fontSize:10, letterSpacing:'6px', textTransform:'uppercase', color:G1, marginBottom:24 }}>
              Faire-part de Mariage
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <h1 style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'clamp(58px,13vw,116px)',
              fontWeight:300, color:INK, margin:0,
              lineHeight:0.92, letterSpacing:'-0.02em',
            }}>
              Bechir<br/>
              <span style={{ fontStyle:'italic', color:G1, fontWeight:300 }}>& Roua</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'30px auto', width:'fit-content' }}>
              <div style={{ width:40, height:1, background:`linear-gradient(to right,transparent,${ROSE})` }}/>
              <div style={{ width:7, height:7, borderRadius:'50%', background:ROSE }}/>
              <div style={{ width:60, height:1, background:G1 }}/>
              <div style={{ width:7, height:7, borderRadius:'50%', background:G1 }}/>
              <div style={{ width:40, height:1, background:`linear-gradient(to left,transparent,${SAGE})` }}/>
              <div style={{ width:7, height:7, borderRadius:'50%', background:SAGE }}/>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:300, color:INK2, letterSpacing:'6px', marginBottom:44 }}>
              27 Juin 2026
            </p>
          </FadeIn>

          <FadeIn delay={0.62}>
            <button
              onClick={()=>scrollTo('ceremony')}
              style={{
                background: hovDiscover ? `linear-gradient(135deg,${ROSE},${G1})` : 'transparent',
                border:`1.5px solid ${G1}`,
                padding:'15px 48px', borderRadius:3,
                fontFamily:"'DM Sans',sans-serif",
                fontSize:11, letterSpacing:'3.5px', textTransform:'uppercase' as const,
                color: hovDiscover ? 'white' : G1,
                cursor:'pointer', transition:'all 0.3s',
                boxShadow: hovDiscover ? `0 8px 28px ${ROSE}40` : 'none',
              }}
              onMouseEnter={()=>setHovDiscover(true)}
              onMouseLeave={()=>setHovDiscover(false)}
            >Découvrir</button>
          </FadeIn>
        </div>

        {/* scroll cue */}
        <div style={{ position:'absolute', bottom:40, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <p style={{ fontSize:9, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, margin:0 }}>Défiler</p>
          <div style={{ width:1, height:52, background:`linear-gradient(to bottom,${G1},transparent)`, animation:'scrollLine 2.2s ease-in-out infinite' }}/>
        </div>
      </section>

      {/* ── COLOR BAND ── */}
      <div style={{ height:5, background:`linear-gradient(to right,${ROSE},${G1},${G2},${SAGE},${BLUE},${G1},${ROSE})` }}/>

     {/* CEREMONY */}
      <section id="ceremony" style={{ padding:'108px 32px', background:CREAM }}>
        <div style={{ maxWidth:940, margin:'0 auto' }}>
          <SectionTitle sub="La Cérémonie">Un moment inoubliable</SectionTitle>
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3, borderRadius:10, overflow:'hidden', boxShadow:'0 12px 56px rgba(44,36,23,0.12)', marginBottom:56 }}>
            <VenuePhoto
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
              alt="Salle de cérémonie" style={{ height:400 }}
            />
            <div style={{ background:`linear-gradient(150deg,${STONE},${STONE2})`, padding:'40px 48px' }}>
              <p style={{ fontSize:10, letterSpacing:'4px', textTransform:'uppercase', color:G1, marginBottom:16 }}>
                Résidence la Haute Étoile
              </p>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:400, color:INK, lineHeight:1.15 }}>
                Samedi<br/>27 Juin 2026
              </h3>
              <div style={{ marginTop:56, display:'flex', flexDirection:'column', gap:16 }}>
                {[
                  {icon:'◷', label:'Heure', val:'15h00', color:ROSE},
                  {icon:'◎', label:'Lieu', val:'Résidence la Haute Étoile', color:G1},
                  {icon:'✦', label:'Adresse', val:'Salakta, Tunisie', color:SAGE},
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', gap:14 }}>
                    <span style={{ color:item.color, fontSize:16 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize:9, letterSpacing:'2.5px', textTransform:'uppercase', color:MUTED }}>{item.label}</p>
                      <p style={{ fontSize:15, color:INK }}>{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section id="program" style={{ background:`linear-gradient(175deg,${STONE2} 0%,${STONE} 50%,${CREAM} 100%)`, padding:'108px 32px' }}>
        <div style={{ maxWidth:660, margin:'0 auto' }}>
          <SectionTitle sub="Planning">Programme de la journée</SectionTitle>
          <div style={{ paddingLeft:10 }}>
            {[
              {time:'15h00', title:'Zdek', desc:'Cérémonie du Zdek', icon:'🌸', color:SAGE, last:false},
              {time:'16h00', title:'3ichwiya', desc:'Entrée en koftan, Zdek, puis changement de robe. Moment festif et chaleureux avec une touche 3echwiya.', icon:'💍', color:G1, last:false},
              {time:'18h00', title:'Henna (Soirée précédente)', desc:'26 Juin 2026 - À partir de 18h à la Résidence la Haute Étoile', icon:'🎨', color:ROSE, last:true},
            ].map((item,i)=>(
              <TimelineItem key={i} {...item}/>
            ))}
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section id="venue" style={{ padding:'108px 32px', background:CREAM }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <SectionTitle sub="Le lieu de réception">Résidence la Haute Étoile - Salakta</SectionTitle>
          </div>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
         <VenuePhoto 
            src="sal.jpg"  // Remplacez par l'URL de la photo que je vous ai fournie
          
            alt="Résidence la Haute Étoile - Entrée" 
            style={{ height:500, borderRadius:12, marginBottom:32, boxShadow:'0 20px 80px rgba(0,0,0,0.18)' }} 
          /></div>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
          <VenuePhoto 
            src="qr.jpg"  // Remplacez par l'URL de la photo que je vous ai fournie
            
            alt="Résidence la Haute Étoile - Entrée" 
            style={{ height:200,width:200, borderRadius:12, marginBottom:32, boxShadow:'0 20px 20px rgba(0,0,0,0.18)', textAlign:'center' }} 
          /></div>

          <div style={{ textAlign:'center', marginBottom:40 }}>
            <p style={{ 
              fontSize:15, 
              color:MUTED, 
              marginBottom:16,
              fontWeight:500 
            }}>
              Résidence la Haute Étoile, Salakta
            </p>

          <p style={{ textAlign:'center', fontSize:15, color:MUTED, marginBottom:32 }}>
           <a 
              href="https://google.com/maps/place/929J%2BP8X+Résidence+la+Haute+Étoile,+Salakta" 
              target="_blank" 
              style={{ 
                color:G1, 
                fontSize:17, 
                textDecoration:'underline', 
                fontWeight:500,
                display:'inline-block',
                marginBottom:28
              }}
            >
              📍 Voir sur Google Maps
            </a>
          </p>
        </div>
      </section>

     
     

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ background:`linear-gradient(160deg,#1E1812,#2C2417)`, padding:'108px 32px' }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <FadeIn>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <p style={{ fontSize:10, letterSpacing:'6px', textTransform:'uppercase', color:G1, marginBottom:12 }}>Aperçu</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,5vw,50px)', fontWeight:300, color:CREAM, margin:0 }}>
                L'atmosphère du grand jour
              </h2>
              <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px auto', width:'fit-content' }}>
                <div style={{ width:50, height:1, background:`linear-gradient(to right,transparent,${ROSE})` }}/><div style={{ width:6, height:6, borderRadius:'50%', background:ROSE }}/>
                <div style={{ width:50, height:1, background:G1 }}/><div style={{ width:6, height:6, borderRadius:'50%', background:G1 }}/>
                <div style={{ width:50, height:1, background:`linear-gradient(to left,transparent,${SAGE})` }}/><div style={{ width:6, height:6, borderRadius:'50%', background:SAGE }}/>
              </div>
            </div>
          </FadeIn>

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gridTemplateRows:'220px 220px', gap:6, borderRadius:8, overflow:'hidden' }}>
            <VenuePhoto src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80" alt="Salle principale" style={{ height:80, borderRadius:12, marginBottom:32, boxShadow:'0 20px 80px rgba(0,0,0,0.18)' }}/>
            <VenuePhoto src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80" alt="Décoration"  style={{ height:80, borderRadius:12, marginBottom:32, boxShadow:'0 20px 80px rgba(0,0,0,0.18)' }}/>
            
           
            <VenuePhoto src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80" alt="Jardins" style={{gridRow:'1/3'}}/>
          </div>
        </div>
      </section>

      {/* ── COLOR BAND 2 ── */}
      <div style={{ height:5, background:`linear-gradient(to right,${BLUE},${SAGE},${G1},${ROSE},${G2},${BLUE})` }}/>

      {/* ── INFOS PRATIQUES ── */}
      <section style={{ padding:'108px 32px', background:CREAM }}>
        <div style={{ maxWidth:920, margin:'0 auto' }}>
          <FadeIn><SectionTitle sub="Informations pratiques">Tout ce qu'il faut savoir</SectionTitle></FadeIn>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28 }}>
            {[
              { title:'Tenue de soirée', icon:'✦', color:ROSE,
                content:"Tenue de soirée recommandée. Merci d'éviter le blanc." },
             
              { title:'Accès & Parking', icon:'◷', color:SAGE,
                content:'À 60 km de Tunis. Parking gratuit sur place. Navette disponible sur demande.' },
              { title:'Cadeaux',         icon:'♦', color:G1,
                content:'Votre présence est le plus beau des cadeaux. Une liste est disponible sur demande.' },
            ].map((card,i)=>(
              <FadeIn key={i} delay={i*0.1}>
                <div style={{
                  padding:'36px 32px',
                  background:`linear-gradient(145deg,white,${STONE})`,
                  borderRadius:8, border:`1px solid ${BORDER}`,
                  borderLeft:`4px solid ${card.color}`,
                  boxShadow:'0 4px 20px rgba(207, 188, 188, 0.06)',
                }}>
                  <span style={{ color:card.color, fontSize:22 }}>{card.icon}</span>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:500, color:INK, margin:'12px 0' }}>{card.title}</h3>
                  <p style={{ fontSize:14, color:MUTED, lineHeight:1.75, margin:0 }}>{card.content}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section id="rsvp" style={{
        padding:'108px 32px',
        background:`linear-gradient(155deg,${STONE2},${STONE},${CREAM})`,
      }}>
        <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
          <FadeIn><SectionTitle sub="Confirmer votre présence" accent={ROSE}>Répondre à l'invitation</SectionTitle></FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ fontSize:15, color:MUTED, marginBottom:48, lineHeight:1.75 }}>
              Merci de nous confirmer votre présence avant le <strong style={{color:INK}}>5 Juin 2026</strong>.<br/>
              Votre réponse nous aidera à préparer ce beau jour.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}><RSVPForm/></FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:`linear-gradient(160deg,#1E1812,#2C2417)`, padding:'72px 32px', textAlign:'center' }}>
        {/* tri-color top border */}
        <div style={{ height:3, background:`linear-gradient(to right,${ROSE},${G1},${SAGE})`, margin:'-72px -32px 60px', width:'calc(100% + 64px)' }}/>
        <div style={{ display:'flex', gap:14, justifyContent:'center', marginBottom:24 }}>
          {[ROSE,G1,SAGE,BLUE].map((c,i)=>(
            <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:c }}/>
          ))}
        </div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:300, color:CREAM, margin:'0 0 10px', letterSpacing:'0.04em' }}>
         Bechir <span style={{color:G1}}>&amp;</span> Roua
        </h2>
        <p style={{ color:MUTED, fontSize:13, letterSpacing:'4px', marginBottom:28 }}>27 · 06 · 2026</p>
        <GoldLine color={G1}/>
        
      </footer>

      <style>{`
        @keyframes scrollLine {
          0%   { opacity:0; transform:scaleY(0); transform-origin:top; }
          50%  { opacity:1; transform:scaleY(1); transform-origin:top; }
          100% { opacity:0; transform:scaleY(1); transform-origin:bottom; }
        }
        * { box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { margin:0; }
        input:focus, textarea:focus, select:focus {
          border-color:${G1} !important;
          box-shadow:0 0 0 3px ${G1}20 !important;
        }
        @media (max-width:768px) {
          nav > div:last-child { display:none; }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════
export default function LuxuryWeddingInvitation() {
  const [opened, setOpened] = useState(false);
  return opened ? <WeddingPage/> : <Envelope onOpen={()=>setOpened(true)}/>;
}