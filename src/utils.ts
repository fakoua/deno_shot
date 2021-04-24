import { join } from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import { copy } from "https://deno.land/std@0.69.0/fs/copy.ts";
import { exists } from "https://deno.land/std@0.69.0/fs/exists.ts";
import * as ink from "https://deno.land/x/ink/mod.ts";
import type { Size } from "./Config.ts";


export async function getChromium(): Promise<string> {
    const os = getOS();
    if (os !== OS.windows) {
        console.log("Not supported OS");
        return "Not supported OS"
    }

    const binPath = await getChromiumPath();
    const chrome = join(binPath, "chrome.exe");
    if (await exists(chrome)) {
        return chrome;
    }
    // download chrome
    await downloadChromium();
    return chrome;
}

export async function getScreenResolution(): Promise<Size> {
    const os = getOS();
    if (os !== OS.windows) {
        console.log("Not supported OS");
        return {
            width: 0,
            height: 0
        }
    }

    try {
        const cmd = [
            "powershell.exe",
            "(Get-WmiObject -Class Win32_VideoController).VideoModeDescription"
        ]

        const p = Deno.run({
            cmd: cmd,
            stdout: "piped",
            stderr: "null",
        });

        const out = await p.output();
        const result = new TextDecoder("utf-8").decode(out);
        p.close();
        const sizes = result.split(" x ");
        return {
            width: parseInt(sizes[0], 10),
            height: parseInt(sizes[1], 10)
        }
    } catch (error) {
        return {
            height: 600,
            width: 800
        }
    }
}

async function getChromiumPath(): Promise<string> {
    const binFolder = join(getDenoDir(), "bin/webcapture/chrome-win")
    const ex = await exists(binFolder)
    if (!ex) {
        // Ensure directory
        await ensureDir(binFolder)
    }
    return binFolder;
}

function getDenoDir(): string {
    const os = getOS();
    const homeKey: string = os === OS.windows ? "USERPROFILE" : "HOME"
    const homeDir = Deno.env.get(homeKey)
    let relativeDir = "";

    switch (os) {
        case OS.windows:
            relativeDir = "AppData/Local/deno"
            break;
        case OS.linux:
            relativeDir = ".cache/deno"
            break;
        case OS.darwin:
            relativeDir = "Library/Caches/deno"
            break;
    }

    if (homeDir === undefined) {
        return "";
    } else {
        return join(homeDir, relativeDir)
    }
}

function getOS(): OS {
    return OS[Deno.build.os];
}

enum OS {
    windows = "windows",
    linux = "linux",
    darwin = "darwin",
}

async function downloadChromium(): Promise<string> {
    console.log(ink.colorize("<green>Downloading Chrome for windows, please wait...</green>"));
    const tempFolder = await Deno.makeTempDir();
    const downloadUrl = "https://denostars.000webhostapp.com/chrome-win.exe";
    const result = await fetch(downloadUrl);
    const blob = await result.blob();
    const zipFile = join(tempFolder, "chrome-win.exe");
    await Deno.writeFile(zipFile, new Uint8Array(await blob.arrayBuffer()));
    console.log(ink.colorize("<green>Chrome for windows downloaded successfully.</green>"));
    console.log(ink.colorize("<blue>Unzip Chrome</blue>"));
    const p = Deno.run({
        cmd: [zipFile, "-y"],
        stdout: "null",
        stderr: "null"
    });
    await p.status();
    p.close()
    const extract = join(tempFolder, "chrome-win");
    const dest = await getChromiumPath();
    console.log(ink.colorize("<blue>Copy bin files.</blue>"));
    await copy(extract, dest, { overwrite: true });
    console.log(ink.colorize("<red><<< Done >>></red>"))
    return zipFile;
}
