import{j as e}from"./index-vtBAwm1E.js";import{g as a,C as n,k as c,i as w,h as i,d as T,f as D,e as L,l as R,ao as P,W as t,U as A,a9 as B,ae as E,af as q,aa as H,ac as m,as as x,ag as I}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import{S as z}from"./square-pen-DURmroqu.js";import{D as F}from"./download-IlNOuvf1.js";import{S as _}from"./settings-BQ3POwe9.js";import{C as U}from"./circle-alert-C395UdkY.js";import"./index-Cj-fYYhT.js";const K={title:"Design System/Theme Showcase",parameters:{layout:"padded"}},r={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Color Tokens"}),e.jsx("div",{className:"grid grid-cols-4 gap-3",children:[["background","bg-background border"],["foreground","bg-foreground"],["primary","bg-primary"],["primary-foreground","bg-primary-foreground border"],["secondary","bg-secondary"],["secondary-foreground","bg-secondary-foreground border"],["muted","bg-muted"],["muted-foreground","bg-muted-foreground"],["accent","bg-accent"],["destructive","bg-destructive"],["border","bg-border"],["card","bg-card border"]].map(([s,k])=>e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:`h-10 rounded-md ${k}`}),e.jsx("p",{className:"text-xs text-muted-foreground",children:s})]},s))})]})},d={render:()=>e.jsxs("div",{className:"space-y-4 max-w-lg",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Typography Scale"}),e.jsx(I,{}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-1",children:"h1 / text-2xl font-semibold"}),e.jsx("h1",{className:"text-2xl font-semibold",children:"Dashboard Overview"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-1",children:"h2 / text-xl font-semibold"}),e.jsx("h2",{className:"text-xl font-semibold",children:"Panel Configuration"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-1",children:"h3 / text-base font-semibold"}),e.jsx("h3",{className:"text-base font-semibold",children:"Query Settings"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-1",children:"body1 / text-sm"}),e.jsx("p",{className:"text-sm",children:"Default body text for descriptions and labels."})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-1",children:"body2 / text-xs"}),e.jsx("p",{className:"text-xs",children:"Smaller text for captions and metadata."})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-1",children:"muted"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Muted text for secondary information."})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-1",children:"mono / font-mono"}),e.jsx("p",{className:"font-mono text-sm",children:"rate(http_requests_total[5m])"})]})]})]})},l={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 bg-card border rounded-lg",children:[e.jsx("h1",{className:"text-xl font-semibold",children:"Production Dashboard"}),e.jsxs("div",{className:"ml-auto flex items-center gap-2",children:[e.jsxs(a,{variant:"outline",size:"sm",children:[e.jsx(z,{className:"h-4 w-4 mr-2"}),"Edit"]}),e.jsx(a,{variant:"ghost",size:"icon",children:e.jsx(F,{className:"h-4 w-4"})}),e.jsx(a,{variant:"ghost",size:"icon",children:e.jsx(_,{className:"h-4 w-4"})})]})]}),e.jsx("div",{className:"grid grid-cols-4 gap-4",children:[{label:"Request Rate",value:"1.2k/s",change:"+5%",ok:!0},{label:"Error Rate",value:"0.04%",change:"+0.01%",ok:!1},{label:"Latency p50",value:"12ms",change:"-2ms",ok:!0},{label:"Latency p99",value:"142ms",change:"+8ms",ok:!1}].map(s=>e.jsxs(n,{children:[e.jsx(c,{className:"pb-1",children:e.jsx(w,{className:"text-xs",children:s.label})}),e.jsxs(i,{children:[e.jsx("p",{className:"text-2xl font-bold",children:s.value}),e.jsx("p",{className:`text-xs mt-1 ${s.ok?"text-green-600":"text-red-500"}`,children:s.change})]})]},s.label))}),e.jsxs(T,{variant:"destructive",children:[e.jsx(U,{className:"h-4 w-4"}),e.jsx(D,{children:"Query Error"}),e.jsx(L,{children:'Failed to load data for "Error Rate" panel. Retrying...'})]}),e.jsxs(n,{children:[e.jsx(c,{children:e.jsx(R,{className:"text-sm",children:"HTTP Request Rate"})}),e.jsx(i,{children:e.jsx(P,{className:"h-48 w-full"})})]})]})},o={render:()=>e.jsxs("div",{className:"max-w-sm space-y-6",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Form Controls"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{children:"Panel Name"}),e.jsx(A,{placeholder:"e.g. CPU Usage"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{children:"Datasource"}),e.jsxs(B,{defaultValue:"prometheus",children:[e.jsx(E,{children:e.jsx(q,{})}),e.jsxs(H,{children:[e.jsx(m,{value:"prometheus",children:"prometheus-prod"}),e.jsx(m,{value:"loki",children:"loki-prod"})]})]})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(t,{children:"Show Legend"}),e.jsx(x,{defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(t,{children:"Stack Series"}),e.jsx(x,{})]})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(a,{variant:"outline",children:"Cancel"}),e.jsx(a,{children:"Save"})]})]})};var u,p,h;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <h2 className="text-lg font-semibold">Color Tokens</h2>
      <div className="grid grid-cols-4 gap-3">
        {[['background', 'bg-background border'], ['foreground', 'bg-foreground'], ['primary', 'bg-primary'], ['primary-foreground', 'bg-primary-foreground border'], ['secondary', 'bg-secondary'], ['secondary-foreground', 'bg-secondary-foreground border'], ['muted', 'bg-muted'], ['muted-foreground', 'bg-muted-foreground'], ['accent', 'bg-accent'], ['destructive', 'bg-destructive'], ['border', 'bg-border'], ['card', 'bg-card border']].map(([name, cls]) => <div key={name} className="space-y-1">
            <div className={\`h-10 rounded-md \${cls}\`} />
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>)}
      </div>
    </div>
}`,...(h=(p=r.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var g,b,f;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold">Typography Scale</h2>
      <Separator />
      <div className="space-y-3">
        <div><p className="text-xs text-muted-foreground mb-1">h1 / text-2xl font-semibold</p><h1 className="text-2xl font-semibold">Dashboard Overview</h1></div>
        <div><p className="text-xs text-muted-foreground mb-1">h2 / text-xl font-semibold</p><h2 className="text-xl font-semibold">Panel Configuration</h2></div>
        <div><p className="text-xs text-muted-foreground mb-1">h3 / text-base font-semibold</p><h3 className="text-base font-semibold">Query Settings</h3></div>
        <div><p className="text-xs text-muted-foreground mb-1">body1 / text-sm</p><p className="text-sm">Default body text for descriptions and labels.</p></div>
        <div><p className="text-xs text-muted-foreground mb-1">body2 / text-xs</p><p className="text-xs">Smaller text for captions and metadata.</p></div>
        <div><p className="text-xs text-muted-foreground mb-1">muted</p><p className="text-sm text-muted-foreground">Muted text for secondary information.</p></div>
        <div><p className="text-xs text-muted-foreground mb-1">mono / font-mono</p><p className="font-mono text-sm">rate(http_requests_total[5m])</p></div>
      </div>
    </div>
}`,...(f=(b=d.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var v,N,j;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-lg">
        <h1 className="text-xl font-semibold">Production Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-4 gap-4">
        {[{
        label: 'Request Rate',
        value: '1.2k/s',
        change: '+5%',
        ok: true
      }, {
        label: 'Error Rate',
        value: '0.04%',
        change: '+0.01%',
        ok: false
      }, {
        label: 'Latency p50',
        value: '12ms',
        change: '-2ms',
        ok: true
      }, {
        label: 'Latency p99',
        value: '142ms',
        change: '+8ms',
        ok: false
      }].map(s => <Card key={s.label}>
            <CardHeader className="pb-1">
              <CardDescription className="text-xs">{s.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className={\`text-xs mt-1 \${s.ok ? 'text-green-600' : 'text-red-500'}\`}>{s.change}</p>
            </CardContent>
          </Card>)}
      </div>

      {/* Alert */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Query Error</AlertTitle>
        <AlertDescription>Failed to load data for &quot;Error Rate&quot; panel. Retrying...</AlertDescription>
      </Alert>

      {/* Panel skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">HTTP Request Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
}`,...(j=(N=l.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};var y,C,S;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="max-w-sm space-y-6">
      <h2 className="text-lg font-semibold">Form Controls</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Panel Name</Label>
          <Input placeholder="e.g. CPU Usage" />
        </div>
        <div className="space-y-2">
          <Label>Datasource</Label>
          <Select defaultValue="prometheus">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prometheus">prometheus-prod</SelectItem>
              <SelectItem value="loki">loki-prod</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label>Show Legend</Label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label>Stack Series</Label>
          <Switch />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
}`,...(S=(C=o.parameters)==null?void 0:C.docs)==null?void 0:S.source}}};const X=["ColorPalette","Typography","DashboardLayout","FormComponents"];export{r as ColorPalette,l as DashboardLayout,o as FormComponents,d as Typography,X as __namedExportsOrder,K as default};
