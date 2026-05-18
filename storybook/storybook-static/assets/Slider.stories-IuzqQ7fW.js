import{j as e}from"./index-vtBAwm1E.js";import{W as r,ap as n}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const y={title:"Components/Slider",parameters:{layout:"centered"}},s={render:()=>e.jsxs("div",{className:"space-y-3 w-64",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(r,{className:"text-sm",children:"Fill Opacity"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"20%"})]}),e.jsx(n,{defaultValue:[20],min:0,max:100,step:5})]})},a={render:()=>e.jsxs("div",{className:"space-y-3 w-64",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(r,{className:"text-sm",children:"Line Width"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"2px"})]}),e.jsx(n,{defaultValue:[2],min:1,max:10,step:1})]})},t={render:()=>e.jsxs("div",{className:"space-y-3 w-64",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(r,{className:"text-sm",children:"Point Radius"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"4px"})]}),e.jsx(n,{defaultValue:[4],min:1,max:20,step:1})]})};var i,d,l;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="space-y-3 w-64">
      <div className="flex justify-between">
        <Label className="text-sm">Fill Opacity</Label>
        <span className="text-sm text-muted-foreground">20%</span>
      </div>
      <Slider defaultValue={[20]} min={0} max={100} step={5} />
    </div>
}`,...(l=(d=s.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var m,c,o;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="space-y-3 w-64">
      <div className="flex justify-between">
        <Label className="text-sm">Line Width</Label>
        <span className="text-sm text-muted-foreground">2px</span>
      </div>
      <Slider defaultValue={[2]} min={1} max={10} step={1} />
    </div>
}`,...(o=(c=a.parameters)==null?void 0:c.docs)==null?void 0:o.source}}};var x,p,u;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="space-y-3 w-64">
      <div className="flex justify-between">
        <Label className="text-sm">Point Radius</Label>
        <span className="text-sm text-muted-foreground">4px</span>
      </div>
      <Slider defaultValue={[4]} min={1} max={20} step={1} />
    </div>
}`,...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};const h=["FillOpacity","LineWidth","PointRadius"];export{s as FillOpacity,a as LineWidth,t as PointRadius,h as __namedExportsOrder,y as default};
