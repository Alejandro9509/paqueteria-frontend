import React from 'react'
import { usePromiseTracker } from 'react-promise-tracker'
import './style.css'
import * as animationData from '../../Assets/Animations/Loader.json'
import Lottie from 'react-lottie-player'
import { Modal } from '@mui/material'

export const Spinner = props => {
    const { promiseInProgress } = usePromiseTracker()
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }
    return (
        promiseInProgress && (
            <Modal
                open style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}
                disablePortal
                disableEnforceFocus
                disableAutoFocus
            >
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    zIndex: 1301,
                    transform: 'translate(-50%, -50%)'
                }}
                >
                    <Lottie
                        loop
                        animationData={animationData.default}
                        style={{ height: "200px", width: "200px" }}
                        play
                    />
                </div>
            </Modal>
        )
    )
}
