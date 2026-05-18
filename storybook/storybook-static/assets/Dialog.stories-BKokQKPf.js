import{j as e}from"./index-vtBAwm1E.js";import{r as D}from"./index-DAV8Sz2w.js";import{g as s,ah as O,ai as y,al as P,am as k,aj as F,ag as E,W as d,U as c,ak as B}from"./theme-C7aKG9bo.js";import"./index-Cj-fYYhT.js";const U={title:"Components/Dialog (Sheet)",parameters:{layout:"centered"}};function p({side:o="right",title:t="Edit Panel"}){const[b,n]=D.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsxs(s,{variant:"outline",onClick:()=>n(!0),children:["Open ",t]}),e.jsx(O,{open:b,onOpenChange:n,children:e.jsxs(y,{side:o,className:"flex flex-col",children:[e.jsxs(P,{children:[e.jsx(k,{children:t}),e.jsx(F,{children:"Make changes to your panel settings here."})]}),e.jsx(E,{}),e.jsxs("div",{className:"flex-1 overflow-auto py-4 space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(d,{htmlFor:"panel-name",children:"Panel Name"}),e.jsx(c,{id:"panel-name",defaultValue:"CPU Usage"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(d,{htmlFor:"panel-desc",children:"Description"}),e.jsx(c,{id:"panel-desc",placeholder:"Optional description..."})]})]}),e.jsxs(B,{children:[e.jsx(s,{variant:"outline",onClick:()=>n(!1),children:"Cancel"}),e.jsx(s,{onClick:()=>n(!1),children:"Save Changes"})]})]})})]})}const a={render:()=>e.jsx(p,{side:"right",title:"Edit Panel"})},r={render:()=>e.jsx(p,{side:"left",title:"Navigation"})},i={render:()=>e.jsx(p,{side:"bottom",title:"Filter Options"})},l={render:()=>{const[o,t]=D.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(s,{onClick:()=>t(!0),children:"Open Panel Editor"}),e.jsx(O,{open:o,onOpenChange:t,children:e.jsxs(y,{side:"right",className:"flex flex-col w-full sm:max-w-[1080px]",children:[e.jsxs(P,{children:[e.jsx(k,{children:"Panel Editor"}),e.jsx(F,{children:"Full-width panel editor with preview"})]}),e.jsx(E,{}),e.jsxs("div",{className:"flex-1 grid grid-cols-2 gap-4 overflow-auto py-4",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"font-medium text-sm",children:"Configuration"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(d,{children:"Panel Name"}),e.jsx(c,{defaultValue:"Requests per Second"})]})]}),e.jsx("div",{className:"bg-muted rounded-md flex items-center justify-center",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Preview area"})})]}),e.jsxs(B,{children:[e.jsx(s,{variant:"outline",onClick:()=>t(!1),children:"Discard"}),e.jsx(s,{onClick:()=>t(!1),children:"Apply"})]})]})})]})}};var m,h,u;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <SheetDemo side="right" title="Edit Panel" />
}`,...(u=(h=a.parameters)==null?void 0:h.docs)==null?void 0:u.source}}};var x,f,j;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <SheetDemo side="left" title="Navigation" />
}`,...(j=(f=r.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var g,S,v;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <SheetDemo side="bottom" title="Filter Options" />
}`,...(v=(S=i.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var N,w,C;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open Panel Editor</Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="flex flex-col w-full sm:max-w-[1080px]">
            <SheetHeader>
              <SheetTitle>Panel Editor</SheetTitle>
              <SheetDescription>Full-width panel editor with preview</SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="flex-1 grid grid-cols-2 gap-4 overflow-auto py-4">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Configuration</h3>
                <div className="space-y-2">
                  <Label>Panel Name</Label>
                  <Input defaultValue="Requests per Second" />
                </div>
              </div>
              <div className="bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Preview area</p>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Discard</Button>
              <Button onClick={() => setOpen(false)}>Apply</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </>;
  }
}`,...(C=(w=l.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};const V=["RightDrawer","LeftDrawer","BottomSheet","WideDrawer"];export{i as BottomSheet,r as LeftDrawer,a as RightDrawer,l as WideDrawer,V as __namedExportsOrder,U as default};
