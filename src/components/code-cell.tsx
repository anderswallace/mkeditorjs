import "bulmaswatch/superhero/bulmaswatch.min.css";
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
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  // debounce logic for automatic code execution
  useEffect(() => {
    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content, cell.id, createBundle]);

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
        {bundle && <Preview code={bundle.code} bundleError={bundle.err} />}
      </div>
    </Resizable>
  );
};

export default CodeCell;
