// Aufruf: node scripts/prepare.js www      (Schriften und PDF-Bibliothek in www kopieren)
//         node scripts/prepare.js android  (Symbol, Manifest und Versionsnummer im Android-Projekt anpassen)
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const mode = process.argv[2];

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function prepareWww() {
  const nm = path.join(root, "node_modules");
  copy(path.join(nm, "jspdf/dist/jspdf.umd.min.js"), path.join(root, "www/vendor/jspdf.umd.min.js"));
  const sans = ["400", "500", "600"];
  const mono = ["500", "600"];
  sans.forEach((w) =>
    copy(
      path.join(nm, `@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-${w}-normal.woff2`),
      path.join(root, `www/fonts/ibm-plex-sans-latin-${w}-normal.woff2`)
    )
  );
  mono.forEach((w) =>
    copy(
      path.join(nm, `@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-${w}-normal.woff2`),
      path.join(root, `www/fonts/ibm-plex-mono-latin-${w}-normal.woff2`)
    )
  );
  console.log("www vorbereitet");
}

async function prepareAndroid() {
  const sharp = require("sharp");
  const res = path.join(root, "android/app/src/main/res");
  if (!fs.existsSync(res)) throw new Error("android/app/src/main/res fehlt. Zuerst 'npx cap add android' ausführen.");

  const TEAL = { r: 10, g: 107, b: 107, alpha: 1 };
  const fgSrc = path.join(root, "icon/icon-foreground.png");
  const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

  for (const [name, f] of Object.entries(densities)) {
    const dir = path.join(res, `mipmap-${name}`);
    fs.mkdirSync(dir, { recursive: true });
    const launcher = Math.round(48 * f);
    const adaptive = Math.round(108 * f);

    // Adaptives Symbol (Android 8 und neuer): Vordergrund mit durchsichtigem Hintergrund
    await sharp(fgSrc).resize(adaptive, adaptive).png().toFile(path.join(dir, "ic_launcher_foreground.png"));

    // Altes Symbol: Herz größer auf türkisem Grund
    const big = Math.round(launcher * 1.55);
    const fg = await sharp(fgSrc).resize(big, big).png().toBuffer();
    const offset = Math.round((big - launcher) / 2);
    const cropped = await sharp(fg).extract({ left: offset, top: offset, width: launcher, height: launcher }).png().toBuffer();
    const square = await sharp({ create: { width: launcher, height: launcher, channels: 4, background: TEAL } })
      .composite([{ input: cropped }])
      .png()
      .toBuffer();
    const r = launcher / 2;
    const roundMask = Buffer.from(`<svg width="${launcher}" height="${launcher}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`);
    const roundedMask = Buffer.from(
      `<svg width="${launcher}" height="${launcher}"><rect width="${launcher}" height="${launcher}" rx="${launcher * 0.18}" fill="#fff"/></svg>`
    );
    await sharp(square).composite([{ input: roundedMask, blend: "dest-in" }]).png().toFile(path.join(dir, "ic_launcher.png"));
    await sharp(square).composite([{ input: roundMask, blend: "dest-in" }]).png().toFile(path.join(dir, "ic_launcher_round.png"));
  }

  // Hintergrundfarbe des adaptiven Symbols
  const valuesDir = path.join(res, "values");
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(
    path.join(valuesDir, "ic_launcher_background.xml"),
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0A6B6B</color>\n</resources>\n'
  );

  // Keine automatische Sicherung in die Cloud: Die Werte bleiben auf dem Handy
  const manifestPath = path.join(root, "android/app/src/main/AndroidManifest.xml");
  let manifest = fs.readFileSync(manifestPath, "utf8");
  manifest = manifest.replace('android:allowBackup="true"', 'android:allowBackup="false"');
  fs.writeFileSync(manifestPath, manifest);

  // Versionsnummer hochzählen, damit Updates über die bestehende App installiert werden können
  const code = process.env.VERSION_CODE || "1";
  const gradlePath = path.join(root, "android/app/build.gradle");
  let gradle = fs.readFileSync(gradlePath, "utf8");
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${code}`).replace(/versionName\s+"[^"]*"/, `versionName "1.${code}"`);
  fs.writeFileSync(gradlePath, gradle);

  console.log("Android-Projekt angepasst, versionCode", code);
}

(async () => {
  if (mode === "www") prepareWww();
  else if (mode === "android") await prepareAndroid();
  else {
    console.error("Aufruf: node scripts/prepare.js www|android");
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
