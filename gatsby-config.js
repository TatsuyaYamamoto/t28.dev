module.exports = {
  siteMetadata: {
    title: `t28.dev`,
    author: {
      name: `@T28_tatsuya`,
      summary: `LLer and programmer.`,
      twitterUrl: `https://twitter.com/T28_tatsuya`,
    },
    description: `@T28_tatsuyaが、あれこれ書いている。`,
    siteUrl: `https://t28.dev`,
    defaultOgpImageUrl: `https://t28.dev/dairi@4x.png`,
  },
  plugins: [
    `gatsby-plugin-netlify`,
    `gatsby-plugin-typegen`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sass`,
    // https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sitemap
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/docs`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 600,
              wrapperStyle: `
                box-shadow: 0 0px 5px 2px rgb(240 240 250);
              `,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          // `gatsby-remark-autolink-headers` must be before `gatsby-remark-prismjs`,
          // https://www.gatsbyjs.com/plugins/gatsby-remark-autolink-headers/?=header#how-to-use
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,

    // https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/?=gatsby-plugin-google-gtag
    // NOTE: This plugin only works in production mode!
    // To test your Global Site Tag is installed and firing events correctly run: gatsby build && gatsby serve.
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [`G-BGKVY5GV23`],
        pluginConfig: {
          head: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `t28.dev`,
        short_name: `t28.dev`,
        start_url: `/`,
        background_color: `#ffffff`,
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/images/icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
  ],
};
