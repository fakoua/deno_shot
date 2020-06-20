import { join }  from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import { copy } from "https://deno.land/std@0.57.0/fs/copy.ts";
import { exists } from "https://deno.land/std@0.57.0/fs/exists.ts";
import * as ink from 'https://deno.land/x/ink/mod.ts';
import { Size } from './Config.ts';


export async function getChromium(): Promise<string> {
    let os = getOS();
    if (os != OS.windows) {
        console.log("Not supported OS");
        return "Not supported OS"
    }

    let binPath = await getChromiumPath();
    let chrome = join(binPath, "chrome.exe");
    if (await exists(chrome)) {
        return chrome;
    }
    // download chrome
    await downloadChromium();
    return chrome;
}

export async function getScreenResolution(): Promise<Size> {
    let os = getOS();
    if (os != OS.windows) {
        console.log("Not supported OS");
        return {
            width: 0,
            height: 0
        }
    }

    try {
        let cmd = [
            "powershell.exe",
            "(Get-WmiObject -Class Win32_VideoController).VideoModeDescription"
        ]
        
        const p = Deno.run({
            cmd: cmd,
            stdout: "piped",
            stderr: "null",
        });
        
        let out = await p.output();
        let result = new TextDecoder("utf-8").decode(out);
        p.close();
        let sizes = result.split(" x ");
        return {
            width: parseInt(sizes[0]),
            height: parseInt(sizes[1])
        }
    } catch (error) {
        return {
            height: 600,
            width: 800
        }
    }
}

async function getChromiumPath(): Promise<string> {
    let binFolder = join(getDenoDir(), "bin/webcapture/chrome-win")
    let ex = await exists(binFolder)
    if (ex) {
        return binFolder;
    }
    //Ensure directory
    await ensureDir(binFolder)
    return binFolder;
}

function getDenoDir(): string {
    let os = getOS();
    let homeKey: string = os == OS.windows ? 'USERPROFILE' : 'HOME'
    let homeDir = Deno.env.get(homeKey)
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
    }
    else 
    {
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
    let tempFolder = await Deno.makeTempDir();
    let downloadUrl = "https://github.com/fakoua/DenoShot/raw/master/chrome/chrome-win.exe";
    let result = await fetch(downloadUrl);
    let blob = await result.blob();
    let zipFile = join(tempFolder, "chrome-win.exe");
    await Deno.writeFile(zipFile, new Uint8Array(await blob.arrayBuffer()));
    console.log(ink.colorize("<green>Chrome for windows downloaded successfully.</green>"));
    console.log(ink.colorize("<blue>Unzip Chrome</blue>"));
    let suc = await unZipChrome(zipFile);
    let extract = join(tempFolder, "chrome-win");
    let dest = await getChromiumPath();
    console.log(ink.colorize("<blue>Copy bin files.</blue>"));
    await copy(extract, dest, { overwrite: true });
    console.log(ink.colorize("<red><<< Done >>></red>"))
    return zipFile;
}

async function unZipChrome(zipFile: string): Promise<boolean> {
    const p = Deno.run({
        cmd: [
            zipFile,
            "-y",
            "-o"
        ],
        stdout: "null",
        stderr: "null"
    });
    const res = await p.status();
    p.close();
    return res.success;
}