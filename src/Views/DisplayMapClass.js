// src/DisplayMapFC.js

import * as React from 'react';
import HPlatform, { HMap, HMapPolyLine } from "react-here-map";

export const DisplayMapClass = () => {
  // Create a reference to the HTML element we want to put the map on



  return (
    <HPlatform
    app_id="2Ts3vDUTLPW8kNUtyFRY"
    app_code="MDivMVFtNkpim-dWuetlWw"
    useCIT
    useHTTPS
    includeUI
    includePlaces
  >
    <HMap
      style={{
        height: "400px",
        width: "800px",
      }}
      mapOptions={{ center: { lat: 32.663334, lng: -115.467781 }, zoom: 4 }}
    >
    </HMap>
  </HPlatform>
  );
};