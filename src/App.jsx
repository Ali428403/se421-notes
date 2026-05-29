import { useState, useEffect } from "react";

// ── DESIGN TOKENS ────────────────────────────────────────────
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

// ── CSS INJECTION (media queries + utility classes) ───────────
function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }

      /* Code blocks */
      .cb-wrap {
        background: #0D1117;
        border: 1px solid #30363D;
        border-radius: 8px;
        overflow: hidden;
        margin: 12px 0;
        font-family: 'Fira Code', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.65;
      }
      .cb-inner { display: flex; }
      .cb-nums {
        padding: 16px 10px;
        text-align: right;
        min-width: 38px;
        background: #161B22;
        color: #6272A4;
        user-select: none;
        border-right: 1px solid #30363D;
        font-size: 12px;
        flex-shrink: 0;
      }
      .cb-nums div { line-height: 1.65; }
      .cb-code {
        padding: 16px;
        flex: 1;
        white-space: pre;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .cb-line { display: block; }
      .cb-line-hl {
        background: rgba(88,166,255,0.1);
        border-left: 2px solid #58A6FF;
        padding-left: 6px;
        margin-left: -2px;
      }

      /* Two-column layout */
      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin: 12px 0;
      }

      /* Tables */
      .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 14px 0; }
      .tbl { width: 100%; border-collapse: collapse; font-family: 'Fira Code', monospace; font-size: 13px; min-width: 420px; }
      .tbl th { background: #161B22; padding: 8px 12px; border-bottom: 2px solid #30363D; color: #8B949E; text-align: left; white-space: nowrap; }
      .tbl td { padding: 7px 12px; border-bottom: 1px solid #30363D; color: #E6EDF3; line-height: 1.5; }
      .tbl tr:nth-child(even) td { background: #0D1117; }

      /* Nav buttons */
      .nav-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #30363D;
        gap: 12px;
      }
      .nav-btn-prev, .nav-btn-next {
        flex: 1;
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Fira Code', monospace;
        font-size: 13px;
        font-weight: 600;
        transition: opacity 0.15s;
        min-height: 48px;
        max-width: 48%;
      }
      .nav-btn-prev {
        background: transparent;
        border: 1px solid #30363D;
        color: #8B949E;
        text-align: left;
      }
      .nav-btn-next { text-align: right; }
      .nav-btn-prev:hover { border-color: #8B949E; }
      .nav-btn-next:hover { opacity: 0.85; }

      /* Quiz */
      .quiz-opt {
        width: 100%;
        background: transparent;
        border: 1px solid #30363D;
        border-radius: 6px;
        padding: 12px 14px;
        color: #E6EDF3;
        text-align: left;
        cursor: pointer;
        font-size: 15px;
        line-height: 1.5;
        min-height: 50px;
        transition: all 0.15s;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .quiz-check {
        margin-top: 12px;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        font-weight: 600;
        min-height: 48px;
        width: 100%;
      }

      /* Heading styles */
      .ch-h2 {
        font-family: 'Fira Code', monospace;
        font-size: 22px;
        margin-bottom: 8px;
        margin-top: 32px;
        border-bottom: 1px solid #30363D;
        padding-bottom: 8px;
      }
      .ch-h3 {
        font-family: 'Fira Code', monospace;
        font-size: 15px;
        margin-bottom: 6px;
        margin-top: 22px;
      }

      /* Diagram scroll */
      .diagram-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }

      /* ── MOBILE ───────────────────────────────────────── */
      @media (max-width: 767px) {
        .cb-wrap { font-size: 11.5px; }
        .cb-nums { min-width: 30px; padding: 12px 6px; font-size: 10px; }
        .cb-code { padding: 12px; }

        .two-col { grid-template-columns: 1fr !important; }

        .tbl { font-size: 12px; }
        .tbl th, .tbl td { padding: 6px 10px; }

        .nav-row { flex-direction: column; }
        .nav-btn-prev, .nav-btn-next { max-width: 100%; width: 100%; text-align: center; font-size: 12px; }

        .ch-h2 { font-size: 18px; }
        .ch-h3 { font-size: 13px; }

        .quiz-opt { font-size: 14px; padding: 12px; }
      }

      /* Scrollbar styling */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #0D1117; }
      ::-webkit-scrollbar-thumb { background: #30363D; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #6272A4; }
    `}</style>
  );
}

// ── SYNTAX HIGHLIGHTER ───────────────────────────────────────
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
  const tokens=[]; let i=0;
  const push=(t,v)=>tokens.push({t,v});
  while(i<line.length){
    if(line[i]==='/'&&line[i+1]==='/'){push('cmt',line.slice(i));break;}
    if(line[i]==='"'){let j=i+1;while(j<line.length&&!(line[j]==='"'&&line[j-1]!=='\\'))j++;push('str',line.slice(i,j+1));i=j+1;continue;}
    if(line[i]==='@'){let j=i+1;while(j<line.length&&/\w/.test(line[j]))j++;push('ann',line.slice(i,j));i=j;continue;}
    if(/[a-zA-Z_$]/.test(line[i])){let j=i;while(j<line.length&&/[\w$]/.test(line[j]))j++;const w=line.slice(i,j);if(KW.has(w))push('kw',w);else if(TYPES.has(w))push('type',w);else if(/^[A-Z]/.test(w))push('cls',w);else push('id',w);i=j;continue;}
    if(/\d/.test(line[i])){let j=i;while(j<line.length&&/[\d.fFdDlL_]/.test(line[j]))j++;push('num',line.slice(i,j));i=j;continue;}
    if('{}()[]'.includes(line[i])){push('bkt',line[i]);i++;continue;}
    const last=tokens[tokens.length-1];
    if(last&&last.t==='plain')last.v+=line[i];else push('plain',line[i]);
    i++;
  }
  return tokens;
}

function CodeBlock({code,highlightLines=[]}) {
  const lines=code.split('\n');
  return (
    <div className="cb-wrap">
      <div className="cb-inner">
        <div className="cb-nums">{lines.map((_,i)=><div key={i}>{i+1}</div>)}</div>
        <div className="cb-code">
          {lines.map((line,i)=>{
            const hl=highlightLines.includes(i+1);
            return(
              <span key={i} className={hl?'cb-line cb-line-hl':'cb-line'}>
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

// ── CALLOUT ──────────────────────────────────────────────────
const CS={
  info: {border:'#58A6FF',bg:'rgba(88,166,255,0.08)', icon:'ℹ',label:'Note'},
  warn: {border:'#D29922',bg:'rgba(210,153,34,0.08)', icon:'⚠',label:'Warning'},
  tip:  {border:'#3FB950',bg:'rgba(63,185,80,0.08)',  icon:'✦',label:'Exam Tip'},
  danger:{border:'#F97583',bg:'rgba(249,117,131,0.08)',icon:'⛔',label:'Anti-Pattern'},
};
function Callout({type='info',children}){
  const s=CS[type];
  return(
    <div style={{background:s.bg,borderLeft:`3px solid ${s.border}`,padding:'12px 16px',
      borderRadius:'0 8px 8px 0',margin:'16px 0',color:C.text}}>
      <div style={{color:s.border,fontFamily:"'Fira Code',monospace",fontSize:12,fontWeight:700,marginBottom:6}}>
        {s.icon} {s.label}
      </div>
      <div style={{lineHeight:1.8,fontSize:14}}>{children}</div>
    </div>
  );
}

// ── QUIZ ─────────────────────────────────────────────────────
function Quiz({question,options,correct,explanation}){
  const [sel,setSel]=useState(null);
  const [checked,setChecked]=useState(false);
  const borderColor=i=>{
    if(!checked)return sel===i?'#58A6FF':C.border;
    if(i===correct)return'#3FB950';
    if(i===sel&&i!==correct)return'#F97583';
    return C.border;
  };
  const bgColor=i=>{
    if(!checked)return sel===i?'rgba(88,166,255,0.1)':'transparent';
    if(i===correct)return'rgba(63,185,80,0.1)';
    if(i===sel&&i!==correct)return'rgba(249,117,131,0.1)';
    return'transparent';
  };
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'20px 16px',margin:'24px 0'}}>
      <div style={{color:'#8BE9FD',fontFamily:"'Fira Code',monospace",fontSize:11,marginBottom:12,letterSpacing:1}}>◆ KNOWLEDGE CHECK</div>
      <p style={{color:C.text,marginBottom:16,lineHeight:1.75,fontSize:16,fontWeight:500}}>{question}</p>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {options.map((opt,i)=>(
          <button key={i} onClick={()=>!checked&&setSel(i)}
            className="quiz-opt"
            style={{border:`1px solid ${borderColor(i)}`,background:bgColor(i),cursor:checked?'default':'pointer'}}>
            <span style={{color:borderColor(i),marginRight:10,fontFamily:"'Fira Code',monospace",fontWeight:700}}>
              {checked?(i===correct?'✓':i===sel?'✗':`${i+1}.`):`${i+1}.`}
            </span>{opt}
          </button>
        ))}
      </div>
      <button onClick={()=>sel!==null&&!checked&&setChecked(true)}
        className="quiz-check"
        style={{background:sel!==null&&!checked?'#58A6FF':'#21262D',color:sel!==null&&!checked?C.bg:C.muted,
          cursor:sel!==null&&!checked?'pointer':'not-allowed',marginTop:14}}>
        {checked?'✓ Answered':'Check Answer'}
      </button>
      {checked&&(
        <div style={{marginTop:14,padding:'14px',
          background:sel===correct?'rgba(63,185,80,0.07)':'rgba(249,117,131,0.07)',
          border:`1px solid ${sel===correct?'#3FB950':'#F97583'}`,
          borderRadius:8,color:C.text,lineHeight:1.8,fontSize:14}}>
          <span style={{color:sel===correct?'#3FB950':'#F97583',fontWeight:700}}>
            {sel===correct?'✓ Correct! ':'✗ Not quite. '}
          </span>{explanation}
        </div>
      )}
    </div>
  );
}

// ── DIAGRAM ──────────────────────────────────────────────────
function Diagram({title,accent='#A5D6FF',variables=[],methods=[]}){
  const row=(item,color)=>(
    <div key={item} style={{padding:'5px 12px',borderBottom:`1px solid ${C.border}`,
      fontFamily:"'Fira Code',monospace",fontSize:12,color}}>{item}</div>
  );
  return(
    <div className="diagram-scroll">
      <div style={{display:'inline-block',border:`2px solid ${accent}`,borderRadius:6,
        overflow:'hidden',margin:'12px 4px',minWidth:220,verticalAlign:'top'}}>
        <div style={{background:accent+'25',padding:'8px 12px',borderBottom:`1px solid ${accent}`,
          fontFamily:"'Fira Code',monospace",fontSize:13,fontWeight:700,color:accent}}>{title}</div>
        {variables.map(v=>row(v,'#F1FA8C'))}
        {variables.length>0&&methods.length>0&&<div style={{borderBottom:`1px solid ${C.border}`,height:1}}/>}
        {methods.map(m=>row(m,'#8BE9FD'))}
      </div>
    </div>
  );
}

// ── TWO-COLUMN ───────────────────────────────────────────────
function TwoCol({left,right,leftLabel='Before',rightLabel='After'}){
  return(
    <div className="two-col">
      <div>
        <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:C.muted,marginBottom:6,letterSpacing:1}}>{leftLabel}</div>
        {left}
      </div>
      <div>
        <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'#3FB950',marginBottom:6,letterSpacing:1}}>{rightLabel}</div>
        {right}
      </div>
    </div>
  );
}

// ── TABLE ────────────────────────────────────────────────────
function Table({headers,rows}){
  return(
    <div className="table-scroll">
      <table className="tbl">
        <thead><tr>{headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row,i)=>(
          <tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ── NAV BUTTONS ──────────────────────────────────────────────
function NavButtons({index,setChapter}){
  const total=TITLES.length;
  return(
    <div className="nav-row">
      {index>0?(
        <button className="nav-btn-prev" onClick={()=>setChapter(index-1)}>
          ← {TITLES[index-1]}
        </button>
      ):<div style={{flex:1}}/>}
      {index<total-1?(
        <button className="nav-btn-next"
          onClick={()=>setChapter(index+1)}
          style={{background:ACCENTS[index+1]+'22',border:`1px solid ${ACCENTS[index+1]}`,color:ACCENTS[index+1]}}>
          {TITLES[index+1]} →
        </button>
      ):(
        <div style={{color:'#3FB950',fontFamily:"'Fira Code',monospace",fontSize:13,padding:'12px 0',textAlign:'center',flex:1}}>🎓 Course Complete!</div>
      )}
    </div>
  );
}

// ── HEADING HELPERS ──────────────────────────────────────────
function H({children,accent}){return <h2 className="ch-h2" style={{color:accent||C.text}}>{children}</h2>;}
function H3({children,accent}){return <h3 className="ch-h3" style={{color:accent||C.text2}}>{children}</h3>;}

// ════════════════════════════════════════════════════════════
// CHAPTERS
// ════════════════════════════════════════════════════════════

function Ch0({setChapter}){
  const acc=ACCENTS[0];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 01</div>
    <H accent={acc}>Classes &amp; Objects</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>A <strong style={{color:C.text}}>class</strong> is a blueprint. An <strong style={{color:C.text}}>object</strong> is a live instance in memory. Every class has two kinds of members: <em>variable members</em> (fields) and <em>method members</em> (things it can do).</p>
    <H3 accent={acc}>Variable vs Method Members — Cat Example (from lecture)</H3>
    <CodeBlock code={`public class Cat {
    public static String city;   // static — shared by ALL Cat objects
    private float age;           // instance — each Cat has its OWN age

    public int getBornYear() {
        int currentYear = LocalDate.now().getYear();
        return (int)(currentYear - this.age);
    }
    public void say(String sentence) {
        String[] words = sentence.split("\\s+");
        for (String word : words) System.out.print("Meow ");
        System.out.println();
    }
}`} highlightLines={[2,3]}/>
    <H3 accent={acc}>Static vs Instance Fields</H3>
    <TwoCol leftLabel="Instance field (per object)" rightLabel="Static field (per class)"
      left={<CodeBlock code={`Cat tom = new Cat();
Cat z   = new Cat();
tom.age = 2.5f;   // tom's OWN age
z.age   = 5f;     // z's OWN — independent
// tom.age != z.age`}/>}
      right={<CodeBlock code={`// city is shared — ONE copy
Cat.city = "Suly";
System.out.println(tom.city); // "Suly"
System.out.println(z.city);   // "Suly"
// change one → changes for ALL`}/>}
    />
    <H3 accent={acc}>⚠ Object Aliasing — Critical Exam Topic</H3>
    <CodeBlock code={`Cat tom = new Cat();
tom.age = 2.5f;

Cat z = tom;    // z is NOT a copy — same address!
z.age = 6f;     // modifying z also modifies tom!

System.out.println(tom.age);  // 6.0 — SURPRISE!`} highlightLines={[4,5,7]}/>
    <Callout type="warn"><strong>Aliasing:</strong> assigning an object variable to another copies the address, not the object. Both variables point to the same thing. This is why <strong>copy constructors</strong> and <strong>immutable objects</strong> matter.</Callout>
    <CodeBlock code={`// new does 3 things:
// 1. ALLOCATE — reserve memory on the heap
// 2. INITIALIZE — run the constructor
// 3. RETURN — give back a reference, store in variable

Cat tom = new Cat();   // 'tom' holds an ADDRESS, not the object itself
tom.age = 2.5f;        // dot operator: navigate address → field`} highlightLines={[6,7]}/>
    <Quiz question="Cat tom = new Cat(); Cat z = tom; z.age = 99; — what is tom.age?"
      options={["Still original — z is a separate copy","99 — z and tom point to the same object","Compile error","null"]}
      correct={1}
      explanation="Object variables hold references (memory addresses). z = tom copies the address, not the object. Both z and tom point to the same Cat on the heap. Setting z.age = 99 modifies the shared object — so tom.age is also 99. This is aliasing."/>
    <NavButtons index={0} setChapter={setChapter}/>
  </div>);
}

function Ch1({setChapter}){
  const acc=ACCENTS[1];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 02</div>
    <H accent={acc}>Constructors</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Two rules: <strong style={{color:C.text}}>no return type</strong> (not even void) and <strong style={{color:C.text}}>name must match the class</strong>. Runs automatically on <code style={{color:'#8BE9FD'}}>new</code>.</p>
    <Callout type="info"><strong>The 3-step new process:</strong> (1) Allocate memory on the heap. (2) Run the matching constructor to initialize fields. (3) Return the reference.</Callout>
    <H3 accent={acc}>Constructor Delegation with this() — Cat Example</H3>
    <CodeBlock code={`public class Cat {
    private float age;

    // No-arg delegates to the float constructor
    public Cat() {
        this(-1f);   // MUST be first line
        System.out.println("Cat constructor called");
    }

    public Cat(float age) {
        System.out.println("Second Cat constructor called");
        this.age = age;
    }
}
// new Cat()   → prints "Second..." THEN "Cat constructor called"
// new Cat(2f) → prints "Second..." only`} highlightLines={[6,11]}/>
    <Callout type="tip"><strong>Execution order:</strong> the delegated constructor runs completely first, then resumes the calling constructor. So "Second Cat constructor called" always prints before "Cat constructor called".</Callout>
    <H3 accent={acc}>Force Mandatory Values — Remove the Default</H3>
    <CodeBlock code={`// Provide only one constructor — compiler enforces it
public class Cat {
    private float age;
    public Cat(float age) { this.age = age; }
}

// new Cat()        // ✗ COMPILE ERROR — good!
// new Cat(2.5f)    // ✓ forced to supply age`} highlightLines={[7,8]}/>
    <H3 accent={acc}>Private Constructor</H3>
    <CodeBlock code={`// private constructor = nobody outside can write new MyClass()
// Used in: Singleton, Factory Pattern, utility classes
public class MathUtils {
    private MathUtils() {}
    public static int square(int x) { return x * x; }
}`}/>
    <Quiz question="In Cat's no-arg constructor, this(-1f) is first. What prints when you write new Cat()?"
      options={["'Cat constructor called' only","'Second Cat constructor called' then 'Cat constructor called'","'Cat constructor called' then 'Second Cat constructor called'","Nothing"]}
      correct={1}
      explanation="this(-1f) delegates to Cat(float), which runs completely first — printing 'Second Cat constructor called'. Control then returns to the no-arg constructor and prints 'Cat constructor called'. Delegated constructor always finishes before the caller continues."/>
    <NavButtons index={1} setChapter={setChapter}/>
  </div>);
}

function Ch2({setChapter}){
  const acc=ACCENTS[2];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 03</div>
    <H accent={acc}>The this Keyword</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}><code style={{color:'#8BE9FD'}}>this</code> has two uses: as a <strong style={{color:C.text}}>variable</strong> (pointer to the current object) and as a <strong style={{color:C.text}}>constructor call</strong> (<code style={{color:'#8BE9FD'}}>this()</code>).</p>
    <H3 accent={acc}>this as a Variable — Breaking Shadowing</H3>
    <CodeBlock code={`public class Cat {
    private float age;

    public void setAge(float age) {
        // Parameter 'age' shadows the field 'age'
        // Without 'this': age = age → assigns param to itself (bug!)
        this.age = age;  // this.age = field, age = parameter
    }
}`} highlightLines={[7]}/>
    <H3 accent={acc}>this Changes Per Object</H3>
    <CodeBlock code={`Cat tom = new Cat(2.5f);
Cat z   = new Cat(5f);

tom.setAge(3f);  // inside setAge: this == tom
z.setAge(7f);   // inside setAge: this == z
// Same method body, different 'this' every call`} highlightLines={[4,5]}/>
    <H3 accent={acc}>this() — Constructor Delegation Rules</H3>
    <CodeBlock code={`public Cat() {
    this(-1f);    // ✓ MUST be the very first statement
    // System.out.println("test");  ← cannot put anything before this()
}
public Cat(float age) {
    this.age = age;
}`}/>
    <Callout type="warn"><code>this()</code> must be the <strong>very first statement</strong> — no code before it. <code>this</code> (the variable) can appear anywhere.</Callout>
    <Quiz question="What does 'this.age = age' mean inside: void setAge(float age) { this.age = age; }"
      options={["Set the local variable to the field value","Set the object's field 'this.age' to the method parameter 'age'","Create a new field called this.age","Compile error — can't have both named 'age'"]}
      correct={1}
      explanation="this.age refers to the field declared in the class. age (without this.) refers to the method parameter. When they share a name, this. is the only way to reach the field. Most common use of the this keyword."/>
    <NavButtons index={2} setChapter={setChapter}/>
  </div>);
}

