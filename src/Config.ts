export interface Config {
    /**
     * Full Path of the output image (png only).
     * Default: C:\temp\screenshot.png
     */
    image?: string,

    /**
     * Window Size (ignored if Maximize is true).
     * Default: 800, 600
     */
    windowSize?: Size,

    /**
     * Capture full screen url (overrides windowSize).
     * Default: false
     */
    maximized?: boolean,

    /**
     * URL Page to capture.
     */
    url: string,

    /**
     * Used in the return: true when success.
     */
    success?: boolean
}

export interface Size {
    width: number, 
    height: number
}

export function defaultConfig(config: Config): Config {
    if (config.maximized === undefined) { config.maximized = false; }
    if (config.image === undefined) { config.image = "C:\\temp\\screenshot.png"; }
    if (config.windowSize === undefined) {
        config.windowSize = {
            height: 600,
            width: 800,
        };
    }

    return config;
}

export function sizeToString(size?: Size): string {
    if (size === undefined) {
        return "800,600";
    }
    return `${size.width},${size.height}`;
}

export function stringToSize(stringSize: string): Size {
    const pos = stringSize.split(",");
    if (pos.length !== 2) {
        return {
            height: 600,
            width: 800
        };
    }

    return {
        height: parseInt(pos[1], 10),
        width: parseInt(pos[0], 10)
    }
}
