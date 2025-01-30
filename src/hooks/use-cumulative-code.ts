import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  const stateOrder = useTypedSelector((state) => state.cells.order);
  const stateData = useTypedSelector((state) => state.cells.data);

  // aggregate code from all previous code editor cells
  const cumulativeCode = (() => {
    const orderedCells = stateOrder.map((id) => stateData[id]);

    // show() function which we can use in the code editor
    // to execute JS and JSX code
    const showFunction = `
          var show = (value) => {
            const root = document.querySelector("#root");
            if (typeof value === 'object') {
              if (value.$$typeof && value.props) {
                const node = createRoot(root);
                node.render(value);
              } else {
              root.innerHTML = JSON.stringify(value);
              }
            } else {
              root.innerHTML = value
            }
          };
          `;
    const showFunctionNoOp = "var show = () => {}";
    const cumulativeCode = [];

    for (let c of orderedCells) {
      if (c.type === "code") {
        // push functional show() only if code cell thats selected
        // is the cell that we are trying to preview
        if (c.id === cellId) {
          cumulativeCode.push(showFunction);
        } else {
          cumulativeCode.push(showFunctionNoOp);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  })();

  return cumulativeCode.join("\n");
};