function Ch3({setChapter}){
  const acc=ACCENTS[3];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 04</div>
    <H accent={acc}>Static Blocks</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>A static block runs <strong style={{color:C.text}}>exactly once</strong> when the JVM first loads the class — before any object is created.</p>
    <CodeBlock code={`public class Cat {
    public static String city;

    // Dr. Yad showed this block then COMMENTED IT OUT — intentional!
    // static {
    //     System.out.println("Cat static block");
    // }
    // Reason: static blocks are not testable — avoid in real code

    public Cat() {
        System.out.println("Cat constructor");  // runs per object
    }
}`} highlightLines={[5,6,7]}/>
    <Table headers={["","Static Block","Constructor"]}
      rows={[
        ["Triggered by","Class first loaded","Every new ClassName()"],
        ["Runs how many times?","Exactly once","Once per object"],
        ["Has access to 'this'?","❌ No","✅ Yes"],
        ["Testable?","❌ No","✅ Yes"],
      ]}/>
    <Callout type="danger"><strong>Dr. Yad's rule: avoid static blocks in real code.</strong> They fire before your test framework starts. You can't mock or override them. Prefer constructors or factories instead.</Callout>
    <Quiz question="You loop: for(int i=0; i<100; i++) new Cat(); — how many times does the static block run?"
      options={["100 times","1 time — when the class is first loaded","0 times","Depends on GC"]}
      correct={1}
      explanation="The static block fires exactly once when the JVM loads the Cat class — before the loop. All 100 new Cat() calls run the constructor, not the static block. Static = per class, not per object."/>
    <NavButtons index={3} setChapter={setChapter}/>
  </div>);
}

