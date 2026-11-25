import { Col, Row } from '@daisu-ui/ui';
import { DemoGroup, ExampleBlock } from './shared.js';

function LayoutCell({ label, tone = 'strong', height = 30 }: { label: string; tone?: 'primary' | 'strong' | 'light'; height?: number }) {
  return <view className={`demo-layout-cell demo-layout-cell-${tone}`} style={{ height: `${height}px` }}><text>{label}</text></view>;
}

export function LayoutExample() {
  return <view className="demo-layout-page"><DemoGroup title="布局能力">
    <ExampleBlock title="基础用法">
      <Row><Col><LayoutCell label="span: 24" tone="primary" /></Col></Row>
      {[12, 8, 6].map(span => <Row key={span}>{Array.from({ length: 24 / span }, (_, index) => <Col key={index} span={span}><LayoutCell label={`span: ${span}`} tone={index % 2 ? 'light' : 'strong'} /></Col>)}</Row>)}
    </ExampleBlock>
    <ExampleBlock title="分栏偏移">
      <Row><Col span={4}><LayoutCell label="span: 4" /></Col><Col span={8} offset={4}><LayoutCell label="span: 8 offset: 4" tone="light" /></Col></Row>
      <Row><Col span={8} offset={4}><LayoutCell label="span: 8 offset: 4" /></Col><Col span={8} offset={4}><LayoutCell label="span: 8 offset: 4" tone="light" /></Col></Row>
    </ExampleBlock>
    <ExampleBlock title="分栏间隔"><Row gutter={20}>{[0, 1, 2].map(index => <Col key={index} span={8}><LayoutCell label="span: 8" tone={index % 2 ? 'light' : 'strong'} /></Col>)}</Row></ExampleBlock>
    <ExampleBlock title="Justify 对齐">{(['center', 'end', 'space-between', 'space-around'] as const).map(justify => <Row key={justify} justify={justify}>{[0, 1, 2].map(index => <Col key={index} span={6}><LayoutCell label={justify.replace('space-', '')} tone={index % 2 ? 'light' : 'strong'} /></Col>)}</Row>)}</ExampleBlock>
    <ExampleBlock title="Align 对齐">{(['middle', 'bottom'] as const).map(align => <Row key={align} align={align}>{[60, 30, 50].map((height, index) => <Col key={height} span={8}><LayoutCell label={align} height={height} tone={index % 2 ? 'light' : 'strong'} /></Col>)}</Row>)}</ExampleBlock>
  </DemoGroup></view>;
}
