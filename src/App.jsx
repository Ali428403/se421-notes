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

const CS = {
  info:  {border:'#58A6FF',bg:'rgba(88,166,255,0.07)', icon:'ℹ',label:'Note'},
  warn:  {border:'#D29922',bg:'rgba(210,153,34,0.07)', icon:'⚠',label:'Warning'},
  tip:   {border:'#3FB950',bg:'rgba(63,185,80,0.07)',  icon:'✦',label:'Exam Tip'},
  danger:{border:'#F97583',bg:'rgba(249,117,131,0.07)',icon:'⛔',label:'Anti-Pattern'},
};
function Callout({type='info',children}){
  const s=CS[type];
  return(
    <div style={{background:s.bg,borderLeft:`3px solid ${s.border}`,padding:'12px 16px',
      borderRadius:'0 6px 6px 0',margin:'14px 0',color:C.text}}>
      <strong style={{color:s.border,fontFamily:"'Fira Code',monospace",fontSize:12}}>{s.icon} {s.label}</strong>
      <div style={{marginTop:6,lineHeight:1.75}}>{children}</div>
    </div>
  );
}

function Quiz({question,options,correct,explanation}){
  const [sel,setSel]=useState(null);
  const [checked,setChecked]=useState(false);
  const gc=i=>{
    if(!checked)return sel===i?'#58A6FF':C.border;
    if(i===correct)return'#3FB950';
    if(i===sel&&i!==correct)return'#F97583';
    return C.border;
  };
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:20,margin:'20px 0'}}>
      <div style={{color:'#8BE9FD',fontFamily:"'Fira Code',monospace",fontSize:11,marginBottom:12,letterSpacing:1}}>◆ KNOWLEDGE CHECK</div>
      <p style={{color:C.text,marginBottom:14,lineHeight:1.7,fontSize:15}}>{question}</p>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {options.map((opt,i)=>(
          <button key={i} onClick={()=>!checked&&setSel(i)} style={{
            background:checked&&i===correct?'rgba(63,185,80,0.1)':checked&&i===sel&&i!==correct?'rgba(249,117,131,0.1)':sel===i?'rgba(88,166,255,0.1)':'transparent',
            border:`1px solid ${gc(i)}`,borderRadius:6,padding:'10px 14px',color:C.text,
            textAlign:'left',cursor:checked?'default':'pointer',fontSize:14,transition:'all 0.15s',
          }}>
            <span style={{color:gc(i),marginRight:10,fontFamily:"'Fira Code',monospace"}}>
              {checked?(i===correct?'✓':i===sel?'✗':`${i+1}.`):`${i+1}.`}
            </span>{opt}
          </button>
        ))}
      </div>
      {!checked&&(
        <button onClick={()=>sel!==null&&setChecked(true)} style={{
          marginTop:12,background:sel!==null?'#58A6FF':C.border,color:C.bg,
          border:'none',borderRadius:6,padding:'8px 20px',
          cursor:sel!==null?'pointer':'not-allowed',fontFamily:"'Fira Code',monospace",fontSize:13,
        }}>Check Answer</button>
      )}
      {checked&&(
        <div style={{marginTop:14,padding:'12px 14px',
          background:sel===correct?'rgba(63,185,80,0.07)':'rgba(249,117,131,0.07)',
          border:`1px solid ${sel===correct?'#3FB950':'#F97583'}`,
          borderRadius:6,color:C.text,lineHeight:1.75,fontSize:14}}>
          <strong style={{color:sel===correct?'#3FB950':'#F97583'}}>
            {sel===correct?'✓ Correct!':'✗ Not quite.'}
          </strong>{' '}{explanation}
        </div>
      )}
    </div>
  );
}

function Diagram({title,accent='#A5D6FF',variables=[],methods=[]}){
  const row=(item,color)=>(
    <div key={item} style={{padding:'5px 12px',borderBottom:`1px solid ${C.border}`,
      fontFamily:"'Fira Code',monospace",fontSize:12,color}}>{item}</div>
  );
  return(
    <div style={{display:'inline-block',border:`2px solid ${accent}`,borderRadius:6,
      overflow:'hidden',margin:'12px 4px',minWidth:220,verticalAlign:'top'}}>
      <div style={{background:accent+'25',padding:'8px 12px',borderBottom:`1px solid ${accent}`,
        fontFamily:"'Fira Code',monospace",fontSize:13,fontWeight:700,color:accent}}>{title}</div>
      {variables.map(v=>row(v,'#F1FA8C'))}
      {variables.length>0&&methods.length>0&&<div style={{borderBottom:`1px solid ${C.border}`,height:1}}/>}
      {methods.map(m=>row(m,'#8BE9FD'))}
    </div>
  );
}