function Ch4({setChapter}){
  const acc=ACCENTS[4];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 05</div>
    <H accent={acc}>Access Modifiers</H>
    <H3 accent={acc}>public vs private — Two Benefits of private</H3>
    <CodeBlock code={`public class BankAccount {
    public String owner;      // anyone can read/write — no control
    private double balance;   // only this class can touch it

    // Benefit 1: CONTROL — validate before changing
    public void deposit(double amount) {
        if (amount > 0) balance += amount;   // negative rejected
    }
    // Benefit 2: ABSTRACTION — caller doesn't know the type
    public double getBalance() { return balance; }
}`} highlightLines={[2,3]}/>
    <Callout type="tip"><strong>The two benefits of private (exam answer):</strong><br/>(1) <strong>Control</strong> — validate input through methods.<br/>(2) <strong>Abstraction</strong> — internals can change without breaking callers.</Callout>
    <H3 accent={acc}>Private Constructors</H3>
    <CodeBlock code={`public class MathUtils {
    private MathUtils() {}   // prevent instantiation

    public static int square(int x) { return x * x; }
}
// new MathUtils()        // ✗ COMPILE ERROR
// MathUtils.square(5)    // ✓`} highlightLines={[2]}/>
    <Quiz question="What are the TWO benefits of making fields private?"
      options={["Speed and memory efficiency","Control (validated access) and Abstraction (hide implementation)","Thread safety and GC","Only one benefit: blocking other packages"]}
      correct={1}
      explanation="Dr. Yad specifically names two: (1) Control — intercept changes via setters and validate them. (2) Abstraction — caller only knows the public interface; you can change internals freely."/>
    <NavButtons index={4} setChapter={setChapter}/>
  </div>);
}

function Ch5({setChapter}){
  const acc=ACCENTS[5];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 06</div>
    <H accent={acc}>Getter / Setter Pattern</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Private fields + validated setters + pure getters. The constructor calls the setters so validation lives in exactly one place.</p>
    <H3 accent={acc}>Full Employee Example (from lecture)</H3>
    <CodeBlock code={`public class Employee {
    private int id;
    private String name;
    private double salary;

    // Constructor calls setters — ONE place for validation
    public Employee(int id, String name, double salary) {
        setId(id);        // not this.id = id
        setName(name);
        setSalary(salary);
    }

    public int    getId()     { return id; }
    public String getName()   { return name; }
    public double getSalary() { return salary; }

    public void setId(int id) {
        if (id <= 0) throw new IllegalArgumentException("ID must be positive");
        this.id = id;
    }
    public void setName(String name) {
        if (name == null || name.isBlank())
            throw new RuntimeException("Name cannot be null");
        this.name = name;
    }
    public void setSalary(double salary) {
        if (salary < 0) throw new RuntimeException("Salary cannot be negative");
        this.salary = salary;
    }
}`} highlightLines={[7,8,9,10]}/>
    <Callout type="tip"><strong>Why call setters from the constructor?</strong> One place for validation — no duplication. If validation changes, update the setter only.</Callout>
    <Quiz question="Why does the Employee constructor call setId(id) instead of this.id = id?"
      options={["No difference","Calling the setter centralises validation — runs the check at construction AND on later updates","this.id = id is illegal in a constructor","Setters are faster"]}
      correct={1}
      explanation="If you write this.id = id directly in the constructor, the validation in setId() is bypassed during construction. Calling setId(id) means one piece of validation code protects the field in every scenario — no duplication."/>
    <NavButtons index={5} setChapter={setChapter}/>
  </div>);
}

function Ch6({setChapter}){
  const acc=ACCENTS[6];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 07</div>
    <H accent={acc}>Entity Abstraction</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}><strong style={{color:C.text}}>Classes model nouns.</strong> <strong style={{color:C.text}}>Methods model verbs.</strong> Decompose large requirements into focused entities.</p>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:16,margin:'12px 0'}}>
      <p style={{color:C.text2,lineHeight:1.85,margin:0,fontSize:14}}>🧱 A <strong style={{color:acc}}>wall</strong> is built from uniform <strong style={{color:acc}}>bricks</strong>. Each brick is simple and reusable. Your software is the wall — your <strong style={{color:acc}}>classes are the bricks</strong>.</p>
    </div>
    <TwoCol leftLabel="❌ Procedural (everything in main)" rightLabel="✅ Entity Abstraction (Lab 1)"
      left={<CodeBlock code={`public class Main {
    public static void main(String[] args) {
        // 100 lines of mixed logic
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        // ... all in one place
    }
}`}/>}
      right={<CodeBlock code={`// Three focused entities:
Calculator calc   = new Calculator();
InputHandler io   = new InputHandler();
Printer printer   = new Printer();

// main only orchestrates:
int a = io.getInteger("Enter a: ");
printer.printResult("Add", calc.add(a,b));`}/>}
    />
    <Callout type="tip"><strong>For 200+ requirements:</strong> (1) Identify nouns → classes. (2) Identify verbs per noun → methods. (3) Assign each requirement to exactly one class.</Callout>
    <Quiz question="In entity abstraction, classes represent _____ and methods represent _____."
      options={["algorithms / data types","nouns (real-world entities) / verbs (actions)","actions / state","they're interchangeable"]}
      correct={1}
      explanation="Entity abstraction maps language to code: nouns → classes (Calculator, Employee), verbs → methods (add, getSalary). Makes design intuitive and maintainable."/>
    <NavButtons index={6} setChapter={setChapter}/>
  </div>);
}

function Ch7({setChapter}){
  const acc=ACCENTS[7];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 08</div>
    <H accent={acc}>CRC Cards</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}><strong style={{color:C.text}}>Class / Responsibilities / Collaborators.</strong> Index cards used before writing any code. Changing a name on a card = 0.1 seconds. Changing it in 50 files = 1 hour.</p>
    <div style={{border:`1px solid ${acc}`,borderRadius:8,overflow:'hidden',maxWidth:420,margin:'16px 0'}}>
      <div style={{background:acc+'22',padding:'10px 16px',borderBottom:`1px solid ${acc}`,fontFamily:"'Fira Code',monospace",fontSize:14,color:acc,fontWeight:700}}>Calculator</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
        <div style={{padding:'10px 14px',borderRight:`1px solid ${C.border}`}}>
          <div style={{color:'#50FA7B',fontFamily:"'Fira Code',monospace",fontSize:11,marginBottom:6}}>RESPONSIBILITIES</div>
          <div style={{color:C.text2,fontSize:13,lineHeight:1.8}}>- Perform add<br/>- Perform subtract<br/>- Perform multiply<br/>- Perform divide<br/>- Hold current operation</div>
        </div>
        <div style={{padding:'10px 14px'}}>
          <div style={{color:'#FF79C6',fontFamily:"'Fira Code',monospace",fontSize:11,marginBottom:6}}>COLLABORATORS</div>
          <div style={{color:C.text2,fontSize:13,lineHeight:1.8}}>- InputHandler<br/>- Printer<br/>- Operation</div>
        </div>
      </div>
    </div>
    <Table headers={["CRC Responsibility","Becomes in Java"]}
      rows={[
        ["'Hold current operation'","private Operation operation; (field)"],
        ["'Perform add'","double add(double a, double b) (method)"],
        ["'Know salary'","private double salary; (field)"],
        ["'Calculate bonus'","double calculateBonus() (method)"],
      ]}/>
    <Quiz question="PRIMARY reason to use CRC cards BEFORE coding?"
      options={["Auto-generate Java","Design is cheap on cards — mistakes cost seconds; in code they cost hours","Replace UML","Post-coding documentation"]}
      correct={1}
      explanation="CRC cards are a low-cost exploration tool. Rearrange responsibilities, rename classes in seconds. In code, every structural change cascades. Design first, code second."/>
    <NavButtons index={7} setChapter={setChapter}/>
  </div>);
}

