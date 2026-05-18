import{j as e}from"./index-vtBAwm1E.js";import{bm as N,d as a,f as n,e as c}from"./theme-C7aKG9bo.js";import"./index-DAV8Sz2w.js";import{I as j}from"./info-Dh8DXxG7.js";import{C as A}from"./circle-alert-C395UdkY.js";import"./index-Cj-fYYhT.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],f=N("circle-check",v),E={title:"Components/Alert",parameters:{layout:"padded"}},r={render:()=>e.jsxs("div",{className:"space-y-4 max-w-lg",children:[e.jsxs(a,{children:[e.jsx(j,{className:"h-4 w-4"}),e.jsx(n,{children:"Info"}),e.jsx(c,{children:"Dashboard is in read-only mode. Changes cannot be saved."})]}),e.jsxs(a,{variant:"destructive",children:[e.jsx(A,{className:"h-4 w-4"}),e.jsx(n,{children:"Error"}),e.jsx(c,{children:"Failed to load datasource. Check the connection settings."})]})]})},s={render:()=>e.jsxs(a,{className:"max-w-lg",children:[e.jsx(f,{className:"h-4 w-4"}),e.jsx(c,{children:"Dashboard saved successfully."})]})},t={render:()=>e.jsxs(a,{variant:"destructive",className:"max-w-lg",children:[e.jsx(A,{className:"h-4 w-4"}),e.jsx(n,{children:"Query Error"}),e.jsxs(c,{className:"font-mono text-xs mt-1",children:['parse error at char 15: unexpected "',"}",'" in metricName']})]})};var l,o,i;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 max-w-lg">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Dashboard is in read-only mode. Changes cannot be saved.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load datasource. Check the connection settings.</AlertDescription>
      </Alert>
    </div>
}`,...(i=(o=r.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};var d,m,p;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <Alert className="max-w-lg">
      <CheckCircle2 className="h-4 w-4" />
      <AlertDescription>Dashboard saved successfully.</AlertDescription>
    </Alert>
}`,...(p=(m=s.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var h,x,u;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <Alert variant="destructive" className="max-w-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Query Error</AlertTitle>
      <AlertDescription className="font-mono text-xs mt-1">
        parse error at char 15: unexpected &quot;{\`}\`}&quot; in metricName
      </AlertDescription>
    </Alert>
}`,...(u=(x=t.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};const b=["AllVariants","WithoutTitle","ErrorState"];export{r as AllVariants,t as ErrorState,s as WithoutTitle,b as __namedExportsOrder,E as default};
