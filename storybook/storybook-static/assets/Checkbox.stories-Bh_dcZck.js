import{j as e}from"./index-vtBAwm1E.js";import{s as r,W as s,ag as h}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const j={title:"Components/Checkbox",parameters:{layout:"centered"}},l={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(r,{id:"terms"}),e.jsx(s,{htmlFor:"terms",children:"Accept terms and conditions"})]})},d={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsx(s,{className:"text-sm font-medium",children:"Select Columns to Display"}),e.jsx(h,{}),[{id:"col-name",label:"Name",checked:!0},{id:"col-value",label:"Value",checked:!0},{id:"col-type",label:"Type",checked:!0},{id:"col-labels",label:"Labels",checked:!1},{id:"col-timestamp",label:"Timestamp",checked:!1}].map(a=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(r,{id:a.id,defaultChecked:a.checked}),e.jsx(s,{htmlFor:a.id,children:a.label})]},a.id))]})},c={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(r,{id:"enabled",defaultChecked:!0,disabled:!0}),e.jsx(s,{htmlFor:"enabled",className:"text-muted-foreground",children:"Enabled (managed by config)"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(r,{id:"disabled",disabled:!0}),e.jsx(s,{htmlFor:"disabled",className:"text-muted-foreground",children:"Disabled (managed by config)"})]})]})};var t,i,m;l.parameters={...l.parameters,docs:{...(t=l.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
}`,...(m=(i=l.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};var o,n,b;d.parameters={...d.parameters,docs:{...(o=d.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
      <Label className="text-sm font-medium">Select Columns to Display</Label>
      <Separator />
      {[{
      id: 'col-name',
      label: 'Name',
      checked: true
    }, {
      id: 'col-value',
      label: 'Value',
      checked: true
    }, {
      id: 'col-type',
      label: 'Type',
      checked: true
    }, {
      id: 'col-labels',
      label: 'Labels',
      checked: false
    }, {
      id: 'col-timestamp',
      label: 'Timestamp',
      checked: false
    }].map(col => <div key={col.id} className="flex items-center space-x-2">
          <Checkbox id={col.id} defaultChecked={col.checked} />
          <Label htmlFor={col.id}>{col.label}</Label>
        </div>)}
    </div>
}`,...(b=(n=d.parameters)==null?void 0:n.docs)==null?void 0:b.source}}};var p,x,u;c.parameters={...c.parameters,docs:{...(p=c.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="enabled" defaultChecked disabled />
        <Label htmlFor="enabled" className="text-muted-foreground">Enabled (managed by config)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" className="text-muted-foreground">Disabled (managed by config)</Label>
      </div>
    </div>
}`,...(u=(x=c.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};const g=["Basic","MultiSelect","Disabled"];export{l as Basic,c as Disabled,d as MultiSelect,g as __namedExportsOrder,j as default};