function Ch8({setChapter}){
  const acc=ACCENTS[8];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 09</div>
    <H accent={acc}>UML Class Diagrams</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Formal notation for class structure. Comes <em>after</em> CRC (exploratory) and <em>before</em> Java (implementation).</p>
    <H3 accent={acc}>Full Modeling Pipeline</H3>
    <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,margin:'16px 0',fontFamily:"'Fira Code',monospace",fontSize:13,minWidth:500}}>
        {['Requirements','CRC Cards','UML','Java Code','Machine Code'].map((s,i,arr)=>(
          <span key={i} style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{background:C.card,border:`1px solid ${acc}`,borderRadius:6,padding:'6px 12px',color:acc,whiteSpace:'nowrap'}}>{s}</span>
            {i<arr.length-1&&<span style={{color:C.muted}}>→</span>}
          </span>
        ))}
      </div>
    </div>
    <div style={{display:'flex',gap:20,flexWrap:'wrap',margin:'14px 0'}}>
      <Diagram title="Employee" accent={acc}
        variables={["- id: int","- name: String","- salary: double"]}
        methods={["+ getId(): int","+ setName(n: String): void","# getSalaryBase(): double"]}/>
      <div style={{flex:1,minWidth:220}}>
        <Table headers={["UML Symbol","Java Modifier"]}
          rows={[["+ (plus)","public"],["-  (minus)","private"],["# (hash)","protected"],["~ (tilde)","default (package)"]]}/>
      </div>
    </div>
    <Callout type="warn"><strong>UML vs Java syntax:</strong> UML writes <code>name: String</code> (type after). Java writes <code>String name</code> (type before). Common exam question!</Callout>
    <Quiz question="In UML, '# getSalaryBase(): double' means what in Java?"
      options={["public double getSalaryBase()","private double getSalaryBase()","protected double getSalaryBase()","static double getSalaryBase()"]}
      correct={2}
      explanation="# = protected in UML. + = public, - = private, ~ = package-private. Also note the return type is after the colon in UML but before the name in Java."/>
    <NavButtons index={8} setChapter={setChapter}/>
  </div>);
}

function Ch9({setChapter}){
  const acc=ACCENTS[9];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 10</div>
    <H accent={acc}>Abstract Classes</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>An <strong style={{color:C.text}}>abstract class</strong> cannot be instantiated — it exists only to be extended. It can have concrete methods AND <strong style={{color:C.text}}>abstract methods</strong> (no body — subclasses must implement).</p>
    <H3 accent={acc}>Evolution: Shape Week 1 → Week 2 (from lecture)</H3>
    <TwoCol leftLabel="Mar 4: Concrete Shape (bad)" rightLabel="Mar 9: Abstract Shape (good)"
      left={<CodeBlock code={`public class Shape {
    public double calculateArea() {
        System.err.println("Not defined");
        return 0.0;  // silent bad default
        // easy to forget to override!
    }
}`}/>}
      right={<CodeBlock code={`public abstract class Shape {
    protected String color;
    public Shape(String color) {
        this.color = color;
    }
    // NO body — forces every subclass
    public abstract double calculateArea();
}`}/>}
    />
    <CodeBlock code={`// Circle MUST implement calculateArea() — won't compile otherwise
public class Circle extends Shape {
    private final double radius;   // final — set once, never changes

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

// new Shape("red");         // ✗ COMPILE ERROR — abstract
// new Circle("red", 5.0);   // ✓ Circle is concrete`} highlightLines={[3,9,10,11]}/>
    <Table headers={["","Abstract Class","Interface"]}
      rows={[
        ["Keyword","abstract class","interface"],
        ["Can have fields?","✅ Yes","❌ No (constants only)"],
        ["Constructor?","✅ Yes","❌ No"],
        ["Extend/implement","1 (single inheritance)","Multiple"],
        ["Models","IS-A relationship","CAN-DO capability"],
      ]}/>
    <Callout type="tip"><strong>When to use abstract class:</strong> subclasses share some concrete behaviour (like displayColor()) but must each define their own version of certain methods (like calculateArea()).</Callout>
    <Quiz question="A class extends an abstract class but doesn't implement one abstract method. What happens?"
      options={["Runtime error when called","Compile error — must implement ALL abstract methods or be declared abstract itself","Abstract method is silently skipped","Java generates a default returning null/0"]}
      correct={1}
      explanation="Compile-time check — not runtime. The compiler guarantees all abstract methods are implemented before you can create objects. The subclass must implement every abstract method, or itself declare abstract."/>
    <NavButtons index={9} setChapter={setChapter}/>
  </div>);
}

function Ch10({setChapter}){
  const acc=ACCENTS[10];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 11</div>
    <H accent={acc}>Code Coupling</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Coupling measures how much one class depends on another. High coupling = changes cascade everywhere.</p>
    <Callout type="danger"><strong>Core rule: the keyword <code>new</code> creates tight coupling.</strong> Writing <code>new AsiaPayTransfer()</code> inside a class permanently binds it to that concrete class.</Callout>
    <TwoCol leftLabel="❌ Tight Coupling" rightLabel="✅ Loose Coupling"
      left={<CodeBlock code={`class SubscriptionPayroll {
    private AsiaPayTransfer transfer
        = new AsiaPayTransfer();  // hardcoded!

    public void run() {
        transfer.transfer(1, 9, salary);
    }
    // Want Visa? Must modify this class.
    // Want to test? Can't mock it.
}`}/>}
      right={<CodeBlock code={`class SubscriptionPayroll {
    private PaymentTransfer transfer;

    SubscriptionPayroll(PaymentTransfer t) {
        this.transfer = t;  // injected from outside
    }
    public void run() {
        transfer.transfer(1, 9, salary);
    }
    // Pass VisaTransfer() — zero code change here
    // Pass mockTransfer — testable!
}`}/>}
    />
    <Table headers={["","Tight","Loose"]}
      rows={[
        ["Created by","new ConcreteClass()","Constructor injection"],
        ["Testable?","❌ Real class only","✅ Inject mock"],
        ["Swappable?","❌ Requires code change","✅ Pass different impl"],
        ["Depends on","Concrete class","Interface"],
      ]}/>
    <Quiz question="Why does 'new AsiaPayTransfer()' inside SubscriptionPayroll create tight coupling?"
      options={["new is slower","It hardcodes a dependency — can't swap implementations without modifying the source","new prevents GC","Circular dependency"]}
      correct={1}
      explanation="Tight coupling means permanently bound to one concrete class. Loose coupling via interfaces lets you pass any PaymentTransfer from outside — zero changes to SubscriptionPayroll."/>
    <NavButtons index={10} setChapter={setChapter}/>
  </div>);
}

function Ch11({setChapter}){
  const acc=ACCENTS[11];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 12</div>
    <H accent={acc}>Interfaces — Contractual Abstraction</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>An interface is a <strong style={{color:C.text}}>contract</strong>. Classes model WHAT something IS (noun). Interfaces model WHAT something CAN DO (adjective/capability).</p>
    <Callout type="tip"><strong>Dr. Yad's analogy: interfaces are adjectives, classes are nouns.</strong> Dog is a noun. Colorful, Runnable, PaymentTransfer are adjectives.</Callout>
    <CodeBlock code={`// Colorful interface (from lecture 2026-03-11)
public interface Colorful {
    String getColor();
    void setColor(String color);
}

// Shape implements Colorful — must provide both methods
public abstract class Shape implements Colorful {
    protected String color;
    public String getColor()           { return this.color; }
    public void setColor(String color) { this.color = color; }
    public abstract double calculateArea();
}`} highlightLines={[2,3,4,8]}/>
    <H3 accent={acc}>Anonymous Classes (from lecture Apr 1)</H3>
    <CodeBlock code={`// Create a one-off Colorful without a named class
Colorful c = new Colorful() {
    public String getColor()           { return "Blue"; }
    public void setColor(String color) { /* nothing */ }
};

// printColor accepts ANY Colorful — interface polymorphism
public void printColor(Colorful obj) {
    System.out.println(obj.getColor());
}
printColor(c);          // works — anonymous class satisfies contract`} highlightLines={[2,3,4,8,9]}/>
    <Callout type="danger"><strong>Anti-pattern:</strong> using interfaces as entity tags like <code>interface HasId</code>, <code>interface HasName</code>. Interfaces describe <em>behaviour capabilities</em>, not just "I have a field named id".</Callout>
    <Quiz question="Conceptual difference between a class and an interface?"
      options={["Classes have fields, interfaces don't — only difference","Class = noun (entity); Interface = adjective (capability/contract)","Interfaces are just abstract classes","Classes run faster"]}
      correct={1}
      explanation="Entity abstraction (class) = nouns: Dog, Employee. Contractual abstraction (interface) = adjectives: Colorful, Runnable, PaymentTransfer. The distinction drives the entire Strategy Pattern design."/>
    <NavButtons index={11} setChapter={setChapter}/>
  </div>);
}

function Ch12({setChapter}){
  const acc=ACCENTS[12];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 13</div>
    <H accent={acc}>Inheritance &amp; super</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Keyword <code style={{color:'#FF79C6'}}>extends</code>. The subclass inherits everything <em>except</em> private members and constructors.</p>
    <CodeBlock code={`public abstract class Shape {
    protected String color;    // protected — subclasses can access directly

    public Shape(String color) { this.color = color; }
    public abstract double calculateArea();
}

public class Circle extends Shape {
    private final double radius;

    public Circle(String color, double radius) {
        super(color);    // MUST be first line — calls Shape's constructor
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}`} highlightLines={[11,15,16,17]}/>
    <Table headers={["Member","Inherited?","Notes"]}
      rows={[
        ["public / protected","✅ Yes","Accessible in subclass"],
        ["package-private","✅ Same package only","Not across packages"],
        ["private","❌ No","Use parent's getters"],
        ["Constructors","❌ No","Must call super() explicitly"],
      ]}/>
    <Callout type="tip"><strong>super() must be the first statement.</strong> If omitted, Java auto-inserts super() — if the parent has no no-arg constructor, compile error.</Callout>
    <Quiz question="Parent has only Parent(int x). Subclass constructor doesn't call super(). What happens?"
      options={["Java uses Parent(int x) automatically","Compile error — auto-inserted super() can't find a no-arg constructor in Parent","Runtime NullPointerException","Subclass skips parent constructor"]}
      correct={1}
      explanation="Java auto-inserts super() (no-arg) if you don't write one. If the parent only has Parent(int x), the no-arg call fails at compile time. You must write super(someValue) explicitly as the first line."/>
    <NavButtons index={12} setChapter={setChapter}/>
  </div>);
}

