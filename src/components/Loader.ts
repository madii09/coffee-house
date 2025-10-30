export function createLoader(): HTMLElement {
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerText = "Loading...";
  return loader;
}
