const core = require('@actions/core');
const github = require('@actions/github');
const matchAll = require("match-all");
const Octokit = require("@octokit/rest");

class Github {
  constructor() {
    const token = core.getInput("github-token");

    if (!token) {
      throw new Error("Missing GitHub token input");
    }
  }
  
  async extractJiraKeys() {
    let jiraIssuesArr = [];
    try {
        const regex = /((([A-Z]+)|([0-9]+))+-\d+)/g;
        const isPullRequest = core.getInput('is-pull-request') == 'true';
        const payload = github.context.payload;
        const token = core.getInput("github-token");
        const octokit = new Octokit({
            auth: token,
        });
        if (isPullRequest) {
            let resultArr = [];
            const owner = payload.repository.owner.login;
            const repo = payload.repository.name;
            const prNum = payload.number;
            const { data } = await octokit.pulls.listCommits({
                owner: owner,
                repo: repo,
                pull_number: prNum
            });
            data.forEach((item) => {
                const commit = item.commit;
                const matches = matchAll(commit.message, regex).toArray();
                matches.forEach((match) => {
                    if (resultArr.find((element) => element == match)) {}
                    else {
                        resultArr.push(match);
                    }
                });
            });
            jiraIssuesArr = resultArr;
        }
        else {
            if (payload.action == 'published') {
              // console.log("parse-all-commits input val is true");
              let resultArr = [];
              const body = payload.release.body;
              const prefix = "compare/";
              let tags = body.substring(body.lastIndexOf(prefix) + prefix.length)
              let diffUrl = String(payload.repository.compare_url).replace("{base}...{head}", tags);
              await octokit.request(`GET ${diffUrl}`, {
                  owner: "octokit",
                  repo: "core.js"
              }).then(response => {
                  response.data.commits.forEach((commit) => {
                      const matches = matchAll(commit.commit.message, regex).toArray();
                      matches.forEach((match) => {
                          if (resultArr.find((element) => element == match)) {
                          }
                          else {
                              resultArr.push(match);
                          }
                      });
                  });
              });
              jiraIssuesArr = resultArr
            }
            else {
                const matches = matchAll(payload.head_commit.message, regex).toArray();
                jiraIssuesArr = matches;
            }
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
    return jiraIssuesArr;
  }
}

module.exports = Github;