function Ch13({setChapter}){
  const acc=ACCENTS[13];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 14</div>
    <H accent={acc}>Method Overriding</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Subclass replaces a parent's method body. Same name, same parameters, different body.</p>
    <CodeBlock code={`// Mar 9: Shape became abstract — forces override in every subclass
public abstract class Shape {
    public abstract double calculateArea();   // no body = must override
}

public class Circle extends Shape {
    private final double radius;

    @Override                    // annotation: verify I'm actually overriding
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

// new Shape("red");  // ✗ abstract — can't instantiate
// (no silent return 0 anymore — compile-time guarantee)`} highlightLines={[3,9,10,11]}/>
    <Callout type="tip"><strong>Always write @Override.</strong> Without it, a typo silently creates a NEW method. With it, the compiler catches the mistake immediately.</Callout>
    <Table headers={["Rule","Correct","Wrong"]}
      rows={[
        ["Return type","Same or covariant subtype","Different type"],
        ["Method name","Identical","Different = overload"],
        ["Parameters","Identical","Different = overload"],
        ["Access modifier","Same or wider","Narrower = compile error"],
        ["Static methods","Cannot override","Hidden, not overridden"],
      ]}/>
    <TwoCol leftLabel="Override (runtime dispatch)" rightLabel="Overload (compile-time)"
      left={<CodeBlock code={`class Circle extends Shape {
    @Override          // same name, same params
    public double calculateArea() {
        return Math.PI * r * r;
    }
}`}/>}
      right={<CodeBlock code={`class Calculator {
    int add(int a, int b) { ... }
    double add(double a, double b){ ... }
    int add(int a, int b, int c){ ... }
    // same name, DIFFERENT params
}`}/>}
    />
    <Quiz question="@Override present but parameter type differs slightly from parent. What happens?"
      options={["Works — minor differences ignored","Compile error — @Override verifies exact match in parent","Runtime error","@Override silently ignored"]}
      correct={1}
      explanation="@Override tells the compiler: verify an exact match (same name + same parameter types) exists in the parent. If not, compile error. This catches typos and signature mismatches before runtime."/>
    <NavButtons index={13} setChapter={setChapter}/>
  </div>);
}

function Ch14({setChapter}){
  const acc=ACCENTS[14];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 15</div>
    <H accent={acc}>protected Modifier</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Bridges private (too restrictive) and public (too open) — specifically for inheritance.</p>
    <Table headers={["Modifier","Same Class","Subclass","Same Package","Everyone"]}
      rows={[
        ["private","✅","❌","❌","❌"],
        ["(default)","✅","❌ cross-pkg","✅","❌"],
        ["protected","✅","✅","✅","❌"],
        ["public","✅","✅","✅","✅"],
      ]}/>
    <H3 accent={acc}>Three Solutions to private + Inheritance</H3>
    <CodeBlock code={`// Problem: Shape.color is private, Circle needs access

// SOLUTION 1: make it protected
public abstract class Shape {
    protected String color;     // Circle can now do: this.color = "red";
}

// SOLUTION 2: getter (keeps private, adds read access)
public abstract class Shape {
    private String color;
    public String getColor() { return color; }   // Circle calls getColor()
}

// SOLUTION 3: super() constructor (private stays private)
public abstract class Shape {
    private String color;
    Shape(String color) { this.color = color; }
}
class Circle extends Shape {
    Circle(double r, String color) {
        super(color);    // parent sets its own private field
        this.radius = r;
    }
}`} highlightLines={[5,10,11,16,19,20]}/>
    <Callout type="tip">Dr. Yad prefers <strong>getters (Solution 2)</strong> or <strong>super() constructor (Solution 3)</strong> over protected fields. Protected exposes fields to ALL future subclasses — including ones written later.</Callout>
    <Quiz question="'protected int salary' in Employee. Which classes can access it directly?"
      options={["Only Employee","Employee + ALL subclasses (entire chain) + same package","Only direct subclasses","All classes in the project"]}
      correct={1}
      explanation="protected = same class + ALL subclasses (direct and indirect) + same package. Manager extends Employee — has access. HourlyContractor extends HourlyEmployee extends Employee — also has access."/>
    <NavButtons index={14} setChapter={setChapter}/>
  </div>);
}

function Ch15({setChapter}){
  const acc=ACCENTS[15];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 16</div>
    <H accent={acc}>Inheritance Problems</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Three structural problems that appear as requirements grow — and exactly why the Strategy Pattern was invented.</p>
    <H3 accent={acc}>Problem 1: Rigid Tree</H3>
    <CodeBlock code={`// Employee hierarchy from lecture (Apr 8)
Employee
├── SalaryBasedEmployee
│   ├── Faculty       // getSalary()
│   └── StaffMember   // getSalary() + getOvertime()
└── HourlyBasedEmployee
    └── Contractor    // getHourRate()

// What if Faculty needs to be ALSO hourly sometimes?
// The tree forces an artificial choice`}/>
    <H3 accent={acc}>Problem 2: instanceof Chains — Real PaySlip.java</H3>
    <CodeBlock code={`// PaySlip.java from lecture (Apr 8) — Dr. Yad showed this as BAD
class PaySlip {
    public double calculateExpendure(Employee e) {
        if (e instanceof Faculty) {
            return ((Faculty)e).getSalary();
        } else if (e instanceof StaffMember) {
            StaffMember s = (StaffMember)e;
            return s.getSalary() + s.getOvertime();
        } else if (e instanceof Contractor) {
            return ((Contractor)e).getHourRate();
        }
        // Add new type → must edit EVERY instanceof chain!
    }
}

// THE FIX — polymorphism with abstract method:
public double calculateExpendure(Employee e) {
    return e.calculateExpendure();  // one line — dispatch automatic
}`} highlightLines={[4,6,9,16,17]}/>
    <H3 accent={acc}>Problem 3: 2^n Class Explosion</H3>
    <CodeBlock code={`// 4 optional properties [HasId, HasName, HasSalary, HasOvertime]
// = 2^4 = 16 classes. Add 1 more → 32 classes!
Employee
├── EmployeeWithId
│   ├── EmployeeWithIdAndName
│   │   ├── EmployeeWithIdAndNameAndSalary
│   │   │   └── EmployeeWithIdAndNameAndSalaryAndOvertime
// ... 9 more classes
// Adding one property DOUBLES the class count`}/>
    <Callout type="danger"><strong>instanceof chains are a design smell.</strong> Every new subclass forces you to find and update every instanceof chain. Strategy Pattern eliminates this.</Callout>
    <Quiz question="What is the problem with PaySlip's instanceof chain?"
      options={["instanceof is slow","Adding a new Employee type requires finding and updating EVERY instanceof chain — easy to miss one","instanceof doesn't work with inheritance","This is actually the recommended approach"]}
      correct={1}
      explanation="Add HourlyFaculty as a new type — you must find every if/else-if chain across the codebase and add a branch. Miss one = runtime bug. Solution: make calculateExpendure() abstract in Employee. Polymorphism dispatches correctly with zero changes."/>
    <NavButtons index={15} setChapter={setChapter}/>
  </div>);
}

function Ch16({setChapter}){
  const acc=ACCENTS[16];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 17</div>
    <H accent={acc}>Strategy Design Pattern</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Replace <code style={{color:'#FF79C6'}}>extends</code> with composition: hold a strategy interface instead of being a type. Swap behaviour at runtime without touching the context class.</p>
    <Callout type="tip"><strong>Composition over Inheritance.</strong> "Faculty HAS-A HasId strategy" instead of "Faculty IS-A Employee".</Callout>
    <H3 accent={acc}>Real Evolution — Faculty/HasId (from lecture Apr 13 → 15b)</H3>
    <TwoCol leftLabel="Apr 13: Concrete composition" rightLabel="Apr 15b: Strategy injection ✅"
      left={<CodeBlock code={`public class Faculty implements HasId {
    private DefaultEmployee employee;  // concrete

    public Faculty() {
        this.employee = new DefaultEmployee();
    }
    public int getId() { return employee.getId(); }
    public void setId(int id) { employee.setId(id); }
}`}/>}
      right={<CodeBlock code={`public class Faculty implements HasId {
    private HasId strategy;   // interface!

    public Faculty() {
        this.strategy = new DefaultEmployee();
    }
    public Faculty(HasId strategy) {  // inject!
        this.strategy = strategy;
    }
    public int getId()      { return strategy.getId(); }
    public void setId(int id){ strategy.setId(id); }
}`}/>}
    />
    <H3 accent={acc}>PaymentManager — Full Pattern (from lecture)</H3>
    <CodeBlock code={`public interface PaymentTransfer {
    void transfer(int from, int to, int amount);
}

public class PaymentManager {           // Context class
    private PaymentTransfer strategy;   // holds interface, not concrete

    public PaymentManager(PaymentTransfer strategy) {
        this.strategy = strategy;        // injected!
    }
    public void transfer(int from, int to, int amount) {
        strategy.transfer(from, to, amount);   // delegate — never changes
    }
}

// Swap at runtime — PaymentManager never changes:
new PaymentManager(new AsiaPayTransfer());
new PaymentManager(new VisaTransfer());
new PaymentManager(new ZenCashTransfer());`} highlightLines={[6,8,9,11,12]}/>
    <H3 accent={acc}>Lab 3 — Applied to Calculator</H3>
    <CodeBlock code={`public interface Operation {
    double execute(double a, double b);
    String getSymbol();
}
public class Calculator {            // Context
    private Operation operation;
    public void setOperation(Operation op) { this.operation = op; }
    public double calculate(double a, double b) {
        return operation.execute(a, b);  // polymorphic dispatch
    }
}
// Concrete strategies:
class AddOperation      implements Operation { ... }
class SubtractOperation implements Operation { ... }
class DivideOperation   implements Operation {
    public double execute(double a, double b) {
        if (b == 0) throw new RuntimeException("Division by zero");
        return a / b;
    }
}`} highlightLines={[8,9]}/>
    <Quiz question="Relationship between PaymentManager and PaymentTransfer?"
      options={["PaymentManager extends PaymentTransfer","PaymentManager HAS-A PaymentTransfer — holds a reference and delegates","PaymentTransfer extends PaymentManager","Same class"]}
      correct={1}
      explanation="HAS-A (composition), not IS-A (inheritance). No extends. PaymentManager holds a private PaymentTransfer and delegates to it. Swap implementations without touching PaymentManager."/>
    <NavButtons index={16} setChapter={setChapter}/>
  </div>);
}

