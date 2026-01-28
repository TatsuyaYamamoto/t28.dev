import type { Person } from "schema-dts";

import profilePic from "../assets/images/profile-pic.jpg";
import { SITE_URL } from "../constants.ts";

export const tatsuyaPersonJsonLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  // Google required properties
  // https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ja#profile-target-specification
  name: "YAMAMOTO Tatsuya",
  // Google recommended properties
  // https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ja#profile-target-specification
  alternateName: ["@T28_tatsuya"],
  description: "LLer and programmer.",
  image: new URL(profilePic.src, SITE_URL).href,
  sameAs: [
    "https://twitter.com/T28_tatsuya",
    "https://x.com/T28_tatsuya",
    "https://github.com/TatsuyaYamamoto",
  ],
  // other properties
} satisfies Person;
