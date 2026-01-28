import type { Person } from "schema-dts";

export const tatsuyaPersonJsonLd = {
  "@type": "Person",
  "@id": "https://t28.dev/#person",
  // Google required properties
  // https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ja#profile-target-specification
  name: "YAMAMOTO Tatsuya",
  // Google recommended properties
  // https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ja#profile-target-specification
  alternateName: ["@T28_tatsuya"],
  description: "LLer and programmer.",
  image: "https://t28.dev/profile.jpg",
  sameAs: [
    "https://twitter.com/T28_tatsuya",
    "https://x.com/T28_tatsuya",
    "https://github.com/TatsuyaYamamoto",
  ],
  // other properties
} satisfies Person;
