import{j as e}from"./index-vtBAwm1E.js";import{C as S,k as v,ao as a,h as y,aq as r}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const D={title:"Components/Loading States",parameters:{layout:"padded"}},l={render:()=>e.jsxs("div",{className:"flex items-center gap-8",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(r,{className:"h-4 w-4"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Small"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(r,{className:"h-6 w-6"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Default"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(r,{className:"h-10 w-10"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Large"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(r,{className:"h-6 w-6 text-primary"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Primary"})]})]})},n={render:()=>e.jsxs(S,{className:"w-full max-w-md",children:[e.jsxs(v,{children:[e.jsx(a,{className:"h-5 w-40"}),e.jsx(a,{className:"h-4 w-24 mt-1"})]}),e.jsx(y,{children:e.jsx(a,{className:"h-48 w-full"})})]})},t={render:()=>e.jsx("div",{className:"grid grid-cols-3 gap-4",children:Array.from({length:6}).map((c,s)=>e.jsxs(S,{children:[e.jsx(v,{children:e.jsx(a,{className:"h-4 w-32"})}),e.jsx(y,{children:e.jsx(a,{className:`w-full ${s%3===0?"h-32":"h-20"}`})})]},s))})},d={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"flex gap-4 px-3 py-2 bg-muted rounded",children:[120,80,60,80,60].map((c,s)=>e.jsx(a,{className:"h-4",style:{width:c}},s))}),Array.from({length:5}).map((c,s)=>e.jsx("div",{className:"flex gap-4 px-3 py-2",children:[120,80,60,80,60].map((C,k)=>e.jsx(a,{className:"h-4",style:{width:C}},k))},s))]})};var m,o,i;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-4 w-4" />
        <p className="text-xs text-muted-foreground">Small</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-6 w-6" />
        <p className="text-xs text-muted-foreground">Default</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-10 w-10" />
        <p className="text-xs text-muted-foreground">Large</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="h-6 w-6 text-primary" />
        <p className="text-xs text-muted-foreground">Primary</p>
      </div>
    </div>
}`,...(i=(o=l.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};var x,p,h;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <Card className="w-full max-w-md">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
}`,...(h=(p=n.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var N,f,u;t.parameters={...t.parameters,docs:{...(N=t.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-3 gap-4">
      {Array.from({
      length: 6
    }).map((_, i) => <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className={\`w-full \${i % 3 === 0 ? 'h-32' : 'h-20'}\`} />
          </CardContent>
        </Card>)}
    </div>
}`,...(u=(f=t.parameters)==null?void 0:f.docs)==null?void 0:u.source}}};var g,j,w;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <div className="flex gap-4 px-3 py-2 bg-muted rounded">
        {[120, 80, 60, 80, 60].map((w, i) => <Skeleton key={i} className="h-4" style={{
        width: w
      }} />)}
      </div>
      {Array.from({
      length: 5
    }).map((_, row) => <div key={row} className="flex gap-4 px-3 py-2">
          {[120, 80, 60, 80, 60].map((w, i) => <Skeleton key={i} className="h-4" style={{
        width: w
      }} />)}
        </div>)}
    </div>
}`,...(w=(j=d.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};const P=["Spinners","PanelSkeleton","DashboardGridSkeleton","TableSkeleton"];export{t as DashboardGridSkeleton,n as PanelSkeleton,l as Spinners,d as TableSkeleton,P as __namedExportsOrder,D as default};
