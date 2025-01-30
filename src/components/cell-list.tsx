import "./cell-list.css";
import { Fragment } from "react/jsx-runtime";
import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";

const CellList: React.FC = () => {
  const cellsOrder = useTypedSelector(({ cells: { order } }) => {
    return order;
  });

  const cellsData = useTypedSelector(({ cells: { data } }) => {
    return data;
  });

  const cells_ordered = cellsOrder.map((id) => {
    return cellsData[id];
  });

  const renderedCells = cells_ordered.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell
        forceVisible={cells_ordered.length === 0}
        previousCellId={null}
      />
      {renderedCells}
    </div>
  );
};

export default CellList;
