import React from 'react';

import AllRoutes from "./routes/Routes";

import { configureFakeBackend } from './helpers';

import "nouislider/distribute/nouislider.css";

import "./assets/scss/app.scss";
import "./assets/scss/icons.scss";
import { setAuthorizationToken } from './api';

// configure fake backend
// configureFakeBackend()

const App = () => {

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0TE8wNU4wVGNBQWtCUi9jQjMvZHpzellJRlMxR2NEd2szSUY0VHlWNGUwR2xRVHRDTkNmV2c9PSIsImp0aSI6IjBmNTI3MzdjLWVjZDItNDkyZS05MTBkLTM2NDc2YTAwY2RiNCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4yQHRlc3QuY29tIiwiZXhwIjoxNzQyNTMwMjUwLCJpc3MiOiJtc2UgaGVhbHRoIGNoZWNrdXAiLCJhdWQiOiJtc2UgaGVhbHRoIGNoZWNrdXAifQ._o19D-RfVzWzVpTvzEl2dLSk-6454GvxVmm_Az5eSGs"; // ดึง Token จาก Local Storage
  setAuthorizationToken(token)

  return (
    <>
      <React.Fragment>
        <AllRoutes />
      </React.Fragment>
    </>
  );
}

export default App;
