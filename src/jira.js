const axios = require("axios");
const core = require("@actions/core");

class Jira {
  constructor() {
    const userEmail = core.getInput("jira-user-email");
    const apiToken = core.getInput("jira-api-token");
    const baseUrl = core.getInput("jira-base-url");

    if (!userEmail || !apiToken || !baseUrl) {
      throw new Error("Missing Jira input argument");
    }

    const token = Buffer.from(`${userEmail}:${apiToken}`).toString("base64");
    this.api = axios.create({
      baseURL: `${baseUrl}/rest/api/3`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    });
  }

  getBaseUrl() {
    return core.getInput("jira-base-url");
  }

  async getIssue(issueId) {
    const path = `issue/${issueId}`;
    const { data } = await this.api.get(path);
    return data;
  }

  async getIssueTransitions(issueId) {
    const path = `issue/${issueId}/transitions`;
    const { data } = await this.api.get(path);
    return data;
  }

  async transitionIssue(issueId, transitionId) {
    const path = `issue/${issueId}/transitions`;
    const body = {
      transition: {
        id: transitionId,
      },
    };
    const { data } = await this.api.post(path, body);
    return data;
  }
}

module.exports = Jira;
