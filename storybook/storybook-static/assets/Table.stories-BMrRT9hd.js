import{j as e}from"./index-vtBAwm1E.js";import{au as T,az as x,aA as n,ay as l,av as u,ax as s,aw as p,B as h}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import"./index-Cj-fYYhT.js";const f={title:"Components/Table",parameters:{layout:"padded"}},g=[{name:"cpu_usage_percent",type:"gauge",labels:4,status:"active",lastSeen:"5s ago"},{name:"http_requests_total",type:"counter",labels:6,status:"active",lastSeen:"1s ago"},{name:"memory_bytes",type:"gauge",labels:3,status:"active",lastSeen:"10s ago"},{name:"disk_io_bytes",type:"counter",labels:5,status:"stale",lastSeen:"2m ago"},{name:"network_packets",type:"counter",labels:4,status:"stale",lastSeen:"5m ago"}],t={render:()=>e.jsxs(T,{children:[e.jsx(p,{children:"Active metrics from the last scrape"}),e.jsx(x,{children:e.jsxs(n,{children:[e.jsx(l,{children:"Metric Name"}),e.jsx(l,{children:"Type"}),e.jsx(l,{className:"text-right",children:"Labels"}),e.jsx(l,{children:"Status"}),e.jsx(l,{className:"text-right",children:"Last Seen"})]})}),e.jsx(u,{children:g.map(a=>e.jsxs(n,{children:[e.jsx(s,{className:"font-mono text-sm",children:a.name}),e.jsx(s,{children:e.jsx(h,{variant:a.type==="counter"?"default":"secondary",className:"text-xs",children:a.type})}),e.jsx(s,{className:"text-right",children:a.labels}),e.jsxs(s,{children:[e.jsx("span",{className:`inline-flex h-2 w-2 rounded-full mr-2 ${a.status==="active"?"bg-green-500":"bg-yellow-500"}`}),a.status]}),e.jsx(s,{className:"text-right text-muted-foreground",children:a.lastSeen})]},a.name))})]})},r={render:()=>e.jsxs(T,{children:[e.jsx(x,{children:e.jsxs(n,{children:[e.jsx(l,{children:"Name"}),e.jsx(l,{children:"Value"}),e.jsx(l,{children:"Timestamp"})]})}),e.jsx(u,{children:e.jsx(n,{children:e.jsx(s,{colSpan:3,className:"h-24 text-center text-muted-foreground",children:"No results found."})})})]})};var d,c,o;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <Table>
      <TableCaption>Active metrics from the last scrape</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Metric Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Labels</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Last Seen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map(m => <TableRow key={m.name}>
            <TableCell className="font-mono text-sm">{m.name}</TableCell>
            <TableCell>
              <Badge variant={m.type === 'counter' ? 'default' : 'secondary'} className="text-xs">
                {m.type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{m.labels}</TableCell>
            <TableCell>
              <span className={\`inline-flex h-2 w-2 rounded-full mr-2 \${m.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}\`} />
              {m.status}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">{m.lastSeen}</TableCell>
          </TableRow>)}
      </TableBody>
    </Table>
}`,...(o=(c=t.parameters)==null?void 0:c.docs)==null?void 0:o.source}}};var m,b,i;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...(i=(b=r.parameters)==null?void 0:b.docs)==null?void 0:i.source}}};const C=["MetricsTable","EmptyState"];export{r as EmptyState,t as MetricsTable,C as __namedExportsOrder,f as default};