function Ch17({setChapter}){
  const acc=ACCENTS[17];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 18</div>
    <H accent={acc}>Factory Design Pattern</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Even with Strategy Pattern, if business logic uses <code style={{color:'#FF79C6'}}>new</code> to create strategies, it's still tightly coupled. Factory centralises creation and adds a test backdoor.</p>
    <CodeBlock code={`public class PaymentTransferFactory {
    public static PaymentTransfer instance = null;  // test override slot

    public static PaymentTransfer getInstance() {
        if (instance != null) return instance;   // test injected a mock
        return new AsiaPayTransfer();            // production default
    }
    public static void setInstance(PaymentTransfer t) {
        instance = t;
    }
}

public class SubscriptionPayroll {
    public void run() {
        PaymentTransfer transfer = PaymentTransferFactory.getInstance();
        transfer.transfer(1001, 9999, salary);   // no new here!
    }
}`} highlightLines={[4,5,6,8,9,15]}/>
    <H3 accent={acc}>Testing with Anonymous Class Mock</H3>
    <CodeBlock code={`// From TestingCodeExample.java (lecture Apr 20)
PaymentTransfer mock = new PaymentTransfer() {
    @Override
    public void transfer(int from, int to, int amount) {
        System.out.println("MOCK: transfer " + amount);
        // Verify call — don't actually send money
    }
};

PaymentTransferFactory.setInstance(mock);   // inject before test

SubscriptionPayroll payroll = new SubscriptionPayroll();
payroll.run();  // uses mock — safe, isolated

PaymentTransferFactory.setInstance(null);   // reset`} highlightLines={[2,9,14]}/>
    <Callout type="danger"><strong>Static instance = anti-pattern in production.</strong> Static state persists across tests and causes interference. This is why DI (next chapter) supersedes Factory for real code.</Callout>
    <Quiz question="Why does the Factory Pattern make code testable when direct 'new' doesn't?"
      options={["Factories are faster","setInstance() lets tests inject a mock — no changes to SubscriptionPayroll needed","Factory auto-creates mocks","new is forbidden in factories"]}
      correct={1}
      explanation="setInstance() is the test backdoor. Tests call setInstance(mock) before exercising SubscriptionPayroll. When run() calls getInstance(), it gets the mock. SubscriptionPayroll doesn't change at all."/>
    <NavButtons index={17} setChapter={setChapter}/>
  </div>);
}

function Ch18({setChapter}){
  const acc=ACCENTS[18];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 19</div>
    <H accent={acc}>Dependency Injection</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>DI removes the factory entirely. The framework reads annotations, sees what your class needs, and wires everything automatically.</p>
    <Callout type="info"><strong>Progression:</strong> keyword new (tight) → Factory (controlled) → DI (framework handles everything)</Callout>
    <H3 accent={acc}>@Inject — Declare Dependencies</H3>
    <CodeBlock code={`public class SubscriptionPayroll {
    private PaymentTransfer instance;
    private String appName;

    @Inject
    public SubscriptionPayroll(PaymentTransfer processor,
                               @AppName String name) {
        this.instance = processor;    // framework provides this
        this.appName  = name;
    }
    public void run() { instance.transfer(1001, 9999, salary); }
}`} highlightLines={[5,6,7]}/>
    <H3 accent={acc}>HRModule — Provide Dependencies</H3>
    <CodeBlock code={`public class HRModule extends AbstractModule {

    @Provides
    static PaymentTransfer providePaymentTransfer() {
        return new ZenCashTransfer();   // change here = whole app changes
    }

    @Provides @AppName   // qualifier to distinguish two String dependencies
    static String getAppName() { return "HR App"; }
}`} highlightLines={[3,4,5,8]}/>
    <H3 accent={acc}>Wire It — Guice.createInjector()</H3>
    <CodeBlock code={`public class DIApp {
    public static void main(String[] args) {
        Injector injector = Guice.createInjector(new HRModule());

        // Guice reads @Inject, sees needs PaymentTransfer + @AppName String,
        // calls the @Provides methods, constructs SubscriptionPayroll — auto!
        SubscriptionPayroll payroll =
            injector.getInstance(SubscriptionPayroll.class);

        payroll.run();
    }
}`} highlightLines={[3,7,8]}/>
    <H3 accent={acc}>Custom Qualifier — @AppName</H3>
    <CodeBlock code={`// When two dependencies share the same type (e.g. two Strings):
@Qualifier
@Retention(RetentionPolicy.RUNTIME)
public @interface AppName {}
// @AppName String appName  vs  @DbUrl String dbUrl`}/>
    <Callout type="danger"><strong>Critical exam anti-pattern: Factory + DI together.</strong> Guice wires via @Inject and the module. If code also calls PaymentTransferFactory.getInstance(), that bypasses Guice. Two competing wiring systems = unpredictable. Pick one.</Callout>
    <Table headers={["","keyword new","Factory","DI (Guice)"]}
      rows={[
        ["Creates objects","Your code","Factory class","Framework"],
        ["Testable?","❌","✅ setInstance()","✅ swap module"],
        ["Tight coupling?","❌ Yes","🟡 Reduced","✅ None"],
      ]}/>
    <Quiz question="Dr. Yad's critical anti-pattern with Google Guice?"
      options={["@Inject on private fields","Mixing DI with Factory — two competing wiring systems in same app","Using @Provides","Calling createInjector() twice"]}
      correct={1}
      explanation="Two wiring systems = unpredictable behaviour. Guice wires via @Inject; factory bypasses Guice. Inconsistent wiring causes subtle bugs. Use one system."/>
    <NavButtons index={18} setChapter={setChapter}/>
  </div>);
}

function Ch19({setChapter}){
  const acc=ACCENTS[19];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 20</div>
    <H accent={acc}>Observer Design Pattern</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>When one object changes, how do dependents find out? Dr. Yad traced 4 stages — each fixing the previous flaw.</p>
    <H3 accent={acc}>Stage 1: Polling — GUI2 (bad)</H3>
    <CodeBlock code={`public class GUI2 {
    private Stock stock;
    public void startPolling() {
        while (true) {                     // infinite loop
            display(stock.getPrice());
            Thread.sleep(1);               // burns CPU when nothing changed
        }
    }
}`} highlightLines={[4,6]}/>
    <H3 accent={acc}>Stage 2: Direct Coupling — Stock3 (bad)</H3>
    <CodeBlock code={`public class Stock3 {
    private GUI dashboard;     // tightly coupled to GUI class!

    public void setPrice(double price) {
        this.price = price;
        dashboard.update();    // Stock knows about GUI internals
    }
    // Want 2 dashboards? Must add dashboard2.update() everywhere.
}`} highlightLines={[2,6]}/>
    <H3 accent={acc}>Stage 3: Single Listener — Stock4</H3>
    <CodeBlock code={`public interface StockListener {
    void onStockChanged(Stock stock);
}
public class Stock4 {
    private StockListener listener;    // only ONE listener
    public void setListener(StockListener l) { this.listener = l; }
    public void setPrice(double price) {
        this.price = price;
        if (listener != null) listener.onStockChanged(this);
    }
}`} highlightLines={[5,9]}/>
    <H3 accent={acc}>Stage 4: List of Listeners — Stock5 ✅ (from lecture)</H3>
    <CodeBlock code={`public class Stock5 {
    private String symbol;
    private double price;
    private List<StockListener> listeners = new ArrayList<>();

    public void addListener(StockListener l)    { listeners.add(l); }
    public void removeListener(StockListener l) { listeners.remove(l); }

    private void notifyListeners() {
        for (StockListener l : listeners) {
            l.onStockChanged(this);   // Stock doesn't know WHO is listening
        }
    }
    public void setPrice(double price) {
        this.price = price;
        notifyListeners();    // push immediately
    }
    public void setSymbol(String symbol) {
        this.symbol = symbol;
        notifyListeners();
    }
}`} highlightLines={[4,6,7,9,10,11,15,16]}/>
    <H3 accent={acc}>GUI4 + Main5 — Wiring</H3>
    <CodeBlock code={`public class GUI4 implements StockListener {
    @Override
    public void onStockChanged(Stock stock) {
        System.out.println("GUI: "+stock.getSymbol()+" = "+stock.getPrice());
        update();
    }
}

// Main5.java
Stock5 appleStock = new Stock5();
GUI4 dashboard    = new GUI4();

appleStock.addListener(dashboard);      // register
appleStock.setSymbol("AAPL");           // → onStockChanged fires
appleStock.setPrice(178.5);             // → onStockChanged fires`} highlightLines={[13,14,15]}/>
    <Table headers={["Stage","Approach","Flaw"]}
      rows={[
        ["GUI2","Polling (while true)","Wastes CPU, latency"],
        ["Stock3","Direct GUI.update()","Tightly coupled to GUI"],
        ["Stock4","Single StockListener","Only one observer"],
        ["Stock5 ✅","List<StockListener>","None — unlimited, loose coupling"],
      ]}/>
    <Callout type="tip"><strong>Key insight: Stock5 doesn't know WHO is listening.</strong> Iterates list, calls onStockChanged(this) on each. Add logger, dashboard, email — Stock5 never changes.</Callout>
    <Quiz question="Fundamental flaw with polling approach (GUI2 while true)?"
      options={["while(true) is a syntax error","CPU spins constantly even when nothing changed; latency when something does","Thread.sleep() not allowed in loops","Polling only works for one observer"]}
      correct={1}
      explanation="Polling burns CPU continuously even when price hasn't changed in hours. Also has latency — if price changes between polls, you miss it until the next cycle. Stock5's push model: notifications fire the instant state changes. Zero wasted cycles."/>
    <NavButtons index={19} setChapter={setChapter}/>
  </div>);
}

