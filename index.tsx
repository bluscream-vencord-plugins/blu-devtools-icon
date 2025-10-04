/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./index.css";

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { useState, useRef } from "@webpack/common";
import ErrorBoundary from "@components/ErrorBoundary";

const HeaderBarIcon = findComponentByCodeLazy(
    ".HEADER_BAR_BADGE_TOP:",
    '.iconBadge,"top"'
);

function DevToolsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
            <path d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
        </svg>
    );
}

function DevToolsButton({ buttonClass }: { buttonClass: string }) {
    const buttonRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDevTools = () => {
        console.log("DevTools button clicked - attempting to open DevTools...");
        try {
            // Method 1: Try DiscordNative.window.toggleDevTools (Discord's native method)
            if (window.DiscordNative?.window?.toggleDevTools) {
                console.log("Using DiscordNative.window.toggleDevTools()");
                window.DiscordNative.window.toggleDevTools();
                setIsOpen(!isOpen);
                return;
            }

            // Method 2: Try webContents.openDevTools (Electron API)
            if (window.webContents?.openDevTools) {
                console.log("Using window.webContents.openDevTools()");
                window.webContents.openDevTools();
                setIsOpen(!isOpen);
                return;
            }

            // Method 3: Try accessing Electron's remote module
            if (window.require) {
                try {
                    const { remote } = window.require("electron");
                    if (remote?.getCurrentWindow) {
                        remote.getCurrentWindow().webContents.openDevTools();
                        setIsOpen(!isOpen);
                        return;
                    }
                } catch (e) {
                    // Remote module might not be available
                }
            }

            // Method 4: Use debugger statement to trigger DevTools
            console.log("Opening DevTools via debugger statement...");
            debugger;
            setIsOpen(!isOpen);

            // Method 5: Fallback - dispatch keyboard shortcut (Ctrl+Alt+O)
            setTimeout(() => {
                const event = new KeyboardEvent("keydown", {
                    key: "o",
                    code: "KeyO",
                    ctrlKey: true,
                    altKey: true,
                    bubbles: true,
                });
                document.dispatchEvent(event);
            }, 100);
        } catch (error) {
            console.error("Failed to open DevTools:", error);
            // Last resort: just use debugger
            console.log("Using debugger as final fallback...");
            debugger;
        }
    };

    return (
        <HeaderBarIcon
            ref={buttonRef}
            className={`vc-devtools-btn ${buttonClass}`}
            onClick={toggleDevTools}
            tooltip="Open DevTools (multiple fallback methods)"
            icon={() => <DevToolsIcon />}
            selected={isOpen}
        />
    );
}

export default definePlugin({
    name: "Blu DevTools Icon",
    description:
        "Adds a DevTools icon next to the inbox icon in the top navigation",
    authors: [
        { name: "Bluscream", id: 0n },
        { name: "Cursor.AI", id: 0n },
    ],

    patches: [
        {
            find: '?"BACK_FORWARD_NAVIGATION":',
            replacement: {
                match: /focusSectionProps:"HELP".{0,20},className:(\i(?:\.button)?)\}\),/,
                replace: "$& $self.renderDevToolsButton($1),",
            },
        },
    ],

    renderDevToolsButton: (buttonClass: string) => (
        <ErrorBoundary noop>
            <DevToolsButton buttonClass={buttonClass} />
        </ErrorBoundary>
    ),
});
