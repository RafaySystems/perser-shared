import{j as e}from"./index-vtBAwm1E.js";import{C as n,k as d,l as f,i as j,h as l,B as N,j as v,g as b}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const T={title:"Components/Card",parameters:{layout:"centered"}},s={render:()=>e.jsxs(n,{className:"w-80",children:[e.jsxs(d,{children:[e.jsx(f,{children:"Panel Title"}),e.jsx(j,{children:"Time series data from the last 6 hours"})]}),e.jsx(l,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Chart content would render here."})})]})},r={render:()=>e.jsxs(n,{className:"w-80",children:[e.jsx(d,{children:e.jsx(f,{children:"Dashboard Summary"})}),e.jsxs(l,{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Panels"}),e.jsx("span",{className:"font-medium",children:"12"})]}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Variables"}),e.jsx("span",{className:"font-medium",children:"5"})]}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Datasources"}),e.jsx("span",{className:"font-medium",children:"3"})]})]}),e.jsx(v,{children:e.jsx(b,{variant:"outline",className:"w-full",children:"Edit Dashboard"})})]})},t={render:()=>e.jsx("div",{className:"grid grid-cols-3 gap-4",children:[{label:"Total Requests",value:"1.2M",trend:"+12%",status:"success"},{label:"Error Rate",value:"0.04%",trend:"+0.01%",status:"warning"},{label:"Latency p99",value:"142ms",trend:"-8ms",status:"default"}].map(a=>e.jsxs(n,{children:[e.jsx(d,{className:"pb-2",children:e.jsx(j,{children:a.label})}),e.jsxs(l,{children:[e.jsx("div",{className:"text-2xl font-bold",children:a.value}),e.jsx(N,{variant:a.status==="success"?"default":a.status==="warning"?"destructive":"secondary",className:"mt-1 text-xs",children:a.trend})]})]},a.label))})};var c,i,o;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <Card className="w-80">
      <CardHeader>
        <CardTitle>Panel Title</CardTitle>
        <CardDescription>Time series data from the last 6 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Chart content would render here.</p>
      </CardContent>
    </Card>
}`,...(o=(i=s.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var m,u,x;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <Card className="w-80">
      <CardHeader>
        <CardTitle>Dashboard Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Panels</span>
          <span className="font-medium">12</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Variables</span>
          <span className="font-medium">5</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Datasources</span>
          <span className="font-medium">3</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Edit Dashboard</Button>
      </CardFooter>
    </Card>
}`,...(x=(u=r.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var p,C,h;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-3 gap-4">
      {[{
      label: 'Total Requests',
      value: '1.2M',
      trend: '+12%',
      status: 'success'
    }, {
      label: 'Error Rate',
      value: '0.04%',
      trend: '+0.01%',
      status: 'warning'
    }, {
      label: 'Latency p99',
      value: '142ms',
      trend: '-8ms',
      status: 'default'
    }].map(item => <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardDescription>{item.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <Badge variant={item.status === 'success' ? 'default' : item.status === 'warning' ? 'destructive' : 'secondary'} className="mt-1 text-xs">
              {item.trend}
            </Badge>
          </CardContent>
        </Card>)}
    </div>
}`,...(h=(C=t.parameters)==null?void 0:C.docs)==null?void 0:h.source}}};const B=["Basic","WithFooter","StatusCards"];export{s as Basic,t as StatusCards,r as WithFooter,B as __namedExportsOrder,T as default};
