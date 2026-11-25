import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { loadKnowledge } from './knowledge.mjs';

try {
  const knowledge = await loadKnowledge();
  const server = new Server({ name: 'daisu-ui', version: knowledge.version }, {
    capabilities: { tools: {}, resources: {} },
    instructions: 'Query the installed Daisu UI documentation before generating ReactLynx code. Check public props, events, theme tokens and native platform limitations. Read daisu-ui://docs/agent-rules for validation requirements.',
  });
  const name = z.string().trim().min(1).max(120);
  const tools = new Map([
    ['list_components', {
      description: '列出 Daisu UI 组件，支持按名称或中文标题筛选。',
      schema: z.object({ query: z.string().max(120).optional() }).strict(),
      inputSchema: { type: 'object', properties: { query: { type: 'string', description: '组件名称或中文关键词，可省略' } }, additionalProperties: false },
      run: ({ query }) => JSON.stringify(knowledge.list(query), null, 2),
    }],
    ['get_component', {
      description: '读取当前版本组件文档，包含公开 API、用法示例、CSS 变量与平台限制。',
      schema: z.object({ component: name, section: z.enum(['full', 'api', 'examples', 'tokens']).default('full') }).strict(),
      inputSchema: { type: 'object', properties: { component: { type: 'string', description: '如 Button、FormItem、config-provider' }, section: { type: 'string', enum: ['full', 'api', 'examples', 'tokens'], default: 'full' } }, required: ['component'], additionalProperties: false },
      run: ({ component, section }) => knowledge.document(component, section),
    }],
    ['get_demo', {
      description: '读取组件独立 Demo 的真实 ReactLynx 源码。',
      schema: z.object({ component: name }).strict(),
      inputSchema: { type: 'object', properties: { component: { type: 'string' } }, required: ['component'], additionalProperties: false },
      run: ({ component }) => knowledge.demo(component),
    }],
    ['search_docs', {
      description: '全文搜索当前组件文档，返回匹配组件及内容片段。多个关键词用空格分隔。',
      schema: z.object({ query: z.string().trim().min(1).max(200), limit: z.number().int().min(1).max(20).default(8) }).strict(),
      inputSchema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 20, default: 8 } }, required: ['query'], additionalProperties: false },
      run: ({ query, limit }) => JSON.stringify(knowledge.search(query, limit), null, 2),
    }],
    ['get_changelog', {
      description: '读取当前仓库真实更新记录，核对组件版本变化。',
      schema: z.object({}).strict(),
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      run: () => knowledge.changelog(),
    }],
  ]);
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [...tools].map(([name, { description, inputSchema }]) => ({ name, description, inputSchema, annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false } })) }));
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const tool = tools.get(request.params.name);
    if (!tool) throw new McpError(ErrorCode.InvalidParams, `Unknown tool: ${request.params.name}`);
    const parsed = tool.schema.safeParse(request.params.arguments ?? {});
    if (!parsed.success) return { isError: true, content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
    try { return { content: [{ type: 'text', text: await tool.run(parsed.data) }] }; }
    catch (error) { return { isError: true, content: [{ type: 'text', text: error.message }] }; }
  });
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: knowledge.resources.map(({ path, ...resource }) => resource) }));
  server.setRequestHandler(ReadResourceRequestSchema, async request => {
    const resource = knowledge.resources.find(item => item.uri === request.params.uri);
    if (!resource) throw new McpError(ErrorCode.InvalidParams, 'Unknown documentation resource');
    return { contents: [{ uri: resource.uri, mimeType: resource.mimeType, text: await knowledge.readResource(resource.path) }] };
  });
  await server.connect(new StdioServerTransport());
} catch (error) {
  console.error(`Daisu UI MCP: ${error.message}`);
  process.exitCode = 1;
}