function Ch20({setChapter}){
  const acc=ACCENTS[20];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 21</div>
    <H accent={acc}>Polymorphism</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>Same method call, different behaviour based on the <strong style={{color:C.text}}>actual runtime type</strong> — not the declared reference type.</p>
    <CodeBlock code={`Shape[] shapes = {
    new Circle("red", 5.0),
    new Rectangle("blue"),
    new Circle("green", 2.5),
};

for (Shape s : shapes) {
    System.out.println(s.calculateArea());
    // Circle    → Circle.calculateArea()     → PI * r^2
    // Rectangle → Rectangle.calculateArea()  → w * h
    // Same call, different behaviour — no instanceof needed!
}`} highlightLines={[7,8,9,10]}/>
    <H3 accent={acc}>printColor() — Interface Polymorphism (from DrawingApp)</H3>
    <CodeBlock code={`public void printColor(Colorful obj) {
    System.out.println(obj.getColor());  // dispatch at runtime
}

printColor(new Circle("black"));           // Circle's getColor()
printColor(new Rectangle(""));             // Rectangle's getColor()
printColor(new Colorful() {                // anonymous class
    public String getColor() { return "Purple"; }
    public void setColor(String c) {}
});`} highlightLines={[1,2]}/>
    <H3 accent={acc}>equals() Override + Copy Constructor (from lecture May 6)</H3>
    <CodeBlock code={`public class Stock {
    private String symbol;
    private double price;

    // Copy constructor — independent copy, not an alias
    public Stock(Stock other) {
        this.symbol = other.symbol;
        this.price  = other.price;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof Stock)) return false;
        Stock o = (Stock) other;
        return symbol.equals(o.symbol) && price == o.price;
    }
}`} highlightLines={[6,7,8,11,12,13,14,15,16]}/>
    <Callout type="tip"><strong>Dynamic dispatch:</strong> the JVM looks up which class's method to call at runtime. This is what makes Strategy and Observer patterns work without any if/else.</Callout>
    <Quiz question="Shape s = new Circle(5.0); s.calculateArea(); — which runs?"
      options={["Shape.calculateArea() — s is declared as Shape","Circle.calculateArea() — actual runtime object is Circle","Both — parent then child","Must cast to Circle first"]}
      correct={1}
      explanation="Java dispatches based on ACTUAL runtime type, not declared reference type. s holds a Circle, so Circle.calculateArea() runs. This is dynamic dispatch — the foundation of polymorphism, Strategy, and Observer patterns."/>
    <NavButtons index={20} setChapter={setChapter}/>
  </div>);
}

function Ch21({setChapter}){
  const acc=ACCENTS[21];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 22</div>
    <H accent={acc}>Immutable Objects &amp; Java Records</H>
    <p style={{color:C.text2,lineHeight:1.8,fontSize:15}}>An immutable object cannot be modified after creation. Every "change" returns a <em>new object</em>. Eliminates mutation bugs, aliasing surprises, thread-safety issues.</p>
    <H3 accent={acc}>The Mutation Problem — API.java (from lecture May 6)</H3>
    <CodeBlock code={`public class API {
    public static Stock magic(Stock stock) {
        stock.setPrice(0.0);   // silently mutates the caller's object!
        return stock;
    }
}

Stock apple = new Stock("AAPL", 178.5);
API.magic(apple);
System.out.println(apple.getPrice());  // 0.0 — SURPRISE!`} highlightLines={[3,10]}/>
    <H3 accent={acc}>Immutable Design — Student.java (from lecture May 11)</H3>
    <CodeBlock code={`public class Student {
    private final int id;       // final = set once, never again
    private final float gpa;

    public Student(int id, float gpa) { this.id=id; this.gpa=gpa; }

    public int   getId()  { return id; }
    public float getGpa() { return gpa; }

    // "Setter" returns NEW instance — this object is UNCHANGED
    public Student setId(int id)     { return new Student(id, this.gpa); }
    public Student setGpa(float gpa) { return new Student(this.id, gpa); }
}

// Method chaining!
Student s1 = new Student(1, 3.0f);
s1 = s1.setGpa(3.4f).setId(4);    // two new Students created

// Detect no-change using reference equality (==)
Student old = s1;
s1 = someMethod(s1);
if (old == s1) System.out.println("nothing changed");`} highlightLines={[2,3,11,12,16,17,20,21,22]}/>
    <Callout type="tip"><strong>old == s1 uses reference equality</strong> to detect no-change. Immutable setters always return new instances — if someMethod returns the same reference, nothing changed. Only works with immutable objects.</Callout>
    <H3 accent={acc}>Java Records (from lecture May 13)</H3>
    <CodeBlock code={`// OLD — 30+ lines of boilerplate
public class Department {
    private final int id;
    private final String name;
    private final String location;
    // constructor + 3 getters + equals + hashCode + toString...
}

// NEW — Java record (Java 16+)
public record Department(int id, String name, String location) {}

// Auto-generates: final fields, constructor,
// getters (id() — NOT getId()), equals, hashCode, toString

Department d = new Department(1, "CS", "Building A");
System.out.println(d.name());     // getter is name() not getName()`} highlightLines={[10,15,16]}/>
    <Table headers={["Feature","Mutable","Immutable","Record"]}
      rows={[
        ["Fields","Can change","final — set once","final (auto)"],
        ["Setters","Modify this","Return new instance","None"],
        ["Thread-safe?","❌","✅","✅"],
        ["Getter naming","getX()","getX()","x() — no 'get'"],
      ]}/>
    <Quiz question="In immutable Student, what does student.setGpa(3.8f) return?"
      options={["void","Same Student with gpa=3.8","NEW Student with gpa=3.8 and original id copied","Compile error — final field"]}
      correct={2}
      explanation="Immutable setters don't modify the current object (fields are final). They return a brand new Student with gpa=3.8 and the original's id. Caller must reassign: s = s.setGpa(3.8f). Original s is completely unchanged."/>
    <NavButtons index={21} setChapter={setChapter}/>
  </div>);
}

function Ch22({setChapter}){
  const acc=ACCENTS[22];
  return(<div>
    <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 23</div>
    <H accent={acc}>Lab Requirements &amp; Exam Summary</H>
    <H3 accent={acc}>Engineering Sweet Spot</H3>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:12,margin:'16px 0'}}>
      {[
        {color:'#F97583',label:'❌ Over-Engineered',body:'50 classes for a calculator. DI framework for a 3-file project.'},
        {color:'#3FB950',label:'✅ Sweet Spot',body:'Right abstractions for requirements. Reusable classes. Strategy where behaviour varies.'},
        {color:'#F97583',label:'❌ Under-Engineered',body:'Everything in main(). No classes. Procedural blob. (Lab 2 was this.)'},
      ].map((item,i)=>(
        <div key={i} style={{background:item.color+'12',border:`1px solid ${item.color}`,borderRadius:8,padding:14}}>
          <div style={{color:item.color,fontFamily:"'Fira Code',monospace",fontSize:11,marginBottom:8,fontWeight:700}}>{item.label}</div>
          <div style={{color:C.text2,fontSize:13,lineHeight:1.7}}>{item.body}</div>
        </div>
      ))}
    </div>
    <H3 accent={acc}>Lab 3 File Structure</H3>
    <Table headers={["File","Role","Pattern Role"]}
      rows={[
        ["Operation.java","interface: execute() + getSymbol()","Strategy interface"],
        ["AddOperation.java","return a + b","Concrete strategy"],
        ["SubtractOperation.java","return a - b","Concrete strategy"],
        ["MultiplyOperation.java","return a * b","Concrete strategy"],
        ["DivideOperation.java","throw if b==0, else a/b","Concrete strategy"],
        ["Calculator.java","holds Operation, delegates","Context class"],
        ["InputHandler.java","wraps Scanner","Collaborator"],
        ["Printer.java","printResult with getSymbol()","Collaborator"],
        ["Main.java","creates all ops, shows polymorphism","Orchestrator"],
      ]}/>
    <H3 accent={acc}>🎯 Complete Exam Cheat Sheet</H3>
    <Table headers={["Concept","One-line summary","Exam watch-out"]}
      rows={[
        ["Classes & Objects","Blueprint vs instance; new = allocate+init+return ref","Variables hold references — aliasing"],
        ["Constructors","No return type, name=class; remove default to force args","this() must be first statement"],
        ["this keyword","this = current object; this() = constructor delegation","this() MUST be first line"],
        ["Static Blocks","Runs once on class load, not per object","Not testable — avoid in prod"],
        ["private","Control + Abstraction — TWO benefits","Constructor calls setters"],
        ["Getters/Setters","Private field + validated setter + pure getter","No duplicate validation"],
        ["Entity Abstraction","Classes=nouns, methods=verbs","Decompose reqs by entity"],
        ["CRC Cards","Class/Responsibilities/Collaborators — design first","Responsibility → field or method"],
        ["UML","+/-/# symbols; type after colon (reversed from Java)","# = protected"],
        ["Abstract Classes","Cannot instantiate; abstract methods force override","Subclass implements ALL or is abstract"],
        ["Code Coupling","keyword new = tight coupling","Use interfaces + injection"],
        ["Interfaces","Adjective/capability — not noun/entity","Don't misuse as HasId/HasName"],
        ["Inheritance","extends; non-private inherited; constructors NOT inherited","super() first line"],
        ["Overriding","Same sig; @Override catches typos; static can't override","Override != overload"],
        ["protected","same class + ALL subclasses + same package","Entire chain, not just direct"],
        ["Inheritance Problems","Rigid tree, 2^n explosion, instanceof chains","These justify Strategy Pattern"],
        ["Strategy Pattern","Composition HAS-A; delegate; swap at runtime","No extends on context class"],
        ["Factory Pattern","Centralise new; setInstance() for test mocks","Static state = anti-pattern"],
        ["DI (Guice)","@Inject + Module + Injector; framework wires it","Factory+DI together = anti-pattern"],
        ["Observer Pattern","addListener/notify; Subject doesn't know WHO","Polling is always bad"],
        ["Polymorphism","Runtime dispatch on ACTUAL type, not declared","Dynamic dispatch"],
        ["Immutable Objects","final fields; setters return new instances","old==s1 = reference equality"],
        ["Java Records","record Dept(id, name){} = immutable POJO","Getter is name() not getName()"],
      ]}/>
    <div style={{background:C.card,border:`1px solid #3FB950`,borderRadius:10,padding:24,marginTop:24,textAlign:'center'}}>
      <div style={{fontSize:40,marginBottom:12}}>🎓</div>
      <div style={{color:'#3FB950',fontFamily:"'Fira Code',monospace",fontSize:18,fontWeight:700,marginBottom:10}}>Course Complete!</div>
      <div style={{color:C.text2,lineHeight:1.9,fontSize:15}}>
        The thread throughout every chapter:<br/>
        <strong style={{color:C.text}}>Reduce coupling. Increase cohesion. Make code testable and extensible.</strong><br/>
        Classes → Inheritance → Interfaces → Patterns → DI.<br/>
        Each layer solves the previous layer's problem.
      </div>
    </div>
    <NavButtons index={22} setChapter={setChapter}/>
  </div>);
}

