import type { FC } from "react";
import { GTAG_ID } from "../constants";

const GtagSnippet: FC = () => {
  if (import.meta.env.MODE === "development") {
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "${GTAG_ID}");
      `,
        }}
      ></script>
    </>
  );
};

export default GtagSnippet;
