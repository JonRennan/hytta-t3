"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {MoonIcon, SunIcon} from "lucide-react";

import {Button} from "~/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "~/components/ui/tooltip";

export function ModeToggle() {
    const {setTheme, theme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;

    return (
        <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <Button
                        className="bg-background mr-2 h-8 w-8 rounded-full"
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <SunIcon
                            className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-transform duration-500 ease-in-out dark:scale-100 dark:rotate-0"/>
                        <MoonIcon
                            className="absolute h-[1.2rem] w-[1.2rem] rotate-0 transition-transform duration-500 ease-in-out dark:scale-0 dark:-rotate-90"/>
                        <span className="sr-only">Bytt modus</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Bytt modus</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
