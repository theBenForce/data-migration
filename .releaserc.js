module.exports = {
  extends: "semantic-release-monorepo",
  branch: "master",
  plugins: [
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: `./lib`,
            label: "Distribution",
          },
          {
            path: `./CHANGELOG.md`,
            label: "Changelog",
          },
        ],
      },
    ],
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
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
