const hooks = require("semantic-release-monorepo-hooks");
const output = hooks();

module.exports = {
  extends: "semantic-release-monorepo",
  tagFormat: output.package + "@${version}",
  branches: ["master", "switch-to-github-workflows"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: "**/dist/**",
            label: "Distribution",
          },
          {
            path: "**/CHANGELOG.md",
            label: "Changelog",
          },
        ],
      },
    ],
  ],
  monorepo: {
    analyzeCommits: ["@semantic-release/commit-analyzer"],
    generateNotes: ["@semantic-release/release-notes-generator"],
  },
  verifyConditions: [],
  verifyRelease: ["@semantic-release/npm", "@semantic-release/github"]
    .map(require)
    .map((x) => x.verifyConditions),
};
