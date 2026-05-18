import{j as e}from"./index-vtBAwm1E.js";import{B as r}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const M={title:"Components/Badge",component:r,parameters:{layout:"centered"}},a={args:{children:"gauge",variant:"default"}},s={args:{children:"counter",variant:"secondary"}},n={args:{children:"error",variant:"destructive"}},t={args:{children:"histogram",variant:"outline"}},c={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(r,{variant:"default",children:"gauge"}),e.jsx(r,{variant:"secondary",children:"counter"}),e.jsx(r,{variant:"outline",children:"histogram"}),e.jsx(r,{variant:"destructive",children:"unknown"})]})},o={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(r,{className:"bg-green-500 hover:bg-green-600",children:"active"}),e.jsx(r,{className:"bg-yellow-500 hover:bg-yellow-600",children:"warning"}),e.jsx(r,{className:"bg-red-500 hover:bg-red-600",children:"critical"}),e.jsx(r,{variant:"secondary",children:"inactive"})]})};var d,i,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: 'gauge',
    variant: 'default'
  }
}`,...(g=(i=a.parameters)==null?void 0:i.docs)==null?void 0:g.source}}};var l,u,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    children: 'counter',
    variant: 'secondary'
  }
}`,...(m=(u=s.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var p,v,h;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: 'error',
    variant: 'destructive'
  }
}`,...(h=(v=n.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var x,B,f;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: 'histogram',
    variant: 'outline'
  }
}`,...(f=(B=t.parameters)==null?void 0:B.docs)==null?void 0:f.source}}};var y,b,j;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="default">gauge</Badge>
      <Badge variant="secondary">counter</Badge>
      <Badge variant="outline">histogram</Badge>
      <Badge variant="destructive">unknown</Badge>
    </div>
}`,...(j=(b=c.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};var w,N,S;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge className="bg-green-500 hover:bg-green-600">active</Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-600">warning</Badge>
      <Badge className="bg-red-500 hover:bg-red-600">critical</Badge>
      <Badge variant="secondary">inactive</Badge>
    </div>
}`,...(S=(N=o.parameters)==null?void 0:N.docs)==null?void 0:S.source}}};const T=["Default","Secondary","Destructive","Outline","MetricTypes","StatusBadges"];export{a as Default,n as Destructive,c as MetricTypes,t as Outline,s as Secondary,o as StatusBadges,T as __namedExportsOrder,M as default};
