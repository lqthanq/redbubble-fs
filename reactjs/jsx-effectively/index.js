const rootElement = document.getElementById("root");
const element = React.createElement("div", {
  children: "Hello word",
  className: "container",
});

ReactDOM.render(element, rootElement);
