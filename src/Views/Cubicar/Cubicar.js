/*
import React, {Component, useRef, useState} from 'react'
import boxImage from "../../iconos/Cubicar/crate_box_assing.jpg"
import boxImageAsignada from "../../iconos/Cubicar/crate_box.jpg"
import {Button, Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import {getRandomId} from "../../Util/Util";


class Cubicar extends Component {
    constructor(props) {
        super(props);
        // console.log(props.espacio)
        this.state = {data: props.data}

    }


    render() {
        return (
            <Dialog open={this.props.open} fullScreen>
                <DialogTitle>
                    <Button onClick={() => this.props.close()} color={"primary"}>Regresar</Button>
                    <Typography align={"center"} variant={"h5"}>{this.props.espacio}</Typography>

                </DialogTitle>
                <DialogContent>
                    <Canvas>

                        <color attach="background" args={['lightgray']} />
                        <PerspectiveCamera
                            makeDefault
                            position={[this.state.data.anchoEspacio + 10, this.state.data.altoEspacio + 2,this.state.data.largoEspacio ]}
                            fov={60}
                            zoom={1}
                        />
                        <ambientLight intensity={0.3}/>
                        <Base
                            position={[2, 0, 0]}
                            size={[50, 0,50]}/>
                        <Box
                            position={[(this.state.data.anchoEspacio / 2), (this.state.data.altoEspacio / 2), (this.state.data.largoEspacio / 2)]}
                            size={[this.state.data.anchoEspacio, this.state.data.altoEspacio,this.state.data.largoEspacio]}/>

                       {/!* <mesh
                            position={[(this.state.data.largoEspacio / 2),0, this.state.data.anchoEspacio + 1]}
                            scale={1}>
                            <boxGeometry args={[this.state.data.anchoEspacio,0.05,0.05]}/>
                            <meshStandardMaterial  />
                        </mesh>*!/}
                        <Html style={{color:"white"}}  position={[(this.state.data.anchoEspacio + 1.2),0,(this.state.data.largoEspacio / 2)]} className="html-story-label html-story-label-b">
                           Largo: {this.props.largoEspacio + " mts"}
                        </Html>

                        {/!*<mesh
                            position={[0,(this.state.data.altoEspacio / 2), this.state.data.anchoEspacio + 1]}
                            scale={1}>
                            <boxGeometry args={[0.05,this.state.data.altoEspacio,0.05]}/>
                            <meshStandardMaterial  />
                        </mesh>*!/}
                        <Html style={{color:"white"}}  position={[0,(this.state.data.altoEspacio / 2), this.state.data.anchoEspacio + 1.2]} className="html-story-label html-story-label-b">
                            Alto: {this.props.altoEspacio + " mts"}
                        </Html>

                        {/!*<mesh
                            position={[this.state.data.largoEspacio+1,0, this.state.data.anchoEspacio/2]}
                            scale={1}>
                            <boxGeometry args={[0.05,0.05,this.state.data.anchoEspacio]}/>
                            <meshStandardMaterial  />
                        </mesh>*!/}
                        <Html style={{color:"white"}}  position={[this.state.data.anchoEspacio/2,0,this.state.data.largoEspacio+1.2 ]} className="html-story-label html-story-label-b">
                          Ancho:  {this.props.anchoEspacio + " mts"}
                        </Html>
                        {
                            this.state.data.productos &&
                            this.state.data.productos.filter(p => !p.asignado).map((p,index) => {

                                return (
                                        <BoxPack key={getRandomId()}  color={'red'} descripcion={p.descripcion} positionLabel={[this.state.data.anchoEspacio +5, this.state.data.altoEspacio , this.state.data.largoEspacio/2]}
                                                 position={[p.posicionX + (p.ancho / 2) , p.posicionZ + (p.alto / 2), p.posicionY + (p.largo / 2) ]}
                                                 size={[p.ancho, p.alto, p.largo]}/>

                                )
                            })
                        }
                        {
                            this.state.data.productos &&
                            this.state.data.productos.filter(p => p.asignado).map((p, index) => {

                                return (
                                        <BoxPackAssigned  key={getRandomId()}  color={'red'} descripcion={p.descripcion} positionLabel={[this.state.data.anchoEspacio +5, this.state.data.altoEspacio , this.state.data.largoEspacio/2]}
                                                 position={[p.posicionX + (p.ancho / 2) , p.posicionZ + (p.alto / 2), p.posicionY + (p.largo / 2) ]}
                                                 size={[p.ancho, p.alto, p.largo]}/>

                                )
                            })
                        }


                        <OrbitControls enableZoom={true}
                                       enablePan={true}
                                       enableRotate={true}
                                       target={[(this.state.data.anchoEspacio / 2), (this.state.data.altoEspacio / 2),(this.state.data.largoEspacio / 2) ]}/>
                    </Canvas>
                </DialogContent>
            </Dialog>
        );
    }
}

Cubicar.propTypes = {};

export default Cubicar;

function Box(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    return (
        <mesh
            {...props}
            ref={ref}
            scale={1}>
            <boxGeometry args={props.size}/>
            <meshStandardMaterial wireframe />
        </mesh>
    )
}
function Base(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    return (
        <mesh
            {...props}
            ref={ref}
            scale={1}>
            <boxGeometry args={props.size}/>
            <meshStandardMaterial color={'#7c7b7b'} />
        </mesh>
    )
}

function BoxPack(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    const texture = useLoader(TextureLoader, boxImage);
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    return (
        <>
            <mesh

                {...props}
                ref={ref}
                scale={hovered ? 1.1 : 1}
                onClick={(event) => click(!clicked)}
                onPointerOver={(event) => hover(true)}
                onPointerOut={(event) => hover(false)}>
                <boxGeometry args={props.size}/>
                <meshStandardMaterial map={texture}  />
            </mesh>
        </>
    )
}
function BoxPackAssigned(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    const texture = useLoader(TextureLoader, boxImageAsignada);
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    return (
        <>
            <mesh

                {...props}
                ref={ref}
                scale={hovered ? 1.1 : 1}
                onClick={(event) => click(!clicked)}
                onPointerOver={(event) => hover(true)}
                onPointerOut={(event) => hover(false)}>

                <boxGeometry args={props.size}/>
                <meshStandardMaterial map={texture}  />
            </mesh>
        </>
    )
}
*/
