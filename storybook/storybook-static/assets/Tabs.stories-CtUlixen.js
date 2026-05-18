import{j as e}from"./index-vtBAwm1E.js";import{aB as v,aD as C,aE as a,aC as s,C as i,k as d,l as c,h as o,W as t,U as n,g}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const y={title:"Components/Tabs",parameters:{layout:"centered"}},r={render:()=>e.jsxs(v,{defaultValue:"query",className:"w-[480px]",children:[e.jsxs(C,{className:"w-full",children:[e.jsx(a,{value:"query",className:"flex-1",children:"Query"}),e.jsx(a,{value:"visualization",className:"flex-1",children:"Visualization"}),e.jsx(a,{value:"settings",className:"flex-1",children:"Settings"})]}),e.jsx(s,{value:"query",children:e.jsxs(i,{children:[e.jsx(d,{children:e.jsx(c,{className:"text-sm",children:"Query Configuration"})}),e.jsxs(o,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{children:"PromQL Expression"}),e.jsx(n,{defaultValue:"rate(http_requests_total[5m])",className:"font-mono text-sm"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{children:"Legend"}),e.jsx(n,{defaultValue:"{{instance}}",placeholder:"Auto"})]}),e.jsx(g,{size:"sm",children:"Run Query"})]})]})}),e.jsx(s,{value:"visualization",children:e.jsxs(i,{children:[e.jsx(d,{children:e.jsx(c,{className:"text-sm",children:"Chart Settings"})}),e.jsx(o,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Chart type, axis, and legend options."})})]})}),e.jsx(s,{value:"settings",children:e.jsxs(i,{children:[e.jsx(d,{children:e.jsx(c,{className:"text-sm",children:"Panel Settings"})}),e.jsxs(o,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{children:"Panel Title"}),e.jsx(n,{defaultValue:"HTTP Request Rate"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{children:"Description"}),e.jsx(n,{placeholder:"Optional description..."})]})]})]})})]})},l={render:()=>e.jsxs(v,{defaultValue:"overview",className:"w-[400px]",children:[e.jsxs(C,{children:[e.jsx(a,{value:"overview",children:"Overview"}),e.jsx(a,{value:"details",children:"Details"}),e.jsx(a,{value:"history",children:"History"})]}),e.jsx(s,{value:"overview",className:"mt-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Overview content goes here."})}),e.jsx(s,{value:"details",className:"mt-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Detailed view with all fields."})}),e.jsx(s,{value:"history",className:"mt-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Change history timeline."})})]})};var u,m,x;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="query" className="w-[480px]">
      <TabsList className="w-full">
        <TabsTrigger value="query" className="flex-1">Query</TabsTrigger>
        <TabsTrigger value="visualization" className="flex-1">Visualization</TabsTrigger>
        <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="query">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Query Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>PromQL Expression</Label>
              <Input defaultValue="rate(http_requests_total[5m])" className="font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Legend</Label>
              <Input defaultValue="{{instance}}" placeholder="Auto" />
            </div>
            <Button size="sm">Run Query</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="visualization">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chart Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chart type, axis, and legend options.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Panel Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Panel Title</Label>
              <Input defaultValue="HTTP Request Rate" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Optional description..." />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
}`,...(x=(m=r.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};var p,T,h;l.parameters={...l.parameters,docs:{...(p=l.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <p className="text-sm text-muted-foreground">Overview content goes here.</p>
      </TabsContent>
      <TabsContent value="details" className="mt-4">
        <p className="text-sm text-muted-foreground">Detailed view with all fields.</p>
      </TabsContent>
      <TabsContent value="history" className="mt-4">
        <p className="text-sm text-muted-foreground">Change history timeline.</p>
      </TabsContent>
    </Tabs>
}`,...(h=(T=l.parameters)==null?void 0:T.docs)==null?void 0:h.source}}};const w=["PanelEditorTabs","BasicTabs"];export{l as BasicTabs,r as PanelEditorTabs,w as __namedExportsOrder,y as default};
