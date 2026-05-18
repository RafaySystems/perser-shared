import{j as e}from"./index-vtBAwm1E.js";import{A as g,b as a,c as t,a as c,W as o,as as l,B as n}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const A={title:"Components/Accordion",parameters:{layout:"centered"}},r={render:()=>e.jsxs(g,{type:"multiple",className:"w-96",children:[e.jsxs(a,{value:"builtin",children:[e.jsx(t,{children:e.jsxs("span",{className:"flex items-center gap-2",children:["Built-in Variables",e.jsx(n,{variant:"secondary",className:"text-xs",children:"3"})]})}),e.jsx(c,{className:"space-y-2",children:["__interval","__rate_interval","__range"].map(s=>e.jsxs("div",{className:"flex items-center justify-between px-2 py-1 rounded bg-muted/40",children:[e.jsx("code",{className:"text-sm font-mono",children:s}),e.jsx(n,{variant:"outline",className:"text-xs",children:"auto"})]},s))})]}),e.jsxs(a,{value:"custom",children:[e.jsx(t,{children:e.jsxs("span",{className:"flex items-center gap-2",children:["Custom Variables",e.jsx(n,{variant:"secondary",className:"text-xs",children:"2"})]})}),e.jsx(c,{className:"space-y-2",children:[{name:"env",type:"list",value:"prod"},{name:"instance",type:"query",value:"web-01"}].map(s=>e.jsxs("div",{className:"flex items-center justify-between px-2 py-1 rounded bg-muted/40",children:[e.jsxs("code",{className:"text-sm font-mono",children:["$",s.name]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(n,{variant:"outline",className:"text-xs",children:s.type}),e.jsx("span",{className:"text-xs text-muted-foreground",children:s.value})]})]},s.name))})]})]})},i={render:()=>e.jsxs(g,{type:"multiple",defaultValue:["legend"],className:"w-80",children:[e.jsxs(a,{value:"legend",children:[e.jsx(t,{children:"Legend"}),e.jsxs(c,{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(o,{children:"Show Legend"}),e.jsx(l,{defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(o,{children:"Show Values"}),e.jsx(l,{})]})]})]}),e.jsxs(a,{value:"tooltip",children:[e.jsx(t,{children:"Tooltip"}),e.jsx(c,{className:"space-y-3",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(o,{children:"Show All Series"}),e.jsx(l,{defaultChecked:!0})]})})]}),e.jsxs(a,{value:"thresholds",children:[e.jsx(t,{children:"Thresholds"}),e.jsx(c,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"No thresholds configured."})})]})]})};var d,m,x;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <Accordion type="multiple" className="w-96">
      <AccordionItem value="builtin">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Built-in Variables
            <Badge variant="secondary" className="text-xs">3</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          {['__interval', '__rate_interval', '__range'].map(v => <div key={v} className="flex items-center justify-between px-2 py-1 rounded bg-muted/40">
              <code className="text-sm font-mono">{v}</code>
              <Badge variant="outline" className="text-xs">auto</Badge>
            </div>)}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="custom">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Custom Variables
            <Badge variant="secondary" className="text-xs">2</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          {[{
          name: 'env',
          type: 'list',
          value: 'prod'
        }, {
          name: 'instance',
          type: 'query',
          value: 'web-01'
        }].map(v => <div key={v.name} className="flex items-center justify-between px-2 py-1 rounded bg-muted/40">
              <code className="text-sm font-mono">\${v.name}</code>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{v.type}</Badge>
                <span className="text-xs text-muted-foreground">{v.value}</span>
              </div>
            </div>)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
}`,...(x=(m=r.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};var u,p,h;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <Accordion type="multiple" defaultValue={['legend']} className="w-80">
      <AccordionItem value="legend">
        <AccordionTrigger>Legend</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Show Legend</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Values</Label>
            <Switch />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tooltip">
        <AccordionTrigger>Tooltip</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Show All Series</Label>
            <Switch defaultChecked />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="thresholds">
        <AccordionTrigger>Thresholds</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">No thresholds configured.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
}`,...(h=(p=i.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};const y=["VariableList","PanelOptions"];export{i as PanelOptions,r as VariableList,y as __namedExportsOrder,A as default};
