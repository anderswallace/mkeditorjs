import "bulmaswatch/superhero/bulmaswatch.min.css";
import "./code-cell.css";
import { useEffect } from "react";
import { useActions } from "../hooks/use-actions";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useTypedSelector } from "../hooks/use-typed-selector";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const stateOrder = useTypedSelector((state) => state.cells.order);
  const stateData = useTypedSelector((state) => state.cells.data);
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  // aggregate code from all previous code editor cells
  const cumulativeCode = (() => {
    const orderedCells = stateOrder.map((id) => stateData[id]);

    const cumulativeCode = [
      `
      const show = (value) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
      }
      `,
    ];

    for (let c of orderedCells) {
      if (c.type === "code") {
        cumulativeCode.push(c.content);
      }
      if (c.id === cell.id) {
        break;
      }
    }

    return cumulativeCode;
  })();

  // debounce logic for automatic code execution
  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join("\n"));
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode.join("\n"));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode.join("\n"), cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} bundleError={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
