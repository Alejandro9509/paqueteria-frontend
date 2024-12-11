import React from "react";

export default function DefaultColumnFilter({column: { filterValue, preFilteredRows, setFilter },
                                            }) {
    const count = preFilteredRows.length;
    const [showResults, setShowResults] = React.useState(false)
    const onClick = () => setShowResults(!showResults)
    return (
        <div style={{ display: "flex" }}>
        <span style={{ display: "block", float: "right" }}>
          <a onClick={onClick}>
            <i className="fa fa-search" />
          </a>
        </span>
            <br></br>
            <span style={{ display: "block" }}>
            <input
                className="form-control"
                type={showResults ? "" : "hidden"}
                value={filterValue || ""}
                onChange={(e) => {
                setFilter(e.target.value || undefined);
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        </span>
        </div>
    );
}