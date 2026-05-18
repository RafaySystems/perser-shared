import{j as e}from"./index-vtBAwm1E.js";import{bm as v,Z as x,$ as p,g as a,_ as u,ag as h,W as n,U as r,as as N}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]],j=v("settings-2",f),w={title:"Components/Popover",parameters:{layout:"centered"}},s={render:()=>e.jsxs(x,{children:[e.jsx(p,{asChild:!0,children:e.jsxs(a,{variant:"outline",size:"sm",children:[e.jsx(j,{className:"mr-2 h-4 w-4"}),"Filters"]})}),e.jsx(u,{className:"w-72",children:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-medium text-sm",children:"Display Options"}),e.jsx(h,{}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{className:"text-xs text-muted-foreground",children:"Min Y-Axis"}),e.jsx(r,{placeholder:"auto",className:"h-8 text-sm"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{className:"text-xs text-muted-foreground",children:"Max Y-Axis"}),e.jsx(r,{placeholder:"auto",className:"h-8 text-sm"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(n,{className:"text-sm",children:"Fill Opacity"}),e.jsx(N,{})]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(a,{variant:"outline",size:"sm",children:"Reset"}),e.jsx(a,{size:"sm",children:"Apply"})]})]})})]})},t={render:()=>e.jsxs(x,{children:[e.jsx(p,{asChild:!0,children:e.jsx(a,{variant:"ghost",size:"sm",children:"Panel Info ℹ"})}),e.jsx(u,{className:"w-80",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm",children:"HTTP Request Rate"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Shows the per-second rate of HTTP requests over the selected time range, grouped by status code."}),e.jsx(h,{}),e.jsxs("div",{className:"text-xs space-y-1",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-muted-foreground",children:"Datasource"}),e.jsx("span",{className:"font-mono",children:"prometheus-prod"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-muted-foreground",children:"Refresh"}),e.jsx("span",{children:"30s"})]})]})]})})]})};var o,i,c;s.parameters={...s.parameters,docs:{...(o=s.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Display Options</h4>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Min Y-Axis</Label>
            <Input placeholder="auto" className="h-8 text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Max Y-Axis</Label>
            <Input placeholder="auto" className="h-8 text-sm" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Fill Opacity</Label>
            <Switch />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Reset</Button>
            <Button size="sm">Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...(c=(i=s.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var l,d,m;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">Panel Info ℹ</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">HTTP Request Rate</h4>
          <p className="text-xs text-muted-foreground">
            Shows the per-second rate of HTTP requests over the selected time range, grouped by status code.
          </p>
          <Separator />
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Datasource</span>
              <span className="font-mono">prometheus-prod</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Refresh</span>
              <span>30s</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...(m=(d=t.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const T=["FilterOptions","PanelInfo"];export{s as FilterOptions,t as PanelInfo,T as __namedExportsOrder,w as default};
