const core = require("@actions/core");
const Jira = require("./jira");
const Github = require("./github");

class App {
  constructor() {
    this.targetStatus = core.getInput("target-status");
    if (!this.targetStatus) {
      throw new Error("Missing target status input");
    }
    
    this.jira = new Jira();
    this.github = new Github();
  }

  async run() {
    const issueList = await this.github.extractJiraKeys();
    if (issueList.length === 0) {
      console.log(`No issues found`);
      return;
    }

    console.log(`Found issue keys: ${issueList.join(", ")}`);
    const transitionIds = await this.getTransitionIds(issueList);
    console.log("Transition ids ---------> " + transitionIds);
    // await this.transitionIssues(issueList, transitionIds);
  }

  async getTransitionIds(issues) {
    const transitionIds = await Promise.all(
      issues.map(async (issue) => {
        const { transitions } = await this.jira.getIssueTransitions(issue);
        console.log("Transitions: ", transitions);
        // const targetTransition = transitions.find(({ name }) => name === this.targetStatus);
        // if (!targetTransition) {
        //   console.log(`Cannot find transition to status "${this.targetStatus}"`);
        //   return null;
        // }
        // return targetTransition.id;
      })
    );

    return transitionIds.filter(Boolean);
  }

  async transitionIssues(issueList, transitionsIds) {
    for (let i = 0; i < issueList.length; i++) {
      const issueKey = issueList[i].key;
      const transitionId = transitionsIds[i];
      await this.jira.transitionIssue(issueKey, transitionId);
    }
  }
}

module.exports = App;
