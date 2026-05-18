import{j as e}from"./index-vtBAwm1E.js";import{as as d,W as i,ag as b}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const g={title:"Components/Switch",parameters:{layout:"centered"}},s={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(d,{id:"airplane-mode"}),e.jsx(i,{htmlFor:"airplane-mode",children:"Airplane Mode"})]})},l={render:()=>e.jsxs("div",{className:"space-y-4 w-72",children:[e.jsx("h3",{className:"font-medium text-sm",children:"Display Settings"}),e.jsx(b,{}),[{id:"show-legend",label:"Show Legend",defaultChecked:!0},{id:"show-tooltip",label:"Show Tooltip",defaultChecked:!0},{id:"show-points",label:"Show Data Points",defaultChecked:!1},{id:"connect-nulls",label:"Connect Null Values",defaultChecked:!1},{id:"fill-opacity",label:"Fill Area Under Line",defaultChecked:!1}].map(a=>e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(i,{htmlFor:a.id,className:"cursor-pointer",children:a.label}),e.jsx(d,{id:a.id,defaultChecked:a.defaultChecked})]},a.id))]})},t={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(d,{id:"disabled-switch",disabled:!0,defaultChecked:!0}),e.jsx(i,{htmlFor:"disabled-switch",className:"text-muted-foreground",children:"Managed by config"})]})};var r,c,o;s.parameters={...s.parameters,docs:{...(r=s.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
}`,...(o=(c=s.parameters)==null?void 0:c.docs)==null?void 0:o.source}}};var n,m,h;l.parameters={...l.parameters,docs:{...(n=l.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-72">
      <h3 className="font-medium text-sm">Display Settings</h3>
      <Separator />
      {[{
      id: 'show-legend',
      label: 'Show Legend',
      defaultChecked: true
    }, {
      id: 'show-tooltip',
      label: 'Show Tooltip',
      defaultChecked: true
    }, {
      id: 'show-points',
      label: 'Show Data Points',
      defaultChecked: false
    }, {
      id: 'connect-nulls',
      label: 'Connect Null Values',
      defaultChecked: false
    }, {
      id: 'fill-opacity',
      label: 'Fill Area Under Line',
      defaultChecked: false
    }].map(item => <div key={item.id} className="flex items-center justify-between">
          <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
          <Switch id={item.id} defaultChecked={item.defaultChecked} />
        </div>)}
    </div>
}`,...(h=(m=l.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var u,p,f;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <Switch id="disabled-switch" disabled defaultChecked />
      <Label htmlFor="disabled-switch" className="text-muted-foreground">Managed by config</Label>
    </div>
}`,...(f=(p=t.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};const k=["Basic","PanelSettings","Disabled"];export{s as Basic,t as Disabled,l as PanelSettings,k as __namedExportsOrder,g as default};
