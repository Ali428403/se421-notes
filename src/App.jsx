import { useState, useEffect } from "react";

const C = {
  bg:"#010409", surface:"#0D1117", card:"#161B22",
  border:"#30363D", text:"#E6EDF3", text2:"#8B949E", muted:"#6272A4",
};

const ACCENTS = [
  "#58A6FF","#3FB950","#D29922","#F97583","#BC8CFF","#56D364",
  "#79C0FF","#E3B341","#FF7B72","#A5D6FF","#FFB86C","#CE93D8",
  "#39D353","#F0883E","#8BE9FD","#FF79C6","#50FA7B","#F1FA8C",
  "#BD93F9","#6BDFFF","#FF6E96","#C3E88D","#FFD700",
];

const TITLES = [
  "Classes & Objects","Constructors","The this Keyword","Static Blocks",
  "Access Modifiers","Getter/Setter Pattern","Entity Abstraction","CRC Cards",
  "UML Diagrams","Abstract Classes","Code Coupling","Interfaces",
  "Inheritance & super","Method Overriding","protected Modifier",
  "Inheritance Problems","Strategy Pattern","Factory Pattern",
  "Dependency Injection","Observer Pattern","Polymorphism",
  "Immutable Objects","Lab Requirements",
];

const ICONS = [
  "⬡","⚙","◎","▦","🔒","⚗","🧱","🃏","📐","🔷","🔗","📋",
  "🌲","🔄","🛡","⚠","♟","🏭","💉","👁","🎭","🧊","🔬",
];

// ── SYNTAX HIGHLIGHTER ──────────────────────────────────────
const KW = new Set([
  'public','private','protected','class','interface','abstract','extends','implements',
  'static','final','void','new','return','this','super','if','else','for','while','do',
  'import','package','instanceof','null','true','false','throws','throw','try','catch',
  'finally','enum','record','var','default','case','switch','break','continue','module',
]);
const TYPES = new Set([
  'int','double','float','long','boolean','String','char','byte','short',
  'Object','System','Math','Scanner','List','ArrayList','Injector','AbstractModule','LocalDate',
]);
const TC = {
  kw:'#FF79C6', type:'#8BE9FD', cls:'#50FA7B', str:'#F1FA8C',
  num:'#BD93F9', ann:'#FFB86C', bkt:'#FF5555', cmt:'#6272A4',
  id:'#E6EDF3', plain:'#ABB2BF',
};

function tokenizeLine(line) {
  const tokens = []; let i = 0;
  const push = (t,v) => tokens.push({t,v});
  while (i < line.length) {
    if (line[i]==='/' && line[i+1]==='/') { push('cmt',line.slice(i)); break; }
    if (line[i]==='"') {
      let j=i+1; while(j<line.length&&!(line[j]==='"'&&line[j-1]!=='\\'))j++;
      push('str',line.slice(i,j+1)); i=j+1; continue;
    }
    if (line[i]==='@') {
      let j=i+1; while(j<line.length&&/\w/.test(line[j]))j++;
      push('ann',line.slice(i,j)); i=j; continue;
    }
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j=i; while(j<line.length&&/[\w$]/.test(line[j]))j++;
      const w=line.slice(i,j);
      if(KW.has(w))push('kw',w);
      else if(TYPES.has(w))push('type',w);
      else if(/^[A-Z]/.test(w))push('cls',w);
      else push('id',w);
      i=j; continue;
    }
    if (/\d/.test(line[i])) {
      let j=i; while(j<line.length&&/[\d.fFdDlL_]/.test(line[j]))j++;
      push('num',line.slice(i,j)); i=j; continue;
    }
    if('{}()[]'.includes(line[i])){push('bkt',line[i]);i++;continue;}
    const last=tokens[tokens.length-1];
    if(last&&last.t==='plain')last.v+=line[i]; else push('plain',line[i]);
    i++;
  }
  return tokens;
}

