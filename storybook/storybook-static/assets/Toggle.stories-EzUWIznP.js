import{j as e}from"./index-vtBAwm1E.js";import{bm as l,W as g,aG as i,aH as s,aF as c}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M17 12H7",key:"16if0g"}],["path",{d:"M19 18H5",key:"18s9l3"}],["path",{d:"M21 6H3",key:"1jwq7v"}]],G=l("align-center",b);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M15 12H3",key:"6jk70r"}],["path",{d:"M17 18H3",key:"1amg6g"}],["path",{d:"M21 6H3",key:"1jwq7v"}]],w=l("align-left",k);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M21 18H7",key:"1ygte8"}],["path",{d:"M21 6H3",key:"1jwq7v"}]],A=l("align-right",M);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",key:"mg9rjx"}]],L=l("bold",I);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["line",{x1:"19",x2:"10",y1:"4",y2:"4",key:"15jd3p"}],["line",{x1:"14",x2:"5",y1:"20",y2:"20",key:"bu0au3"}],["line",{x1:"15",x2:"9",y1:"4",y2:"20",key:"uljnxc"}]],_=l("italic",S);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M6 4v6a6 6 0 0 0 12 0V4",key:"9kb039"}],["line",{x1:"4",x2:"20",y1:"20",y2:"20",key:"nun2al"}]],V=l("underline",H),R={title:"Components/Toggle",parameters:{layout:"centered"}},r={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(c,{"aria-label":"Toggle bold",children:e.jsx(L,{className:"h-4 w-4"})}),e.jsx(c,{"aria-label":"Toggle italic",children:e.jsx(_,{className:"h-4 w-4"})}),e.jsx(c,{"aria-label":"Toggle underline",children:e.jsx(V,{className:"h-4 w-4"})})]})},o={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(g,{className:"text-xs text-muted-foreground",children:"Legend Position"}),e.jsxs(i,{type:"single",defaultValue:"left",children:[e.jsx(s,{value:"left","aria-label":"Align left",children:e.jsx(w,{className:"h-4 w-4"})}),e.jsx(s,{value:"center","aria-label":"Align center",children:e.jsx(G,{className:"h-4 w-4"})}),e.jsx(s,{value:"right","aria-label":"Align right",children:e.jsx(A,{className:"h-4 w-4"})})]})]})},t={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(g,{className:"text-xs text-muted-foreground",children:"Sort Order"}),e.jsx(i,{type:"single",defaultValue:"asc",className:"flex gap-1",children:["None","Asc","Desc"].map(a=>e.jsx(s,{value:a.toLowerCase(),className:"text-xs px-3",children:a},a))})]})},n={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(g,{className:"text-xs text-muted-foreground",children:"Stack Mode"}),e.jsx(i,{type:"single",defaultValue:"none",children:["none","100%","value"].map(a=>e.jsx(s,{value:a,className:"text-xs px-3",children:a},a))})]})};var d,m,p;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
}`,...(p=(m=r.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,x,h;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Legend Position</Label>
      <ToggleGroup type="single" defaultValue="left">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
}`,...(h=(x=o.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var N,y,T;t.parameters={...t.parameters,docs:{...(N=t.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Sort Order</Label>
      <ToggleGroup type="single" defaultValue="asc" className="flex gap-1">
        {['None', 'Asc', 'Desc'].map(mode => <ToggleGroupItem key={mode} value={mode.toLowerCase()} className="text-xs px-3">
            {mode}
          </ToggleGroupItem>)}
      </ToggleGroup>
    </div>
}`,...(T=(y=t.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var j,f,v;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Stack Mode</Label>
      <ToggleGroup type="single" defaultValue="none">
        {['none', '100%', 'value'].map(mode => <ToggleGroupItem key={mode} value={mode} className="text-xs px-3">
            {mode}
          </ToggleGroupItem>)}
      </ToggleGroup>
    </div>
}`,...(v=(f=n.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};const B=["SingleToggle","AlignmentGroup","SortModeGroup","StackModeGroup"];export{o as AlignmentGroup,r as SingleToggle,t as SortModeGroup,n as StackModeGroup,B as __namedExportsOrder,R as default};
