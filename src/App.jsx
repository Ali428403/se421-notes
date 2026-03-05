import { useState } from "react";

const chapters = [
  {
    id: 0,
    label: "01",
    title: "Classes & Objects",
    icon: "⬡",
    color: "#64FFDA",
  },
  {
    id: 1,
    label: "02",
    title: "Constructors",
    icon: "⚙",
    color: "#FF6B9D",
  },
  {
    id: 2,
    label: "03",
    title: "The `this` Keyword",
    icon: "◎",
    color: "#FFD166",
  },
  {
    id: 3,
    label: "04",
    title: "Static Blocks",
    icon: "⚡",
    color: "#A29BFE",
  },
  {
    id: 4,
    label: "05",
    title: "Access Modifiers",
    icon: "🔒",
    color: "#55EFC4",
  },
  {
    id: 5,
    label: "06",
    title: "Homework",
    icon: "✏",
    color: "#FD79A8",
  },
  {
    id: 6,
    label: "07",
    title: "Entity Abstraction",
    icon: "🧱",
    color: "#00CEC9",
  },
  {
    id: 7,
    label: "08",
    title: "CRC Cards",
    icon: "🃏",
    color: "#FDCB6E",
  },
  {
    id: 8,
    label: "09",
    title: "UML Class Diagrams",
    icon: "📐",
    color: "#E17055",
  },
  {
    id: 9,
    label: "10",
    title: "Lab 2 Requirements",
    icon: "🧪",
    color: "#74B9FF",
  },
  {
    id: 10,
    label: "11",
    title: "Inheritance & super",
    icon: "🌳",
    color: "#6FCF97",
  },
  {
    id: 11,
    label: "12",
    title: "Method Overriding",
    icon: "🔄",
    color: "#F2994A",
  },
  {
    id: 12,
    label: "13",
    title: "protected Modifier",
    icon: "🛡",
    color: "#BB6BD9",
  },
];

const CodeBlock = ({ code, highlight = [] }) => (
  <div style={{
    background: "#0D1117",
    border: "1px solid #30363D",
    borderRadius: "8px",
    padding: "18px 22px",
    fontFamily: "'Fira Code', 'Courier New', monospace",
    fontSize: "13.5px",
    lineHeight: "1.8",
    overflowX: "auto",
    margin: "16px 0",
    position: "relative",
  }}>
    <div style={{
      position: "absolute", top: "10px", right: "14px",
      fontSize: "10px", color: "#58A6FF", letterSpacing: "1px",
      fontFamily: "monospace",
    }}>JAVA</div>
    {code.split("\n").map((line, i) => (
      <div key={i} style={{
        background: highlight.includes(i + 1) ? "rgba(100,255,218,0.08)" : "transparent",
        borderLeft: highlight.includes(i + 1) ? "2px solid #64FFDA" : "2px solid transparent",
        paddingLeft: "8px",
        marginLeft: "-8px",
        color: syntaxColor(line),
        whiteSpace: "pre",
      }}>
        <span style={{ color: "#3D4451", userSelect: "none", marginRight: "16px", fontSize: "11px" }}>
          {String(i + 1).padStart(2, " ")}
        </span>
        {renderSyntax(line)}
      </div>
    ))}
  </div>
);

function syntaxColor() { return "#E6EDF3"; }

function renderSyntax(line) {
  const keywords = ["public", "private", "static", "class", "new", "void", "float", "int", "this", "return", "if", "for", "protected", "default"];
  const parts = [];
  let remaining = line;
  let key = 0;

  // Simple tokenizer
  const tokens = remaining.split(/(\s+|[{}();,=.]|"[^"]*")/g).filter(t => t);
  return tokens.map((token, i) => {
    if (keywords.includes(token.trim())) {
      return <span key={i} style={{ color: "#FF79C6" }}>{token}</span>;
    }
    if (/^".*"$/.test(token.trim())) {
      return <span key={i} style={{ color: "#F1FA8C" }}>{token}</span>;
    }
    if (/^\/\//.test(token.trim())) {
      return <span key={i} style={{ color: "#6272A4", fontStyle: "italic" }}>{token}</span>;
    }
    if (/^[0-9.-]+$/.test(token.trim()) && token.trim() !== "") {
      return <span key={i} style={{ color: "#BD93F9" }}>{token}</span>;
    }
    if (/^[A-Z]/.test(token.trim()) && token.trim().length > 1) {
      return <span key={i} style={{ color: "#50FA7B" }}>{token}</span>;
    }
    if (["(", ")", "{", "}", ";", "."].includes(token.trim())) {
      return <span key={i} style={{ color: "#FF6B6B" }}>{token}</span>;
    }
    return <span key={i} style={{ color: "#E6EDF3" }}>{token}</span>;
  });
}

const Callout = ({ type = "info", children }) => {
  const styles = {
    info: { bg: "rgba(100,255,218,0.07)", border: "#64FFDA", icon: "💡" },
    warn: { bg: "rgba(255,209,102,0.07)", border: "#FFD166", icon: "⚠️" },
    tip: { bg: "rgba(162,155,254,0.07)", border: "#A29BFE", icon: "✨" },
    danger: { bg: "rgba(255,107,157,0.07)", border: "#FF6B9D", icon: "🚫" },
  };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg,
      borderLeft: `3px solid ${s.border}`,
      borderRadius: "0 8px 8px 0",
      padding: "14px 18px",
      margin: "16px 0",
      fontSize: "14px",
      lineHeight: "1.7",
      color: "#C9D1D9",
    }}>
      <span style={{ marginRight: "8px" }}>{s.icon}</span>{children}
    </div>
  );
};

