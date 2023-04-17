const core = require('@actions/core');
const http = require("@actions/http-client");

const fs = require('fs');
const exec = require('@actions/exec')
const glob = require('@actions/glob');

const dns = require('dns')
const util = require('util')


// most @actions toolkit packages have async methods
async function run() {
  try {

    let base = process.env.GITHUB_SERVER_URL + "/";
    let repo = process.env.GITHUB_REPOSITORY;
    // setup 
    await exec.exec('update-ca-certificates');


    await exec.exec("apk", ["add", "iptables", "bind-tools", "ca-certificates"])
    await exec.exec("iptables", ["-t", "nat", "-N", "pse"])
    await exec.exec("iptables", ["-t", "nat", "-A", "OUTPUT", "-j", "pse"])

    const lookup = util.promisify(dns.lookup);
    const dresp = await lookup('pse', nil, (err, addr, family) => { });
    console.log(dresp);

    client = new http.HttpClient("pse-action", [], {
      ignoreSslError: true,
    });

    core.warning("getting ca");
    const res = await client.get('https://pse.invisirisk.com/ca1');
    if (res.message.statusCode != 200) {
      core.error("error getting ca certificate, status " + res.message.statusCode)
      throw "error getting ca  certificate"
    }
    const cert = await res.readBody()
    fs.writeFileSync("/etc/ssl/certs/pse.pem", cert);
    core.exportVariable('NODE_EXTRA_CA_CERTS', '/etc/ssl/certs/pse.pem');
    await exec.exec('update-ca-certificates');


    let q = new URLSearchParams({
      'builder': 'github',
      'build_id': process.env.GITHUB_RUN_ID,
      build_url: base + repo + "/actions/runs/" + process.env.GITHUB_RUN_ID + "/attempts/" + process.env.GITHUB_RUN_ATTEMPT,
      project: process.env.GITHUB_REPOSITORY,
      builder_url: base,
      scm: 'git',
      scm_commit: process.env.GITHUB_SHA,
      //      scm_prev_commit = process,
      scm_branch: process.env.GITHUB_REF_NAME,
      scm_origin: base + repo,
    });
    await client.post('https://pse.invisirisk.com/start', q.toString(),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
