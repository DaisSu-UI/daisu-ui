import { root, useInitData, useState } from "@lynx-js/react";
import { Button, ConfigProvider, RootPortalHost } from "@daisu-ui/ui";

function App() {
  const data = useInitData() as { theme?: string };
  const [theme, setTheme] = useState<"light" | "dark">(
    data.theme === "dark" ? "dark" : "light",
  );
  const [count, setCount] = useState(0);
  return (
    <ConfigProvider
      theme={theme}
      style={{ height: "100%", backgroundColor: "var(--cso-ui-surface)" }}
    >
      <RootPortalHost>
        <view style={{ padding: "24px" }}>
          <text style={{ color: "var(--cso-ui-text)" }}>已点击 {count} 次</text>
          <Button
            label="点击"
            onTap={() => {
              "background only";
              setCount((value) => value + 1);
            }}
          />
          <Button
            label="切换主题"
            onTap={() => {
              "background only";
              setTheme((value) => (value === "light" ? "dark" : "light"));
            }}
          />
        </view>
      </RootPortalHost>
    </ConfigProvider>
  );
}
root.render(<App />);
