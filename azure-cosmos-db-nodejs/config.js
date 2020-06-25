// @ts-check

const config = {
  endpoint: "https://hemiedisondb.documents.azure.com:443/",
  key: "dPWVVQotOD8JSJB8UTEXXtj0isLhyNDxwxuXIzWDFyYSyliZpLQjEMrcrIWhh2cwCXgRwEl4RAGA8cfLfbfWcg==",
  databaseId: "hemiedisondb",
  containerId: "plan",
  partitionKey: { kind: "Hash", paths: ["/"] }
};

module.exports = config;