// ════════════════════════════════════════════════════════════
// SIDEBAR CONTENT (shared between desktop + mobile drawer)
// ════════════════════════════════════════════════════════════
function SidebarContent({chapter, setChapter, accent}) {
  return (
    <>
      <div style={{padding:'20px 16px',borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:C.muted,letterSpacing:2,marginBottom:4}}>SE421</div>
        <div style={{color:C.text,fontWeight:700,fontSize:15}}>Java OOP</div>
        <div style={{color:C.muted,fontSize:12,marginTop:3}}>Complete Study Guide</div>
      </div>
      <div style={{overflowY:'auto',flex:1,padding:'6px 0'}}>
        {TITLES.map((title,i)=>{
          const ac=ACCENTS[i]; const active=chapter===i;
          return(
            <button key={i} onClick={()=>setChapter(i)} style={{
              width:'100%',textAlign:'left',
              background:active?`${ac}18`:'transparent',
              border:'none',
              borderLeft:active?`3px solid ${ac}`:'3px solid transparent',
              padding:'11px 16px',cursor:'pointer',transition:'background 0.15s',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,
                  color:active?ac:C.muted,minWidth:22,letterSpacing:0.5}}>
                  {String(i+1).padStart(2,'0')}
                </span>
                <span style={{fontSize:15}}>{ICONS[i]}</span>
                <span style={{color:active?ac:C.text2,fontSize:12.5,
                  fontWeight:active?700:400,lineHeight:1.35}}>{title}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{padding:'12px 16px',borderTop:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:C.muted,marginBottom:6}}>
          Chapter {chapter+1} of {TITLES.length}
        </div>
        <div style={{height:4,background:C.card,borderRadius:2,overflow:'hidden'}}>
          <div style={{
            height:'100%',
            width:`${((chapter+1)/TITLES.length)*100}%`,
            background:accent,borderRadius:2,transition:'width 0.3s',
          }}/>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════
const CHAPTERS=[Ch0,Ch1,Ch2,Ch3,Ch4,Ch5,Ch6,Ch7,Ch8,Ch9,Ch10,Ch11,
                Ch12,Ch13,Ch14,Ch15,Ch16,Ch17,Ch18,Ch19,Ch20,Ch21,Ch22];

export default function App() {
  const [chapter, setChapter] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener('resize',check);
    return()=>window.removeEventListener('resize',check);
  },[]);

  const goTo = (i) => {
    setChapter(i);
    setMenuOpen(false);
    window.scrollTo({top:0, behavior:'smooth'});
  };

  const Chapter = CHAPTERS[chapter];
  const accent  = ACCENTS[chapter];

  // ── MOBILE ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <GlobalStyles/>
        <div style={{background:C.bg,minHeight:'100vh',color:C.text,
          fontFamily:'system-ui,-apple-system,sans-serif'}}>

          {/* Fixed top bar */}
          <div style={{position:'fixed',top:0,left:0,right:0,zIndex:200,
            background:C.surface,borderBottom:`1px solid ${C.border}`,
            height:56,display:'flex',alignItems:'center',
            justifyContent:'space-between',padding:'0 16px',
            boxShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,flex:1,minWidth:0}}>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:12,color:accent,fontWeight:700,flexShrink:0}}>SE421</span>
              <span style={{color:C.muted,fontSize:12,flexShrink:0}}>·</span>
              <span style={{color:C.text2,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {ICONS[chapter]} {TITLES[chapter]}
              </span>
            </div>
            {/* Hamburger */}
            <button onClick={()=>setMenuOpen(v=>!v)} style={{
              flexShrink:0,width:44,height:44,background:menuOpen?accent+'22':'transparent',
              border:`1px solid ${menuOpen?accent:C.border}`,borderRadius:8,
              cursor:'pointer',display:'flex',flexDirection:'column',
              alignItems:'center',justifyContent:'center',gap:5,marginLeft:8,
            }}>
              <span style={{display:'block',width:18,height:2,background:menuOpen?accent:C.text2,borderRadius:2,
                transition:'all 0.2s',transform:menuOpen?'rotate(45deg) translate(0px, 7px)':'none'}}/>
              <span style={{display:'block',width:18,height:2,background:menuOpen?accent:C.text2,borderRadius:2,
                transition:'all 0.2s',opacity:menuOpen?0:1}}/>
              <span style={{display:'block',width:18,height:2,background:menuOpen?accent:C.text2,borderRadius:2,
                transition:'all 0.2s',transform:menuOpen?'rotate(-45deg) translate(0px, -7px)':'none'}}/>
            </button>
          </div>

          {/* Drawer backdrop */}
          {menuOpen&&(
            <div onClick={()=>setMenuOpen(false)} style={{
              position:'fixed',inset:0,zIndex:300,background:'rgba(1,4,9,0.75)',
              backdropFilter:'blur(2px)',
            }}/>
          )}

          {/* Slide-in drawer */}
          <div style={{
            position:'fixed',top:0,left:0,bottom:0,zIndex:400,
            width:Math.min(300, window.innerWidth*0.85),
            background:C.surface,
            borderRight:`1px solid ${C.border}`,
            display:'flex',flexDirection:'column',
            transform:menuOpen?'translateX(0)':'translateX(-100%)',
            transition:'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
            boxShadow:menuOpen?'4px 0 24px rgba(0,0,0,0.5)':'none',
          }}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
              padding:'16px',borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
              <div>
                <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:C.muted,letterSpacing:2}}>SE421</div>
                <div style={{color:C.text,fontWeight:700,fontSize:15,marginTop:2}}>Java OOP</div>
              </div>
              <button onClick={()=>setMenuOpen(false)} style={{
                width:36,height:36,background:'transparent',
                border:`1px solid ${C.border}`,borderRadius:6,
                color:C.text2,fontSize:18,cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>✕</button>
            </div>
            <div style={{overflowY:'auto',flex:1,WebkitOverflowScrolling:'touch'}}>
              {TITLES.map((title,i)=>{
                const ac=ACCENTS[i]; const active=chapter===i;
                return(
                  <button key={i} onClick={()=>goTo(i)} style={{
                    width:'100%',textAlign:'left',
                    background:active?`${ac}18`:'transparent',
                    border:'none',borderLeft:active?`3px solid ${ac}`:'3px solid transparent',
                    padding:'14px 18px',cursor:'pointer',
                  }}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:active?ac:C.muted,minWidth:24}}>{String(i+1).padStart(2,'0')}</span>
                      <span style={{fontSize:17}}>{ICONS[i]}</span>
                      <span style={{color:active?ac:C.text,fontSize:14,fontWeight:active?700:400,lineHeight:1.35}}>{title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{padding:'14px 18px',borderTop:`1px solid ${C.border}`,flexShrink:0}}>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:C.muted,marginBottom:8}}>
                {chapter+1} / {TITLES.length} chapters
              </div>
              <div style={{height:4,background:C.card,borderRadius:2,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${((chapter+1)/TITLES.length)*100}%`,background:accent,borderRadius:2,transition:'width 0.3s'}}/>
              </div>
            </div>
          </div>

          {/* Main scrollable content */}
          <div style={{paddingTop:56}}>
            <div style={{padding:'20px 16px 60px',maxWidth:600,margin:'0 auto'}}>
              <Chapter setChapter={goTo}/>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── DESKTOP ─────────────────────────────────────────────
  return (
    <>
      <GlobalStyles/>
      <div style={{display:'flex',height:'100vh',background:C.bg,
        fontFamily:'system-ui,-apple-system,sans-serif',color:C.text,overflow:'hidden'}}>
        <div style={{width:240,background:C.surface,borderRight:`1px solid ${C.border}`,
          display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0}}>
          <SidebarContent chapter={chapter} setChapter={setChapter} accent={accent}/>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'40px 48px'}}>
          <div style={{maxWidth:820,margin:'0 auto'}}>
            <Chapter setChapter={setChapter}/>
          </div>
        </div>
      </div>
    </>
  );
}
