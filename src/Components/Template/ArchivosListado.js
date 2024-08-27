import React from 'react';
import {Button} from "@mui/material";

export default function ArchivosListado(props) {
    const archivos = props.archivos;
    return(
        <section className="main-container">
            <div className="container-fluid">
                <div className="widget-wrap">
                    {archivos.map( (file) =>(
                        <Button
                            variant={'outlined'}
                            href={file.file} target={'_blank'}
                            style={{textTransform: 'none'}}
                            size={"large"}>
                            {file.name}
                        </Button>
                    ))
                    }

                </div>
            </div>
        </section>
    )
}