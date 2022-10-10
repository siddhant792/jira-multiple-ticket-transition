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
            let resultArr = [];
            if (isPullRequest) {
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
                        if (!resultArr.find((element) => element == match)) {
                            resultArr.push(match);
                        }
                    });
                });
            } else {
                const body = payload.action != 'published' ? payload.head_commit.message : payload.release.body;
                const matches = matchAll(body, regex).toArray();
                matches.forEach((match) => {
                    if (!resultArr.find((element) => element == match)) {
                        resultArr.push(match);
                    }
                });
            }
            jiraIssuesArr = resultArr;
        }
        catch (error) {
            core.setFailed(error.message);
        }
        return jiraIssuesArr;
    }
}

module.exports = Github;
