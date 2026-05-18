import{j as e}from"./index-vtBAwm1E.js";import{a6 as c,ag as p}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const N={title:"Components/ScrollArea",parameters:{layout:"centered"}},a={render:()=>e.jsx(c,{className:"h-64 w-72 rounded-md border",children:e.jsxs("div",{className:"p-4",children:[e.jsx("h4",{className:"mb-4 text-sm font-medium",children:"Variables (12)"}),Array.from({length:12},(s,r)=>`variable_${r+1}`).map((s,r)=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between py-2",children:[e.jsxs("span",{className:"font-mono text-sm",children:["$",s]}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"list"})]}),r<11&&e.jsx(p,{})]},s))]})})},t={render:()=>e.jsx(c,{className:"h-48 w-full rounded-md border bg-muted/30 p-4",children:e.jsx("div",{className:"space-y-1 font-mono text-xs",children:Array.from({length:20},(s,r)=>e.jsxs("div",{className:"text-muted-foreground",children:[e.jsxs("span",{className:"text-green-500",children:["[",new Date(Date.now()-r*1e3).toISOString(),"]"]})," ","query executed in ",Math.floor(Math.random()*200+5),"ms"]},r))})})};var n,o,m;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <ScrollArea className="h-64 w-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Variables (12)</h4>
        {Array.from({
        length: 12
      }, (_, i) => \`variable_\${i + 1}\`).map((v, i) => <div key={v}>
            <div className="flex items-center justify-between py-2">
              <span className="font-mono text-sm">\${v}</span>
              <span className="text-xs text-muted-foreground">list</span>
            </div>
            {i < 11 && <Separator />}
          </div>)}
      </div>
    </ScrollArea>
}`,...(m=(o=a.parameters)==null?void 0:o.docs)==null?void 0:m.source}}};var d,l,i;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <ScrollArea className="h-48 w-full rounded-md border bg-muted/30 p-4">
      <div className="space-y-1 font-mono text-xs">
        {Array.from({
        length: 20
      }, (_, i) => <div key={i} className="text-muted-foreground">
            <span className="text-green-500">[{new Date(Date.now() - i * 1000).toISOString()}]</span>{' '}
            query executed in {Math.floor(Math.random() * 200 + 5)}ms
          </div>)}
      </div>
    </ScrollArea>
}`,...(i=(l=t.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};const g=["VariableList","QueryLog"];export{t as QueryLog,a as VariableList,g as __namedExportsOrder,N as default};
