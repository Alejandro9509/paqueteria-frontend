import React from "react";
import {useFilters, useSortBy, useTable} from "react-table";
import DefaultColumnFilter from "./DefaultColumnFilter";

export default function TableUnidadViajes({ data, select, func }) {
    const defaultColumn = React.useMemo(
        () => ({
            // Default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const columns = React.useMemo(() => [
        {
            Name: "Descripcion",
            accessor: "m_sDescripcion",
        },
        {
            Name: "Codigo",
            accessor: "m_sCodigo",
        },
        {
            Name: "Tipo de unidad",
            accessor: "m_nIdTipoUnidad",
        },
        {
            Name: "Estatus",
            accessor: "m_bActivo",
        },
    ], []);


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useFilters,
        useSortBy
    );

    return (
        <div
            className="col-md-12"
            style={{ maxHeight: "300px", overflow: "auto" }}
        >
            <table className="table" {...getTableProps()}>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render("Name")}
                                {/* Add a sort direction indicator */}
                                <span>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <i className="fa fa-caret-up" />
                                        ) : (
                                            <i className="fa fa-caret-down" />
                                        )
                                    ) : (
                                        ""
                                    )}
                                </span>
                                <div>
                                    {column.canFilter ? column.render("Filter") : null}
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                style={{
                                    backgroundColor: row.original.m_nIdUnidad === select ? "orange" : "white"
                                }}
                                {...row.getRowProps()}
                                onClick={func.bind(this, row.original, false)}
                                onDoubleClick={func.bind(this, row.original, true)}
                            >
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}