const Quiz = ({ question, options, answer, explanation }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{
      background: "#161B22",
      border: "1px solid #30363D",
      borderRadius: "10px",
      padding: "20px 24px",
      margin: "20px 0",
    }}>
      <div style={{ color: "#64FFDA", fontSize: "11px", letterSpacing: "2px", marginBottom: "10px", fontFamily: "monospace" }}>
        KNOWLEDGE CHECK
      </div>
      <div style={{ color: "#E6EDF3", fontSize: "15px", marginBottom: "16px", lineHeight: "1.6" }}>{question}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((opt, i) => {
          let bg = "#0D1117";
          let border = "#30363D";
          let color = "#8B949E";
          if (revealed) {
            if (i === answer) { bg = "rgba(80,250,123,0.1)"; border = "#50FA7B"; color = "#50FA7B"; }
            else if (i === selected && i !== answer) { bg = "rgba(255,107,107,0.1)"; border = "#FF6B6B"; color = "#FF6B6B"; }
          } else if (i === selected) {
            border = "#64FFDA"; color = "#64FFDA";
          }
          return (
            <button key={i} onClick={() => { setSelected(i); setRevealed(false); }}
              style={{
                background: bg, border: `1px solid ${border}`, borderRadius: "6px",
                padding: "10px 16px", color, textAlign: "left", cursor: "pointer",
                fontFamily: "'Fira Code', monospace", fontSize: "13px", transition: "all 0.2s",
              }}>
              <span style={{ marginRight: "10px", opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {selected !== null && !revealed && (
        <button onClick={() => setRevealed(true)} style={{
          marginTop: "12px", background: "#64FFDA", color: "#0D1117", border: "none",
          borderRadius: "6px", padding: "8px 20px", cursor: "pointer",
          fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px", fontWeight: "bold",
        }}>CHECK ANSWER</button>
      )}
      {revealed && (
        <div style={{
          marginTop: "14px", padding: "12px 16px",
          background: "rgba(100,255,218,0.05)", borderRadius: "6px",
          color: "#8B949E", fontSize: "13.5px", lineHeight: "1.6",
        }}>
          <span style={{ color: "#64FFDA" }}>Explanation: </span>{explanation}
        </div>
      )}
    </div>
  );
};

const Diagram = ({ title, rows }) => (
  <div style={{
    margin: "20px auto", maxWidth: "340px",
    border: "1px solid #30363D", borderRadius: "8px",
    overflow: "hidden", fontFamily: "monospace",
  }}>
    <div style={{
      background: "#161B22", padding: "10px 18px",
      color: "#64FFDA", fontSize: "14px", fontWeight: "bold",
      borderBottom: "1px solid #30363D", textAlign: "center",
    }}>{title}</div>
    {rows.map((row, i) => (
      <div key={i} style={{
        padding: "8px 18px",
        background: i % 2 === 0 ? "#0D1117" : "#0F1318",
        color: row.type === "method" ? "#50FA7B" : row.type === "private" ? "#FF6B6B" : "#E6EDF3",
        fontSize: "13px",
        borderBottom: i < rows.length - 1 ? "1px solid #21262D" : "none",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span style={{ fontSize: "10px", opacity: 0.5 }}>
          {row.type === "private" ? "🔴" : row.type === "method" ? "🟢" : "🔵"}
        </span>
        <span>{row.label}</span>
        {row.note && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#58A6FF", opacity: 0.7 }}>{row.note}</span>}
      </div>
    ))}
  </div>
);

// ── CHAPTER CONTENT ────────────────────────────────────────────────

const Chapter0 = () => (
  <div>
    <h2 style={sectionTitle}>Classes & Objects — Recap</h2>
    <p style={bodyText}>
      A <strong style={{ color: "#64FFDA" }}>class</strong> is a software structure — think of it as a blueprint. Every class can contain two kinds of members:
    </p>
    <Diagram title="Cat (class)" rows={[
      { label: "float age", type: "field", note: "variable member" },
      { label: "String city", type: "field", note: "static variable" },
      { label: "sayHello()", type: "method", note: "method member" },
      { label: "getBornYear()", type: "method", note: "method member" },
    ]} />
    <Callout type="info">
      A class can <em>only</em> contain <strong>variable members</strong> and <strong>method members</strong>. You cannot write a bare <code>if</code> or <code>for</code> loop directly inside a class — those must live inside a method.
    </Callout>

    <h3 style={subTitle}>Static vs. Non-Static Members</h3>
    <p style={bodyText}>This is the most fundamental distinction in Java classes:</p>

    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#64FFDA" }}>
        <div style={{ color: "#64FFDA", fontFamily: "monospace", fontSize: "12px", marginBottom: "8px" }}>NON-STATIC MEMBER</div>
        <p style={{ ...bodyText, marginTop: 0 }}>Each object gets <strong>its own copy</strong>. Changing the value through one object does NOT affect any other object.</p>
        <CodeBlock code={`Cat tom = new Cat();\nCat jerry = new Cat();\ntom.age = 3;\njerry.age = 7;\n// tom.age = 3, jerry.age = 7`} />
      </div>
      <div style={{ ...card, borderColor: "#FF6B9D" }}>
        <div style={{ color: "#FF6B9D", fontFamily: "monospace", fontSize: "12px", marginBottom: "8px" }}>STATIC MEMBER</div>
        <p style={{ ...bodyText, marginTop: 0 }}>Shared by <strong>all objects</strong>. Belongs to the class, not any single object. Access via the class name.</p>
        <CodeBlock code={`Cat.city = "Riyadh";\n// ALL cat objects see "Riyadh"\n// No object needed to access it`} />
      </div>
    </div>

    <h3 style={subTitle}>Object Instantiation & the Dot Operator</h3>
    <CodeBlock code={`Cat z = new Cat();   // create object\nz.age = 5;           // access variable member\nz.sayHello();        // access method member\nCat.city = "Dubai";  // access static member`} highlight={[1, 2, 3, 4]} />

    <Quiz
      question="Which keyword is required to access a non-static member of a class?"
      options={["The class name (Cat.age)", "The dot operator on an object pointer (z.age)", "The static keyword", "No special syntax needed"]}
      answer={1}
      explanation="Non-static members require you to create an object first, then use the dot operator on that object pointer. Static members use the class name directly."
    />
  </div>
);

const Chapter1 = () => (
  <div>
    <h2 style={sectionTitle}>Constructors</h2>
    <p style={bodyText}>A <strong style={{ color: "#FF6B9D" }}>constructor</strong> is a special non-static method that is <strong>automatically called every time you create an object</strong> with the <code>new</code> keyword.</p>

    <h3 style={subTitle}>Rules for Writing a Constructor</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "16px 0" }}>
      {[
        ["1", "No return type — not even void", "#FF6B9D"],
        ["2", "The method name must exactly match the class name", "#FFD166"],
        ["3", "It can have an access modifier (e.g. public)", "#64FFDA"],
        ["4", "It is NOT static", "#A29BFE"],
      ].map(([n, text, c]) => (
        <div key={n} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <span style={{ color: c, fontFamily: "monospace", fontWeight: "bold", fontSize: "18px", minWidth: "20px" }}>{n}</span>
          <span style={{ color: "#C9D1D9", fontSize: "14.5px", lineHeight: "1.6" }}>{text}</span>
        </div>
      ))}
    </div>

    <CodeBlock code={`public class Cat {\n    float age;\n\n    // ✅ Valid constructor\n    public Cat() {\n        this.age = -1;  // set default age\n        System.out.println("Cat object created!");\n    }\n}`} highlight={[5, 6, 7, 8]} />

    <h3 style={subTitle}>When is it called?</h3>
    <p style={bodyText}>When you write <code>new Cat()</code>, Java performs <strong>three steps in order</strong>:</p>
    <div style={{ ...card, borderColor: "#30363D", padding: "20px" }}>
      {[
        ["Step 1", "Ask the OS to allocate memory for the new object", "#58A6FF"],
        ["Step 2", "Call the constructor on that freshly allocated memory", "#FF6B9D"],
        ["Step 3", "Assign the reference (pointer) to your variable", "#64FFDA"],
      ].map(([step, desc, c]) => (
        <div key={step} style={{ display: "flex", gap: "16px", padding: "10px 0", borderBottom: "1px solid #21262D" }}>
          <span style={{ color: c, fontFamily: "monospace", fontSize: "13px", minWidth: "60px" }}>{step}</span>
          <span style={{ color: "#C9D1D9", fontSize: "14px" }}>{desc}</span>
        </div>
      ))}
    </div>

    <h3 style={subTitle}>The Default Constructor</h3>
    <Callout type="tip">
      If you write <strong>no constructor at all</strong>, Java silently adds an empty one: <code>public Cat() {"{ }"}</code>. But the moment you write ANY constructor yourself, Java stops adding the default one.
    </Callout>

    <h3 style={subTitle}>Constructor Overloading</h3>
    <p style={bodyText}>You can have <strong>multiple constructors</strong> as long as their parameter lists are different — this is called <em>overloading</em>.</p>
    <CodeBlock code={`public class Cat {\n    float age;\n\n    // Constructor 1 — no arguments\n    public Cat() {\n        this.age = -1;\n    }\n\n    // Constructor 2 — takes an age value\n    public Cat(float age) {\n        this.age = age;\n    }\n}\n\n// Calling each constructor:\nCat a = new Cat();        // calls Constructor 1\nCat b = new Cat(2.5f);    // calls Constructor 2`} highlight={[5, 6, 10, 11, 15, 16]} />

    <Callout type="warn">
      You <strong>cannot</strong> have two constructors with the exact same parameter types and count. Java would not know which one to call!
    </Callout>

    <h3 style={subTitle}>Calling One Constructor from Another</h3>
    <p style={bodyText}>Use <code style={{ color: "#FF79C6" }}>this(...)</code> to call another constructor. It must be the <strong>very first line</strong> of the constructor body.</p>
    <CodeBlock code={`public Cat() {\n    this(-1.0f);  // calls Cat(float age) with -1\n    System.out.println("Default constructor done");\n}\n\npublic Cat(float age) {\n    this.age = age;\n    System.out.println("Second constructor called");\n}`} highlight={[2]} />

    <h3 style={subTitle}>Design Insight: Why Constructors Matter</h3>
    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#FF6B6B" }}>
        <div style={{ color: "#FF6B6B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>❌ WITHOUT CONSTRUCTOR</div>
        <CodeBlock code={`Cat c = new Cat();\nc.init();  // easy to forget!\nc.sayHello();`} />
        <p style={{ color: "#8B949E", fontSize: "13px" }}>Caller must remember to call <code>init()</code>. Cognitive load. Easy to forget. Bugs.</p>
      </div>
      <div style={{ ...card, borderColor: "#50FA7B" }}>
        <div style={{ color: "#50FA7B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>✅ WITH CONSTRUCTOR</div>
        <CodeBlock code={`Cat c = new Cat();\n// init is automatic!\nc.sayHello();`} />
        <p style={{ color: "#8B949E", fontSize: "13px" }}>Initialization is guaranteed. Zero cognitive load. Always correct.</p>
      </div>
    </div>

    <h3 style={subTitle}>Forcing Mandatory Values</h3>
    <p style={bodyText}>Remove the no-argument constructor entirely — and Java will not add one back (since you already have one). Now callers <strong>must</strong> provide a value to create an object:</p>
    <CodeBlock code={`// Only this constructor exists:\npublic Cat(float age) {\n    this.age = age;\n}\n\n// This now FAILS to compile:\nCat c = new Cat();          // ❌ No matching constructor\n\n// This is the only valid way:\nCat c = new Cat(3.0f);      // ✅`} highlight={[7, 10]} />
    <Callout type="tip">The Java <code>Scanner</code> class uses exactly this technique — it has no default constructor, forcing you to specify an input source (file, string, System.in, etc.).</Callout>

    <Quiz
      question="You write a class with only one constructor: public Dog(String name). What happens when you write: Dog d = new Dog();"
      options={[
        "It compiles fine — Java provides a default constructor",
        "It compiles but prints a warning",
        "It fails to compile — no matching constructor exists",
        "It creates a Dog with name = null"
      ]}
      answer={2}
      explanation="Since you already defined a constructor, Java will NOT add a default no-argument constructor. The call new Dog() finds no matching constructor and fails at compile time."
    />
  </div>
);

const Chapter2 = () => (
  <div>
    <h2 style={sectionTitle}>The <code>this</code> Keyword</h2>
    <p style={bodyText}><code style={{ color: "#FFD166" }}>this</code> has two distinct uses in Java. Understanding both is essential.</p>

    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#FFD166" }}>
        <div style={{ color: "#FFD166", fontFamily: "monospace", fontSize: "12px", marginBottom: "10px" }}>USE 1 — this as a VARIABLE</div>
        <p style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6 }}>
          A <strong>pointer to the current object</strong>. Use it to refer to a class member when it is shadowed by a local variable or parameter with the same name.
        </p>
      </div>
      <div style={{ ...card, borderColor: "#A29BFE" }}>
        <div style={{ color: "#A29BFE", fontFamily: "monospace", fontSize: "12px", marginBottom: "10px" }}>USE 2 — this() as a METHOD</div>
        <p style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6 }}>
          A call to <strong>another constructor</strong> in the same class. Must be the first line of a constructor body.
        </p>
      </div>
    </div>

    <h3 style={subTitle}>The Shadowing Problem</h3>
    <p style={bodyText}>When a parameter has the same name as a class member, Java resolves to the <em>closest scope</em> — the parameter wins. The class member becomes invisible (shadowed).</p>
    <CodeBlock code={`public class Cat {\n    float age;           // class member\n\n    // Parameter is also named "age" — shadowing!\n    public Cat(float age) {\n        age = age;        // ❌ Assigns parameter to itself!\n        // Java cannot see the class member here\n    }\n}`} highlight={[6]} />

    <Callout type="danger">
      <code>age = age</code> is a no-op — you're reading and writing the <em>same parameter variable</em>. The class member <code>age</code> is never updated. Java may show a warning.
    </Callout>

    <h3 style={subTitle}>The Fix: <code>this.age</code></h3>
    <CodeBlock code={`public class Cat {\n    float age;           // class member\n\n    public Cat(float age) {\n        this.age = age;   // ✅ this.age = class member\n                          //    age     = parameter\n    }\n}`} highlight={[5]} />

    <div style={{ ...card, borderColor: "#30363D", padding: "18px 20px" }}>
      <div style={{ color: "#FFD166", fontFamily: "monospace", fontSize: "12px", marginBottom: "12px" }}>HOW this WORKS ACROSS MULTIPLE OBJECTS</div>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {[
          { name: "tom", age: "3.0" },
          { name: "jerry", age: "7.0" },
        ].map(obj => (
          <div key={obj.name} style={{
            border: "1px solid #30363D", borderRadius: "8px",
            padding: "14px", background: "#0D1117", flex: "1", minWidth: "140px",
          }}>
            <div style={{ color: "#58A6FF", fontFamily: "monospace", fontSize: "12px", marginBottom: "8px" }}>
              Object: <strong>{obj.name}</strong>
            </div>
            <div style={{ color: "#C9D1D9", fontFamily: "monospace", fontSize: "13px" }}>
              age = {obj.age}
            </div>
            <div style={{ color: "#6272A4", fontSize: "11px", marginTop: "6px" }}>
              When constructor runs on this object,<br />
              <code style={{ color: "#FFD166" }}>this</code> → points here
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: "#8B949E", fontSize: "13px", marginTop: "12px" }}>
        <code>this</code> dynamically points to <em>whichever object</em> is being constructed or operated on. The same code works correctly for every object.
      </p>
    </div>

    <h3 style={subTitle}><code>this</code> Outside Constructors</h3>
    <CodeBlock code={`public void setAge(float age) {\n    this.age = age;  // same trick works in any method\n}\n\n// Both lines below are equivalent if no shadowing:\nSystem.out.println(age);\nSystem.out.println(this.age);  // explicit — makes intent clear`} />

    <Quiz
      question="In a constructor: public Book(String title) { title = title; } — what is wrong?"
      options={[
        "Nothing is wrong, it's valid Java",
        "The parameter name conflicts — the class field 'title' is never assigned",
        "You cannot have a String parameter in a constructor",
        "The constructor needs a return type"
      ]}
      answer={1}
      explanation="Both references to 'title' resolve to the parameter — the class field is shadowed. Fix it with: this.title = title;"
    />
  </div>
);

const Chapter3 = () => (
  <div>
    <h2 style={sectionTitle}>Static Blocks</h2>
    <p style={bodyText}>
      A <strong style={{ color: "#A29BFE" }}>static block</strong> is a special block of code inside a class that runs exactly <strong>once</strong> — the first time the class is loaded into memory.
    </p>

    <CodeBlock code={`public class Cat {\n    float age;\n\n    // Static block — runs ONCE when class is first loaded\n    static {\n        System.out.println("Cat class loaded into memory!");\n    }\n\n    // Constructor — runs EVERY TIME new Cat() is called\n    public Cat() {\n        System.out.println("Cat object created!");\n    }\n}`} highlight={[5, 6, 7]} />

    <h3 style={subTitle}>Static Block vs. Constructor — Key Difference</h3>
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%", borderCollapse: "collapse",
        fontFamily: "monospace", fontSize: "13px", margin: "16px 0",
      }}>
        <thead>
          <tr style={{ background: "#161B22" }}>
            {["", "Static Block", "Constructor"].map(h => (
              <th key={h} style={{ padding: "12px 16px", color: "#8B949E", fontWeight: "normal", textAlign: "left", borderBottom: "1px solid #30363D" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["When does it run?", "Once, when class is first loaded", "Every time new Object() is called"],
            ["How many times?", "Exactly once per program run", "Once per object created"],
            ["Triggered by", "First use of class (new OR static access)", "Only by new keyword"],
            ["Arguments?", "None — no parentheses", "Can have parameters"],
            ["Per class limit?", "Only ONE static block", "Multiple constructors allowed"],
            ["Testable?", "❌ Cannot be overridden or mocked", "✅ Yes"],
          ].map(([label, a, b], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#0D1117" : "#0F1318" }}>
              <td style={{ padding: "10px 16px", color: "#8B949E", borderBottom: "1px solid #21262D" }}>{label}</td>
              <td style={{ padding: "10px 16px", color: "#A29BFE", borderBottom: "1px solid #21262D" }}>{a}</td>
              <td style={{ padding: "10px 16px", color: "#FF6B9D", borderBottom: "1px solid #21262D" }}>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h3 style={subTitle}>Proof: 10 objects, but static block runs once</h3>
    <CodeBlock code={`for (int i = 0; i < 10; i++) {\n    new Cat();\n}\n\n// Output:\n// Cat class loaded into memory!   ← only ONCE\n// Cat object created!             ← 10 times\n// Cat object created!\n// Cat object created!\n// ... (7 more)`} />

    <Callout type="warn">
      The professor's honest opinion: <strong>avoid static blocks when possible</strong>. They cannot be overridden, cannot be easily tested (a critical non-functional requirement), and add hidden complexity. Use them only when you truly need code to run exactly once at class-load time.
    </Callout>

    <h3 style={subTitle}>When might you actually need one?</h3>
    <p style={bodyText}>Situations where static blocks are appropriate:</p>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "12px 0" }}>
      {[
        "Loading a native library (System.loadLibrary) exactly once",
        "Setting up a complex static data structure or cache at startup",
        "One-time configuration that depends on multiple static fields being initialized first",
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "12px", color: "#C9D1D9", fontSize: "14px" }}>
          <span style={{ color: "#A29BFE" }}>→</span> {item}
        </div>
      ))}
    </div>

    <Quiz
      question="You create 5 instances of a class that has a static block and a constructor. How many times does each run?"
      options={[
        "Static block: 5 times, Constructor: 5 times",
        "Static block: 1 time, Constructor: 5 times",
        "Static block: 0 times, Constructor: 5 times",
        "Static block: 1 time, Constructor: 1 time"
      ]}
      answer={1}
      explanation="The static block fires exactly once when the class is first loaded. The constructor fires once per object, so 5 times for 5 new instances."
    />
  </div>
);

const Chapter4 = () => (
  <div>
    <h2 style={sectionTitle}>Access Modifiers</h2>
    <p style={bodyText}>
      Access modifiers control <strong>who can access a class member</strong>. Java has four, but today we focus on the two most important:
    </p>

    <div style={{ display: "flex", gap: "0", margin: "20px 0", borderRadius: "10px", overflow: "hidden", border: "1px solid #30363D" }}>
      {[
        { mod: "public", color: "#50FA7B", desc: "Anyone can access this member — no restriction whatsoever." },
        { mod: "private", color: "#FF6B6B", desc: "Only the class itself can access this member. Nobody outside." },
        { mod: "default", color: "#FFD166", desc: "(No keyword) Package-level access. Covered in future lectures." },
        { mod: "protected", color: "#A29BFE", desc: "Package + subclass access. Relevant with inheritance." },
      ].map((item, i) => (
        <div key={i} style={{
          flex: 1, padding: "16px 12px", background: "#0D1117",
          borderRight: i < 3 ? "1px solid #30363D" : "none", textAlign: "center",
          opacity: i >= 2 ? 0.45 : 1,
        }}>
          <div style={{ color: item.color, fontFamily: "monospace", fontSize: "14px", marginBottom: "8px", fontWeight: "bold" }}>
            {item.mod}
          </div>
          <div style={{ color: "#8B949E", fontSize: "12px", lineHeight: 1.5 }}>{item.desc}</div>
          {i >= 2 && <div style={{ color: "#58A6FF", fontSize: "11px", marginTop: "6px" }}>→ future lecture</div>}
        </div>
      ))}
    </div>

    <h3 style={subTitle}><code>public</code> — No Restrictions</h3>
    <CodeBlock code={`public class Cat {\n    public float age;          // anyone can read/write\n    public void sayHello() {   // anyone can call\n        System.out.println("Meow!");\n    }\n}\n\n// From any other class:\nCat c = new Cat();\nc.age = 5;          // ✅ allowed\nc.sayHello();       // ✅ allowed`} />

    <h3 style={subTitle}><code>private</code> — Class-Only Access</h3>
    <CodeBlock code={`public class Cat {\n    private float age;          // hidden from everyone else\n    private void init() { }    // hidden method too\n\n    public void setAge(float a) {\n        this.age = a;  // ✅ Cat's own method CAN access it\n    }\n}\n\n// From Main class:\nCat c = new Cat();\nc.age = 5;    // ❌ COMPILE ERROR: age has private access\nc.init();     // ❌ COMPILE ERROR: init() has private access`} highlight={[11, 12]} />

    <Callout type="danger">
      Making everything <code>public</code> means <strong>zero control</strong> over your data. Any class can change your internal variables at any time without your knowledge — a major source of bugs.
    </Callout>

    <h3 style={subTitle}>Why <code>private</code> is Powerful — Two Benefits</h3>

    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#55EFC4" }}>
        <div style={{ color: "#55EFC4", fontFamily: "monospace", fontSize: "12px", marginBottom: "10px" }}>BENEFIT 1 — CONTROL</div>
        <p style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6 }}>
          Only your class modifies the variable. You control exactly <em>when</em> and <em>how</em> it changes. This eliminates an entire class of bugs caused by unexpected external mutations.
        </p>
      </div>
      <div style={{ ...card, borderColor: "#A29BFE" }}>
        <div style={{ color: "#A29BFE", fontFamily: "monospace", fontSize: "12px", marginBottom: "10px" }}>BENEFIT 2 — ABSTRACTION</div>
        <p style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6 }}>
          Complexity is hidden <em>inside</em> the class. The rest of the system does not need to know how it works internally. This is the foundation of encapsulation in OOP.
        </p>
      </div>
    </div>

    <h3 style={subTitle}>Private Constructors</h3>
    <p style={bodyText}>Yes — constructors can be private too. This is an advanced design pattern:</p>
    <CodeBlock code={`public class Cat {\n    private float age;\n\n    // Nobody outside this class can call new Cat()\n    private Cat() { }\n\n    // But you can still have public constructors\n    public Cat(float age) {\n        this.age = age;\n    }\n}`} highlight={[5]} />
    <Callout type="tip">
      <strong>Homework question:</strong> In what situation would a <strong>private constructor</strong> be useful? Think about design patterns that restrict or control object creation... (Hint: Singleton pattern!)
    </Callout>

    <h3 style={subTitle}>The Two Layers of Abstraction So Far</h3>
    <div style={{ ...card, borderColor: "#30363D", padding: "18px 20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          ["Layer 1", "Procedural Abstraction", "Methods hide implementation details behind a name", "#58A6FF"],
          ["Layer 2", "Data Hiding", "private members encapsulate complexity inside the class", "#55EFC4"],
        ].map(([n, name, desc, c]) => (
          <div key={n} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <span style={{ color: c, fontFamily: "monospace", fontSize: "12px", minWidth: "60px" }}>{n}</span>
            <div>
              <div style={{ color: c, fontSize: "14px", fontWeight: "bold", marginBottom: "3px" }}>{name}</div>
              <div style={{ color: "#8B949E", fontSize: "13px" }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <Quiz
      question="You declare: private int count; inside class Counter. Which of these statements is valid?"
      options={[
        "Counter c = new Counter(); c.count = 10;",
        "Inside a method of Counter: this.count = 10;",
        "A subclass of Counter can access count directly",
        "Any class in the same file can access count"
      ]}
      answer={1}
      explanation="private members can only be accessed within the class that declares them. Subclasses and external classes cannot access private members directly. Only code inside Counter itself can use count."
    />
  </div>
);

const Chapter5 = () => (
  <div>
    <h2 style={sectionTitle}>Homework & Review</h2>
    <p style={bodyText}>Two challenge problems from the lecture. Work through them before checking the hints!</p>

    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <HomeworkCard
        number="01"
        title="Simulate Static Block with a Constructor"
        color="#FD79A8"
        description="Without using the static keyword or a static block, rewrite the Cat constructor so that a specific block of code runs ONLY ONCE — the first time any Cat object is created. For all subsequent objects, that block must NOT execute."
        hint="You need a way to 'remember' whether the first object has already been created. Since static variables belong to the class (not any individual object), a static boolean flag could track this across all instances."
        code={`public class Cat {\n    float age;\n    // TODO: add a variable to track\n    // whether the first object was created\n\n    public Cat() {\n        // TODO: only print the message\n        // for the very first object\n    }\n}\n\n// Expected output when creating 3 cats:\n// "First cat ever created!"   ← only once\n// (nothing for 2nd and 3rd)`}
      />

      <HomeworkCard
        number="02"
        title="Benefits of a Private Constructor"
        color="#A29BFE"
        description="Think deeply about this: if a constructor is private, nobody outside the class can write new Cat(). Why would a class designer intentionally do this? What design problem does this solve? What non-functional requirement does it serve?"
        hint="Consider: what if you wanted to guarantee only ONE instance of a class ever exists in the entire program? Or control object creation through a factory method? Research the 'Singleton' design pattern."
        code={`public class DatabaseConnection {\n    private static DatabaseConnection instance;\n\n    // Private constructor — can't call new externally\n    private DatabaseConnection() { }\n\n    // Controlled creation through this method\n    public static DatabaseConnection getInstance() {\n        if (instance == null) {\n            instance = new DatabaseConnection();\n        }\n        return instance;\n    }\n}\n\n// Only one connection ever exists:\nDatabaseConnection db = DatabaseConnection.getInstance();`}
      />
    </div>

    <h3 style={{ ...subTitle, marginTop: "36px" }}>Lecture Summary</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", margin: "16px 0" }}>
      {[
        ["Classes", "Software structures containing variable members and method members"],
        ["Static vs Non-Static", "Static = shared by all objects. Non-static = each object has its own copy"],
        ["Constructors", "Auto-called on new. No return type. Name = class name. Can be overloaded"],
        ["Default Constructor", "Java provides one if you write none. Disappears once you write any constructor"],
        ["this (variable)", "Pointer to current object. Breaks variable shadowing"],
        ["this() (method)", "Calls another constructor in the same class. Must be first line"],
        ["Static Block", "Runs once when class loads. Not recommended — not testable"],
        ["public", "Any class can access. Zero restriction"],
        ["private", "Only the declaring class can access. Gives control + abstraction"],
      ].map(([term, def], i) => (
        <div key={i} style={{
          display: "flex", gap: "16px", padding: "11px 16px",
          background: i % 2 === 0 ? "#0D1117" : "#0F1318",
          borderRadius: "4px",
        }}>
          <span style={{ color: "#64FFDA", fontFamily: "monospace", fontSize: "13px", minWidth: "150px" }}>{term}</span>
          <span style={{ color: "#8B949E", fontSize: "13.5px", lineHeight: 1.5 }}>{def}</span>
        </div>
      ))}
    </div>
  </div>
);

const HomeworkCard = ({ number, title, color, description, hint, code }) => {
  const [showHint, setShowHint] = useState(false);
  return (
    <div style={{
      background: "#0D1117", border: `1px solid ${color}22`,
      borderRadius: "10px", overflow: "hidden",
    }}>
      <div style={{
        background: `${color}11`, padding: "16px 22px",
        borderBottom: `1px solid ${color}33`,
        display: "flex", alignItems: "center", gap: "14px",
      }}>
        <span style={{ color, fontFamily: "monospace", fontSize: "24px", fontWeight: "bold" }}>HW{number}</span>
        <span style={{ color: "#E6EDF3", fontSize: "16px", fontWeight: "500" }}>{title}</span>
      </div>
      <div style={{ padding: "20px 22px" }}>
        <p style={{ color: "#C9D1D9", fontSize: "14.5px", lineHeight: 1.7, margin: "0 0 16px" }}>{description}</p>
        <CodeBlock code={code} />
        <button onClick={() => setShowHint(!showHint)} style={{
          background: "transparent", border: `1px solid ${color}55`,
          color, padding: "8px 18px", borderRadius: "6px", cursor: "pointer",
          fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px",
          transition: "all 0.2s",
        }}>
          {showHint ? "HIDE HINT" : "SHOW HINT"}
        </button>
        {showHint && (
          <div style={{
            marginTop: "14px", padding: "14px 18px",
            background: `${color}0D`, borderRadius: "6px", borderLeft: `3px solid ${color}`,
            color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6,
          }}>
            💡 {hint}
          </div>
        )}
      </div>
    </div>
  );
};

const Chapter6 = () => (
  <div>
    <h2 style={sectionTitle}>Entity Abstraction</h2>
    <p style={bodyText}>
      This lecture introduces a crucial mental shift: stop thinking of classes as "just code containers" and start thinking of them as <strong style={{ color: "#00CEC9" }}>entities</strong> — software representations of real-world things.
    </p>

    <h3 style={subTitle}>Two Levels of Software Structure</h3>
    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#64FFDA" }}>
        <div style={{ color: "#64FFDA", fontFamily: "monospace", fontSize: "12px", marginBottom: "8px" }}>METHODS → Procedural Abstraction</div>
        <p style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6 }}>
          Take raw materials (loops, conditions, algorithms) and wrap them into a <strong>brick</strong>. The caller doesn't know how it works — they just call it.
        </p>
      </div>
      <div style={{ ...card, borderColor: "#00CEC9" }}>
        <div style={{ color: "#00CEC9", fontFamily: "monospace", fontSize: "12px", marginBottom: "8px" }}>CLASSES → Entity Abstraction</div>
        <p style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6 }}>
          Take multiple bricks and group them into a <strong>wall</strong>. The class is a single entity with attributes (characteristics) and methods (actions).
        </p>
      </div>
    </div>

    <div style={{ ...card, borderColor: "#30363D", padding: "20px", margin: "20px 0" }}>
      <div style={{ color: "#00CEC9", fontFamily: "monospace", fontSize: "12px", marginBottom: "14px" }}>THE WALL ANALOGY</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          ["🧱 Bricks", "Methods — the actual functional units built from raw code"],
          ["🏠 Wall", "The Class — groups bricks into one larger structure"],
          ["🎨 Paint color", "Attributes (variable members) — characteristics of the wall/object"],
          ["🔧 What it can do", "Methods — actions the entity can perform"],
        ].map(([icon, desc], i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "18px", minWidth: "28px" }}>{icon.split(" ")[0]}</span>
            <div>
              <span style={{ color: "#00CEC9", fontFamily: "monospace", fontSize: "13px" }}>{icon.slice(3)} </span>
              <span style={{ color: "#8B949E", fontSize: "13.5px" }}>{desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <h3 style={subTitle}>Classes are Nouns. Methods are Verbs.</h3>
    <p style={bodyText}>This is not a style preference — it's a fundamental design rule:</p>
    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#50FA7B" }}>
        <div style={{ color: "#50FA7B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>✅ CLASS NAMES — Nouns</div>
        <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#E6EDF3", lineHeight: 2 }}>
          Shape<br />Circle<br />Rectangle<br />Person<br />Schedule
        </div>
        <p style={{ color: "#6272A4", fontSize: "12px", marginTop: "8px" }}>Entities = things that exist</p>
      </div>
      <div style={{ ...card, borderColor: "#50FA7B" }}>
        <div style={{ color: "#50FA7B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>✅ METHOD NAMES — Verbs</div>
        <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#E6EDF3", lineHeight: 2 }}>
          calculateArea()<br />displayColor()<br />getAge()<br />scheduleAppointment()
        </div>
        <p style={{ color: "#6272A4", fontSize: "12px", marginTop: "8px" }}>Actions = things that happen</p>
      </div>
    </div>

    <Callout type="tip">
      The professor intentionally named methods starting with verbs: <code>displayColor</code>, not <code>colorDisplay</code>. This makes the model consistent — an entity (noun) performs actions (verbs).
    </Callout>

    <h3 style={subTitle}>Designing with 200 Functional Requirements</h3>
    <p style={bodyText}>In a real project you won't have 2–3 requirements. You may have <strong>200</strong>. Here is the systematic approach:</p>

    <div style={{ ...card, borderColor: "#30363D", padding: "20px" }}>
      {[
        ["Step 1", "Gather all functional requirements from system analysis", "#58A6FF"],
        ["Step 2", "Group them logically — requirements that belong together", "#00CEC9"],
        ["Step 3", "Each group becomes a CLASS (entity)", "#FDCB6E"],
        ["Step 4", "Each requirement in a group becomes a METHOD (action)", "#FF6B9D"],
        ["Step 5", "Repeat until all requirements are distributed across classes", "#50FA7B"],
      ].map(([step, desc, c]) => (
        <div key={step} style={{ display: "flex", gap: "16px", padding: "12px 0", borderBottom: "1px solid #21262D" }}>
          <span style={{ color: c, fontFamily: "monospace", fontSize: "12px", minWidth: "55px" }}>{step}</span>
          <span style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.5 }}>{desc}</span>
        </div>
      ))}
    </div>

    <Callout type="info">
      Real example: 200 requirements → Group 1: 50 about payroll → <code>Payroll</code> class. Group 2: 20 about employee data → <code>Employee</code> class. The grouping logic is everything.
    </Callout>

    <Quiz
      question="Why should Java class names always be nouns?"
      options={[
        "It's just a Java convention with no deeper meaning",
        "Because classes represent entities — things that exist — and entities are nouns",
        "Because the compiler requires it",
        "To distinguish them from interfaces"
      ]}
      answer={1}
      explanation="Classes model entities in your system. Entities are things (nouns). Their methods are actions (verbs). This isn't arbitrary — it's a design philosophy that keeps your model coherent and readable."
    />
  </div>
);

const Chapter7 = () => {
  const [flipped, setFlipped] = useState(false);
  return (
  <div>
    <h2 style={sectionTitle}>CRC Cards</h2>
    <p style={bodyText}>
      <strong style={{ color: "#FDCB6E" }}>CRC</strong> stands for <strong>Class – Responsibility – Collaboration</strong>. It's a low-tech, high-value design tool used <em>before</em> writing any Java code.
    </p>

    <h3 style={subTitle}>Why CRC Before Code?</h3>
    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#FF6B6B" }}>
        <div style={{ color: "#FF6B6B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>❌ Jump straight to code</div>
        <p style={{ color: "#8B949E", fontSize: "13.5px", lineHeight: 1.6 }}>
          Write code → realize design is wrong → refactor → write again → refactor again. Expensive and painful.
        </p>
      </div>
      <div style={{ ...card, borderColor: "#50FA7B" }}>
        <div style={{ color: "#50FA7B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>✅ CRC cards first</div>
        <p style={{ color: "#8B949E", fontSize: "13.5px", lineHeight: 1.6 }}>
          Draw cards → spot design issues → tear up paper → redraw. Free and instant. Only then write Java.
        </p>
      </div>
    </div>

    <h3 style={subTitle}>What a CRC Card Looks Like</h3>

    <div style={{
      maxWidth: "380px", margin: "20px auto",
      border: "2px solid #FDCB6E", borderRadius: "8px", overflow: "hidden",
      fontFamily: "monospace", boxShadow: "0 4px 24px rgba(253,203,110,0.15)",
    }}>
      <div style={{ background: "#FDCB6E22", padding: "12px 18px", borderBottom: "2px solid #FDCB6E" }}>
        <span style={{ color: "#FDCB6E", fontSize: "11px", letterSpacing: "2px" }}>CLASS NAME</span>
        <div style={{ color: "#E6EDF3", fontSize: "20px", fontWeight: "700", marginTop: "4px" }}>Person</div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "14px 16px", borderRight: "1px solid #30363D" }}>
          <div style={{ color: "#FDCB6E", fontSize: "10px", letterSpacing: "1px", marginBottom: "10px" }}>RESPONSIBILITIES</div>
          {[
            "Knows personal data (name, phone)",
            "Can tell if available for appointment",
            "Knows schedule",
          ].map((r, i) => (
            <div key={i} style={{ color: "#C9D1D9", fontSize: "12.5px", padding: "5px 0", borderBottom: "1px solid #21262D", lineHeight: 1.4 }}>
              → {r}
            </div>
          ))}
        </div>
        <div style={{ width: "120px", padding: "14px 14px" }}>
          <div style={{ color: "#FDCB6E", fontSize: "10px", letterSpacing: "1px", marginBottom: "10px" }}>COLLABORATORS</div>
          <div style={{ color: "#58A6FF", fontSize: "13px", padding: "5px 0" }}>Schedule</div>
        </div>
      </div>
    </div>

    <h3 style={subTitle}>The Three Sections Explained</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "16px 0" }}>
      {[
        {
          label: "Class Name",
          color: "#FDCB6E",
          desc: "A noun. The entity you are modeling. Written at the top of the card.",
        },
        {
          label: "Responsibilities",
          color: "#00CEC9",
          desc: "Written in plain English — NO Java, NO technical jargon. Each line starts with a verb. Each line = one thing this class can know or do. Maps directly to methods (and sometimes attributes).",
        },
        {
          label: "Collaborators",
          color: "#FF6B9D",
          desc: "Other class names this class must talk to in order to fulfill a responsibility. In Java code, this means you'll have an object of that class somewhere inside this class.",
        },
      ].map(({ label, color, desc }) => (
        <div key={label} style={{ ...card, borderColor: color + "44", borderLeft: `3px solid ${color}` }}>
          <div style={{ color, fontFamily: "monospace", fontSize: "13px", marginBottom: "6px" }}>{label}</div>
          <div style={{ color: "#8B949E", fontSize: "13.5px", lineHeight: 1.6 }}>{desc}</div>
        </div>
      ))}
    </div>

    <h3 style={subTitle}>Responsibilities → Java Code</h3>
    <p style={bodyText}>Each responsibility translates to Java in a predictable way:</p>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: "13px", margin: "12px 0" }}>
        <thead>
          <tr style={{ background: "#161B22" }}>
            {["Responsibility type", "Becomes in Java"].map(h => (
              <th key={h} style={{ padding: "10px 14px", color: "#8B949E", fontWeight: "normal", textAlign: "left", borderBottom: "1px solid #30363D" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Knows a value (e.g. name, phone)", "→ private attribute + getter method"],
            ["Can perform an action", "→ public method"],
            ["Needs another class", "→ object of that class as a member or parameter"],
            ["Knows a collection of things", "→ attribute with a data structure (List, array)"],
          ].map(([r, j], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#0D1117" : "#0F1318" }}>
              <td style={{ padding: "10px 14px", color: "#C9D1D9", borderBottom: "1px solid #21262D" }}>{r}</td>
              <td style={{ padding: "10px 14px", color: "#64FFDA", borderBottom: "1px solid #21262D" }}>{j}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Callout type="warn">
      CRC cards define <strong>dependencies</strong>: if Person needs Schedule, a bug in Schedule can break Person. Spotting these dependencies early (on paper) lets you decide whether to simplify them before writing a single line of Java.
    </Callout>

    <Quiz
      question="In a CRC card, what does the 'Collaborators' section represent in Java code?"
      options={[
        "The superclass this class inherits from",
        "The access modifiers used by this class",
        "Other classes this class depends on — usually appearing as object references inside methods or as member variables",
        "The test cases for this class"
      ]}
      answer={2}
      explanation="Collaborators are dependencies. If class A lists class B as a collaborator, somewhere in A's Java code you'll find an object of B being used — either as a field, a local variable, or a parameter."
    />
  </div>
  );
};

const Chapter8 = () => (
  <div>
    <h2 style={sectionTitle}>UML Class Diagrams</h2>
    <p style={bodyText}>
      After CRC cards, UML class diagrams are the next step. They add <strong style={{ color: "#E17055" }}>just enough technical detail</strong> to catch design mistakes before writing full Java code.
    </p>

    <h3 style={subTitle}>The Modeling Pipeline</h3>
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "20px 0", flexWrap: "wrap" }}>
      {[
        { label: "Functional Requirements", sub: "plain English", color: "#8B949E" },
        { label: "→", color: "#30363D" },
        { label: "CRC Cards", sub: "abstract model", color: "#FDCB6E" },
        { label: "→", color: "#30363D" },
        { label: "UML Diagram", sub: "semi-detailed model", color: "#E17055" },
        { label: "→", color: "#30363D" },
        { label: "Java Code", sub: "full detail", color: "#50FA7B" },
        { label: "→", color: "#30363D" },
        { label: "Machine Code", sub: "compiled", color: "#58A6FF" },
      ].map((item, i) => (
        item.label === "→"
          ? <span key={i} style={{ color: "#30363D", fontSize: "20px" }}>→</span>
          : <div key={i} style={{
              background: "#161B22", border: `1px solid ${item.color}44`,
              borderRadius: "6px", padding: "10px 14px", textAlign: "center",
            }}>
              <div style={{ color: item.color, fontFamily: "monospace", fontSize: "12px", fontWeight: "bold" }}>{item.label}</div>
              <div style={{ color: "#6272A4", fontSize: "11px", marginTop: "3px" }}>{item.sub}</div>
            </div>
      ))}
    </div>

    <Callout type="info">
      Each step adds more detail. CRC = English sentences. UML = typed fields and method signatures. Java = full implementation. Machine code = binary. They all model the same system at different levels of abstraction.
    </Callout>

    <h3 style={subTitle}>Anatomy of a UML Class Box</h3>

    <div style={{ maxWidth: "320px", margin: "20px auto", border: "1px solid #E17055", borderRadius: "8px", overflow: "hidden", fontFamily: "monospace" }}>
      <div style={{ background: "#E1705522", padding: "12px 18px", borderBottom: "1px solid #E17055", textAlign: "center" }}>
        <span style={{ color: "#E6EDF3", fontSize: "16px", fontWeight: "bold" }}>ClassName</span>
      </div>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid #30363D" }}>
        <div style={{ color: "#8B949E", fontSize: "10px", letterSpacing: "1px", marginBottom: "8px" }}>ATTRIBUTES</div>
        {[
          ["+ name : String", "#50FA7B", "public"],
          ["- age : float", "#FF6B6B", "private"],
          ["# id : int", "#A29BFE", "protected"],
        ].map(([line, c, label]) => (
          <div key={line} style={{ color: c, fontSize: "13px", padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
            <span>{line}</span>
            <span style={{ color: "#6272A4", fontSize: "11px" }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 18px" }}>
        <div style={{ color: "#8B949E", fontSize: "10px", letterSpacing: "1px", marginBottom: "8px" }}>METHODS</div>
        {[
          "+ getName() : String",
          "+ setAge(a : float) : void",
          "- validate() : boolean",
        ].map((line) => (
          <div key={line} style={{ color: "#64FFDA", fontSize: "13px", padding: "4px 0" }}>{line}</div>
        ))}
      </div>
    </div>

    <h3 style={subTitle}>UML Syntax Rules</h3>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: "13px", margin: "12px 0" }}>
        <thead>
          <tr style={{ background: "#161B22" }}>
            {["Symbol", "Meaning", "Java equivalent"].map(h => (
              <th key={h} style={{ padding: "10px 14px", color: "#8B949E", fontWeight: "normal", textAlign: "left", borderBottom: "1px solid #30363D" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["+", "public", "public"],
            ["-", "private", "private"],
            ["#", "protected", "protected"],
            ["name : Type", "attribute declaration", "Type name;"],
            ["method() : ReturnType", "method signature", "ReturnType method()"],
            ["→ (hollow arrow)", "inheritance", "extends"],
            ["— (line with number)", "association / dependency", "has-a relationship"],
          ].map(([sym, mean, java], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#0D1117" : "#0F1318" }}>
              <td style={{ padding: "10px 14px", color: "#FDCB6E", borderBottom: "1px solid #21262D" }}>{sym}</td>
              <td style={{ padding: "10px 14px", color: "#C9D1D9", borderBottom: "1px solid #21262D" }}>{mean}</td>
              <td style={{ padding: "10px 14px", color: "#64FFDA", borderBottom: "1px solid #21262D" }}>{java}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h3 style={subTitle}>UML vs. Java — Important Difference</h3>
    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#E17055" }}>
        <div style={{ color: "#E17055", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>UML (attribute syntax)</div>
        <CodeBlock code={`name : String\nage : float\nid : int`} />
        <p style={{ color: "#6272A4", fontSize: "12px" }}>Name first, then type — separated by colon</p>
      </div>
      <div style={{ ...card, borderColor: "#50FA7B" }}>
        <div style={{ color: "#50FA7B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>Java (field syntax)</div>
        <CodeBlock code={`String name;\nfloat age;\nint id;`} />
        <p style={{ color: "#6272A4", fontSize: "12px" }}>Type first, then name — no colon</p>
      </div>
    </div>

    <Callout type="warn">
      UML is NOT Java. Do not read UML as Java syntax. They model the same thing at different levels of detail. The professor only cares about <strong>UML class diagrams</strong> — not sequence diagrams, activity diagrams, or any other UML diagram types.
    </Callout>

    <h3 style={subTitle}>Why UML After CRC?</h3>
    <p style={bodyText}>CRC cards are great for grouping, but they hide certain problems in plain-English descriptions. UML makes these visible:</p>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "12px 0" }}>
      {[
        "Inheritance relationships that don't make logical sense",
        "Classes with too many responsibilities (too large)",
        "Missing dependencies you didn't notice in CRC",
        "Circular dependencies (A needs B, B needs A — trouble!)",
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "12px", color: "#C9D1D9", fontSize: "14px", alignItems: "flex-start" }}>
          <span style={{ color: "#E17055", marginTop: "2px" }}>⚠</span> {item}
        </div>
      ))}
    </div>

    <Quiz
      question="In UML, what does '- age : float' mean?"
      options={[
        "A public method called age that returns float",
        "A private attribute called age of type float",
        "A protected variable with default value",
        "A static field called float of type age"
      ]}
      answer={1}
      explanation="The minus (-) symbol means private. The format is 'name : Type' — so 'age : float' is an attribute named age of type float. Combined: private attribute age of type float."
    />
  </div>
);

const Chapter9 = () => (
  <div>
    <h2 style={sectionTitle}>Lab 2 Requirements</h2>
    <p style={bodyText}>
      Lab 2 is the deliberate opposite of Lab 1. Together they form a critical lesson about software design extremes.
    </p>

    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#FF6B9D" }}>
        <div style={{ color: "#FF6B9D", fontFamily: "monospace", fontSize: "12px", marginBottom: "10px" }}>LAB 1 — Overengineered</div>
        <p style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6 }}>
          Calculator app with as <strong>many classes and methods as possible</strong>. Every operation broken into its own structure. Maximum code organization.
        </p>
        <div style={{ color: "#6272A4", fontSize: "12px", marginTop: "8px" }}>→ Too complex, hard to read</div>
      </div>
      <div style={{ ...card, borderColor: "#74B9FF" }}>
        <div style={{ color: "#74B9FF", fontFamily: "monospace", fontSize: "12px", marginBottom: "10px" }}>LAB 2 — Underengineered</div>
        <p style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.6 }}>
          Same calculator app but with as <strong>few code structures as possible</strong>. Minimum classes, minimum methods. Everything crammed together.
        </p>
        <div style={{ color: "#6272A4", fontSize: "12px", marginTop: "8px" }}>→ Too simple, hard to maintain</div>
      </div>
    </div>

    <Callout type="tip">
      The point of doing both labs is to <strong>feel</strong> both extremes. Only by experiencing them directly can you develop the intuition for where the right balance lies — which is the core skill of software design.
    </Callout>

    <h3 style={subTitle}>Lab 2 Specification</h3>
    <div style={{ ...card, borderColor: "#74B9FF", padding: "20px" }}>
      {[
        ["Domain", "Calculator (same as Lab 1)"],
        ["Operations", "All operations required in Lab 1 — no change"],
        ["Goal", "Minimize the number of classes and methods used"],
        ["Target", "As few code structures as possible"],
        ["Design quality", "Intentionally bad — that's the point"],
        ["Insight", "Experience what underengineering feels like"],
      ].map(([key, val], i) => (
        <div key={i} style={{ display: "flex", gap: "16px", padding: "10px 0", borderBottom: "1px solid #21262D" }}>
          <span style={{ color: "#74B9FF", fontFamily: "monospace", fontSize: "13px", minWidth: "120px" }}>{key}</span>
          <span style={{ color: "#C9D1D9", fontSize: "13.5px" }}>{val}</span>
        </div>
      ))}
    </div>

    <h3 style={subTitle}>The Bigger Picture</h3>
    <p style={bodyText}>These two labs set up the central question of the entire course:</p>

    <div style={{ ...card, borderColor: "#30363D", padding: "24px", textAlign: "center", margin: "20px 0" }}>
      <div style={{ fontSize: "32px", marginBottom: "16px" }}>⟵ ——————————— ⟶</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ textAlign: "left", maxWidth: "160px" }}>
          <div style={{ color: "#FF6B9D", fontFamily: "monospace", fontSize: "13px", marginBottom: "6px" }}>OVERENGINEERED</div>
          <div style={{ color: "#6272A4", fontSize: "12px", lineHeight: 1.5 }}>Too many classes. Hard to read. Unnecessary complexity. Cognitive overload.</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#50FA7B", fontFamily: "monospace", fontSize: "13px", marginBottom: "6px" }}>SWEET SPOT</div>
          <div style={{ color: "#6272A4", fontSize: "12px" }}>The goal of<br />SE421</div>
        </div>
        <div style={{ textAlign: "right", maxWidth: "160px" }}>
          <div style={{ color: "#74B9FF", fontFamily: "monospace", fontSize: "13px", marginBottom: "6px" }}>UNDERENGINEERED</div>
          <div style={{ color: "#6272A4", fontSize: "12px", lineHeight: 1.5 }}>Everything in one blob. Hard to maintain. No separation of concerns.</div>
        </div>
      </div>
    </div>

    <Callout type="info">
      The full explanation of <em>why</em> the sweet spot matters will come in the next recording. Labs 1 and 2 are the setup — the next lecture delivers the payoff.
    </Callout>

    <h3 style={{ ...subTitle, marginTop: "32px" }}>Part 2 Lecture Summary</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", margin: "16px 0" }}>
      {[
        ["Entity Abstraction", "Classes = entities (nouns). Methods = actions (verbs). Two levels of structure."],
        ["Class Names", "Always nouns. Method names always start with a verb."],
        ["Design with 200 reqs", "Group requirements → each group = class, each req = method"],
        ["CRC Cards", "Class, Responsibility, Collaboration. Paper-based design before coding."],
        ["Responsibilities", "Plain English, verb-first, no Java jargon. Maps to methods/attributes."],
        ["Collaborators", "Other classes this class depends on. Becomes object references in Java."],
        ["UML Class Diagram", "Semi-detailed model between CRC and Java. Catches design mistakes early."],
        ["UML Syntax", "+ public, - private, # protected. name : Type for attributes."],
        ["Lab 2", "Underengineer the calculator. Minimum classes and methods."],
      ].map(([term, def], i) => (
        <div key={i} style={{
          display: "flex", gap: "16px", padding: "11px 16px",
          background: i % 2 === 0 ? "#0D1117" : "#0F1318",
          borderRadius: "4px",
        }}>
          <span style={{ color: "#74B9FF", fontFamily: "monospace", fontSize: "13px", minWidth: "170px" }}>{term}</span>
          <span style={{ color: "#8B949E", fontSize: "13.5px", lineHeight: 1.5 }}>{def}</span>
        </div>
      ))}
    </div>
  </div>
);

const Chapter10 = () => (
  <div>
    <h2 style={sectionTitle}>Inheritance & the <code>super</code> Keyword</h2>
    <p style={bodyText}>
      <strong style={{ color: "#6FCF97" }}>Inheritance</strong> is a class feature that lets one class automatically receive all non-private members from another class — eliminating code duplication across related classes.
    </p>

    <h3 style={subTitle}>The Core Idea</h3>
    <div style={{ ...card, borderColor: "#6FCF97", padding: "20px", margin: "16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          { label: "Superclass (Parent)", desc: "The class being inherited from. Defines shared members.", color: "#6FCF97", example: "Shape" },
          { label: "Subclass (Child)", desc: "The class that inherits. Gets all non-private members from the parent.", color: "#58A6FF", example: "Circle, Rectangle" },
        ].map(({ label, desc, color, example }) => (
          <div key={label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ background: color + "22", border: `1px solid ${color}`, borderRadius: "6px", padding: "8px 14px", minWidth: "160px", textAlign: "center" }}>
              <div style={{ color, fontFamily: "monospace", fontSize: "12px" }}>{label}</div>
              <div style={{ color: "#E6EDF3", fontSize: "14px", marginTop: "4px" }}>{example}</div>
            </div>
            <p style={{ color: "#8B949E", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>

    <h3 style={subTitle}>Syntax: the <code>extends</code> Keyword</h3>
    <CodeBlock code={`public class Shape {                  // superclass\n    private String color;\n\n    public Shape(String color) {\n        this.color = color;\n    }\n\n    public void displayColor() {\n        System.out.println(color);\n    }\n\n    public double calculateArea() {\n        return 0;  // generic shape can't know this\n    }\n}\n\npublic class Circle extends Shape {   // subclass\n    private double radius;\n\n    // Circle now has: displayColor() + calculateArea()\n    // inherited automatically from Shape\n}`} highlight={[17]} />

    <h3 style={subTitle}>What Gets Inherited?</h3>
    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#50FA7B" }}>
        <div style={{ color: "#50FA7B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>✅ INHERITED (non-private)</div>
        {["public methods", "public variables", "protected methods", "protected variables"].map(i => (
          <div key={i} style={{ color: "#C9D1D9", fontSize: "13.5px", padding: "4px 0", borderBottom: "1px solid #21262D" }}>→ {i}</div>
        ))}
      </div>
      <div style={{ ...card, borderColor: "#FF6B6B" }}>
        <div style={{ color: "#FF6B6B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>❌ NOT INHERITED (private)</div>
        {["private variables", "private methods", "private constructors"].map(i => (
          <div key={i} style={{ color: "#C9D1D9", fontSize: "13.5px", padding: "4px 0", borderBottom: "1px solid #21262D" }}>✗ {i}</div>
        ))}
        <p style={{ color: "#6272A4", fontSize: "12px", marginTop: "8px" }}>Still exist in the object's memory — just not directly accessible.</p>
      </div>
    </div>

    <h3 style={subTitle}>The <code>super</code> Keyword</h3>
    <p style={bodyText}>
      <code style={{ color: "#6FCF97" }}>super</code> is a pointer to the <strong>parent class</strong>. Just like <code>this</code> points to the current object, <code>super</code> points to the superclass. Use it when you need to access something in the parent from a subclass.
    </p>

    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#6FCF97" }}>
        <div style={{ color: "#6FCF97", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>super() — call parent constructor</div>
        <CodeBlock code={`public Circle() {\n    super("");  // calls Shape("")\n}`} />
        <p style={{ color: "#6272A4", fontSize: "12px" }}>Must be the FIRST line. Used when parent has no default constructor.</p>
      </div>
      <div style={{ ...card, borderColor: "#FFD166" }}>
        <div style={{ color: "#FFD166", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>super.member — access parent member</div>
        <CodeBlock code={`super.color = "red";\n// only works if color is\n// NOT private in Shape`} />
        <p style={{ color: "#6272A4", fontSize: "12px" }}>If the member is private, you must go through a public/protected method instead.</p>
      </div>
    </div>

    <Callout type="warn">
      If the superclass has <strong>no default constructor</strong> (no-argument constructor), every subclass constructor <strong>must</strong> call <code>super(...)</code> with the required arguments as its very first line — or Java will throw a compile error.
    </Callout>

    <h3 style={subTitle}>Every Class Inherits from <code>Object</code></h3>
    <p style={bodyText}>If you don't write <code>extends</code>, Java silently adds <code>extends Object</code>. This means every Java class ultimately inherits from <code>Object</code> — which is why you always see methods like <code>toString()</code>, <code>hashCode()</code>, and <code>equals()</code> available on every object.</p>

    <div style={{ ...card, borderColor: "#30363D", padding: "18px" }}>
      <div style={{ color: "#8B949E", fontFamily: "monospace", fontSize: "12px", marginBottom: "12px" }}>INHERITANCE TREE (our example)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0", fontFamily: "monospace", fontSize: "13px" }}>
        {[
          { label: "Object", indent: 0, color: "#58A6FF", note: "root of all Java classes" },
          { label: "└── Shape", indent: 1, color: "#6FCF97", note: "extends Object (implicit)" },
          { label: "    ├── Circle", indent: 2, color: "#FFD166", note: "extends Shape" },
          { label: "    └── Rectangle", indent: 2, color: "#FFD166", note: "extends Shape" },
        ].map(({ label, color, note }) => (
          <div key={label} style={{ padding: "6px 0", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #21262D" }}>
            <span style={{ color }}>{label}</span>
            <span style={{ color: "#3D4451", fontSize: "11px" }}>{note}</span>
          </div>
        ))}
      </div>
    </div>

    <Callout type="tip">
      Inheritance creates a hierarchy. Members defined at the top propagate down automatically. Add a new method to <code>Shape</code> and <strong>all</strong> subclasses get it instantly — no manual copying needed.
    </Callout>

    <h3 style={subTitle}>Subclasses Can Add Their Own Members</h3>
    <CodeBlock code={`public class Circle extends Shape {\n    private double radius;  // NEW attribute, unique to Circle\n\n    public Circle(String color, double radius) {\n        super(color);          // sets Shape's color field\n        this.radius = radius;  // sets Circle's own radius\n    }\n\n    // Circle has: displayColor(), calculateArea() from Shape\n    // PLUS its own radius field\n}`} highlight={[2, 8]} />

    <Quiz
      question="Class Dog extends Animal. Animal has: public void eat(), private int age. What does Dog inherit?"
      options={[
        "Both eat() and age",
        "Only eat() — private members are not inherited",
        "Only age — methods are not inherited",
        "Nothing — subclasses start empty"
      ]}
      answer={1}
      explanation="Inheritance copies all non-private members. eat() is public so it's inherited. age is private so it stays exclusive to Animal — Dog cannot access it directly."
    />
  </div>
);

const Chapter11 = () => (
  <div>
    <h2 style={sectionTitle}>Method Overriding</h2>
    <p style={bodyText}>
      <strong style={{ color: "#F2994A" }}>Overriding</strong> lets a subclass replace an inherited method with its own implementation. Same method name, same signature — different body.
    </p>

    <h3 style={subTitle}>The Problem It Solves</h3>
    <p style={bodyText}>
      <code>Shape.calculateArea()</code> returns 0 because a generic shape doesn't know its formula. But <code>Circle</code> knows its formula: <strong>π × r²</strong>. Overriding lets Circle swap the inherited useless implementation with the correct one.
    </p>

    <CodeBlock code={`// In Shape (superclass):\npublic double calculateArea() {\n    System.out.println("Cannot calculate — generic shape!");\n    return 0;\n}\n\n// In Circle (subclass) — OVERRIDES the above:\n@Override\npublic double calculateArea() {\n    return Math.PI * radius * radius;  // π × r²\n}`} highlight={[8, 9, 10]} />

    <h3 style={subTitle}>How Overriding Works</h3>
    <div style={{ ...card, borderColor: "#30363D", padding: "20px", margin: "16px 0" }}>
      {[
        ["Step 1", "Subclass declares a method with the EXACT same signature as the parent's method", "#F2994A"],
        ["Step 2", "Java sees this as an override — the subclass version shadows the parent version", "#FFD166"],
        ["Step 3", "When called on a subclass object, the subclass version executes — not the parent's", "#50FA7B"],
      ].map(([step, desc, c]) => (
        <div key={step} style={{ display: "flex", gap: "16px", padding: "11px 0", borderBottom: "1px solid #21262D" }}>
          <span style={{ color: c, fontFamily: "monospace", fontSize: "12px", minWidth: "55px" }}>{step}</span>
          <span style={{ color: "#C9D1D9", fontSize: "14px", lineHeight: 1.5 }}>{desc}</span>
        </div>
      ))}
    </div>

    <h3 style={subTitle}>Proof in Code</h3>
    <CodeBlock code={`Shape s1 = new Shape("red");\nCircle s2 = new Circle("blue", 2.2);\n\nSystem.out.println(s1.calculateArea());  // → 0.0  (Shape version)\nSystem.out.println(s2.calculateArea());  // → 15.2  (Circle version: π×2.2²)`} highlight={[4, 5]} />

    <h3 style={subTitle}>The <code>@Override</code> Annotation</h3>
    <p style={bodyText}>Writing <code>@Override</code> above the method is optional but strongly recommended. It tells the compiler: "I intend this to be an override. Please verify."</p>
    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#50FA7B" }}>
        <div style={{ color: "#50FA7B", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>✅ With @Override</div>
        <CodeBlock code={`@Override\npublic double calculateArea() {\n    return Math.PI * radius * radius;\n}`} />
        <p style={{ color: "#8B949E", fontSize: "13px" }}>If signature doesn't match parent's, compiler gives an error immediately — catches typos.</p>
      </div>
      <div style={{ ...card, borderColor: "#8B949E" }}>
        <div style={{ color: "#8B949E", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>Without @Override</div>
        <CodeBlock code={`public double calculateArea() {\n    return Math.PI * radius * radius;\n}`} />
        <p style={{ color: "#8B949E", fontSize: "13px" }}>Still works — but if you misspell the method name, Java silently creates a NEW method instead of overriding.</p>
      </div>
    </div>

    <h3 style={subTitle}>Overriding Rules</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "16px 0" }}>
      {[
        ["Method name", "Must be identical to the parent's method name", "✅"],
        ["Parameters", "Must be identical (same types, same count)", "✅"],
        ["Return type", "Must be same (or a subtype — covariant return)", "✅"],
        ["Access modifier", "Can be same or MORE permissive (e.g. protected → public)", "✅"],
        ["static methods", "Cannot be overridden — this is why the professor dislikes static!", "❌"],
        ["private methods", "Cannot be overridden — not inherited in the first place", "❌"],
      ].map(([rule, desc, ok]) => (
        <div key={rule} style={{ display: "flex", gap: "12px", padding: "10px 14px", background: "#0D1117", borderRadius: "6px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "14px", minWidth: "20px" }}>{ok}</span>
          <span style={{ color: "#64FFDA", fontFamily: "monospace", fontSize: "13px", minWidth: "140px" }}>{rule}</span>
          <span style={{ color: "#8B949E", fontSize: "13.5px" }}>{desc}</span>
        </div>
      ))}
    </div>

    <Callout type="danger">
      <strong>Static methods cannot be overridden.</strong> This is the professor's core reason for avoiding static methods. Without overriding, a subclass cannot specialize behavior — it's just copying code, not inheriting intelligently. Static kills the power of OOP.
    </Callout>

    <h3 style={subTitle}>Override vs. Overload — Don't Confuse These</h3>
    <div style={twoCol}>
      <div style={{ ...card, borderColor: "#F2994A" }}>
        <div style={{ color: "#F2994A", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>OVERRIDE (inheritance)</div>
        <p style={{ color: "#C9D1D9", fontSize: "13.5px", lineHeight: 1.6 }}>
          Subclass redefines a method from parent. <strong>Same signature</strong>. Replaces parent behavior for that subclass.
        </p>
      </div>
      <div style={{ ...card, borderColor: "#A29BFE" }}>
        <div style={{ color: "#A29BFE", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>OVERLOAD (same class)</div>
        <p style={{ color: "#C9D1D9", fontSize: "13.5px", lineHeight: 1.6 }}>
          Same class defines multiple methods with <strong>same name but different parameters</strong>. No inheritance needed.
        </p>
      </div>
    </div>

    <Quiz
      question="Circle extends Shape. Shape has: public double calculateArea(). Circle also declares: public double calculateArea(). What is this called and what happens when you call it on a Circle object?"
      options={[
        "Overloading — both versions exist and Java picks randomly",
        "Overriding — Circle's version executes, shadowing Shape's version",
        "Compile error — you can't redeclare a method",
        "Overloading — Circle now has two calculateArea methods"
      ]}
      answer={1}
      explanation="When the signature matches exactly and the method is in a subclass, it's overriding. Calling calculateArea() on a Circle object runs Circle's implementation. Shape's version is shadowed (but not deleted — you could still reach it with super.calculateArea())."
    />
  </div>
);

const Chapter12 = () => (
  <div>
    <h2 style={sectionTitle}>The <code>protected</code> Access Modifier</h2>
    <p style={bodyText}>
      <strong style={{ color: "#BB6BD9" }}>protected</strong> fills the gap between <code>private</code> and <code>public</code>. It was designed specifically for inheritance scenarios.
    </p>

    <h3 style={subTitle}>The Four Access Modifiers — Full Comparison</h3>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: "13px", margin: "16px 0" }}>
        <thead>
          <tr style={{ background: "#161B22" }}>
            {["Modifier", "Same Class", "Subclass", "Same Package", "Everyone"].map(h => (
              <th key={h} style={{ padding: "10px 14px", color: "#8B949E", fontWeight: "normal", textAlign: "left", borderBottom: "1px solid #30363D" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["private", "✅", "❌", "❌", "❌", "#FF6B6B"],
            ["default (none)", "✅", "❌", "✅", "❌", "#FFD166"],
            ["protected", "✅", "✅", "✅", "❌", "#BB6BD9"],
            ["public", "✅", "✅", "✅", "✅", "#50FA7B"],
          ].map(([mod, ...cols]) => {
            const color = cols.pop();
            return (
              <tr key={mod} style={{ background: "#0D1117" }}>
                <td style={{ padding: "10px 14px", color, fontWeight: "bold", borderBottom: "1px solid #21262D" }}>{mod}</td>
                {cols.map((v, i) => (
                  <td key={i} style={{ padding: "10px 14px", color: v === "✅" ? "#50FA7B" : "#FF6B6B", borderBottom: "1px solid #21262D", textAlign: "center" }}>{v}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <Callout type="info">
      We haven't covered packages yet — so for now, focus only on the <strong>"Same Class"</strong> and <strong>"Subclass"</strong> columns. That's what matters for today's inheritance examples.
    </Callout>

    <h3 style={subTitle}>The Problem: Private + Inheritance</h3>
    <p style={bodyText}>When <code>color</code> is private in <code>Shape</code>, the subclass <code>Circle</code> cannot access it directly — even though Circle inherits from Shape.</p>
    <CodeBlock code={`public class Shape {\n    private String color;  // private\n    ...\n}\n\npublic class Circle extends Shape {\n    public Circle(String color) {\n        super.color = color;  // ❌ ERROR: color has private access in Shape\n        this.color = color;   // ❌ ERROR: color is not defined in Circle\n    }\n}`} highlight={[8, 9]} />

    <h3 style={subTitle}>Three Solutions — Compared</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "16px 0" }}>
      {[
        {
          label: "Solution 1 — Make it public",
          color: "#FF6B6B",
          code: `public String color;  // ✅ compiles, but...\n// ❌ Now ANYONE can change color from anywhere`,
          verdict: "Works but loses all control. Bad design.",
        },
        {
          label: "Solution 2 — Make it protected",
          color: "#BB6BD9",
          code: `protected String color;  // ✅ subclasses can access\n// ✅ still hidden from unrelated classes`,
          verdict: "Best balance for inheritance scenarios.",
        },
        {
          label: "Solution 3 — Keep private, use super() constructor",
          color: "#50FA7B",
          code: `// In Circle:\npublic Circle(String color) {\n    super(color);  // ✅ calls Shape's constructor\n                   // Shape's constructor sets its own private color\n}`,
          verdict: "Cleanest approach. Private stays private. Access goes through the parent's own methods.",
        },
      ].map(({ label, color, code, verdict }) => (
        <div key={label} style={{ ...card, borderLeft: `3px solid ${color}`, borderColor: color + "44" }}>
          <div style={{ color, fontFamily: "monospace", fontSize: "12px", marginBottom: "8px" }}>{label}</div>
          <CodeBlock code={code} />
          <div style={{ color: "#8B949E", fontSize: "13px", marginTop: "4px" }}>{verdict}</div>
        </div>
      ))}
    </div>

    <h3 style={subTitle}>When to Use Each</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "12px 0" }}>
      {[
        ["private", "Default for all fields. Maximum encapsulation. Use getters/setters or constructors for access.", "#FF6B6B"],
        ["protected", "When you specifically want subclasses to access or override a member but hide it from everyone else.", "#BB6BD9"],
        ["public", "Methods and constructors that form the class's public interface. Rarely for fields.", "#50FA7B"],
        ["default", "Package-level sharing. Covered properly when we study packages.", "#FFD166"],
      ].map(([mod, desc, c]) => (
        <div key={mod} style={{ display: "flex", gap: "14px", padding: "10px 14px", background: "#0D1117", borderRadius: "6px" }}>
          <span style={{ color: c, fontFamily: "monospace", fontSize: "13px", minWidth: "80px", fontWeight: "bold" }}>{mod}</span>
          <span style={{ color: "#8B949E", fontSize: "13.5px", lineHeight: 1.5 }}>{desc}</span>
        </div>
      ))}
    </div>

    <h3 style={subTitle}>Lecture 3 Summary</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", margin: "16px 0" }}>
      {[
        ["extends", "Declares a subclass. Circle extends Shape."],
        ["Inheritance", "Subclass gets all non-private members from superclass automatically."],
        ["super()", "Calls the parent constructor. Must be first line. Required if parent has no default constructor."],
        ["super.member", "Accesses a parent's field or method. Only works if not private."],
        ["Object class", "Root of all Java classes. Every class inherits from it implicitly."],
        ["Overriding", "Subclass redefines a parent method with same signature. Parent version is shadowed."],
        ["@Override", "Optional annotation. Asks compiler to verify the override is valid."],
        ["Static ≠ Override", "Static methods cannot be overridden. This is why the professor avoids static."],
        ["protected", "Accessible by same class + all subclasses + same package. Middle ground for inheritance."],
        ["Private access", "Can still be modified indirectly through the parent's own public/protected methods."],
      ].map(([term, def], i) => (
        <div key={i} style={{
          display: "flex", gap: "16px", padding: "11px 16px",
          background: i % 2 === 0 ? "#0D1117" : "#0F1318",
          borderRadius: "4px",
        }}>
          <span style={{ color: "#6FCF97", fontFamily: "monospace", fontSize: "13px", minWidth: "150px" }}>{term}</span>
          <span style={{ color: "#8B949E", fontSize: "13.5px", lineHeight: 1.5 }}>{def}</span>
        </div>
      ))}
    </div>

    <Quiz
      question="Why does the professor dislike static methods, especially in the context of inheritance?"
      options={[
        "Static methods use more memory",
        "Static methods are slower at runtime",
        "Static methods cannot be overridden, so subclasses lose the ability to specialize inherited behavior",
        "Static methods don't compile with extends"
      ]}
      answer={2}
      explanation="The power of inheritance is that subclasses can override and specialize parent behavior. Static methods are bound to the class at compile time, not the object at runtime — so they can't be overridden. This removes a key OOP advantage."
    />
  </div>
);

// ── STYLES ─────────────────────────────────────────────────────────

const sectionTitle = {
  color: "#E6EDF3", fontSize: "24px", fontWeight: "700",
  fontFamily: "'Fira Code', monospace", marginBottom: "16px",
  marginTop: "0",
};

const subTitle = {
  color: "#C9D1D9", fontSize: "17px", fontWeight: "600",
  marginTop: "28px", marginBottom: "8px",
  fontFamily: "'Fira Code', monospace",
};

const bodyText = {
  color: "#8B949E", fontSize: "15px", lineHeight: "1.75",
  margin: "12px 0",
};

const card = {
  background: "#161B22", border: "1px solid #30363D",
  borderRadius: "8px", padding: "16px",
};

const twoCol = {
  display: "flex", gap: "16px", margin: "16px 0", flexWrap: "wrap",
};

const chapterContent = [
  <Chapter0 />, <Chapter1 />, <Chapter2 />,
  <Chapter3 />, <Chapter4 />, <Chapter5 />,
  <Chapter6 />, <Chapter7 />, <Chapter8 />, <Chapter9 />,
  <Chapter10 />, <Chapter11 />, <Chapter12 />,
];

// ── MAIN APP ───────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState(0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#010409",
      color: "#E6EDF3",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: "flex",
    }}>
      {/* Sidebar */}
      <div style={{
        width: "220px", minHeight: "100vh",
        background: "#0D1117",
        borderRight: "1px solid #21262D",
        padding: "28px 0",
        flexShrink: 0,
        position: "sticky", top: 0, alignSelf: "flex-start",
      }}>
        <div style={{
          padding: "0 20px 24px",
          borderBottom: "1px solid #21262D",
        }}>
          <div style={{ color: "#58A6FF", fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace", marginBottom: "6px" }}>
            SC421 · LECTURE NOTES
          </div>
          <div style={{ color: "#E6EDF3", fontSize: "16px", fontWeight: "700", lineHeight: 1.3 }}>
            Java OOP<br />Deep Dive
          </div>
        </div>
        <div style={{ padding: "16px 0" }}>
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActive(ch.id)}
              style={{
                width: "100%", background: active === ch.id ? `${ch.color}15` : "transparent",
                border: "none", borderLeft: active === ch.id ? `3px solid ${ch.color}` : "3px solid transparent",
                padding: "12px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px",
                textAlign: "left", transition: "all 0.15s",
              }}
            >
              <span style={{ color: ch.color, fontSize: "14px" }}>{ch.icon}</span>
              <div>
                <div style={{ color: active === ch.id ? ch.color : "#8B949E", fontSize: "10px", fontFamily: "monospace", letterSpacing: "1px" }}>
                  {ch.label}
                </div>
                <div style={{ color: active === ch.id ? "#E6EDF3" : "#6E7681", fontSize: "13px", lineHeight: 1.3 }}>
                  {ch.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "40px 48px", maxWidth: "800px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          marginBottom: "32px", paddingBottom: "20px",
          borderBottom: "1px solid #21262D",
        }}>
          <span style={{ fontSize: "28px" }}>{chapters[active].icon}</span>
          <div>
            <div style={{ color: chapters[active].color, fontSize: "11px", fontFamily: "monospace", letterSpacing: "2px" }}>
              CHAPTER {chapters[active].label}
            </div>
            <div style={{ color: "#E6EDF3", fontSize: "22px", fontWeight: "700" }}>
              {chapters[active].title}
            </div>
          </div>
        </div>

        {chapterContent[active]}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "48px", paddingTop: "20px", borderTop: "1px solid #21262D" }}>
          <button
            onClick={() => setActive(a => Math.max(0, a - 1))}
            disabled={active === 0}
            style={{
              background: active > 0 ? "#161B22" : "transparent",
              border: "1px solid #30363D", borderRadius: "6px",
              padding: "10px 20px", color: active > 0 ? "#E6EDF3" : "#30363D",
              cursor: active > 0 ? "pointer" : "default",
              fontFamily: "monospace", fontSize: "13px",
            }}
          >← Previous</button>
          <button
            onClick={() => setActive(a => Math.min(chapters.length - 1, a + 1))}
            disabled={active === chapters.length - 1}
            style={{
              background: active < chapters.length - 1 ? chapters[active + 1 < chapters.length ? active + 1 : active].color + "22" : "transparent",
              border: `1px solid ${active < chapters.length - 1 ? chapters[Math.min(active + 1, chapters.length - 1)].color : "#30363D"}`,
              borderRadius: "6px", padding: "10px 20px",
              color: active < chapters.length - 1 ? "#E6EDF3" : "#30363D",
              cursor: active < chapters.length - 1 ? "pointer" : "default",
              fontFamily: "monospace", fontSize: "13px",
            }}
          >Next →</button>
        </div>
      </div>
    </div>
  );
}
