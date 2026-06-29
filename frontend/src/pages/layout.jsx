import React from 'react';
import { Outlet, Link } from 'react-router-dom';
export default function Layout() {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/posts">Posts</Link>
                    </li>
                    <li>
                        <Link to="/users">Users</Link>
                    </li>
                </ul>
                <Outlet />
            </nav>
        </>
    );
}