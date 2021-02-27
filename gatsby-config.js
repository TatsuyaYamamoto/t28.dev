module.exports = {
  siteMetadata: {
    title: `t28.dev`,
    author: {
      name: `@T28_tatsuya`,
      summary: `LLer and programmer.`,
    },
    description: `@T28_tatsuyaが、あれこれ書いている。`,
    siteUrl: `https://t28.dev`,
    social: {
      twitter: `@T28_tatsuya`,
    },
  },
  plugins: [
    `gatsby-plugin-typegen`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
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

    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-gatsby-cloud`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
