// Loading page 

/* Simple jsx loading page while calling CanvasAPI 

*/ 

import React from 'react';

export const Loading = () => {
    return (
        <div style={styles.container}>
            <h1>Loading</h1>
            <div style={styles.spinner}></div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    spinner: {
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        marginTop: '20px',
    },
};

// Create keyframes for the spinner animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default Loading;