function CodeBlock({ code, highlightLines=[] }) {
  const lines = code.split('\n');
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
      overflow:'auto',fontFamily:"'Fira Code',monospace",fontSize:13,lineHeight:1.65,margin:'12px 0'}}>
      <div style={{display:'flex'}}>
        <div style={{padding:'16px 10px',textAlign:'right',minWidth:38,background:C.card,
          color:C.muted,userSelect:'none',borderRight:`1px solid ${C.border}`,fontSize:12}}>
          {lines.map((_,i)=><div key={i}>{i+1}</div>)}
        </div>
        <div style={{padding:'16px',flex:1,whiteSpace:'pre',overflowX:'auto'}}>
          {lines.map((line,i)=>{
            const hl=highlightLines.includes(i+1);
            return(
              <span key={i} style={{background:hl?'rgba(88,166,255,0.1)':'transparent',
                display:'block',borderLeft:hl?'2px solid #58A6FF':'2px solid transparent',paddingLeft:hl?6:0}}>
                {tokenizeLine(line).map((tk,j)=>(
                  <span key={j} style={{color:TC[tk.t]||'#E6EDF3'}}>{tk.v}</span>
                ))}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function H({children,accent}){return <h2 style={{color:accent||C.text,fontFamily:"'Fira Code',monospace",fontSize:22,marginBottom:8,marginTop:32,borderBottom:`1px solid ${C.border}`,paddingBottom:8}}>{children}</h2>;}
function H3({children,accent}){return <h3 style={{color:accent||C.text2,fontFamily:"'Fira Code',monospace",fontSize:15,marginBottom:6,marginTop:20}}>{children}</h3>;}

// ════════════════════════════════════════════════════════════
// CH 0 — CLASSES & OBJECTS
// ════════════════════════════════════════════════════════════
function Ch0({setChapter}){
  const acc=ACCENTS[0];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 01</div>
      <H accent={acc}>Classes &amp; Objects</H>
      <p style={{color:C.text2,lineHeight:1.8}}>A <strong style={{color:C.text}}>class</strong> is a blueprint. An <strong style={{color:C.text}}>object</strong> is a live instance in memory.</p>
      <H3 accent={acc}>Variable vs Method Members</H3>
      <CodeBlock code={`public class Cat {\n    public static String city;\n    private float age;\n\n    public int getBornYear() {\n        int currentYear = 2024;\n        return (int)(currentYear - this.age);\n    }\n}`} highlightLines={[2,3]}/>
      <H3 accent={acc}>Creating Objects</H3>
      <CodeBlock code={`Cat tom = new Cat();\nCat z = new Cat();\ntom.age = 2.5f;\nz.age = 5f;\nSystem.out.println(tom.age); // 2.5\nSystem.out.println(z.age);   // 5.0`}/>
      <div style={{marginTop:40,paddingTop:20,borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'flex-end'}}>
        <button onClick={()=>setChapter(1)} style={{background:ACCENTS[1]+'22',border:`1px solid ${ACCENTS[1]}`,borderRadius:6,padding:'10px 20px',color:ACCENTS[1],cursor:'pointer',fontFamily:"'Fira Code',monospace",fontSize:13,fontWeight:600}}>Next: {TITLES[1]} →</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 1 — CONSTRUCTORS
// ════════════════════════════════════════════════════════════
function Ch1({setChapter}){
  const acc=ACCENTS[1];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 02</div>
      <H accent={acc}>Constructors</H>
      <p style={{color:C.text2,lineHeight:1.8}}>A constructor runs automatically when you create an object with <code style={{color:'#8BE9FD'}}>new ClassName()</code>.</p>
      <H3 accent={acc}>The 3-Step new Process</H3>
      <CodeBlock code={`// Step 1 — ALLOCATE: reserve memory on heap\n// Step 2 — INITIALIZE: run the constructor\n// Step 3 — RETURN: give back a reference\n\nCat tom = new Cat(2.5f);`}/>
      <H3 accent={acc}>Constructor Delegation with this()</H3>
      <CodeBlock code={`public class Cat {\n    private float age;\n\n    public Cat() {\n        this(-1f);\n    }\n\n    public Cat(float age) {\n        this.age = age;\n    }\n}`} highlightLines={[5]}/>
      <div style={{marginTop:40,paddingTop:20,borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <button onClick={()=>setChapter(0)} style={{background:'transparent',border:`1px solid ${C.border}`,borderRadius:6,padding:'10px 20px',color:C.text2,cursor:'pointer',fontFamily:"'Fira Code',monospace",fontSize:13}}>← {TITLES[0]}</button>
        <button onClick={()=>setChapter(2)} style={{background:ACCENTS[2]+'22',border:`1px solid ${ACCENTS[2]}`,borderRadius:6,padding:'10px 20px',color:ACCENTS[2],cursor:'pointer',fontWeight:600}}>Next: {TITLES[2]} →</button>
      </div>
    </div>
  );
}

// Placeholder chapters
function ChPlaceholder({index,setChapter}){
  const acc=ACCENTS[index];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter {index+1}</div>
      <H accent={acc}>{TITLES[index]}</H>
      <p style={{color:C.text2,fontSize:14,lineHeight:1.8}}>Content for <strong>{TITLES[index]}</strong> coming soon...</p>
      <div style={{marginTop:40,paddingTop:20,borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        {index>0&&<button onClick={()=>setChapter(index-1)} style={{background:'transparent',border:`1px solid ${C.border}`,borderRadius:6,padding:'10px 20px',color:C.text2,cursor:'pointer'}}>← {TITLES[index-1]}</button>}
        {index<TITLES.length-1&&<button onClick={()=>setChapter(index+1)} style={{background:ACCENTS[index+1]+'22',border:`1px solid ${ACCENTS[index+1]}`,borderRadius:6,padding:'10px 20px',color:ACCENTS[index+1],cursor:'pointer',fontWeight:600}}>Next: {TITLES[index+1]} →</button>}
      </div>
    </div>
  );
}

const CHAPTERS = [Ch0,Ch1,...Array(21).fill(null).map((_,i)=>(props)=>ChPlaceholder({index:i+2,...props}))];

export default function App() {
  const [chapter, setChapter] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const Chapter = CHAPTERS[chapter];
  const accent = ACCENTS[chapter];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{display:'flex',height:'100vh',background:C.bg,fontFamily:'system-ui,-apple-system,sans-serif',color:C.text,overflow:'hidden',flexDirection:isMobile?'column':'row'}}>
      
      {/* HAMBURGER MENU - Mobile Only */}
      {isMobile && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',background:C.surface,borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:999}}>
          <div style={{fontFamily:"'Fira Code',monospace",fontSize:12,color:accent,fontWeight:600,flex:1,marginRight:8}}>{ICONS[chapter]} {TITLES[chapter]}</div>
          <button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} style={{background:mobileMenuOpen?accent+'22':'transparent',border:`1px solid ${mobileMenuOpen?accent:C.border}`,borderRadius:6,padding:'8px 12px',color:mobileMenuOpen?accent:C.text,cursor:'pointer',fontSize:16,fontWeight:700,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center'}}>☰</button>
        </div>
      )}

      {/* SIDEBAR - Desktop or Mobile Menu */}
      {(!isMobile || mobileMenuOpen) && (
        <>
          {isMobile && <div onClick={()=>setMobileMenuOpen(false)} style={{position:'fixed',top:56,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:998}} />}
          <div style={{width:isMobile?'100%':230,background:C.surface,borderRight:isMobile?'none':`1px solid ${C.border}`,borderTop:isMobile?`1px solid ${C.border}`:'none',display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,maxHeight:isMobile?'calc(100vh - 56px)':'100vh',overflowY:'auto',position:isMobile?'fixed':'relative',top:isMobile?56:0,zIndex:999}}>
            
            {/* Header */}
            <div style={{padding:'18px 16px',borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:C.muted,letterSpacing:1.5,marginBottom:4}}>SE421</div>
              <div style={{color:C.text,fontWeight:700,fontSize:14}}>Java OOP</div>
              <div style={{color:C.muted,fontSize:12,marginTop:2}}>Complete Study Guide</div>
            </div>

            {/* Chapter List */}
            <div style={{overflowY:'auto',flex:1,padding:'8px 0'}}>
              {TITLES.map((title,i)=>{
                const ac=ACCENTS[i]; const active=chapter===i;
                return(
                  <button key={i} onClick={()=>{setChapter(i);setMobileMenuOpen(false);}} style={{width:'100%',textAlign:'left',background:active?`${ac}15`:'transparent',border:'none',borderLeft:active?`3px solid ${ac}`:'3px solid transparent',padding:'9px 14px',cursor:'pointer',transition:'all 0.15s',borderBottom:`1px solid ${C.border}`}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:active?ac:C.muted,minWidth:22}}>{String(i+1).padStart(2,'0')}</span>
                      <span style={{fontSize:13}}>{ICONS[i]}</span>
                      <span style={{color:active?ac:C.text2,fontSize:12,fontWeight:active?600:400,lineHeight:1.3}}>{title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Progress */}
            <div style={{padding:'12px 16px',borderTop:`1px solid ${C.border}`}}>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:C.muted}}>Chapter {chapter+1} of {TITLES.length}</div>
              <div style={{marginTop:6,height:3,background:C.card,borderRadius:2,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${((chapter+1)/TITLES.length)*100}%`,background:accent,borderRadius:2,transition:'width 0.3s'}}/>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      <div style={{flex:1,overflowY:'auto',padding:isMobile?'20px 16px':'40px 48px'}}>
        <div style={{maxWidth:820,margin:'0 auto'}}>
          {Chapter && <Chapter setChapter={setChapter}/>}
        </div>
      </div>
    </div>
  );
}
