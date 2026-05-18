import{j as n}from"./index-vtBAwm1E.js";import{J as m,Q as i,g as l,K as D,L as w,M as e,O as s,N as h,P as M,aO as x}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import{E as j,C as N,S}from"./share-2-BvLs77GO.js";import{S as I}from"./square-pen-DURmroqu.js";import{D as v}from"./download-IlNOuvf1.js";import"./index-Cj-fYYhT.js";const T={title:"Components/DropdownMenu",parameters:{layout:"centered"}},o={render:()=>n.jsxs(m,{children:[n.jsx(i,{asChild:!0,children:n.jsx(l,{variant:"ghost",size:"icon",children:n.jsx(j,{className:"h-4 w-4"})})}),n.jsxs(D,{className:"w-48",children:[n.jsx(h,{children:"Panel Actions"}),n.jsx(s,{}),n.jsxs(w,{children:[n.jsxs(e,{children:[n.jsx(I,{className:"mr-2 h-4 w-4"}),"Edit Panel"]}),n.jsxs(e,{children:[n.jsx(N,{className:"mr-2 h-4 w-4"}),"Duplicate",n.jsx(M,{children:"⌘D"})]}),n.jsxs(e,{children:[n.jsx(v,{className:"mr-2 h-4 w-4"}),"Export Data"]}),n.jsxs(e,{children:[n.jsx(S,{className:"mr-2 h-4 w-4"}),"Share Link"]})]}),n.jsx(s,{}),n.jsxs(e,{className:"text-destructive focus:text-destructive",children:[n.jsx(x,{className:"mr-2 h-4 w-4"}),"Remove Panel"]})]})]})},r={render:()=>n.jsxs(m,{children:[n.jsx(i,{asChild:!0,children:n.jsx(l,{variant:"outline",children:"Dashboard Options ▾"})}),n.jsxs(D,{className:"w-56",children:[n.jsxs(w,{children:[n.jsx(e,{children:"Save Dashboard"}),n.jsx(e,{children:"Save as Copy"}),n.jsx(e,{children:"Import JSON"}),n.jsx(e,{children:"Export JSON"})]}),n.jsx(s,{}),n.jsx(e,{className:"text-destructive focus:text-destructive",children:"Delete Dashboard"})]})]})};var a,t,d;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Panel Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit Panel
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            Share Link
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Remove Panel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
}`,...(d=(t=o.parameters)==null?void 0:t.docs)==null?void 0:d.source}}};var p,u,c;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Dashboard Options ▾</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>Save Dashboard</DropdownMenuItem>
          <DropdownMenuItem>Save as Copy</DropdownMenuItem>
          <DropdownMenuItem>Import JSON</DropdownMenuItem>
          <DropdownMenuItem>Export JSON</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          Delete Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
}`,...(c=(u=r.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};const L=["PanelActions","DashboardMenu"];export{r as DashboardMenu,o as PanelActions,L as __namedExportsOrder,T as default};
