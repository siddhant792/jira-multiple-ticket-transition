# jira-multiple-ticket-transition

Find Jira issue keys from commit messages in PR and diff in case of Releases

## Usage

```yaml
- name: Jira multiple ticket transitions
  uses: siddhant792/jira-multiple-ticket-transition@main
  with:
    jira-base-url: https://<yourdomain>.atlassian.net
    jira-user-email: human@example.com
    jira-api-token: ${{ secrets.JIRA_API_TOKEN }}
    github-token: ${{ secrets.GITHUB_TOKEN }}
    target-status: In Progress
    is-pull-request: ${{ github.event_name == 'pull_request' }}
```

## Inputs

| **Name**        | **Description**                                                           | **Required** |
| --------------- | ------------------------------------------------------------------------- | ------------ |
| jira-base-url   | URL of Jira instance                                                      | ✔            |
| jira-api-token  | Access Token for Authorization                                            | ✔            |
| jira-user-email | Email of the user for which Access Token was created for                  | ✔            |
| github-token    | Your everyday GitHub token                                                | ✔            |
| is-pull-request | If true library will read all commits in case of PR                       | ✔            |

## References

- [chontawee/gj-find-transition-issues](https://github.com/chontawee/gj-find-transition-issues)
- [atlassian/gajira-login](https://github.com/atlassian/gajira-login.git)
- [atlassian/gajira-find-issue-key](https://github.com/atlassian/gajira-find-issue-key.git)
- [atlassian/gajira-transition](https://github.com/atlassian/gajira-transition.git)
- [atlassian/action-transition-multiple-jira-issues](https://github.com/bloobirds-it/action-transition-multiple-jira-issues.git)
