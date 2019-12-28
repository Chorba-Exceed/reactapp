import React from 'react';
import Button from '@material-ui/core/Button';

function LogOut() {
  function logOut() {
    localStorage.clear();
    window.location.href = '/';
  }
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
      {
          localStorage.length > 0
            ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={logOut}
              >
                Log out
              </Button>
            )
            : null
        }
    </div>
  );
}

export default LogOut;
