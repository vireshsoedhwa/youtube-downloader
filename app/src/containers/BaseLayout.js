import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom'

export default function BaseLayout(props) {

    return (
        <>
            <nav class="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                        <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                            <li>
                                <a href="/home" class="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent 
                                md:text-blue-700 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                                    aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="/create" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 
                                md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white 
                                md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white 
                                md:dark:hover:bg-transparent">
                                    Create</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}
