import{j as e}from"./index-vtBAwm1E.js";import{W as t,a1 as n,a2 as u}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const h={title:"Components/RadioGroup",parameters:{layout:"centered"}},s={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsx(t,{className:"text-sm font-medium",children:"Panel Type"}),e.jsx(n,{defaultValue:"time-series",children:[{value:"time-series",label:"Time Series",desc:"Line, bar, or area chart over time"},{value:"stat",label:"Stat",desc:"Single value with optional sparkline"},{value:"gauge",label:"Gauge",desc:"Radial gauge with threshold colors"},{value:"table",label:"Table",desc:"Tabular data with sorting and filtering"}].map(a=>e.jsxs("div",{className:"flex items-start space-x-3",children:[e.jsx(u,{value:a.value,id:`type-${a.value}`,className:"mt-0.5"}),e.jsxs("label",{htmlFor:`type-${a.value}`,className:"cursor-pointer",children:[e.jsx("p",{className:"text-sm font-medium",children:a.label}),e.jsx("p",{className:"text-xs text-muted-foreground",children:a.desc})]})]},a.value))})]})},l={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{className:"text-sm font-medium",children:"Legend Placement"}),e.jsx(n,{defaultValue:"bottom",className:"flex gap-6",children:["Bottom","Right","Hidden"].map(a=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(u,{value:a.toLowerCase(),id:`pos-${a}`}),e.jsx(t,{htmlFor:`pos-${a}`,children:a})]},a))})]})};var r,i,o;s.parameters={...s.parameters,docs:{...(r=s.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
      <Label className="text-sm font-medium">Panel Type</Label>
      <RadioGroup defaultValue="time-series">
        {[{
        value: 'time-series',
        label: 'Time Series',
        desc: 'Line, bar, or area chart over time'
      }, {
        value: 'stat',
        label: 'Stat',
        desc: 'Single value with optional sparkline'
      }, {
        value: 'gauge',
        label: 'Gauge',
        desc: 'Radial gauge with threshold colors'
      }, {
        value: 'table',
        label: 'Table',
        desc: 'Tabular data with sorting and filtering'
      }].map(item => <div key={item.value} className="flex items-start space-x-3">
            <RadioGroupItem value={item.value} id={\`type-\${item.value}\`} className="mt-0.5" />
            <label htmlFor={\`type-\${item.value}\`} className="cursor-pointer">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </label>
          </div>)}
      </RadioGroup>
    </div>
}`,...(o=(i=s.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var m,d,c;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <Label className="text-sm font-medium">Legend Placement</Label>
      <RadioGroup defaultValue="bottom" className="flex gap-6">
        {['Bottom', 'Right', 'Hidden'].map(pos => <div key={pos} className="flex items-center space-x-2">
            <RadioGroupItem value={pos.toLowerCase()} id={\`pos-\${pos}\`} />
            <Label htmlFor={\`pos-\${pos}\`}>{pos}</Label>
          </div>)}
      </RadioGroup>
    </div>
}`,...(c=(d=l.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const g=["PanelType","LegendPlacement"];export{l as LegendPlacement,s as PanelType,g as __namedExportsOrder,h as default};
