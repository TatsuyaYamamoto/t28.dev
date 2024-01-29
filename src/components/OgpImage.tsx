import { readFileSync } from "node:fs";

import { ImageResponse } from "@vercel/og";

import t28Profile from "../assets/images/profile-pic.jpg";

console.log("t28Profile.src", t28Profile.src);
console.log("import.meta.url", import.meta.url);

const t28ProfileUrl = import.meta.env.DEV
  ? new URL(t28Profile.src.replace("/@fs", "file://"))
  : new URL(`..${t28Profile.src}`, import.meta.url);
const t28ProfileBase64 = readFileSync(t28ProfileUrl, { encoding: "base64" });
const t28ProfileDataUrl = `data:image/jpeg;base64,${t28ProfileBase64}`;

const fontFamilyDataCache = new Map<string, ArrayBuffer>();

/**
 * ref: https://www.unpkg.com/@vercel/og@0.5.6/dist/index.node.js
 */
const getGoogleFontData = async (query: string): Promise<ArrayBuffer> => {
  const cached = fontFamilyDataCache.get(query);
  if (cached) {
    console.log(`[ogp-font] cache-hit: ${query}`);
    return cached;
  }
  console.log(`[ogp-font] cache-miss: ${query}`);

  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${query}`;

  const googleFontCss = await fetch(googleFontUrl).then((res) => res.text());

  const fontUrl = googleFontCss.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  )?.[1];

  if (!fontUrl) {
    throw new Error(`unexpected. css data is invalid -> ${googleFontCss}`);
  }

  const arrayBuffer = await fetch(fontUrl).then((res) => res.arrayBuffer());

  // cache
  fontFamilyDataCache.set(query, arrayBuffer);

  return arrayBuffer;
};

export const getBlogPostOgpImageResponse = async (params: {
  title: string;
}): Promise<Response> => {
  return new ImageResponse(
    (
      <div
        lang="ja-JP"
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          padding: 40,
          backgroundColor: "rgba(242, 242, 248, 0.5)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 20,
            padding: 40,
            backgroundColor: "#ffffff",
            border: "1px solid #dfdfdf",
            boxShadow: "0 2px 4px rgba(67, 133, 187, 0.07)",
          }}
        >
          <div
            style={{
              flex: 1,
              alignItems: "center",
              fontSize: 70,
              fontWeight: 700,
              color: "#000000",

              // 長いタイトルは3行を上限にして ... で省略する
              display: "-webkit-box",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {params.title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ flex: 1 }} />
            <img
              src={t28ProfileDataUrl}
              alt=""
              style={{
                width: 60,
                height: 60,
                borderRadius: 100000,
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 40,
                fontWeight: 700,
                marginLeft: 15,
                color: "#005b99",
              }}
            >
              t28.dev
            </div>
          </div>
        </div>
      </div>
    ),
    {
      fonts: [
        {
          name: "Noto Sans JP",
          data: await getGoogleFontData("Noto+Sans+JP:wght@700"),
          style: "normal",
        },
      ],
    },
  );
};
