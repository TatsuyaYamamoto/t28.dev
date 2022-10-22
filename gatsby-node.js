const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const blogPostTemplate = path.resolve(`./src/templates/blog-post.tsx`);
const roundupPostTemplate = path.resolve(`./src/templates/roundup-post.tsx`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const {
    data: {
      allMdx: { nodes: blogPosts },
    },
  } = await graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: ASC }
          filter: { fields: { type: { eq: "blog" } } }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
              type
            }
            frontmatter {
              roundup
            }
          }
        }
      }
    `
  );

  blogPosts.forEach((post, index) => {
    const roundupPostSlug = post.frontmatter.roundup;
    const previousPostId = index === 0 ? null : blogPosts[index - 1].id;
    const nextPostId =
      index === blogPosts.length - 1 ? null : blogPosts[index + 1].id;

    createPage({
      path: post.fields.slug,
      component: blogPostTemplate,
      context: {
        id: post.id,
        roundupPostSlug,
        previousPostId,
        nextPostId,
      },
    });
  });

  const {
    data: {
      allMdx: { nodes: roundupPosts },
    },
  } = await graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: ASC }
          filter: { fields: { type: { eq: "roundup" } } }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
              type
            }
          }
        }
      }
    `
  );

  roundupPosts.forEach((post) => {
    createPage({
      path: post.fields.slug,
      component: roundupPostTemplate,
      context: { id: post.id },
    });
  });
};

/**
 *
 * @param {import('gatsby').CreateNodeArgs["node"]} node
 * @param {import('gatsby').CreateNodeArgs["actions"]} actions
 * @param getNode
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value: slug,
    });

    const filePathPattern = new RegExp(
      `^${__dirname}/content/(?<type>[0-9a-zA-Z]+)/.+`
    );
    const {
      groups: { type },
    } = filePathPattern.exec(node.fileAbsolutePath);
    createNodeField({
      name: `type`,
      node,
      value: type,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type Mdx implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `);
};

exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const config = getConfig();

  config.module.rules = config.module.rules.map((rule) => {
    if (
      // isEslintLoaderRule
      Array.isArray(rule.use) &&
      rule.use[0].loader.match(/\/eslint-loader\//)
    ) {
      // overwrite webpack Module Rule.test assertion for TypeScript.
      // gatsby's default value is /\.jsx?$/
      // https://github.com/gatsbyjs/gatsby/blob/gatsby%402.32.0/packages/gatsby/src/utils/webpack-utils.ts#L491
      rule.test = /\.[jt]sx?$/;
    }

    return rule;
  });

  actions.replaceWebpackConfig(config);
};
