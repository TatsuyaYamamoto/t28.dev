import { type FC, useEffect, useRef } from "react";

const EmbeddedTweet: FC<{ html: string }> = (props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const id = "twitter-widgets-js";
    if (document.getElementById(id)) {
      // @ts-ignore
      window.twttr?.widgets.load(containerRef.current);
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = "https://platform.twitter.com/widgets.js";
    document.body.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: props.html }} />
  );
};

export default EmbeddedTweet;