function TwoCol({left,right,leftLabel='Before',rightLabel='After'}){
  const [narrow, setNarrow] = useState(false);
  useEffect(()=>{
    const check=()=>setNarrow(window.innerWidth<600);
    check();
    window.addEventListener('resize',check);
    return()=>window.removeEventListener('resize',check);
  },[]);
  return(
    <div style={{display:'grid',gridTemplateColumns:narrow?'1fr':'1fr 1fr',gap:12,margin:'12px 0'}}>
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

function Table({headers,rows}){
  return(
    <div style={{overflowX:'auto',margin:'14px 0'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontFamily:"'Fira Code',monospace",fontSize:13}}>
        <thead>
          <tr>{headers.map((h,i)=>(
            <th key={i} style={{background:C.card,padding:'8px 12px',borderBottom:`2px solid ${C.border}`,color:C.text2,textAlign:'left'}}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} style={{background:i%2===0?'transparent':C.surface}}>
              {row.map((cell,j)=>(
                <td key={j} style={{padding:'7px 12px',borderBottom:`1px solid ${C.border}`,color:C.text,lineHeight:1.5}}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NavButtons({index,setChapter}){
  const total=TITLES.length;
  return(
    <div style={{display:'flex',justifyContent:'space-between',marginTop:40,paddingTop:20,borderTop:`1px solid ${C.border}`}}>
      {index>0?(
        <button onClick={()=>setChapter(index-1)} style={{background:'transparent',border:`1px solid ${C.border}`,borderRadius:6,padding:'10px 20px',color:C.text2,cursor:'pointer',fontFamily:"'Fira Code',monospace",fontSize:13}}>← {TITLES[index-1]}</button>
      ):<div/>}
      {index<total-1?(
        <button onClick={()=>setChapter(index+1)} style={{background:ACCENTS[index+1]+'22',border:`1px solid ${ACCENTS[index+1]}`,borderRadius:6,padding:'10px 20px',color:ACCENTS[index+1],cursor:'pointer',fontFamily:"'Fira Code',monospace",fontSize:13,fontWeight:600}}>Next: {TITLES[index+1]} →</button>
      ):(
        <div style={{color:'#3FB950',fontFamily:"'Fira Code',monospace",fontSize:13,alignSelf:'center'}}>🎓 Course Complete!</div>
      )}
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
      <p style={{color:C.text2,lineHeight:1.8}}>A <strong style={{color:C.text}}>class</strong> is a blueprint. An <strong style={{color:C.text}}>object</strong> is a live instance in memory. Every class has two kinds of members: <em>variable members</em> (fields it holds) and <em>method members</em> (things it can do).</p>

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
z.age   = 5f;     // z's OWN age — independent
System.out.println(tom.age); // 2.5
System.out.println(z.age);   // 5.0`}/>}
        right={<CodeBlock code={`// city is shared — ONE copy for all cats
Cat.city = "Suly";
System.out.println(tom.city); // "Suly"
System.out.println(z.city);   // "Suly"
// change one → changes for ALL`}/>}
      />

      <H3 accent={acc}>⚠ Object Aliasing — Critical Exam Topic</H3>
      <CodeBlock code={`Cat tom = new Cat();
tom.age = 2.5f;

Cat z = tom;    // z is NOT a copy — both point to SAME object!
z.age = 6f;     // modifying z also modifies tom!

System.out.println(tom.age);  // 6.0 — SURPRISE!
// tom and z hold the same memory address`} highlightLines={[3,4,6]}/>
      <Callout type="warn"><strong>Aliasing:</strong> assigning an object variable to another doesn't copy the object — both variables point to the same memory. Change one, and the other reflects the change. This is a common source of bugs and is why <strong>immutable objects</strong> and <strong>copy constructors</strong> matter (Chapter 21).</Callout>

      <H3 accent={acc}>The keyword new — 3 Steps</H3>
      <CodeBlock code={`// Cat tom = new Cat();
// Step 1 — ALLOCATE: reserve memory on the heap for a Cat object
// Step 2 — INITIALIZE: run the Cat() constructor
// Step 3 — RETURN: give back a reference (address), store in 'tom'

Cat tom = new Cat();   // 'tom' holds the ADDRESS, not the object itself
tom.age = 2.5f;        // dot operator: navigate address → field`} highlightLines={[6,7]}/>

      <Quiz question="Cat tom = new Cat(); Cat z = tom; z.age = 99; — what is tom.age?"
        options={["Still the original value — z is a separate copy","99 — because z and tom point to the same object","Compile error — two variables can't reference one object","null — tom was overwritten"]}
        correct={1}
        explanation="Object variables hold references (memory addresses). Writing z = tom copies the address, not the object. Now z and tom both point to the same Cat on the heap. Setting z.age = 99 modifies that single shared object — so tom.age is also 99. This is aliasing."/>
      <NavButtons index={0} setChapter={setChapter}/>
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
      <p style={{color:C.text2,lineHeight:1.8}}>A constructor runs automatically when you write <code style={{color:'#8BE9FD'}}>new ClassName()</code>. Two rules: <strong style={{color:C.text}}>no return type</strong> (not even void), and <strong style={{color:C.text}}>name must match the class</strong>.</p>

      <H3 accent={acc}>The 3-Step new Process</H3>
      <CodeBlock code={`// Cat tom = new Cat(2.5f);
// Step 1: Allocate memory on the heap
// Step 2: Run the matching constructor — Cat(float age)
// Step 3: Return the reference, store in 'tom'`}/>

      <H3 accent={acc}>Constructor Delegation with this() — Real Cat Example</H3>
      <CodeBlock code={`// From lecture: Cat.java (2026-03-02)
public class Cat {
    private float age;

    // No-arg constructor delegates to the float constructor
    public Cat() {
        this(-1f);   // MUST be first line — calls Cat(float)
        System.out.println("Cat constructor is called");
    }

    public Cat(float age) {
        System.out.println("Second Cat constructor is called");
        this.age = age;
    }
}

// new Cat()    → prints "Second Cat constructor..." then "Cat constructor..."
// new Cat(2f)  → prints "Second Cat constructor..." only`} highlightLines={[6,7,11,12]}/>
      <Callout type="tip"><strong>Execution order with this():</strong> the delegated constructor runs FIRST (all of it), then execution returns to the line after this() in the calling constructor. The output: "Second Cat..." always prints before "Cat constructor..."</Callout>

      <H3 accent={acc}>Force Mandatory Values — Remove the Default</H3>
      <CodeBlock code={`// If you want 'age' to always be set, provide NO no-arg constructor
public class Cat {
    private float age;

    public Cat(float age) {      // only constructor — no default
        this.age = age;
    }
}

// new Cat()        // ✗ COMPILE ERROR — good! compiler enforces the rule
// new Cat(2.5f)    // ✓ forced to supply age`} highlightLines={[9,10]}/>

      <H3 accent={acc}>Private Constructor — Block All Instantiation</H3>
      <CodeBlock code={`// From lecture: Cat.java — private constructor (commented out, shown as concept)
public class Cat {
    // private Cat() { }   // ← no one outside can write new Cat()
    // Used for: Singleton pattern, utility classes, Factory pattern
}`}/>

      <Quiz question="In Cat's no-arg constructor, this(-1f) is the first line. What prints when you write new Cat()?"
        options={["'Cat constructor is called' only","'Second Cat constructor is called' then 'Cat constructor is called'","'Cat constructor is called' then 'Second Cat constructor is called'","Nothing — this() prevents any printing"]}
        correct={1}
        explanation="this(-1f) delegates to Cat(float age), which runs completely first — printing 'Second Cat constructor is called'. Then control returns to the no-arg constructor and prints 'Cat constructor is called'. The delegated constructor always completes before the caller continues."/>
      <NavButtons index={1} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 2 — THE this KEYWORD
// ════════════════════════════════════════════════════════════
function Ch2({setChapter}){
  const acc=ACCENTS[2];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 03</div>
      <H accent={acc}>The this Keyword</H>
      <p style={{color:C.text2,lineHeight:1.8}}><code style={{color:'#8BE9FD'}}>this</code> has two uses: as a <strong style={{color:C.text}}>variable</strong> (pointer to the current object) and as a <strong style={{color:C.text}}>constructor call</strong> (<code style={{color:'#8BE9FD'}}>this()</code>).</p>

      <H3 accent={acc}>this as a Variable — Breaking Shadowing</H3>
      <CodeBlock code={`public class Cat {
    private float age;

    // Parameter 'age' shadows the field 'age'
    public void setAge(float age) {
        // Without 'this': age = age → assigns parameter to itself (bug!)
        this.age = age;   // this.age = field, age = parameter
    }

    // this changes per object — same method, different 'this' each call
    public void printRef() {
        System.out.println(this);  // prints the memory address of THIS cat
    }
}`} highlightLines={[7]}/>

      <H3 accent={acc}>this() — Constructor Delegation</H3>
      <CodeBlock code={`public class Cat {
    private float age;

    public Cat() {
        this(-1f);   // delegates — MUST be first line, no code above it!
    }

    public Cat(float age) {
        this.age = age;
    }
}`} highlightLines={[5]}/>
      <Callout type="warn"><code>this()</code> must be the <strong>very first statement</strong>. You cannot write any code before it. <code>this</code> as a variable can appear anywhere.</Callout>

      <Quiz question="What does 'this' refer to inside: public void setAge(float age) { this.age = age; }"
        options={["The class Cat itself","The specific object that setAge() was called on","The parameter named age","A static reference shared by all Cat objects"]}
        correct={1}
        explanation="this always refers to the specific object the method was called on. If you call tom.setAge(2.5f), then inside setAge, this == tom. If you call z.setAge(5f), then this == z. Same method, different this every call. It's the mechanism that lets one method serve all instances."/>
      <NavButtons index={2} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 3 — STATIC BLOCKS
// ════════════════════════════════════════════════════════════
function Ch3({setChapter}){
  const acc=ACCENTS[3];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 04</div>
      <H accent={acc}>Static Blocks</H>
      <p style={{color:C.text2,lineHeight:1.8}}>A static block runs <strong style={{color:C.text}}>exactly once</strong> when the JVM first loads the class — before any object is created. Unlike constructors (per object), static blocks are per class.</p>

      <H3 accent={acc}>Syntax — Cat Example from Lecture</H3>
      <CodeBlock code={`public class Cat {
    public static String city;

    // From lecture: this was shown then COMMENTED OUT intentionally
    // static {
    //     System.out.println("Cat static block");
    // }

    // The reason: static blocks run ONCE, before any constructor.
    // Order: static block → constructor (per each new Cat())
}`} highlightLines={[5,6,7]}/>

      <Table headers={["","Static Block","Constructor"]}
        rows={[
          ["Triggered by","Class first loaded by JVM","Every new ClassName()"],
          ["Runs how many times?","Exactly once","Once per object created"],
          ["Has access to 'this'?","❌ No","✅ Yes"],
          ["Testable?","❌ No — cannot inject mocks","✅ Yes"],
          ["Purpose","One-time class setup","Per-object initialization"],
        ]}/>

      <Callout type="danger"><strong>Dr. Yad's rule: avoid static blocks in real code.</strong> They fire before your test framework starts — you cannot mock or override them. If a static block opens a database connection or reads a file, unit tests will require the real environment to be set up. Use constructors or factories instead.</Callout>

      <Quiz question="You loop: for(int i=0;i{`<`}100;i++) new Cat(); — how many times does a static block in Cat run?"
        options={["100 times","1 time — when the class is first loaded, before the loop begins","0 times — static blocks only run if called explicitly","It depends on JVM garbage collection"]}
        correct={1}
        explanation="The static block fires exactly once when the JVM loads the Cat class. That happens before the loop creates any objects. All 100 new Cat() calls run the constructor, not the static block. Static = per class, not per object."/>
      <NavButtons index={3} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 4 — ACCESS MODIFIERS
// ════════════════════════════════════════════════════════════
function Ch4({setChapter}){
  const acc=ACCENTS[4];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 05</div>
      <H accent={acc}>Access Modifiers</H>

      <H3 accent={acc}>public vs private — Two Benefits of private</H3>
      <CodeBlock code={`public class BankAccount {
    public String owner;      // ← anyone can read/write — no control
    private double balance;   // ← only this class can touch it

    // Benefit 1: CONTROL — validate before changing
    public void deposit(double amount) {
        if (amount > 0) balance += amount;  // negative deposits blocked
    }

    // Benefit 2: ABSTRACTION — caller doesn't know if it's double or int
    // We can change the internal type without breaking external code
    public double getBalance() { return balance; }
}`} highlightLines={[2,3,6,7]}/>

      <Callout type="tip"><strong>The two benefits of private:</strong> (1) <strong>Control</strong> — you validate input through methods before allowing state changes. (2) <strong>Abstraction</strong> — the internal implementation can change without affecting callers. These are the two answers Dr. Yad specifically asks about in exams.</Callout>

      <H3 accent={acc}>Private Constructors</H3>
      <CodeBlock code={`// Private constructor = no one outside can write new MyClass()
// Used in: Singleton, Factory Pattern, utility classes

public class MathUtils {
    private MathUtils() {}   // prevent instantiation — all methods are static

    public static int square(int x) { return x * x; }
}

// MathUtils m = new MathUtils();  // ✗ COMPILE ERROR
// MathUtils.square(5);            // ✓ use via class name`} highlightLines={[4,5]}/>

      <Quiz question="What are the TWO benefits Dr. Yad emphasizes for making fields private?"
        options={["Speed and memory efficiency","Control (validated access via methods) and Abstraction (hide implementation from callers)","Thread safety and garbage collection","Only one benefit: preventing access from other packages"]}
        correct={1}
        explanation="Dr. Yad specifically names two benefits: (1) Control — you intercept changes through setter methods and validate them (reject negative salaries, null names). (2) Abstraction — the caller only knows the public interface, not whether balance is a double, BigDecimal, or fetched from a database. Change the internals freely without touching callers."/>
      <NavButtons index={4} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 5 — GETTER/SETTER PATTERN
// ════════════════════════════════════════════════════════════
function Ch5({setChapter}){
  const acc=ACCENTS[5];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 06</div>
      <H accent={acc}>Getter / Setter Design Pattern</H>
      <p style={{color:C.text2,lineHeight:1.8}}>Private fields + validated setters + pure getters. The constructor calls the setters so validation lives in exactly one place.</p>

      <H3 accent={acc}>Full Employee Example (from lecture 2026-04-06)</H3>
      <CodeBlock code={`public class Employee {
    private int id;
    private String name;
    private double salary;

    // Constructor reuses setters — validation in ONE place
    public Employee(int id, String name, double salary) {
        setId(id);         // not this.id = id — call the setter!
        setName(name);
        setSalary(salary);
    }

    // Pure getters — just return
    public int    getId()     { return id; }
    public String getName()   { return name; }
    public double getSalary() { return salary; }

    // Validated setters
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
        if (salary < 0)
            throw new RuntimeException("Salary cannot be negative");
        this.salary = salary;
    }
}`} highlightLines={[7,8,9,10,18,19,22,23,24,27,28,29]}/>
      <Callout type="tip"><strong>Why call setters from the constructor?</strong> If validation is in both the constructor and the setter, they can drift apart. One call site, one rule — the constructor delegates to setters so the logic is never duplicated.</Callout>

      <Quiz question="Why does the Employee constructor call setId(id) instead of this.id = id?"
        options={["It doesn't matter — both are equivalent","Calling the setter centralises validation so the check runs at construction AND later when called directly","this.id = id is illegal inside a constructor","Setters are always faster than direct assignment"]}
        correct={1}
        explanation="If you write this.id = id directly in the constructor, the validation in setId() is bypassed during construction. By calling setId(id), one piece of validation code protects the field in every scenario. Never duplicate validation logic."/>
      <NavButtons index={5} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 6 — ENTITY ABSTRACTION
// ════════════════════════════════════════════════════════════
function Ch6({setChapter}){
  const acc=ACCENTS[6];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 07</div>
      <H accent={acc}>Entity Abstraction</H>
      <p style={{color:C.text2,lineHeight:1.8}}><strong style={{color:C.text}}>Classes model nouns</strong> (real-world entities). <strong style={{color:C.text}}>Methods model verbs</strong> (actions). This is how you decompose large, complex requirements into manageable pieces.</p>

      <H3 accent={acc}>The Wall/Brick Analogy</H3>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:16,margin:'12px 0'}}>
        <p style={{color:C.text2,lineHeight:1.85,margin:0}}>🧱 A <strong style={{color:acc}}>wall</strong> is built from uniform <strong style={{color:acc}}>bricks</strong>. Each brick is simple and reusable. The wall is complex, but building it is tractable because you just stack bricks.<br/><br/>Your software is the wall. Your <strong style={{color:acc}}>classes are the bricks</strong> — each one small, focused, and reusable. Complexity is managed by decomposition.</p>
      </div>

      <H3 accent={acc}>Lab 1 as Entity Abstraction</H3>
      <TwoCol leftLabel="❌ Procedural (everything in main)" rightLabel="✅ Entity Abstraction (Lab 1)"
        left={<CodeBlock code={`public class Main {
    public static void main(String[] args) {
        // 100 lines of logic
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        // ... all mixed together
    }
}`}/>}
        right={<CodeBlock code={`// Three focused classes:
Calculator calc = new Calculator();
InputHandler input = new InputHandler();
Printer printer = new Printer();

// main just orchestrates:
int a = input.getInteger("Enter a: ");
int b = input.getInteger("Enter b: ");
printer.printResult("Add", calc.add(a, b));`}/>}
      />
      <Callout type="tip"><strong>Systematic approach for 200+ requirements:</strong> (1) Identify nouns → classes. (2) Identify verbs per noun → methods. (3) Assign each requirement to exactly one class. Complexity is now distributed, not concentrated in one giant main().</Callout>

      <Quiz question="In entity abstraction, what does a class represent and what do methods represent?"
        options={["Classes = algorithms, methods = data types","Classes = nouns (real-world entities), methods = verbs (actions that entity performs)","Classes = actions, methods = state","Both represent the same concept"]}
        correct={1}
        explanation="Entity abstraction maps language directly to code: nouns → classes, verbs → methods. A Calculator (noun) can add(), subtract(), multiply() (verbs). An Employee (noun) can getSalary(), setName(), calculateBonus(). This makes the design intuitive and maintainable."/>
      <NavButtons index={6} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 7 — CRC CARDS
// ════════════════════════════════════════════════════════════
function Ch7({setChapter}){
  const acc=ACCENTS[7];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 08</div>
      <H accent={acc}>CRC Cards</H>
      <p style={{color:C.text2,lineHeight:1.8}}><strong style={{color:C.text}}>Class / Responsibilities / Collaborators.</strong> Index cards used to design a system before writing any code. Changing a class name on a card takes 0.1 seconds. Changing it in 50 Java files takes an hour.</p>

      <H3 accent={acc}>Anatomy of a CRC Card</H3>
      <div style={{border:`1px solid ${acc}`,borderRadius:8,overflow:'hidden',maxWidth:420,margin:'16px 0'}}>
        <div style={{background:acc+'22',padding:'10px 16px',borderBottom:`1px solid ${acc}`,fontFamily:"'Fira Code',monospace",fontSize:14,color:acc,fontWeight:700}}>Calculator</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderBottom:`1px solid ${C.border}`}}>
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
          ["'Know the employee salary'","private double salary; (field)"],
          ["'Calculate bonus'","double calculateBonus() (method)"],
        ]}/>
      <Callout type="tip">Every responsibility on the card becomes either a <strong>field</strong> (data the object knows) or a <strong>method</strong> (behaviour the object can do). This is the direct bridge from design to code.</Callout>

      <Quiz question="What is the PRIMARY reason to use CRC cards BEFORE writing code?"
        options={["To auto-generate Java code","Design is cheap on cards — mistakes cost seconds; mistakes in code cost hours","To replace UML diagrams","CRC cards are for post-coding documentation"]}
        correct={1}
        explanation="CRC cards are a low-cost exploration tool. Rearrange responsibilities, rename classes, redesign collaborations in seconds. Once in code, every structural change cascades through the codebase. Design first, code second."/>
      <NavButtons index={7} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 8 — UML CLASS DIAGRAMS
// ════════════════════════════════════════════════════════════
function Ch8({setChapter}){
  const acc=ACCENTS[8];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 09</div>
      <H accent={acc}>UML Class Diagrams</H>
      <p style={{color:C.text2,lineHeight:1.8}}>UML (Unified Modeling Language) is the formal notation for class structure. It comes <em>after</em> CRC (exploratory) and <em>before</em> Java (implementation).</p>

      <H3 accent={acc}>Full Modeling Pipeline</H3>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',margin:'16px 0',fontFamily:"'Fira Code',monospace",fontSize:13}}>
        {['Requirements','CRC Cards','UML','Java Code','Machine Code'].map((s,i,arr)=>(
          <span key={i} style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{background:C.card,border:`1px solid ${acc}`,borderRadius:6,padding:'6px 12px',color:acc}}>{s}</span>
            {i<arr.length-1&&<span style={{color:C.muted}}>→</span>}
          </span>
        ))}
      </div>

      <H3 accent={acc}>UML Box Anatomy</H3>
      <div style={{display:'flex',gap:20,flexWrap:'wrap',margin:'14px 0'}}>
        <Diagram title="Employee" accent={acc}
          variables={["- id: int","- name: String","- salary: double"]}
          methods={["+ getId(): int","+ setName(n: String): void","# getSalaryBase(): double","+ calculateBonus(): double"]}/>
        <div style={{flex:1,minWidth:220}}>
          <Table headers={["UML Symbol","Java Modifier"]}
            rows={[["+ (plus)","public"],["-  (minus)","private"],["# (hash)","protected"],["~ (tilde)","package-private (default)"]]}/>
          <Callout type="warn"><strong>UML vs Java syntax:</strong> UML writes <code>name: String</code> (type after). Java writes <code>String name</code> (type before). This difference often appears in exam questions.</Callout>
        </div>
      </div>

      <Quiz question="In a UML diagram, '# getSalaryBase(): double' means what in Java?"
        options={["public double getSalaryBase()","private double getSalaryBase()","protected double getSalaryBase()","static double getSalaryBase()"]}
        correct={2}
        explanation="# in UML means protected. + is public, - is private, ~ is package-private. The method signature also shows the return type comes AFTER in UML (: double) but before in Java (double getSalaryBase()). Both conventions appear in SE421 exams."/>
      <NavButtons index={8} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 9 — ABSTRACT CLASSES
// ════════════════════════════════════════════════════════════
function Ch9({setChapter}){
  const acc=ACCENTS[9];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 10</div>
      <H accent={acc}>Abstract Classes</H>
      <p style={{color:C.text2,lineHeight:1.8}}>An <strong style={{color:C.text}}>abstract class</strong> is a class that cannot be instantiated directly — it exists only to be extended. It can have both concrete methods (with body) and <strong style={{color:C.text}}>abstract methods</strong> (no body — subclasses must implement them).</p>

      <H3 accent={acc}>The Problem It Solves — Shape (from lecture Mar 9)</H3>
      <CodeBlock code={`// Mar 3: Shape was concrete — had a body that printed an error
public class Shape {
    public double calculateArea() {
        System.err.println("Area calculation not defined for generic shape.");
        return 0.0;           // ← meaningless default, easy to forget to override
    }
}

// Mar 9: Shape became abstract — forces every subclass to implement area
public abstract class Shape {
    protected String color;

    public Shape(String color) { this.color = color; }

    public abstract double calculateArea();  // ← NO body, NO return 0

    public void displayColor() {
        System.out.println("This shape is " + color + ".");
    }
}`} highlightLines={[10,14]}/>

      <H3 accent={acc}>Abstract Method Rules</H3>
      <CodeBlock code={`// Circle MUST implement calculateArea() — won't compile otherwise
public class Circle extends Shape {
    private final double radius;   // final — immutable after construction

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;   // must provide a body
    }
}

// new Shape("red");  // ✗ COMPILE ERROR — cannot instantiate abstract class
// new Circle("red", 5.0);  // ✓ fine — Circle is concrete`} highlightLines={[4,10,11,12,15]}/>

      <H3 accent={acc}>Abstract vs Interface</H3>
      <Table headers={["","Abstract Class","Interface"]}
        rows={[
          ["Keyword","abstract class","interface"],
          ["Can have fields?","✅ Yes","❌ No (only constants)"],
          ["Can have concrete methods?","✅ Yes","✅ (default methods, Java 8+)"],
          ["Constructor?","✅ Yes","❌ No"],
          ["Extend/implement how many?","1 (single inheritance)","Multiple"],
          ["Models","IS-A relationship","CAN-DO capability"],
        ]}/>

      <Callout type="tip"><strong>When to use abstract class:</strong> when subclasses share some concrete behaviour (like <code>displayColor()</code>) but must each define their own version of certain methods (like <code>calculateArea()</code>). Abstract enforces the contract while providing shared code.</Callout>

      <Quiz question="A class extends an abstract class but doesn't implement one of the abstract methods. What happens?"
        options={["Runtime error when the method is called","Compile error — the subclass must either implement ALL abstract methods or itself be declared abstract","The abstract method is skipped silently","Java generates a default implementation that returns null/0"]}
        correct={1}
        explanation="If a concrete class extends an abstract class, it must implement every abstract method — or declare itself abstract too. This is a compile-time check, not runtime. The compiler guarantees all abstract methods are implemented before you can create objects of that class."/>
      <NavButtons index={9} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 10 — CODE COUPLING
// ════════════════════════════════════════════════════════════
function Ch10({setChapter}){
  const acc=ACCENTS[10];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 11</div>
      <H accent={acc}>Code Coupling</H>
      <p style={{color:C.text2,lineHeight:1.8}}><strong style={{color:C.text}}>Coupling</strong> measures how much one class depends on another. High coupling = changes cascade everywhere. Low coupling = classes can change independently.</p>

      <Callout type="danger"><strong>Dr. Yad's core rule: the keyword <code>new</code> creates tight coupling.</strong> Writing <code>new AsiaPayTransfer()</code> inside a class permanently binds it to AsiaPayTransfer. You cannot swap implementations without modifying that class.</Callout>

      <TwoCol leftLabel="❌ Tight Coupling" rightLabel="✅ Loose Coupling"
        left={<CodeBlock code={`class SubscriptionPayroll {
    // Hardcoded dependency
    private AsiaPayTransfer transfer
        = new AsiaPayTransfer();

    public void run() {
        transfer.transfer(1, 9, salary);
    }
    // Switch to Visa? Must edit this file.
    // Test with mock? Cannot.
}`}/>}
        right={<CodeBlock code={`class SubscriptionPayroll {
    private PaymentTransfer transfer;

    // Dependency injected from outside
    SubscriptionPayroll(PaymentTransfer t) {
        this.transfer = t;
    }
    public void run() {
        transfer.transfer(1, 9, salary);
    }
    // Switch to Visa? Pass new VisaTransfer().
    // Test with mock? Pass a mock object.
}`}/>}
      />

      <Table headers={["","Tight Coupling","Loose Coupling"]}
        rows={[
          ["Created by","keyword new inside the class","Constructor/setter injection"],
          ["Testable?","❌ Must use real class","✅ Inject a mock/stub"],
          ["Swappable?","❌ Requires code change","✅ Pass different implementation"],
          ["Depends on","Concrete class","Interface"],
        ]}/>

      <Quiz question="Why does writing 'new AsiaPayTransfer()' inside SubscriptionPayroll create tight coupling?"
        options={["new is slower than other instantiation methods","It hardcodes a dependency on AsiaPayTransfer — you cannot swap implementations without modifying SubscriptionPayroll's source code","new prevents garbage collection","It causes a circular dependency"]}
        correct={1}
        explanation="Tight coupling means the class is permanently bound to a specific concrete class. Any change to AsiaPayTransfer ripples into SubscriptionPayroll. Loose coupling via interfaces lets you pass any PaymentTransfer implementation from outside — zero changes to SubscriptionPayroll needed."/>
      <NavButtons index={10} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 11 — INTERFACES (CONTRACTUAL ABSTRACTION)
// ════════════════════════════════════════════════════════════
function Ch11({setChapter}){
  const acc=ACCENTS[11];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 12</div>
      <H accent={acc}>Interfaces — Contractual Abstraction</H>
      <p style={{color:C.text2,lineHeight:1.8}}>An interface is a <strong style={{color:C.text}}>contract</strong>. Where entity abstraction models <em>what something is</em> (noun/class), contractual abstraction models <em>what something can do</em> (adjective/interface).</p>

      <Callout type="tip"><strong>Dr. Yad's analogy: interfaces are adjectives, classes are nouns.</strong> <code>Dog</code> is a noun. <code>Colorful</code>, <code>Runnable</code>, <code>PaymentTransfer</code> are adjectives. A class implements an interface to say "I have this capability."</Callout>

      <H3 accent={acc}>Colorful Interface (from lecture 2026-03-11)</H3>
      <CodeBlock code={`// Interface = contract — declares WHAT without HOW
public interface Colorful {
    String getColor();
    void setColor(String color);
}

// Shape implements Colorful — must provide both methods
public abstract class Shape implements Colorful {
    protected String color;

    public String getColor()              { return this.color; }
    public void setColor(String color)    { this.color = color; }

    public abstract double calculateArea();
}`} highlightLines={[2,3,4,8]}/>

      <H3 accent={acc}>Anonymous Classes (from lecture Apr 1)</H3>
      <CodeBlock code={`// From DrawingApp.java — create a one-off Colorful without a named class
public class DrawingApp {
    void main() {
        // Anonymous class: implement Colorful on the fly
        Colorful c = new Colorful() {
            public String getColor()           { return "Blue"; }
            public void setColor(String color) { /* do nothing */ }
        };

        printColor(c);   // works — c satisfies the Colorful contract
    }

    // Accepts ANY Colorful — Circle, Rectangle, anonymous class, doesn't matter
    public void printColor(Colorful obj) {
        System.out.println(obj.getColor());
    }
}`} highlightLines={[5,6,7,8,13,14]}/>
      <Callout type="info"><strong>Anonymous classes</strong> are a shorthand: define and instantiate an interface/class in one expression. Useful for one-off implementations (callbacks, test mocks). You'll see this in Factory Pattern testing — <code>new PaymentTransfer() {"{ ... }"}</code>.</Callout>

      <H3 accent={acc}>PaymentTransfer Interface (from lecture)</H3>
      <CodeBlock code={`public interface PaymentTransfer {
    void transfer(int from, int to, int amount);
}

// Any class implementing this MUST provide transfer()
public class AsiaPayTransfer implements PaymentTransfer {
    @Override
    public void transfer(int from, int to, int amount) {
        // AsiaPay-specific logic
    }
}`}/>

      <Callout type="danger"><strong>Anti-pattern Dr. Yad warned about:</strong> using interfaces as entity tags — like <code>interface HasId</code>, <code>interface HasName</code>. This misuses the concept. Interfaces should describe a <em>behaviour capability</em>, not just announce "I have a field called id". That's entity abstraction's job (classes).</Callout>

      <Quiz question="What is the conceptual difference between a class and an interface?"
        options={["Classes have fields; interfaces have only methods — that is the only difference","A class models WHAT something IS (noun/entity); an interface models WHAT something CAN DO (adjective/capability)","Interfaces are just abstract classes with different syntax","Classes are slower; interfaces are faster"]}
        correct={1}
        explanation="Entity abstraction (classes) models nouns: Dog, Employee, Calculator. Contractual abstraction (interfaces) models adjectives/capabilities: Colorful, Runnable, PaymentTransfer. The distinction drives the design of the entire Strategy Pattern — the interface is the 'tag' that says what a class can do, regardless of what it is."/>
      <NavButtons index={11} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 12 — INHERITANCE & super
// ════════════════════════════════════════════════════════════
function Ch12({setChapter}){
  const acc=ACCENTS[12];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 13</div>
      <H accent={acc}>Inheritance &amp; super</H>
      <p style={{color:C.text2,lineHeight:1.8}}>Inheritance lets a subclass reuse code from a superclass. In Java: <code style={{color:'#FF79C6'}}>extends</code>. The subclass inherits everything <em>except</em> private members and constructors.</p>

      <H3 accent={acc}>Shape → Circle (real lecture progression)</H3>
      <CodeBlock code={`// Shape has private color — Circle cannot touch it directly
// Solution: pass through super() constructor
public abstract class Shape {
    protected String color;    // Week 2 changed to protected

    public Shape(String color) {
        this.color = color;
    }

    public abstract double calculateArea();
    public void displayColor() {
        System.out.println("This shape is " + color + ".");
    }
}

public class Circle extends Shape {
    private final double radius;   // final — cannot change after init

    public Circle(String color, double radius) {
        super(color);   // MUST be first line — initialises Shape's fields
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}`} highlightLines={[3,19,20]}/>

      <H3 accent={acc}>What Gets Inherited</H3>
      <Table headers={["Member","Inherited?","Notes"]}
        rows={[
          ["public fields/methods","✅ Yes","Directly accessible in subclass"],
          ["protected fields/methods","✅ Yes","Directly accessible in subclass"],
          ["package-private (default)","✅ Same package only","Not across packages"],
          ["private fields/methods","❌ No","Must use parent's getters/setters"],
          ["Constructors","❌ No","Must call super() explicitly"],
        ]}/>

      <Callout type="tip"><strong>super() must be the first statement</strong> in a subclass constructor. If omitted, Java auto-inserts <code>super()</code> — if the parent has no no-arg constructor, this is a compile error.</Callout>

      <Quiz question="A subclass constructor doesn't call super(). The parent class has only a parameterised constructor Parent(int x). What happens?"
        options={["Java uses the parent's parameterised constructor automatically","Compile error — Java tries to auto-insert super() but no no-arg constructor exists in Parent","Runtime NullPointerException","The subclass skips the parent constructor entirely"]}
        correct={1}
        explanation="Java auto-inserts super() (no-arg) if you don't write one. If the parent only has Parent(int x), the no-arg super() call fails at compile time. You must explicitly write super(someValue) as the first line of the subclass constructor."/>
      <NavButtons index={12} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 13 — METHOD OVERRIDING
// ════════════════════════════════════════════════════════════
function Ch13({setChapter}){
  const acc=ACCENTS[13];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 14</div>
      <H accent={acc}>Method Overriding</H>
      <p style={{color:C.text2,lineHeight:1.8}}>Overriding lets a subclass replace a parent's method body. Same name, same parameters, different body.</p>

      <H3 accent={acc}>The calculateArea() Problem (from lecture)</H3>
      <CodeBlock code={`// Mar 3: Shape had a generic calculateArea() returning 0
// Problem: easy to FORGET to override — no compile-time guarantee

// Mar 9: Changed to abstract — compiler FORCES override in every subclass
public abstract class Shape {
    public abstract double calculateArea();   // no body = must override
}

public class Circle extends Shape {
    private final double radius;

    @Override                          // annotation: verify I'm actually overriding
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

// Shape s = new Shape("red");  // ✗ can't instantiate abstract
// s.calculateArea();           // ← would have returned 0 silently — BAD`} highlightLines={[6,11,12]}/>

      <H3 accent={acc}>Override Rules</H3>
      <Table headers={["Rule","Correct","Wrong"]}
        rows={[
          ["Return type","Same or covariant subtype","Different type"],
          ["Method name","Must be identical","Different = overload not override"],
          ["Parameters","Must be identical","Different = overload"],
          ["Access modifier","Same or wider","Narrower (public → private = error)"],
          ["Static methods","Cannot be overridden","Hidden, not overridden"],
        ]}/>

      <Callout type="tip"><strong>Always write @Override.</strong> Without it, a typo in the method name silently creates a NEW method instead of overriding. With @Override, the compiler catches the mistake immediately.</Callout>

      <TwoCol leftLabel="Override (runtime dispatch)" rightLabel="Overload (compile-time)"
        left={<CodeBlock code={`// Same name, SAME params, in subclass
class Circle extends Shape {
    @Override
    public double calculateArea() {
        return Math.PI * r * r;
    }
}`}/>}
        right={<CodeBlock code={`// Same name, DIFFERENT params, same class
class Calculator {
    int add(int a, int b) { ... }
    double add(double a, double b){ ... }
    int add(int a, int b, int c){ ... }
}`}/>}
      />

      <Quiz question="A method has @Override but the parameter type is slightly different from the parent's. What happens?"
        options={["Works — Java ignores minor differences with @Override","Compile error — @Override verifies an exact match exists in the parent","Runtime error when called","@Override is silently ignored"]}
        correct={1}
        explanation="@Override is a compile-time directive saying 'verify this overrides something in the parent.' If no exact match exists (same name + same parameter types), the compiler fails. This is exactly why @Override is valuable — it catches typos and signature mismatches before runtime."/>
      <NavButtons index={13} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 14 — protected MODIFIER
// ════════════════════════════════════════════════════════════
function Ch14({setChapter}){
  const acc=ACCENTS[14];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 15</div>
      <H accent={acc}>protected Modifier</H>
      <p style={{color:C.text2,lineHeight:1.8}}><code style={{color:'#FF79C6'}}>protected</code> bridges private (too restrictive for inheritance) and public (too open). Subclasses need parent data, but private blocks them.</p>

      <Table headers={["Modifier","Same Class","Subclass","Same Package","Everyone"]}
        rows={[
          ["private","✅","❌","❌","❌"],
          ["(default)","✅","❌ (cross-pkg)","✅","❌"],
          ["protected","✅","✅","✅","❌"],
          ["public","✅","✅","✅","✅"],
        ]}/>

      <H3 accent={acc}>Three Solutions to private + Inheritance</H3>
      <CodeBlock code={`// Problem: Shape.color is private, Circle extends Shape

// SOLUTION 1: make it protected
public abstract class Shape {
    protected String color;     // Circle can now: this.color = "red";
}

// SOLUTION 2: use getters (keeps private, adds read access)
public abstract class Shape {
    private String color;
    public String getColor() { return color; }   // Circle calls getColor()
}

// SOLUTION 3: super() constructor (private stays private, parent sets it)
public abstract class Shape {
    private String color;
    Shape(String color) { this.color = color; }
}
public class Circle extends Shape {
    Circle(double r, String color) {
        super(color);    // parent sets its own private field
        this.radius = r;
    }
}`} highlightLines={[4,5,9,10,11,15,16,20,21]}/>

      <Callout type="tip">Dr. Yad's preference: <strong>getters (Solution 2)</strong> or <strong>super() constructor (Solution 3)</strong> over protected fields. Protected exposes fields to ALL future subclasses — including ones written later. Getters keep control in the parent.</Callout>

      <Quiz question="'protected int salary' in Employee. Which classes can access it directly (dot notation, no getter)?"
        options={["Only Employee itself","Employee AND all subclasses (entire chain) AND all classes in the same package","Only Employee's direct subclasses","All classes in the project"]}
        correct={1}
        explanation="protected = same class + ALL subclasses (direct, indirect, the full inheritance chain) + all classes in the same package. So Manager extends Employee — has access. And HourlyContractor extends HourlyEmployee extends Employee — also has access. But unrelated classes in different packages do not."/>
      <NavButtons index={14} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 15 — INHERITANCE PROBLEMS
// ════════════════════════════════════════════════════════════
function Ch15({setChapter}){
  const acc=ACCENTS[15];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 16</div>
      <H accent={acc}>Inheritance Problems</H>
      <p style={{color:C.text2,lineHeight:1.8}}>Inheritance has three structural problems that appear as requirements grow. Understanding them is <em>exactly why</em> the Strategy Pattern was invented.</p>

      <H3 accent={acc}>Problem 1: Rigid Tree</H3>
      <CodeBlock code={`// Employee hierarchy from lecture (Apr 8)
Employee
├── SalaryBasedEmployee
│   ├── Faculty           // getSalary()
│   └── StaffMember       // getSalary() + getOvertime()
└── HourlyBasedEmployee
    └── Contractor        // getHourRate()

// Problem: what if Faculty needs to be ALSO hourly sometimes?
// The tree forces an artificial choice — can't be in two places`}/>

      <H3 accent={acc}>Problem 2: instanceof Chains — Real Code from Lecture</H3>
      <CodeBlock code={`// PaySlip.java from lecture (Apr 8) — the WRONG approach shown first
class PaySlip {
    // Dr. Yad showed this as the BAD version:
    public double calculateExpendure(Employee e) {
        if (e instanceof Faculty) {
            Faculty f = (Faculty) e;
            return f.getSalary();
        } else if (e instanceof StaffMember) {
            StaffMember s = (StaffMember) e;
            return s.getSalary() + s.getOvertime();
        } else if (e instanceof Contractor) {
            Contractor c = (Contractor) e;
            return c.getHourRate();
        }
    }
    // Add a new Employee type → must find and edit EVERY instanceof chain
}

// The FIX using polymorphism — calculateExpendure() becomes abstract in Employee
public double calculateExpendure(Employee e) {
    return e.calculateExpendure();   // one line — polymorphism handles dispatch!
}`} highlightLines={[5,8,11,19,20]}/>

      <H3 accent={acc}>Problem 3: 2^n Explosion</H3>
      <CodeBlock code={`// Optional properties: [HasId, HasName, HasSalary, HasOvertime]
// 4 properties = 2^4 = 16 possible combinations
// Each combination needs its own class in pure inheritance:

Employee
├── EmployeeWithId
│   ├── EmployeeWithIdAndName
│   │   ├── EmployeeWithIdAndNameAndSalary
│   │   │   └── EmployeeWithIdAndNameAndSalaryAndOvertime
// ... 7 more classes just for Employee variants

// Add ONE more property → class count DOUBLES`}/>

      <Callout type="danger"><strong>instanceof chains are a design smell.</strong> Every new subclass forces you to hunt down all instanceof chains and add a new branch. The Strategy Pattern eliminates this completely.</Callout>

      <Quiz question="In PaySlip.java from lecture, what is the problem with: if(e instanceof Faculty) ... else if(e instanceof Contractor) ...?"
        options={["instanceof is slower than polymorphism","Adding a new Employee type requires finding and updating EVERY instanceof chain in the codebase — violates extensibility","instanceof doesn't work with inheritance","This is actually the recommended approach"]}
        correct={1}
        explanation="Every instanceof chain is a maintenance bomb. Add HourlyFaculty as a new type — now you must find every if/else-if chain across the codebase and add a branch. Miss one and you have a runtime bug. The solution: make calculateExpendure() abstract in Employee. Polymorphism dispatches correctly with zero changes needed."/>
      <NavButtons index={15} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 16 — STRATEGY DESIGN PATTERN
// ════════════════════════════════════════════════════════════
function Ch16({setChapter}){
  const acc=ACCENTS[16];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 17</div>
      <H accent={acc}>Strategy Design Pattern</H>
      <p style={{color:C.text2,lineHeight:1.8}}>Strategy replaces <code style={{color:'#FF79C6'}}>extends</code> with composition: an object <em>holds</em> a strategy (interface) instead of <em>being</em> a type. Swap behaviour at runtime without touching the context class.</p>

      <Callout type="tip"><strong>Core idea: Composition over Inheritance.</strong> Instead of "Faculty IS-A Employee", we use "Faculty HAS-A HasId strategy". The strategy is swappable; the Faculty is stable.</Callout>

      <H3 accent={acc}>Real Lecture Evolution — Faculty with HasId Strategy (Apr 13 → 15b)</H3>
      <TwoCol leftLabel="Apr 13: Faculty with DefaultEmployee" rightLabel="Apr 15b: Faculty with injected HasId strategy"
        left={<CodeBlock code={`// Composition — holds a DefaultEmployee
public class Faculty implements HasId {
    private DefaultEmployee employee;

    public Faculty() {
        this.employee = new DefaultEmployee();
    }
    public int getId() {
        return employee.getId();   // delegate
    }
    public void setId(int id) {
        employee.setId(id);
    }
}`}/>}
        right={<CodeBlock code={`// Strategy injection — holds HasId interface
public class Faculty implements HasId {
    private HasId strategy;

    public Faculty() {
        this.strategy = new DefaultEmployee();
    }
    // INJECT a different strategy
    public Faculty(HasId strategy) {
        this.strategy = strategy;
    }
    public int getId()     { return strategy.getId(); }
    public void setId(int id) { strategy.setId(id); }
}`}/>}
      />

      <H3 accent={acc}>PaymentManager — Full Strategy Pattern (from lecture)</H3>
      <CodeBlock code={`// Strategy interface
public interface PaymentTransfer {
    void transfer(int from, int to, int amount);
}

// Context class — holds strategy, delegates to it
public class PaymentManager {
    private PaymentTransfer strategy;

    public PaymentManager(PaymentTransfer strategy) {
        this.strategy = strategy;    // injected!
    }

    public void transfer(int from, int to, int amount) {
        strategy.transfer(from, to, amount);   // delegate
    }
}

// Concrete strategies — all interchangeable
public class AsiaPayTransfer  implements PaymentTransfer { ... }
public class VisaTransfer     implements PaymentTransfer { ... }
public class ZenCashTransfer  implements PaymentTransfer { ... }

// Usage — swap at runtime, PaymentManager never changes
PaymentManager pm = new PaymentManager(new AsiaPayTransfer());
pm.transfer(1, 2, 500);

pm = new PaymentManager(new VisaTransfer());  // swap — zero code changes in PaymentManager`} highlightLines={[8,10,11,14,15]}/>

      <H3 accent={acc}>Applied to Lab 3 — Calculator</H3>
      <CodeBlock code={`public interface Operation {
    double execute(double a, double b);
    String getSymbol();
}

public class Calculator {           // Context
    private Operation operation;

    public void setOperation(Operation op) { this.operation = op; }

    public double calculate(double a, double b) {
        return operation.execute(a, b);   // polymorphic dispatch
    }
}

// Each concrete strategy:
public class AddOperation implements Operation {
    public double execute(double a, double b) { return a + b; }
    public String getSymbol() { return "+"; }
}
public class DivideOperation implements Operation {
    public double execute(double a, double b) {
        if (b == 0) throw new RuntimeException("Division by zero");
        return a / b;
    }
    public String getSymbol() { return "/"; }
}`} highlightLines={[7,8,10,11]}/>

      <Quiz question="In the Strategy Pattern, what is the relationship between PaymentManager and PaymentTransfer?"
        options={["PaymentManager extends PaymentTransfer","PaymentManager HAS-A PaymentTransfer (composition) — holds a reference and delegates to it","PaymentTransfer extends PaymentManager","They are the same class"]}
        correct={1}
        explanation="Strategy Pattern is HAS-A (composition), not IS-A (inheritance). PaymentManager holds a private PaymentTransfer field and delegates the actual logic to it. No extends. This lets you swap PaymentTransfer implementations (Visa, AsiaPay, ZenCash) without touching PaymentManager."/>
      <NavButtons index={16} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 17 — FACTORY DESIGN PATTERN
// ════════════════════════════════════════════════════════════
function Ch17({setChapter}){
  const acc=ACCENTS[17];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 18</div>
      <H accent={acc}>Factory Design Pattern</H>
      <p style={{color:C.text2,lineHeight:1.8}}>Even with Strategy Pattern, if business logic uses <code style={{color:'#FF79C6'}}>new</code> to create strategies, it's still tightly coupled. Factory centralises object creation and adds a backdoor for testing.</p>

      <H3 accent={acc}>PaymentTransferFactory (from lecture Apr 20)</H3>
      <CodeBlock code={`public class PaymentTransferFactory {
    public static PaymentTransfer instance = null;  // test override slot

    public static PaymentTransfer getInstance() {
        if (instance != null) return instance;  // test injected a mock
        return new AsiaPayTransfer();           // production default
    }

    // Called by tests to inject a mock before running business code
    public static void setInstance(PaymentTransfer useInstance) {
        instance = useInstance;
    }
}

// Business logic uses factory — not new directly
public class SubscriptionPayroll {
    public void run() {
        PaymentTransfer transfer = PaymentTransferFactory.getInstance();
        transfer.transfer(1001, 9999, salary);
    }
}`} highlightLines={[4,5,6,10,11,17]}/>

      <H3 accent={acc}>Testing with Anonymous Class Mock (from TestingCodeExample.java)</H3>
      <CodeBlock code={`// From lecture: create a mock using anonymous class — no library needed!
PaymentTransfer mockTransfer = new PaymentTransfer() {
    @Override
    public void transfer(int from, int to, int amount) {
        System.out.println("MOCK: transfer called — " + amount);
        // Don't actually send money — just verify the call
    }
};

// Inject mock before running the code under test
PaymentTransferFactory.setInstance(mockTransfer);

SubscriptionPayroll payroll = new SubscriptionPayroll();
payroll.run();  // uses mock — safe, isolated, no real money

// Reset after test
PaymentTransferFactory.setInstance(null);`} highlightLines={[2,3,4,5,10,11]}/>

      <Callout type="danger"><strong>Static instance = anti-pattern in production.</strong> The lecture showed <code>public static PaymentTransfer instance</code>. Static state persists across tests and can cause interference. This is why Dependency Injection (next chapter) supersedes the Factory Pattern for production code.</Callout>

      <Quiz question="Why does the Factory Pattern make code testable when direct 'new' doesn't?"
        options={["Factories are faster to instantiate","setInstance() lets tests inject a mock before calling business code — no changes to SubscriptionPayroll needed","Factory methods auto-create mocks","new is forbidden inside factory classes"]}
        correct={1}
        explanation="The backdoor is setInstance(). Tests call setInstance(mockObject) before exercising SubscriptionPayroll. When run() calls PaymentTransferFactory.getInstance(), it gets the mock instead of the real AsiaPayTransfer. SubscriptionPayroll doesn't change at all — the swap happens externally."/>
      <NavButtons index={17} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 18 — DEPENDENCY INJECTION
// ════════════════════════════════════════════════════════════
function Ch18({setChapter}){
  const acc=ACCENTS[18];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 19</div>
      <H accent={acc}>Dependency Injection</H>
      <p style={{color:C.text2,lineHeight:1.8}}>DI removes the factory entirely. An external framework reads annotations, sees what your class needs, and wires everything automatically.</p>

      <Callout type="info"><strong>Progression:</strong> keyword new (tight) → Factory (controlled) → DI (framework handles everything).</Callout>

      <H3 accent={acc}>@Inject — Declare Dependencies (from lecture Apr 22)</H3>
      <CodeBlock code={`public class SubscriptionPayroll {
    private PaymentTransfer instance;
    private String appName;

    @Inject
    public SubscriptionPayroll(PaymentTransfer processor,
                               @AppName String name) {
        this.instance = processor;   // framework provides this
        this.appName = name;         // framework provides this too
    }

    public void run() {
        instance.transfer(1001, 9999, salary);
    }
}`} highlightLines={[5,6,7]}/>

      <H3 accent={acc}>HRModule — Provide Dependencies</H3>
      <CodeBlock code={`public class HRModule extends AbstractModule {

    @Provides
    static PaymentTransfer providePaymentTransfer() {
        return new ZenCashTransfer();   // change here = changes for the whole app
    }

    @Provides @AppName     // qualifier: distinguishes from other String @Provides
    static String getAppName() {
        return "HR App";
    }
}`} highlightLines={[3,4,5,8,9]}/>

      <H3 accent={acc}>Wiring — Guice.createInjector()</H3>
      <CodeBlock code={`public class DIApp {
    public static void main(String[] args) {
        // Tell Guice which module to use
        Injector injector = Guice.createInjector(new HRModule());

        // Guice reads @Inject on SubscriptionPayroll,
        // sees it needs PaymentTransfer → calls providePaymentTransfer()
        // sees it needs @AppName String → calls getAppName()
        // Constructs SubscriptionPayroll with those values — automatically
        SubscriptionPayroll payroll =
            injector.getInstance(SubscriptionPayroll.class);

        payroll.run();
    }
}`} highlightLines={[4,10,11]}/>

      <H3 accent={acc}>Custom Qualifier — @AppName</H3>
      <CodeBlock code={`// When two dependencies have the same type (e.g. two Strings),
// qualify them with custom annotations

@Qualifier
@Retention(RetentionPolicy.RUNTIME)
public @interface AppName {}

// Usage: @AppName String appName  vs  @DbUrl String dbUrl`} highlightLines={[4,5,6]}/>

      <Callout type="danger"><strong>Critical exam anti-pattern: Factory + DI together.</strong> If you have Guice wiring AND also call <code>PaymentTransferFactory.getInstance()</code> in the same codebase, you have two competing wiring systems. Guice doesn't know about the factory. Choose one — in modern code, DI wins.</Callout>

      <Table headers={["","keyword new","Factory","DI (Guice)"]}
        rows={[
          ["Who creates objects?","Your code","Factory class","Framework"],
          ["Testable?","❌","✅ setInstance()","✅ swap module"],
          ["Tight coupling?","❌ Yes","🟡 Reduced","✅ None"],
          ["Boilerplate","None","Medium","Low (annotations)"],
        ]}/>

      <Quiz question="What is Dr. Yad's critical anti-pattern when using Google Guice?"
        options={["Using @Inject on private fields","Mixing DI with Factory — using setInstance() AND Guice wiring in the same app creates two competing systems","Using @Provides in a module","Calling createInjector() more than once"]}
        correct={1}
        explanation="Two competing wiring systems = unpredictable behaviour. Guice wires via @Inject and the module; but if code also calls PaymentTransferFactory.getInstance(), that bypasses Guice and may return a different object. Inconsistent wiring causes subtle, hard-to-debug bugs. Use one system."/>
      <NavButtons index={18} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 19 — OBSERVER DESIGN PATTERN
// ════════════════════════════════════════════════════════════
function Ch19({setChapter}){
  const acc=ACCENTS[19];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 20</div>
      <H accent={acc}>Observer Design Pattern</H>
      <p style={{color:C.text2,lineHeight:1.8}}>Observer solves: when one object changes, how do dependents find out? Dr. Yad traced 4 evolutionary stages — each fixing the previous stage's flaw.</p>

      <H3 accent={acc}>Stage 1: Polling — GUI2 (bad)</H3>
      <CodeBlock code={`public class GUI2 {
    private Stock stock;
    public void startPolling() {
        while (true) {                    // infinite loop — runs forever
            display(stock.getPrice());
            Thread.sleep(1);              // burns CPU even when price unchanged
        }
    }
}`} highlightLines={[4,5,6]}/>

      <H3 accent={acc}>Stage 2: Direct Coupling — Stock3 (bad)</H3>
      <CodeBlock code={`public class Stock3 {
    private GUI dashboard;    // ← TIGHTLY COUPLED to GUI class!

    public void setPrice(double price) {
        this.price = price;
        dashboard.update();   // Stock knows about GUI internals
    }
}
// Add a second dashboard? Must add dashboard2.update() to every setter.`} highlightLines={[2,5,6]}/>

      <H3 accent={acc}>Stage 3: Single Listener — Stock4</H3>
      <CodeBlock code={`public interface StockListener {
    void onStockChanged(Stock stock);
}

public class Stock4 {
    private StockListener listener;     // only ONE listener

    public void setListener(StockListener l) { this.listener = l; }

    public void setPrice(double price) {
        this.price = price;
        if (listener != null)
            listener.onStockChanged(this);
    }
}`} highlightLines={[6,12,13]}/>

      <H3 accent={acc}>Stage 4: List of Listeners — Stock5 (FINAL — from lecture)</H3>
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
        notifyListeners();    // push notification immediately
    }
    public void setSymbol(String symbol) {
        this.symbol = symbol;
        notifyListeners();
    }
}`} highlightLines={[4,6,7,9,10,11,16,17]}/>

      <H3 accent={acc}>GUI4 — The Observer (from lecture)</H3>
      <CodeBlock code={`public class GUI4 implements StockListener {
    @Override
    public void onStockChanged(Stock stock) {
        System.out.println("GUI: " + stock.getSymbol() + " = " + stock.getPrice());
        update();   // do the actual 100-line UI refresh
    }
    private void update() { /* 100 lines of UI logic */ }
}

// Main5.java — wiring
Stock5 appleStock = new Stock5();
GUI4 dashboard = new GUI4();

appleStock.addListener(dashboard);   // register
appleStock.setSymbol("AAPL");         // → triggers onStockChanged automatically
appleStock.setPrice(178.5);           // → triggers onStockChanged automatically`} highlightLines={[1,2,3,13,14,15,16]}/>

      <Table headers={["Stage","Approach","Flaw"]}
        rows={[
          ["GUI2","Polling (while true)","Wastes CPU, introduces latency"],
          ["Stock3","Direct call to GUI.update()","Tightly coupled to GUI class"],
          ["Stock4","Single StockListener field","Only one observer possible"],
          ["Stock5 ✅","List<StockListener>","None — unlimited observers, loose coupling"],
        ]}/>

      <Callout type="tip"><strong>Key insight: Stock5 doesn't know WHO is listening.</strong> It iterates the list and calls onStockChanged(this) on each. Add a logger, a dashboard, an email alert — Stock5 never changes.</Callout>

      <Quiz question="What is the fundamental flaw with the polling approach in GUI2?"
        options={["while(true) is a syntax error in Java","CPU spins constantly even when nothing changed; and there's inherent latency between polls","Thread.sleep() is not allowed inside a loop","Polling only works for one observer"]}
        correct={1}
        explanation="Polling wastes CPU resources continuously — even when the stock price hasn't changed in hours. It also has latency: if the price changes between polls, you miss it until the next cycle. Stock5's push model inverts this: notifications go out the instant state changes, zero wasted cycles."/>
      <NavButtons index={19} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 20 — POLYMORPHISM
// ════════════════════════════════════════════════════════════
function Ch20({setChapter}){
  const acc=ACCENTS[20];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 21</div>
      <H accent={acc}>Polymorphism</H>
      <p style={{color:C.text2,lineHeight:1.8}}>Polymorphism = "many forms". The same method call behaves differently based on the <strong style={{color:C.text}}>actual runtime type</strong> of the object, not the declared reference type.</p>

      <H3 accent={acc}>Runtime Type Determination</H3>
      <CodeBlock code={`// Declared type: Shape    Actual types vary at runtime
Shape[] shapes = {
    new Circle("red", 5.0),
    new Rectangle("blue"),
    new Circle("green", 2.5),
};

for (Shape s : shapes) {
    System.out.println(s.calculateArea());
    // Circle    → Circle.calculateArea()    → PI * r^2
    // Rectangle → Rectangle.calculateArea() → w * h
    // Same call, different behaviour — no instanceof needed!
}`} highlightLines={[8,9,10,11]}/>

      <H3 accent={acc}>printColor() — Polymorphism with Interfaces (from DrawingApp)</H3>
      <CodeBlock code={`// From lecture Apr 1: printColor accepts any Colorful
public void printColor(Colorful obj) {
    System.out.println(obj.getColor());
}

// Called with: Circle, Rectangle, anonymous class — all work
Circle c = new Circle("black");
printColor(c);              // prints "black"

Colorful anon = new Colorful() {
    public String getColor() { return "Purple"; }
    public void setColor(String c) {}
};
printColor(anon);           // prints "Purple"`} highlightLines={[2,3]}/>

      <H3 accent={acc}>equals() Override (from lecture May 6)</H3>
      <CodeBlock code={`// Stock.java with copy constructor + equals override
public class Stock {
    private String symbol;
    private double price;

    // Copy constructor — make an independent copy
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
}`} highlightLines={[7,8,9,12,13,14,15,16,17]}/>

      <Callout type="tip"><strong>Dynamic dispatch:</strong> the JVM looks up which class's method to call at runtime — not at compile time. This is what makes Strategy Pattern and Observer Pattern work without if/else chains.</Callout>

      <Quiz question="Shape s = new Circle(5.0); s.calculateArea(); — which calculateArea() runs?"
        options={["Shape.calculateArea() — s is declared as Shape","Circle.calculateArea() — the actual runtime object is a Circle","Both run — Java calls parent then child","Cannot call — must cast to Circle first"]}
        correct={1}
        explanation="Java's runtime dispatches based on the ACTUAL object type, not the declared reference type. s holds a Circle, so Circle.calculateArea() runs. This is dynamic dispatch — the mechanism behind polymorphism, Strategy Pattern, and Observer Pattern."/>
      <NavButtons index={20} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 21 — IMMUTABLE OBJECTS & RECORDS
// ════════════════════════════════════════════════════════════
function Ch21({setChapter}){
  const acc=ACCENTS[21];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 22</div>
      <H accent={acc}>Immutable Objects &amp; Java Records</H>
      <p style={{color:C.text2,lineHeight:1.8}}>An immutable object cannot be modified after creation. Every "change" returns a <em>new object</em>. Eliminates shared-state bugs, aliasing surprises, and thread-safety issues.</p>

      <H3 accent={acc}>The Mutation Problem (from lecture May 6 — API.java)</H3>
      <CodeBlock code={`// API.java — silently mutates the caller's object!
public class API {
    public static Stock magic(Stock stock) {
        stock.setPrice(0.0);   // modifies the SAME object the caller passed in
        return stock;
    }
}

// Caller:
Stock apple = new Stock("AAPL", 178.5);
API.magic(apple);
System.out.println(apple.getPrice());  // 0.0 — SURPRISE! caller's stock was mutated`} highlightLines={[4,11]}/>

      <H3 accent={acc}>Immutable Design — Student.java (from lecture May 11)</H3>
      <CodeBlock code={`public class Student {
    private final int id;       // final = cannot change after constructor
    private final float gpa;

    public Student(int id, float gpa) {
        this.id  = id;
        this.gpa = gpa;
    }

    public int   getId()  { return id; }
    public float getGpa() { return gpa; }

    // "Setter" returns a NEW instance — this object is unchanged
    public Student setId(int id)     { return new Student(id, this.gpa); }
    public Student setGpa(float gpa) { return new Student(this.id, gpa); }
}

// Usage — method chaining!
Student s1 = new Student(1, 3.0f);
s1 = s1.setGpa(3.4f).setId(4);   // each call makes a new Student

// Detect no-change using reference equality
Student old = s1;
s1 = someMethod(s1);
if (old == s1) System.out.println("someMethod made no changes");`} highlightLines={[2,3,14,15,20,24,25]}/>
      <Callout type="tip"><strong>old == s1 uses reference equality</strong> to detect no-change. Since immutable setters always return new instances, if someMethod() returns the same reference it received — nothing changed. This pattern only works with immutable objects.</Callout>

      <H3 accent={acc}>Java Records — Shorthand for Immutable POJOs (from lecture)</H3>
      <CodeBlock code={`// Old way — 30+ lines of boilerplate
public class Department {
    private final int id;
    private final String name;
    private final String location;
    // constructor + 3 getters + equals + hashCode + toString...
}

// New way — Java record (one line!)
public record Department(int id, String name, String location) {}

// Auto-generates: final fields, canonical constructor,
// getters (id() not getId()), equals(), hashCode(), toString()

Department d = new Department(1, "CS", "Building A");
System.out.println(d.name());     // NOTE: name() not getName()`} highlightLines={[10,15,16]}/>

      <Table headers={["Feature","Mutable Class","Immutable Class","Record"]}
        rows={[
          ["Fields","Can change","final — set once","final (auto)"],
          ["Setters","Modify this","Return new instance","None (immutable)"],
          ["Thread-safe?","❌","✅","✅"],
          ["Boilerplate","High","High","Minimal"],
          ["Getter naming","getX()","getX()","x() — no 'get'"],
        ]}/>

      <Quiz question="In the immutable Student class, what does student.setGpa(3.8f) return?"
        options={["void","The same Student with gpa updated to 3.8","A NEW Student with gpa=3.8 and all other fields copied","Compile error — final fields cannot be changed"]}
        correct={2}
        explanation="Immutable setters don't modify the current object (its fields are final). They create and return a brand new Student with the new gpa and the original's id. The caller must reassign: s = s.setGpa(3.8f). The original s is completely unchanged — which is the whole point."/>
      <NavButtons index={21} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CH 22 — LAB REQUIREMENTS & EXAM SUMMARY
// ════════════════════════════════════════════════════════════
function Ch22({setChapter}){
  const acc=ACCENTS[22];
  return(
    <div>
      <div style={{color:acc,fontFamily:"'Fira Code',monospace",fontSize:12,marginBottom:4}}>Chapter 23</div>
      <H accent={acc}>Lab Requirements &amp; Full Exam Summary</H>

      <H3 accent={acc}>Over-Engineered vs Under-Engineered</H3>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:20,margin:'14px 0'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,textAlign:'center'}}>
          <div style={{background:'rgba(249,117,131,0.1)',border:'1px solid #F97583',borderRadius:6,padding:12}}>
            <div style={{color:'#F97583',fontFamily:"'Fira Code',monospace",fontSize:11,marginBottom:8}}>❌ Over-Engineered</div>
            <div style={{color:C.text2,fontSize:13,lineHeight:1.7}}>50 classes for a calculator. DI framework for a 3-file project. Abstract factory just to add numbers.</div>
          </div>
          <div style={{background:'rgba(63,185,80,0.1)',border:'1px solid #3FB950',borderRadius:6,padding:12}}>
            <div style={{color:'#3FB950',fontFamily:"'Fira Code',monospace",fontSize:11,marginBottom:8}}>✅ Sweet Spot</div>
            <div style={{color:C.text2,fontSize:13,lineHeight:1.7}}>Right abstraction for the requirements. Reusable classes. Strategy where behaviour varies.</div>
          </div>
          <div style={{background:'rgba(249,117,131,0.1)',border:'1px solid #F97583',borderRadius:6,padding:12}}>
            <div style={{color:'#F97583',fontFamily:"'Fira Code',monospace",fontSize:11,marginBottom:8}}>❌ Under-Engineered</div>
            <div style={{color:C.text2,fontSize:13,lineHeight:1.7}}>Everything in main(). No classes. Procedural blob. Cannot be tested or extended. (Lab 2 was this.)</div>
          </div>
        </div>
      </div>

      <H3 accent={acc}>Lab 3 File Structure</H3>
      <Table headers={["File","Role","Pattern Role"]}
        rows={[
          ["Operation.java","interface: execute() + getSymbol()","Strategy interface"],
          ["AddOperation.java","return a + b","Concrete strategy"],
          ["SubtractOperation.java","return a - b","Concrete strategy"],
          ["MultiplyOperation.java","return a * b","Concrete strategy"],
          ["DivideOperation.java","throw if b==0, else a/b","Concrete strategy"],
          ["Calculator.java","holds Operation, delegates execute()","Context class"],
          ["InputHandler.java","wraps Scanner, getNumber()","Collaborator"],
          ["Printer.java","printResult() uses op.getSymbol()","Collaborator"],
          ["Main.java","creates all ops, loops, shows polymorphism","Orchestrator"],
        ]}/>

      <H3 accent={acc}>Full Course Cheat Sheet — Exam Edition</H3>
      <Table headers={["Concept","One-line summary","Exam watch-out"]}
        rows={[
          ["Classes & Objects","Blueprint vs instance; new = allocate+init+return ref","Variables hold references — aliasing is real"],
          ["Constructors","No return type, name=class; remove default to force args","this() must be first statement"],
          ["this keyword","this = current object; this() = constructor delegation","this() MUST be first line"],
          ["Static Blocks","Runs once on class load, not per object","Not testable — avoid in prod"],
          ["private","Control + Abstraction — TWO benefits","Constructor should call setters"],
          ["Getters/Setters","Private field + validated setter + pure getter","Avoid duplicate validation"],
          ["Entity Abstraction","Classes=nouns, methods=verbs","Decompose reqs by entity"],
          ["CRC Cards","Class/Responsibilities/Collaborators — design before code","Resp → field or method"],
          ["UML","+/-/# symbols; UML type after colon (reversed from Java)","# = protected in Java"],
          ["Abstract Classes","Cannot instantiate; abstract methods force override","Subclass must implement ALL"],
          ["Code Coupling","keyword new = tight coupling; interface+injection = loose","new is the problem"],
          ["Interfaces","Adjective/capability, not noun/entity","Don't misuse as HasId/HasName"],
          ["Inheritance","extends; non-private inherited; constructors NOT inherited","super() first line"],
          ["Overriding","Same sig; @Override catches typos; static can't override","Override != overload"],
          ["protected","same class + ALL subclasses + same package","Not just direct subclasses"],
          ["Inheritance Problems","Rigid tree, 2^n explosion, instanceof chains","These justify Strategy Pattern"],
          ["Strategy Pattern","Composition (HAS-A interface); delegate; swap at runtime","No extends on context"],
          ["Factory Pattern","Centralise new; setInstance() for test mocks","Static state = anti-pattern"],
          ["DI (Guice)","@Inject + Module + Injector; framework wires it all","Factory+DI together = anti-pattern"],
          ["Observer Pattern","addListener/notify; Stock doesn't know WHO listens","Polling is always bad"],
          ["Polymorphism","Runtime dispatch on ACTUAL type, not declared type","Dynamic dispatch"],
          ["Immutable Objects","final fields; setters return new instances","old==s1 = reference equality check"],
          ["Java Records","record Dept(int id, String name){} = immutable POJO","Getter is name() not getName()"],
        ]}/>

      <div style={{background:C.card,border:`1px solid #3FB950`,borderRadius:8,padding:20,marginTop:24,textAlign:'center'}}>
        <div style={{fontSize:32,marginBottom:8}}>🎓</div>
        <div style={{color:'#3FB950',fontFamily:"'Fira Code',monospace",fontSize:16,fontWeight:700,marginBottom:8}}>Course Complete!</div>
        <div style={{color:C.text2,lineHeight:1.8}}>The thread throughout every chapter: <strong style={{color:C.text}}>reduce coupling, increase cohesion, make code testable and extensible.</strong><br/>
          Classes → Inheritance → Interfaces → Patterns → DI. Each layer solves the previous layer's problem.</div>
      </div>
      <NavButtons index={22} setChapter={setChapter}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN APP — RESPONSIVE (desktop sidebar + mobile hamburger)
// ════════════════════════════════════════════════════════════
const CHAPTERS = [Ch0,Ch1,Ch2,Ch3,Ch4,Ch5,Ch6,Ch7,Ch8,Ch9,Ch10,Ch11,
                  Ch12,Ch13,Ch14,Ch15,Ch16,Ch17,Ch18,Ch19,Ch20,Ch21,Ch22];

function SidebarContent({chapter, setChapter, accent, onSelect}) {
  return (
    <>
      <div style={{padding:'18px 16px',borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:C.muted,letterSpacing:1.5,marginBottom:4}}>SE421</div>
        <div style={{color:C.text,fontWeight:700,fontSize:14}}>Java OOP</div>
        <div style={{color:C.muted,fontSize:12,marginTop:2}}>Complete Study Guide</div>
      </div>
      <div style={{overflowY:'auto',flex:1,padding:'8px 0'}}>
        {TITLES.map((title,i)=>{
          const ac=ACCENTS[i]; const active=chapter===i;
          return(
            <button key={i} onClick={()=>{ setChapter(i); if(onSelect) onSelect(); }}
              style={{width:'100%',textAlign:'left',background:active?`${ac}15`:'transparent',
                border:'none',borderLeft:active?`3px solid ${ac}`:'3px solid transparent',
                padding:'11px 16px',cursor:'pointer',transition:'all 0.15s'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:active?ac:C.muted,minWidth:22}}>{String(i+1).padStart(2,'0')}</span>
                <span style={{fontSize:14}}>{ICONS[i]}</span>
                <span style={{color:active?ac:C.text2,fontSize:13,fontWeight:active?600:400,lineHeight:1.3}}>{title}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{padding:'12px 16px',borderTop:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:C.muted}}>Chapter {chapter+1} of {TITLES.length}</div>
        <div style={{marginTop:6,height:3,background:C.card,borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${((chapter+1)/TITLES.length)*100}%`,background:accent,borderRadius:2,transition:'width 0.3s'}}/>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [chapter, setChapter] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=>{
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  },[]);

  // Close menu when chapter changes on mobile
  const handleChapterSelect = (i) => {
    setChapter(i);
    setMenuOpen(false);
    window.scrollTo({top:0, behavior:'smooth'});
  };

  const Chapter = CHAPTERS[chapter];
  const accent = ACCENTS[chapter];

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <div style={{background:C.bg,minHeight:'100vh',fontFamily:'system-ui,-apple-system,sans-serif',color:C.text}}>

        {/* Mobile top bar */}
        <div style={{position:'fixed',top:0,left:0,right:0,zIndex:100,
          background:C.surface,borderBottom:`1px solid ${C.border}`,
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'0 16px',height:54}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:accent,fontWeight:700}}>SE421</span>
            <span style={{color:C.muted,fontSize:11}}>·</span>
            <span style={{color:C.text2,fontSize:12,maxWidth:180,overflow:'hidden',
              textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{TITLES[chapter]}</span>
          </div>
          {/* Hamburger button */}
          <button onClick={()=>setMenuOpen(v=>!v)} style={{
            background:'transparent',border:`1px solid ${menuOpen?accent:C.border}`,
            borderRadius:6,padding:'6px 10px',cursor:'pointer',color:menuOpen?accent:C.text2,
            display:'flex',flexDirection:'column',gap:4,alignItems:'center',justifyContent:'center',
            width:40,height:36,
          }}>
            <span style={{display:'block',height:2,width:18,background:menuOpen?accent:C.text2,
              borderRadius:2,transition:'all 0.2s',
              transform:menuOpen?'rotate(45deg) translateY(5px)':'none'}}/>
            <span style={{display:'block',height:2,width:18,background:menuOpen?accent:C.text2,
              borderRadius:2,transition:'all 0.2s',
              opacity:menuOpen?0:1}}/>
            <span style={{display:'block',height:2,width:18,background:menuOpen?accent:C.text2,
              borderRadius:2,transition:'all 0.2s',
              transform:menuOpen?'rotate(-45deg) translateY(-5px)':'none'}}/>
          </button>
        </div>

        {/* Drawer overlay */}
        {menuOpen && (
          <div style={{position:'fixed',inset:0,zIndex:99}} onClick={()=>setMenuOpen(false)}>
            <div style={{position:'absolute',inset:0,background:'rgba(1,4,9,0.7)'}}/>
          </div>
        )}

        {/* Slide-in drawer */}
        <div style={{
          position:'fixed',top:54,left:0,bottom:0,zIndex:99,
          width:260,background:C.surface,borderRight:`1px solid ${C.border}`,
          display:'flex',flexDirection:'column',
          transform:menuOpen?'translateX(0)':'translateX(-100%)',
          transition:'transform 0.25s ease',
          overflowY:'auto',
        }}>
          <SidebarContent chapter={chapter} setChapter={handleChapterSelect} accent={accent} onSelect={()=>setMenuOpen(false)}/>
        </div>

        {/* Scrollable content — padded for top bar */}
        <div style={{paddingTop:54}}>
          <div style={{padding:'24px 16px 48px'}}>
            <Chapter setChapter={handleChapterSelect}/>
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ──
  return (
    <div style={{display:'flex',height:'100vh',background:C.bg,fontFamily:'system-ui,-apple-system,sans-serif',color:C.text,overflow:'hidden'}}>
      <div style={{width:230,background:C.surface,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0}}>
        <SidebarContent chapter={chapter} setChapter={setChapter} accent={accent}/>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'40px 48px'}}>
        <div style={{maxWidth:820,margin:'0 auto'}}>
          <Chapter setChapter={setChapter}/>
        </div>
      </div>
    </div>
  );
}
