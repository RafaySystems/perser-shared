import{j as e}from"./index-vtBAwm1E.js";import{W as n,a9 as i,ae as o,af as d,aa as u,ab as r,ad as c,ac as t}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const f={title:"Components/Select",parameters:{layout:"centered"}},l={render:()=>e.jsxs("div",{className:"space-y-2 w-60",children:[e.jsx(n,{children:"Time Range"}),e.jsxs(i,{defaultValue:"1h",children:[e.jsx(o,{children:e.jsx(d,{placeholder:"Select time range"})}),e.jsx(u,{children:e.jsxs(r,{children:[e.jsx(c,{children:"Quick Ranges"}),e.jsx(t,{value:"5m",children:"Last 5 minutes"}),e.jsx(t,{value:"15m",children:"Last 15 minutes"}),e.jsx(t,{value:"1h",children:"Last 1 hour"}),e.jsx(t,{value:"6h",children:"Last 6 hours"}),e.jsx(t,{value:"24h",children:"Last 24 hours"}),e.jsx(t,{value:"7d",children:"Last 7 days"})]})})]})]})},s={render:()=>e.jsxs("div",{className:"space-y-2 w-72",children:[e.jsx(n,{children:"Datasource"}),e.jsxs(i,{defaultValue:"prometheus-prod",children:[e.jsx(o,{children:e.jsx(d,{placeholder:"Select datasource"})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(c,{children:"Prometheus"}),e.jsx(t,{value:"prometheus-prod",children:"prometheus-prod"}),e.jsx(t,{value:"prometheus-staging",children:"prometheus-staging"})]}),e.jsxs(r,{children:[e.jsx(c,{children:"Loki"}),e.jsx(t,{value:"loki-prod",children:"loki-prod"})]})]})]})]})},a={render:()=>e.jsxs("div",{className:"space-y-2 w-60",children:[e.jsx(n,{children:"Panel Type"}),e.jsxs(i,{disabled:!0,defaultValue:"timeseries",children:[e.jsx(o,{children:e.jsx(d,{})}),e.jsx(u,{children:e.jsx(t,{value:"timeseries",children:"Time Series"})})]})]})};var m,S,h;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-60">
      <Label>Time Range</Label>
      <Select defaultValue="1h">
        <SelectTrigger>
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Quick Ranges</SelectLabel>
            <SelectItem value="5m">Last 5 minutes</SelectItem>
            <SelectItem value="15m">Last 15 minutes</SelectItem>
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="6h">Last 6 hours</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
}`,...(h=(S=l.parameters)==null?void 0:S.docs)==null?void 0:h.source}}};var p,x,j;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-72">
      <Label>Datasource</Label>
      <Select defaultValue="prometheus-prod">
        <SelectTrigger>
          <SelectValue placeholder="Select datasource" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Prometheus</SelectLabel>
            <SelectItem value="prometheus-prod">prometheus-prod</SelectItem>
            <SelectItem value="prometheus-staging">prometheus-staging</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Loki</SelectLabel>
            <SelectItem value="loki-prod">loki-prod</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
}`,...(j=(x=s.parameters)==null?void 0:x.docs)==null?void 0:j.source}}};var g,v,L;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-60">
      <Label>Panel Type</Label>
      <Select disabled defaultValue="timeseries">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="timeseries">Time Series</SelectItem>
        </SelectContent>
      </Select>
    </div>
}`,...(L=(v=a.parameters)==null?void 0:v.docs)==null?void 0:L.source}}};const V=["TimeRange","Datasource","Disabled"];export{s as Datasource,a as Disabled,l as TimeRange,V as __namedExportsOrder,f as default};
