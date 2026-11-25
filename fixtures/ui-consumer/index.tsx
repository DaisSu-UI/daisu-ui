import 'daisu-ui/router/runtime';
import { root } from '@lynx-js/react';
import * as UI from 'daisu-ui';
import * as Router from 'daisu-ui/router';
import { parseRoutePath } from 'daisu-ui/router/location';
import { datetimePad } from 'daisu-ui/utils';

// Keep all public values reachable so the consumer compiler checks every export.
const exports = [...Object.keys(UI), ...Object.keys(Router)].join(', ');
const button: UI.ButtonProps = { label: 'Packed package', onTap: () => { 'background only'; } };
const upload: UI.UploadAdapter = { chooseAndUpload: async () => { 'background only'; return null; } };

root.render(
  <UI.ConfigProvider>
    <UI.RootPortalHost>
      <UI.Button {...button} />
      <UI.Upload adapter={upload} />
      <UI.Signature />
      <UI.BarCode value="123456789012" />
      <UI.QrCode text="daisu-ui" />
      <text>{datetimePad(1)}: {parseRoutePath('/demo').path}: {exports}</text>
    </UI.RootPortalHost>
  </UI.ConfigProvider>,
);
