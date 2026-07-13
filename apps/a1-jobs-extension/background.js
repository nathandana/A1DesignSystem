function enableSidePanelOnAction() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {})
}

chrome.runtime.onInstalled.addListener(enableSidePanelOnAction)
chrome.runtime.onStartup.addListener(enableSidePanelOnAction)
enableSidePanelOnAction()
