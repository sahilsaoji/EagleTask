// Login Page 

// Login page to get a users CanvasAPI key and store it in the local storage.

import React, { useState } from 'react';

export const Login = () => {
    const [api_key, setApiKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('api_key', api_key);
        window.location.href = '/dashboard';
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    API Key:
                    <input type="text" value={api_key} onChange={(e) => setApiKey(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )

}

export default Login