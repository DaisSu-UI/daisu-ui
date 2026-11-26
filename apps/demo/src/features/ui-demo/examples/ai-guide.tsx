import { Cell, CellGroup } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

export function AiGuideExample() {
  return <DemoGroup title="AI 使用指南">
    <ExampleBlock title="选择接入方式"><CellGroup><Cell title="LLM 文档" description="简明组件入口" value="docs/ui/llms.txt" last /><Cell title="完整文档" description="组件约束与工作流" value="docs/ui/llms-full.txt" last /><Cell title="MCP" description="只调用已配置且可用的 MCP 工具" value="按需查询" last /><Cell title="Agent Skills" description="消费端接入与组件查询" value="daisu agent init" last /></CellGroup></ExampleBlock>
    <ExampleBlock title="提交前检查"><text className="catalog-card-copy">使用 daisu-ui 公共入口；业务网络与宿主协议由使用方注入。运行 npm test、npm run test:types、npm run build 和 npm run ui:check，原生能力由消费项目完成真机回归。</text></ExampleBlock>
  </DemoGroup>;
}
