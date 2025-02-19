"use client"
import { useParams } from 'next/navigation';
import React from 'react'

function page() {

    const { year, season, title } = useParams();
    return (
        <div>
            <p>Year: {year}</p>
            <p>Season: {season}</p>
            <p>ID {title}</p>
        </div>
    )
}

export default page
