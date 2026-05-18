import{j as e}from"./index-vtBAwm1E.js";import{aJ as n,aN as a,g,aK as l,aM as j}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import{I as b}from"./info-Dh8DXxG7.js";import"./index-Cj-fYYhT.js";const B={title:"Components/Tooltip",parameters:{layout:"centered"},decorators:[o=>e.jsx(j,{children:e.jsx(o,{})})]},t={render:()=>e.jsxs(n,{children:[e.jsx(a,{asChild:!0,children:e.jsx(g,{variant:"outline",children:"Hover me"})}),e.jsx(l,{children:e.jsx("p",{children:"Tooltip content here"})})]})},r={render:()=>e.jsxs(n,{children:[e.jsx(a,{asChild:!0,children:e.jsx("button",{className:"inline-flex items-center text-muted-foreground hover:text-foreground",children:e.jsx(b,{className:"h-4 w-4"})})}),e.jsx(l,{className:"max-w-xs",children:e.jsx("p",{className:"text-sm",children:"The step interval controls the resolution of the time series data. A smaller step produces more data points."})})]})},s={render:()=>e.jsx("div",{className:"flex gap-1",children:[{icon:"📊",label:"Add Panel"},{icon:"📁",label:"Add Group"},{icon:"⬇️",label:"Download JSON"},{icon:"✏️",label:"Edit Dashboard"}].map(o=>e.jsxs(n,{children:[e.jsx(a,{asChild:!0,children:e.jsx(g,{variant:"ghost",size:"icon",className:"h-8 w-8",children:e.jsx("span",{children:o.icon})})}),e.jsx(l,{children:e.jsx("p",{className:"text-xs",children:o.label})})]},o.label))})};var i,c,p;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip content here</p>
      </TooltipContent>
    </Tooltip>
}`,...(p=(c=t.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var d,m,h;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">
          The step interval controls the resolution of the time series data. A smaller step produces more data points.
        </p>
      </TooltipContent>
    </Tooltip>
}`,...(h=(m=r.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var x,T,u;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="flex gap-1">
      {[{
      icon: '📊',
      label: 'Add Panel'
    }, {
      icon: '📁',
      label: 'Add Group'
    }, {
      icon: '⬇️',
      label: 'Download JSON'
    }, {
      icon: '✏️',
      label: 'Edit Dashboard'
    }].map(item => <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span>{item.icon}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{item.label}</p>
          </TooltipContent>
        </Tooltip>)}
    </div>
}`,...(u=(T=s.parameters)==null?void 0:T.docs)==null?void 0:u.source}}};const I=["Basic","InfoIcon","ToolbarTooltips"];export{t as Basic,r as InfoIcon,s as ToolbarTooltips,I as __namedExportsOrder,B as default};
