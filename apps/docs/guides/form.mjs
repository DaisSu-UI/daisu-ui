import { g, e } from "./shared.mjs";
export default {
  "form-detail": g(
    "表单用于组织字段布局与校验。Form 管理数据模型和校验规则，FormItem 描述字段并承载输入控件。zodAdapter(schema, options?) 将支持 safeParseAsync 的 schema 转为 FormSchema；字段错误路径使用点分隔，根级错误使用空路径，不会自动使用 schema 的转换结果更新 model。options 可传 isRequired(path) 函数或 { isRequired }，必填推断由调用方提供，不从 schema 内部结构猜测。Zod 是消费项目自选依赖；业务状态仍以受控 model 管理。",
    "Form FormItem zodAdapter",
    e(
      "基础用法",
      "受控表单",
      'const [model, setModel] = useState({ name: "" }); return <Form model={model} border><FormItem title="姓名" prop="name" required><Input value={model.name} onChange={name => { \'background only\'; setModel({ name }); }} /></FormItem></Form>;',
    ),
    e(
      "校验用法",
      "提交时校验",
      'const form = useRef<FormRef>(null); const [model, setModel] = useState({ name: "" }); const schema: FormSchema = { validate: data => data.name ? [] : [{ path: "name", message: "请输入姓名" }] }; return <><Form ref={form} model={model} schema={schema}><FormItem title="姓名" prop="name"><Input value={model.name} onChange={name => { \'background only\'; setModel({ name }); }} /></FormItem></Form><Button label="提交" onTap={async () => { \'background only\'; const result = await form.current?.validate(); if (result?.valid) console.log(model); }} /></>;',
    ),
    e(
      "组件状态",
      "整体禁用",
      'return <Form model={{ name: "张三" }} disabled><FormItem title="姓名" prop="name"><Input value="张三" /></FormItem></Form>;',
    ),
  ),
  rate: g(
    "评分用于展示或选择评分等级，支持半星、只读、禁用和自定义图标。",
    "Rate",
    e(
      "组件类型",
      "受控评分",
      "const [value, setValue] = useState(3); return <Rate value={value} onChange={event => { 'background only'; setValue(event.value); }} />;",
    ),
    e(
      "组件状态",
      "只读与禁用",
      "return <><Rate value={4} readonly /><Rate value={3} disabled /></>;",
    ),
    e(
      "组件样式",
      "数量与尺寸",
      'return <Rate num={5} size={28} color="#f57f00" />;',
    ),
  ),
  switch: g(
    "开关用于切换两个互斥状态，支持加载、禁用、自定义值和切换前校验。",
    "Switch",
    e(
      "组件类型",
      "受控开关",
      "const [value, setValue] = useState(true); return <Switch value={value} onChange={event => { 'background only'; setValue(Boolean(event.value)); }} />;",
    ),
    e(
      "组件状态",
      "加载与禁用",
      "return <><Switch loading /><Switch value disabled /></>;",
    ),
    e(
      "交互用法",
      "异步校验",
      "return <Switch beforeChange={async value => { 'background only'; console.log(value); return true; }} />;",
    ),
  ),
  input: g(
    "输入框用于录入单行文本，支持受控值、清空、密码、字数统计和前后插槽。",
    "Input",
    e(
      "组件类型",
      "基本使用",
      'return <Input placeholder="请输入歪比巴卜" />;',
      "通过 `placeholder` 设置占位文字。",
    ),
    e(
      "组件类型",
      "数字类型",
      'return <Input type="number" placeholder="请输入数字" />;',
      '设置 `type="number"` 使用数字输入类型。',
    ),
    e(
      "组件状态",
      "禁用状态",
      'return <Input defaultValue="这是禁用状态" disabled />;',
      "设置 `disabled` 禁用输入框，禁用时不能编辑或清空内容。",
    ),
    e(
      "组件状态",
      "只读状态",
      'return <Input defaultValue="这是只读状态" readonly />;',
      "设置 `readonly` 使内容只读。",
    ),
    e(
      "组件状态",
      "错误状态",
      'return <Input defaultValue="123456" error />;',
      "设置 `error` 展示错误状态，内容使用错误颜色。",
    ),
    e(
      "组件变体",
      "清空按钮",
      'return <Input defaultValue="支持清空" clearable />;',
      "设置 `clearable`，输入框有内容时显示清空按钮。",
    ),
    e(
      "组件变体",
      "有值且聚焦时展示清空按钮",
      'return <Input clearable clearTrigger="focus" />;',
      '设置 `clearTrigger="focus"`，仅在有值并且聚焦时显示清空按钮。',
    ),
    e(
      "组件变体",
      "点击清除按钮时不自动聚焦",
      "return <Input clearable focusWhenClear={false} />;",
      "设置 `focusWhenClear={false}`，点击清空按钮后不自动聚焦。",
    ),
    e(
      "组件变体",
      "密码框",
      'return <Input defaultValue="password" showPassword clearable />;',
      "设置 `showPassword` 显示密码切换按钮，可组合 `clearable` 使用。",
    ),
    e(
      "内容形态",
      "设置前后 Icon",
      'return <Input prefixIcon="sound" suffixIcon="send" />;',
      "通过 `prefixIcon` 和 `suffixIcon` 设置前后图标，点击分别触发 `onClickPrefixIcon` 和 `onClickSuffixIcon`。",
    ),
    e(
      "内容形态",
      "后缀插槽",
      'return <Input placeholder="请输入验证码" suffix={<Button label="获取验证码" size="small" />} />;',
      "通过 `suffix` 自定义后缀内容，例如放置验证码按钮。",
    ),
    e(
      "组件样式",
      "字数限制",
      'return <Input defaultValue="1234" maxlength={20} showWordLimit />;',
      "设置 `maxlength` 限制输入长度，配合 `showWordLimit` 显示字数统计。",
    ),
    e(
      "组件样式",
      "紧凑布局",
      'return <view style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><Input compact placeholder="请输入价格" style={{ width: "155px" }} /><text>元</text></view>;',
      "设置 `compact` 使用紧凑布局，可与单位文字等内容组合。",
    ),
    e(
      "特殊用法",
      "结合表单使用",
      'return <CellGroup border><Cell center title="基本用法" titleWidth="98px"><Input compact placeholder="请输入" /></Cell><Cell center title="必填" titleWidth="98px" required><Input compact placeholder="请输入" /></Cell><Cell center title="自定义插槽" titleWidth="98px"><Input compact suffix={<Button label="获取验证码" size="small" />} /></Cell></CellGroup>;',
      "在 `Cell` 中组合输入框，使用 `center` 垂直居中、`required` 展示必填标记，输入框设置 `compact`。",
    ),
  ),
  textarea: g(
    "文本域用于录入多行内容，支持高度控制、自动增高、清空和字数统计。",
    "Textarea",
    e(
      "组件类型",
      "多行输入",
      'const [value, setValue] = useState(""); return <Textarea value={value} onChange={setValue} placeholder="请输入详细说明" />;',
    ),
    e(
      "组件状态",
      "禁用与只读",
      'return <><Textarea value="这是只读内容" readonly /><Textarea value="这是禁用内容" disabled /></>;',
    ),
    e(
      "组件样式",
      "自适应高度与字数",
      "return <Textarea autoHeight minHeight={100} maxHeight={240} maxlength={200} showWordLimit />;",
    ),
  ),
  "input-number": g(
    "计数器用于在指定范围内调整数值，支持精度、步长、空值和异步变更校验。",
    "InputNumber",
    e(
      "组件类型",
      "基础计数器",
      "const [value, setValue] = useState<InputNumberValue>(1); return <InputNumber value={value} onChange={event => { 'background only'; setValue(event.value); }} min={1} max={10} />;",
    ),
    e(
      "组件样式",
      "步长与精度",
      "return <InputNumber defaultValue={1.5} step={0.1} precision={1} min={0} />;",
    ),
    e(
      "组件状态",
      "禁用与禁止输入",
      "return <><InputNumber disabled /><InputNumber disableInput defaultValue={3} /></>;",
    ),
  ),
  search: g(
    "搜索框用于输入关键字并触发搜索，支持清空、取消、聚焦和自定义操作区域。",
    "Search",
    e(
      "组件类型",
      "受控搜索",
      'const [value, setValue] = useState(""); return <Search value={value} onChange={event => { \'background only\'; setValue(event.value); }} placeholder="请输入关键词" />;',
    ),
    e("组件状态", "禁用搜索", 'return <Search value="搜索内容" disabled />;'),
    e(
      "内容形态",
      "输入提示",
      'return <Search placeholder="搜索商品、品牌" />;',
    ),
  ),
  checkbox: g(
    "复选框用于选择一个或多个选项，支持分组、禁用、只读和按钮外观。",
    "Checkbox CheckboxGroup",
    e(
      "组件类型",
      "独立复选框",
      "const [checked, setChecked] = useState(false); return <Checkbox value={checked} onChange={event => { 'background only'; setChecked(Boolean(event.value)); }}>我已阅读并同意协议</Checkbox>;",
    ),
    e(
      "组合用法",
      "复选框组",
      'return <CheckboxGroup defaultValue={["apple"]}><Checkbox value="apple">苹果</Checkbox><Checkbox value="orange">橙子</Checkbox></CheckboxGroup>;',
    ),
    e(
      "组件状态",
      "禁用与按钮样式",
      'return <><Checkbox disabled>禁用选项</Checkbox><CheckboxGroup type="button"><Checkbox value="one">选项一</Checkbox><Checkbox value="two">选项二</Checkbox></CheckboxGroup></>;',
    ),
  ),
  radio: g(
    "单选框用于从互斥选项中选择一项，通过 RadioGroup 管理选中值和公共属性。",
    "Radio RadioGroup",
    e(
      "组件类型",
      "单选框组",
      'const [value, setValue] = useState<string | null>("one"); return <RadioGroup value={value} onChange={setValue}><Radio value="one">选项一</Radio><Radio value="two">选项二</Radio></RadioGroup>;',
    ),
    e(
      "组件状态",
      "禁用选项",
      'return <RadioGroup defaultValue="one"><Radio value="one">可用选项</Radio><Radio value="two" disabled>禁用选项</Radio></RadioGroup>;',
    ),
    e(
      "组件变体",
      "按钮单选框",
      'return <RadioGroup type="button" defaultValue="one"><Radio value="one">选项一</Radio><Radio value="two">选项二</Radio></RadioGroup>;',
    ),
  ),
  slider: g(
    "滑块用于在一个数值范围内选择数值，支持区间值、步长、刻度和垂直布局。",
    "Slider",
    e(
      "组件类型",
      "基础滑块",
      "const [value, setValue] = useState<SliderValue>(30); return <Slider value={value} onChange={setValue} min={0} max={100} />;",
    ),
    e(
      "组件样式",
      "步长与刻度",
      "return <Slider defaultValue={40} step={20} marks={[0, 20, 40, 60, 80, 100]} showValue />;",
    ),
    e("组件状态", "禁用", "return <Slider value={50} disabled />;"),
  ),
  keyboard: g(
    "虚拟键盘为数字、身份证和车牌等输入场景提供统一按键面板，输入结果由 value 管理。",
    "Keyboard",
    e(
      "基础用法",
      "数字键盘",
      'const [value, setValue] = useState(""); const [visible, setVisible] = useState(false); return <><Button label="打开键盘" onTap={() => { \'background only\'; setVisible(true); }} /><Keyboard value={value} onChange={setValue} visible={visible} onVisibleChange={setVisible} /></>;',
    ),
    e(
      "组件样式",
      "确认按钮",
      'return <Keyboard visible={false} title="请输入金额" />;',
    ),
  ),
  "password-input": g(
    "密码输入框将内容分格显示，可与虚拟键盘组合录入验证码、支付密码等短内容。",
    "PasswordInput",
    e("组件类型", "密码格", 'return <PasswordInput value="123" />;'),
    e(
      "组合用法",
      "配合虚拟键盘",
      "const [value, setValue] = useState(\"\"); const [visible, setVisible] = useState(false); return <><PasswordInput value={value} onFocus={() => { 'background only'; setVisible(true); }} /><Keyboard value={value} onChange={setValue} visible={visible} onVisibleChange={setVisible} /></>;",
    ),
  ),
  picker: g(
    "选择器以弹层方式展示滚轮选项，支持多列、联动、确认和取消。",
    "Picker",
    e(
      "组件类型",
      "打开选择器",
      'const [visible, setVisible] = useState(false); return <><Button label="选择城市" onTap={() => { \'background only\'; setVisible(true); }} /><Picker visible={visible} onVisibleChange={setVisible} columns={[{ value: "sh", label: "上海" }, { value: "bj", label: "北京" }]} onConfirm={event => { \'background only\'; console.log(event.value); }} /></>;',
    ),
    e(
      "组件样式",
      "自定义标题",
      'return <Picker visible={false} title="请选择城市" confirmButtonText="确定" columns={[{ value: "sh", label: "上海" }]} />;',
    ),
  ),
  "picker-view": g(
    "选择器视图将滚轮面板直接嵌入页面，适合自定义弹层或固定区域选择。",
    "PickerView",
    e(
      "组件类型",
      "单列选择",
      'return <PickerView columns={[{ value: "sh", label: "上海" }, { value: "bj", label: "北京" }]} onChange={event => { \'background only\'; console.log(event.value); }} />;',
    ),
    e(
      "组件样式",
      "滚轮高度",
      'return <PickerView visibleItemCount={5} columns={[{ value: 1, label: "选项一" }, { value: 2, label: "选项二" }]} />;',
    ),
  ),
  "select-picker": g(
    "单复选选择器通过弹层展示列表选项，支持单选、多选和确认操作。",
    "SelectPicker",
    e(
      "组件类型",
      "单选列表",
      'const [visible, setVisible] = useState(false); return <><Button label="选择" onTap={() => { \'background only\'; setVisible(true); }} /><SelectPicker visible={visible} onVisibleChange={setVisible} type="radio" columns={[{ value: 1, label: "选项一" }, { value: 2, label: "选项二" }]} /></>;',
    ),
    e(
      "组件变体",
      "多选列表",
      'return <SelectPicker visible={false} type="checkbox" columns={[{ value: "a", label: "选项一" }, { value: "b", label: "选项二" }]} />;',
    ),
  ),
  cascader: g(
    "级联选择器适合省市区、分类等层级数据，支持逐级选择和异步加载。",
    "Cascader",
    e(
      "组件类型",
      "层级选择",
      'const [visible, setVisible] = useState(false); return <><Button label="选择地区" onTap={() => { \'background only\'; setVisible(true); }} /><Cascader visible={visible} onVisibleChange={setVisible} options={[{ value: "zj", label: "浙江", children: [{ value: "hz", label: "杭州" }] }]} /></>;',
    ),
    e(
      "组件样式",
      "自定义标题",
      'return <Cascader visible={false} title="选择分类" options={[{ value: "book", label: "图书" }]} />;',
    ),
  ),
  "datetime-picker-view": g(
    "日期时间选择器视图在页面内展示时间滚轮，可限制时间范围并调整选择类型。",
    "DatetimePickerView",
    e(
      "组件类型",
      "日期时间",
      "return <DatetimePickerView value={Date.now()} type=\"datetime\" onChange={event => { 'background only'; console.log(event.value); }} />;",
    ),
    e(
      "组件变体",
      "日期选择",
      'return <DatetimePickerView value={Date.now()} type="date" />;',
    ),
  ),
  "datetime-picker": g(
    "日期时间选择器以弹层方式选择日期和时间，支持范围限制、自定义文案和确认校验。",
    "DatetimePicker",
    e(
      "组件类型",
      "选择日期时间",
      "const [visible, setVisible] = useState(false); return <><Button label=\"选择时间\" onTap={() => { 'background only'; setVisible(true); }} /><DatetimePicker visible={visible} onVisibleChange={setVisible} type=\"datetime\" value={Date.now()} onConfirm={event => { 'background only'; console.log(event.value); }} /></>;",
    ),
    e(
      "组件变体",
      "选择日期",
      'return <DatetimePicker visible={false} type="date" value={Date.now()} />;',
    ),
  ),
  "calendar-view": g(
    "日历面板在页面中直接展示月份与日期，支持单日、范围以及日期禁用。",
    "CalendarView",
    e(
      "组件类型",
      "单日选择",
      "return <CalendarView value={Date.now()} type=\"date\" onChange={event => { 'background only'; console.log(event.value); }} />;",
    ),
    e("组件变体", "日期范围", 'return <CalendarView type="daterange" />;'),
  ),
  calendar: g(
    "日历选择器通过弹层提供单日、日期范围和多种日期选择模式，适合预约与筛选。",
    "Calendar",
    e(
      "组件类型",
      "弹层日历",
      "const [visible, setVisible] = useState(false); return <><Button label=\"选择日期\" onTap={() => { 'background only'; setVisible(true); }} /><Calendar visible={visible} onVisibleChange={setVisible} type=\"date\" onConfirm={event => { 'background only'; console.log(event.value); }} /></>;",
    ),
    e(
      "组件变体",
      "日期范围",
      'return <Calendar visible={false} type="daterange" title="选择入住日期" />;',
    ),
  ),
  upload: g(
    "上传组件管理文件列表、上传进度、预览与删除。选取和上传过程由应用提供的适配器完成。",
    "Upload",
    e(
      "组件类型",
      "展示文件",
      'return <Upload fileList={[{ url: "https://example.com/photo.jpg", status: "success" }]} />;',
    ),
    e(
      "组件状态",
      "禁用与数量限制",
      "return <><Upload disabled /><Upload limit={3} /></>;",
      "实际文件选择需接入 UploadAdapter；文档示例不连接业务上传服务。",
    ),
  ),
  "img-cropper": g(
    "图片裁剪器用于选取图片区域、旋转和导出裁剪结果，浏览器模式通过 Web 宿主提供裁剪能力。",
    "ImgCropper",
    e(
      "基础用法",
      "打开裁剪器",
      'const [show, setShow] = useState(false); return <><Button label="裁剪图片" onTap={() => { \'background only\'; setShow(true); }} /><ImgCropper show={show} onShowChange={setShow} mode="browser" imgSrc="https://example.com/photo.jpg" onConfirm={result => { \'background only\'; console.log(result); }} /></>;',
    ),
    e(
      "组件样式",
      "裁剪尺寸",
      'return <ImgCropper show={false} mode="browser" imgWidth={280} imgHeight={280} />;',
    ),
  ),
  signature: g(
    "签名组件记录手写笔迹，支持清空、撤销、确认和自定义画笔样式。",
    "Signature",
    e(
      "基础用法",
      "手写签名",
      "return <Signature onConfirm={result => { 'background only'; console.log(result); }} />;",
    ),
    e("组件样式", "画笔颜色", 'return <Signature penColor="#1c64fd" />;'),
  ),
  "slide-verify": g(
    "滑动验证要求用户拖动滑块完成确认，适合表单提交前的交互校验。",
    "SlideVerify",
    e(
      "基础用法",
      "滑动确认",
      "return <SlideVerify onSuccess={() => { 'background only'; console.log(\"验证通过\"); }} />;",
    ),
    e(
      "组件状态",
      "禁用与自定义文案",
      'return <><SlideVerify disabled /><SlideVerify text="拖动滑块完成验证" successText="验证成功" /></>;',
    ),
  ),
};
