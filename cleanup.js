const core = require('@actions/core');
const http = require("@actions/http-client");


const fs = require('fs');

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info("cleanup");
    core.info(JSON.stringify(process.env));
    client = new http.HttpClient("pse-action", [], {
      ignoreSslError: true,
    });
    const base = process.env.GITHUB_SERVER_URL + "/";
    const repo = process.env.GITHUB_REPOSITORY;
    const api = process.env.GITHUB_API_URL + "/repos";
    const run_id = process.env.GITHUB_RUN_ID;
    const token = process.env.ACTIONS_RUNTIME_TOKEN;
    core.info("token: " + token);




    const q = new URLSearchParams({
      build_url: base + repo + "/actions/runs/" + process.env.GITHUB_RUN_ID + "/attempts/" + process.env.GITHUB_RUN_ATTEMPT,
      status: process.env.GITHUB_RUN_RESULT
    });
    client.post('https://pse.invisirisk.com/end', q.toString(),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );

  } catch (error) {
    core.setFailed(error.message);
  }
} ''

run();
