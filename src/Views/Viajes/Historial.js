import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { GridOverlay, DataGrid } from '@material-ui/data-grid';
import {makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const data = []
const types = [
    {
        id: 1,
        value: 'Unidad'
    },
    {
        id: 2,
        value: 'Operador'
    },
    {
        id: 3,
        value: 'Caja'
    },
    {
        id: 4,
        value: 'Candado'
    }
]

const useStyles = makeStyles({
   headerText:{
       marginBottom: 20,
       marginTop: 20,
       marginLeft: 5,
       fontWeight: 'bold',
   },
    root: {
        minWidth: 275,
        margin: 10,
        boxShadow: '0px 0px 6px -1px',
    },
    cardListContent:{
       padding: 0,
       margin:0,
    },
    input:{
       marginRight: 15
    }
});

export default function Historial(){
    const classes = useStyles();
    const [selectedStartDate, setSelectedStartDate] = React.useState();
    const [selectedEndDate, setSelectedEndDate] = React.useState();
    const [changeType, setChangeType] = React.useState(0);
    const handleStartDateChange = (date) => {
        setSelectedStartDate(date.target.value);
    };
    const handleEndDateChange = (date) =>{
        setSelectedEndDate(date.target.value);
    };
    const handleTypeChange = (event) =>{
        setChangeType(event.target.value);
    };

    const columns = React.useMemo( () => [
        {
            headerName: "Usuario",
            field: "user",
            width: 150,
        },
        {
            headerName: "Fecha/Hora",
            field: "fecha",
            width: 150,
        },
        {
            headerName: "Cambio realizado",
            field: "cambio",
            width: 150,
        },
        {
            headerName: "Actual",
            field: "actual",
            width: 150,
        },
        {
            headerName: "Anterior",
            field: "anterior",
            width: 150,
        },
    ]);

    function conDatos() {
        return data.length != 0;
    }

    return(
        <div>
            <div className="row" style={{ paddingLeft: "8px" }}>
                <h1 className={classes.headerText}>Historial de cambios del viaje</h1>
                <form className="j-forms">
                    <div className="row" style={{ display: "flex", justifyContent:'flex-start' }}>
                        <div >
                            <div className="input" style={{marginRight: 15}}>
                                <TextField
                                    autoFocus
                                    type="date"
                                    margin="dense"
                                    label="Fecha Inicial"
                                    variant="outlined"
                                    className="form-control"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    id="fechaInicial"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="input" style={{marginRight: 15}}>
                                <TextField
                                    autoFocus
                                    type="date"
                                    margin="dense"
                                    label="Fecha Final"
                                    variant="outlined"
                                    className="form-control"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                    id="fechaFinal"/>
                            </div>
                        </div>
                        <div>
                            <label className="input select" style={{marginRight: 15}}>
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel id="idChangeTypeLabel">Tipo de cambio</InputLabel>
                                    <Select
                                        style={{minWidth: 150}}
                                        labelId="idChangeTypeLabel"
                                        className="form-control"
                                        required
                                        value={changeType}
                                        onChange={handleTypeChange}
                                        id="idTypeChange"
                                        label="Tipo de cambio">
                                        <option value="0">Todos</option>
                                        {types.map((tipo) => (
                                            <option key={tipo.id} value={tipo.id}>
                                                {tipo.value}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            {conDatos() ? (
                <Card className={classes.root}>
                    <CardContent className={classes.cardListContent}>
                        <div className="row" style={{height: window.innerHeight - 250, width: '100%', padding: 0, margin: 0}}>
                <DataGrid columns={columns} rows={data}/>
                        </div>
                    </CardContent>
                </Card>
                ) : (
                <div className="row" style={{height: window.innerHeight - 250, width: '100%', padding: 0, margin: 0}}>
                    <div style={{margin:20}}>No se encontró ningún registro</div>
                </div>
            )}
        </div>
    )
}