import { iconNames } from 'daisu-ui';
const groups = [
  { title: '方向与导航', pattern: /arrow|caret|double|^to-|^left|^right|^up|^down|rotate|expand|shrink|^menu|^swap|^nav|fullscreen/ },
  { title: '编辑与排版', pattern: /align|font|bold|italic|underline|strike|^h\d|edit|copy|paste|delete|eraser|brush|scissor|quote|line-height|list|sort|filter|replace|zoom|link/ },
  { title: '媒体与设备', pattern: /camera|image|photo|video|audio|play|pause|record|sound|mute|music|headset|mic|voice|desktop|mobile|keyboard|printer|phone|skip|forward|backward/ },
  { title: '状态与提示', pattern: /check|close|question|info|exclamation|warning|empty|no-|fail|loading|lock|safe|eye|minus|plus|^stop|^power/ },
];
export const iconCategories = [...groups.map((group, index) => ({ title: group.title, names: iconNames.filter(name => group.pattern.test(name) && !groups.slice(0, index).some(previous => previous.pattern.test(name))) })), { title: '生活与应用', names: iconNames.filter(name => !groups.some(group => group.pattern.test(name))) }];
