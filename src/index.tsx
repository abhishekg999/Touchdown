import { render } from "preact";
import { App } from "./App";
import "./styles/global.css";

const elem = document.getElementById("root")!;

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= elem);
  render(<App />, root);
} else {
  // The hot module reloading API is not available in production.
  render(<App />, elem);
}
