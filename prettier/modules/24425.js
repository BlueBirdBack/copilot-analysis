Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.checkFileOnLoad = exports.registerCopilotIgnore = void 0;
const r = require(89496);
const i = require(1402);
const o = require(25112);
const s = require(54913);
const a = require(60070);
async function c(e) {
  return await r.workspace.fs.readFile(e).then(e => e.toString());
}
exports.registerCopilotIgnore = async function (e) {
  const t = [];
  const n = new s.CopilotIgnoreManager(e);
  async function l() {
    const e = await r.workspace.findFiles(`**/${o.COPILOT_IGNORE_FILE}`);
    for (const [t, r] of await async function (e) {
      const t = [];
      for (const n of e) t.push(c(n).then(e => [n, e]));
      return Promise.all(t);
    }(e)) n.onDidIgnorePatternCreate(t, r);
  }
  e.forceSet(s.CopilotIgnoreManager, n);
  if (r.workspace.workspaceFolders) {
    await l();
  }
  if (a.isRunningInTest(e)) {
    n.enabled(!0);
  } else {
    t.push(function (e, t) {
      function n(e, n) {
        t.enabled(!0 === n?.copilotignore_enabled);
      }
      const r = e.get(i.CopilotTokenNotifier);
      r.on("onCopilotToken", n);
      return {
        dispose() {
          r.off("onCopilotToken", n);
        }
      };
    }(e, n));
  }
  t.push(r.workspace.onDidChangeWorkspaceFolders(e => {
    for (const t of e.removed) n.onDidWorkspaceRemove(t.uri);
    return l();
  }));
  t.push(r.workspace.onDidOpenTextDocument(e => n.onDidOpenTextDocument(e?.uri)), r.window.onDidChangeActiveTextEditor(e => n.onDidOpenTextDocument(e?.document?.uri)));
  t.push(r.workspace.onDidSaveTextDocument(async e => {
    if (n.isCopilotIgnoreFile(e.uri)) {
      const t = await c(e.uri);
      n.onDidIgnorePatternCreate(e.uri, t);
    }
  }), r.workspace.onDidDeleteFiles(e => {
    for (const t of e.files) n.onDidIgnorePatternDelete(t);
  }), r.workspace.onDidRenameFiles(async e => {
    for (const t of e.files) if (n.isCopilotIgnoreFile(t.newUri)) {
      const e = await c(t.newUri);
      n.onDidIgnorePatternMove(t.oldUri, t.newUri, e);
    }
  }));
  return r.Disposable.from(...t);
};
exports.checkFileOnLoad = async function (e) {
  if (r.window?.activeTextEditor) {
    e.get(s.CopilotIgnoreManager).setIgnoredStatus(r.window.activeTextEditor.document?.uri);
  }
};