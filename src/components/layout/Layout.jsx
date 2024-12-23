import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }) => {
    return (
        <div className='min-h-screen flex justify-center bg-white'>

            {children}

        </div>
    )
}

export default Layout
