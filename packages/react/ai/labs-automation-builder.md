# Labs trigger-condition-action builder

`/experiments/automation-builder` studies an editable sentence that becomes
structured When / If / Then blocks as complexity grows. It takes inspiration
from [Jira Automation](https://www.atlassian.com/software/jira/features/automation)
without connecting to Jira or any other service.

`RuleBuilder.jsx` is controlled by `rule`, `onChange` and `mode` (`auto`,
`sentence`, `blocks`). The host owns templates, test samples and results. Rules
contain `name`, `trigger`, `match` (`all`/`any`), conditions with stable IDs and
field/operator/value, and ordered actions with stable IDs and type/value.

Automatic switches to blocks when there is more than one condition or action,
and back when the rule becomes simple. Both presentations edit the same objects;
configuration changes never translate, parse or discard rule data. Each phrase
opens an explicitly named A1 Dialog with a draft; Save commits, Cancel/Escape
preserve the prior value. The parent keeps Add controls mounted across automatic
conversion. Removing a clause returns focus to its Add control. A stable polite
status announces changes. The dialog handles trapping and returning focus.

Support up to six conditions and six actions. Conditions offer equality and
inequality on priority, type and status. All/Any determine conjunction; no
conditions means every matching trigger continues. At least one action remains.
Actions support notify, assign, change status and comment; earlier/later buttons
change action order without dragging. Blank names/comments cannot be tested/saved.

`rule-model.js` owns validation, summaries, presentation selection and pure test
logic. Tests compare trigger first, then conditions, then report ordered actions
as Would run or Skipped. A mismatched trigger marks conditions Not evaluated.
This is a dry run: nothing is sent, assigned, saved or enabled. Rule/sample edits
clear stale results. The optional structured JSON is the same controlled rule.

Uses only A1 controls, Card icons, Stack/Grid, Code and responsive shell. No new
CSS, tokens or animation. Unit checks cover AND/OR, negation, empty conditions,
invalid rules, trigger mismatch and immutable ordering. Browser checks cover
editing, dialog focus, automatic conversion, switching views without loss,
matching/skipped traces, keyboard, phone layout and scoped axe. Human screen-reader
review and a standalone host are still needed before promotion.
