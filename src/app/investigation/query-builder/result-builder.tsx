import React from "react";
import type { StepsProps } from "antd";
import { Steps } from "antd";

interface AppProps {
  current: number;
  items: StepsProps["items"];
}

const App: React.FC<AppProps> = ({ current, items }) => (
  <Steps type="navigation" size="small" current={current} items={items} />
);

export default App;
