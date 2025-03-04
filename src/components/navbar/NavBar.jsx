import React from 'react'
import ModeToggle from '../ModeToggle'
import NavigationMenuComponent from './NavigationMenu'

export default function NavBar() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:z-30 lg:px-8 backdrop-blur-xs dark:backdrop-blur-sm bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <NavigationMenuComponent />
                <ModeToggle />
            </nav>
        </header>
    )
}
