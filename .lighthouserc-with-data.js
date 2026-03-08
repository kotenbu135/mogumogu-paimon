module.exports = {
  ci: {
    collect: {
      url: ["https://kotenbu135.github.io/mogumogu-paimon/"],
      puppeteerScript: "./lighthouse-setup.cjs",
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.6 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci-with-data",
    },
  },
};
