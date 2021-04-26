import defaultTheme from './default'

import { createMuiTheme } from '@material-ui/core'
import lightBlue from "@material-ui/core/colors/lightBlue";


const overrides = {
  typography: {
    h1: {
      fontSize: '3rem'
    },
    h2: {
      fontSize: '2rem'
    },
    h3: {
      fontSize: '1.64rem'
    },
    h4: {
      fontSize: '1.5rem',
    },
    h5: {
      fontSize: '1.285rem',
    },
    h6: {
      fontSize: '1.142rem',
    },
    fontFamily: [
      'Montserrat', 'sans-serif',
      'Roboto'
    ].join(','),
  },
  // MuiGrid:{
  //   margin: "0px"
  // },
}



export default {
  default: createMuiTheme({ ...defaultTheme, ...overrides })
}
