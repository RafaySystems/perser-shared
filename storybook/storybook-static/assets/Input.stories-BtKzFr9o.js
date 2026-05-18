import{j as e}from"./index-vtBAwm1E.js";import{U as a,W as d,a7 as U,g as W}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const O={title:"Components/Input",component:a,parameters:{layout:"centered"}},r={args:{placeholder:"Enter value..."}},s={args:{defaultValue:"prometheus-prod"}},t={args:{disabled:!0,defaultValue:"Read-only value"}},l={render:()=>e.jsxs("div",{className:"space-y-2 w-64",children:[e.jsx(d,{htmlFor:"datasource-url",children:"Datasource URL"}),e.jsx(a,{id:"datasource-url",placeholder:"http://prometheus:9090"})]})},o={render:()=>e.jsxs("div",{className:"relative w-72",children:[e.jsx(U,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"}),e.jsx(a,{className:"pl-9",placeholder:"Search panels..."})]})},n={render:()=>e.jsxs("div",{className:"flex gap-2 w-80",children:[e.jsx(a,{placeholder:"PromQL expression",className:"font-mono text-sm"}),e.jsx(W,{size:"sm",children:"Run"})]})},c={render:()=>e.jsxs("div",{className:"space-y-4 w-72",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(d,{htmlFor:"panel-name",children:"Panel Name *"}),e.jsx(a,{id:"panel-name",placeholder:"e.g. CPU Usage"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(d,{htmlFor:"panel-desc",children:"Description"}),e.jsx(a,{id:"panel-desc",placeholder:"Optional"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(d,{htmlFor:"repeat-var",children:"Repeat by Variable"}),e.jsx(a,{id:"repeat-var",placeholder:"Select variable..."})]})]})};var p,m,i;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter value...'
  }
}`,...(i=(m=r.parameters)==null?void 0:m.docs)==null?void 0:i.source}}};var u,h,v;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    defaultValue: 'prometheus-prod'
  }
}`,...(v=(h=s.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var x,b,g;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: 'Read-only value'
  }
}`,...(g=(b=t.parameters)==null?void 0:b.docs)==null?void 0:g.source}}};var N,j,f;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-64">
      <Label htmlFor="datasource-url">Datasource URL</Label>
      <Input id="datasource-url" placeholder="http://prometheus:9090" />
    </div>
}`,...(f=(j=l.parameters)==null?void 0:j.docs)==null?void 0:f.source}}};var y,L,S;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input className="pl-9" placeholder="Search panels..." />
    </div>
}`,...(S=(L=o.parameters)==null?void 0:L.docs)==null?void 0:S.source}}};var w,F,I;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2 w-80">
      <Input placeholder="PromQL expression" className="font-mono text-sm" />
      <Button size="sm">Run</Button>
    </div>
}`,...(I=(F=n.parameters)==null?void 0:F.docs)==null?void 0:I.source}}};var R,D,V;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-72">
      <div className="space-y-2">
        <Label htmlFor="panel-name">Panel Name *</Label>
        <Input id="panel-name" placeholder="e.g. CPU Usage" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="panel-desc">Description</Label>
        <Input id="panel-desc" placeholder="Optional" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="repeat-var">Repeat by Variable</Label>
        <Input id="repeat-var" placeholder="Select variable..." />
      </div>
    </div>
}`,...(V=(D=c.parameters)==null?void 0:D.docs)==null?void 0:V.source}}};const z=["Default","WithValue","Disabled","WithLabel","SearchInput","WithButton","FormGroup"];export{r as Default,t as Disabled,c as FormGroup,o as SearchInput,n as WithButton,l as WithLabel,s as WithValue,z as __namedExportsOrder,O as default};
