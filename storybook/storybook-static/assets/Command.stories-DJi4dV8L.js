import{j as e}from"./index-vtBAwm1E.js";import{r as i}from"./index-DAV8Sz2w.js";import{bm as k,Z as S,$ as L,g as I,_ as E,v as f,y as w,D as P,w as N,x as d,z as p,r as h,a$ as y,E as O,B as T}from"./theme-C7aKG9bo.js";import"./index-Cj-fYYhT.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]],B=k("chevrons-up-down",U),V={title:"Components/Command (Combobox)",parameters:{layout:"centered"}},l=[{value:"prometheus-prod",label:"prometheus-prod",type:"Prometheus"},{value:"prometheus-staging",label:"prometheus-staging",type:"Prometheus"},{value:"loki-prod",label:"loki-prod",type:"Loki"},{value:"loki-dev",label:"loki-dev",type:"Loki"},{value:"tempo-prod",label:"tempo-prod",type:"Tempo"}],t={render:()=>{var u;const[o,n]=i.useState(!1),[s,c]=i.useState("prometheus-prod");return e.jsxs(S,{open:o,onOpenChange:n,children:[e.jsx(L,{asChild:!0,children:e.jsxs(I,{variant:"outline",role:"combobox","aria-expanded":o,className:"w-64 justify-between",children:[s?(u=l.find(a=>a.value===s))==null?void 0:u.label:"Select datasource...",e.jsx(B,{className:"ml-2 h-4 w-4 shrink-0 opacity-50"})]})}),e.jsx(E,{className:"w-64 p-0",children:e.jsxs(f,{children:[e.jsx(w,{placeholder:"Search datasources..."}),e.jsxs(P,{children:[e.jsx(N,{children:"No datasource found."}),e.jsx(d,{label:"Prometheus",children:l.filter(a=>a.type==="Prometheus").map(a=>e.jsxs(p,{value:a.value,onSelect:m=>{c(m),n(!1)},children:[e.jsx(h,{className:y("mr-2 h-4 w-4",s===a.value?"opacity-100":"opacity-0")}),a.label]},a.value))}),e.jsx(O,{}),e.jsx(d,{label:"Loki",children:l.filter(a=>a.type==="Loki").map(a=>e.jsxs(p,{value:a.value,onSelect:m=>{c(m),n(!1)},children:[e.jsx(h,{className:y("mr-2 h-4 w-4",s===a.value?"opacity-100":"opacity-0")}),a.label]},a.value))})]})]})})]})}},r={render:()=>e.jsxs(f,{className:"rounded-lg border shadow-md w-80",children:[e.jsx(w,{placeholder:"Search panels..."}),e.jsxs(P,{children:[e.jsx(N,{children:"No panel found."}),e.jsx(d,{heading:"Panels",children:[{name:"CPU Usage",type:"gauge"},{name:"Memory Usage",type:"gauge"},{name:"HTTP Requests",type:"timeseries"},{name:"Error Rate",type:"timeseries"},{name:"Latency P99",type:"stat"}].map(o=>e.jsxs(p,{className:"flex items-center justify-between",children:[o.name,e.jsx(T,{variant:"secondary",className:"text-xs",children:o.type})]},o.name))})]})]})};var C,v,x;t.parameters={...t.parameters,docs:{...(C=t.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('prometheus-prod');
    return <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-64 justify-between">
            {value ? datasources.find(d => d.value === value)?.label : 'Select datasource...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search datasources..." />
            <CommandList>
              <CommandEmpty>No datasource found.</CommandEmpty>
              <CommandGroup label="Prometheus">
                {datasources.filter(d => d.type === 'Prometheus').map(d => <CommandItem key={d.value} value={d.value} onSelect={current => {
                setValue(current);
                setOpen(false);
              }}>
                      <Check className={cn('mr-2 h-4 w-4', value === d.value ? 'opacity-100' : 'opacity-0')} />
                      {d.label}
                    </CommandItem>)}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup label="Loki">
                {datasources.filter(d => d.type === 'Loki').map(d => <CommandItem key={d.value} value={d.value} onSelect={current => {
                setValue(current);
                setOpen(false);
              }}>
                      <Check className={cn('mr-2 h-4 w-4', value === d.value ? 'opacity-100' : 'opacity-0')} />
                      {d.label}
                    </CommandItem>)}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>;
  }
}`,...(x=(v=t.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var g,b,j;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <Command className="rounded-lg border shadow-md w-80">
      <CommandInput placeholder="Search panels..." />
      <CommandList>
        <CommandEmpty>No panel found.</CommandEmpty>
        <CommandGroup heading="Panels">
          {[{
          name: 'CPU Usage',
          type: 'gauge'
        }, {
          name: 'Memory Usage',
          type: 'gauge'
        }, {
          name: 'HTTP Requests',
          type: 'timeseries'
        }, {
          name: 'Error Rate',
          type: 'timeseries'
        }, {
          name: 'Latency P99',
          type: 'stat'
        }].map(p => <CommandItem key={p.name} className="flex items-center justify-between">
              {p.name}
              <Badge variant="secondary" className="text-xs">{p.type}</Badge>
            </CommandItem>)}
        </CommandGroup>
      </CommandList>
    </Command>
}`,...(j=(b=r.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};const q=["DatasourceCombobox","InlineSearch"];export{t as DatasourceCombobox,r as InlineSearch,q as __namedExportsOrder,V as default};
