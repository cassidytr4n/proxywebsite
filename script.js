let tabStart = 2;
let tabCount = tabStart;
let activeTabs = new Set([1, 2]); // Track which tab numbers are currently active

// Add X button to tab 2 only
const tab1 = document.querySelector(`[data-tab="1"]`);
const tab2 = document.querySelector(`[data-tab="2"]`);
enableTabRenaming(tab1);
enableTabRenaming(tab2);

const xButton = document.createElement("button");
xButton.className = "xbutton";
xButton.textContent = "❌";
xButton.onclick = (e) => {
  e.stopPropagation();
  closeTab(2);
};
tab2.appendChild(xButton);

// Proxy input & iframe
document.getElementById("EnterButton").addEventListener("click", () => {
  let url = document.getElementById("InputId").value.trim();

  if (!url) {
    alert("Please enter a URL.");
    return;
  }

  // Get selected tab from dropdown
  const selectedTab = document.getElementById("tabSelect").value;
  const tabNumber = selectedTab.replace("tab", "").replace("Content", "");

  // Load iframe
  document.getElementById(`Frame${tabNumber}`).src = `/proxy?url=${encodeURIComponent(url)}`;

  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-tab]").forEach(btn => {
      const tabNumber = btn.dataset.tab;
      attachTabClick(btn, tabNumber);
      enableTabRenaming(btn);
    });

    updateTabSelector();
  });

  const targetButton = document.querySelector(`[data-tab="${tabNumber}"]`);

  // Automatically switch to that tab so user can see the loaded page
  if (targetButton) {
    targetButton.click();
  }
});


function opentab(tabNumber) { // parameter = tabNumber
  document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("activecontent"));

  document.querySelectorAll(".tab-buttons button:not(.newtab)").forEach((b) => {
    b.classList.remove("activetab");
    b.classList.add("inactivetab");
  });

  const content = document.getElementById(`tab${tabNumber}Content`); // content of tab to open
  const button = document.querySelector(`[data-tab="${tabNumber}"]`); // button of tab to open
 
  if (!content || !button) return; // if NOT content OR NOT button

  content.classList.add("activecontent");
  button.classList.remove("inactivetab");
  button.classList.add("activetab");
}

function addNewTab() {
  tabCount++;
  activeTabs.add(tabCount); // Add to active tabs set
  updateTabSelector();

  const tabButtons = document.getElementById("tabButtons");
  const newTabButton = tabButtons.querySelector(".newtab");
  const tabContainer = document.querySelector(".tab-container");

  // creating new tab button
  const button = document.createElement("button");
  button.className = "inactivetab";
  button.setAttribute("data-tab", tabCount);

  const label = document.createElement("span");
  label.className = "tab-label";
  label.textContent = `Tab ${tabCount}`;
  button.appendChild(label);
  enableTabRenaming(button);

  const xButton = document.createElement("button");
  xButton.className = "xbutton";
  xButton.textContent = "❌";
  const currentTabNum = tabCount; // Capture the value
  xButton.onclick = (e) => {
    e.stopPropagation();
    closeTab(currentTabNum);
  };
  
  button.appendChild(xButton);
  attachTabClick(button, currentTabNum); 
  tabButtons.insertBefore(button, newTabButton);

  // create tab content (div)
  const newTabContent = document.createElement("div");
  newTabContent.id = `tab${tabCount}Content`;
  newTabContent.className = "tab-content inactivecontent";

  newTabContent.innerHTML = `
    <h3>Tab ${tabCount}</h3>
    <p>Proxy Page Output</p>
    <iframe id="Frame${tabCount}"></iframe>
  `;

  tabContainer.appendChild(newTabContent);
}

function updateTabSelector() {
  const selector = document.getElementById("tabSelector");
  const select = document.getElementById("tabSelect");

// Show dropdown if we have 2 or more active tabs
  if (activeTabs.size >= 2) {
    selector.style.display = "block";
    select.innerHTML = ""; // Clear dropdown menu to update it

    // Add options for all active tabs (excluding Tab 1)
    const sortedTabs = Array.from(activeTabs).sort((a, b) => a - b);
    sortedTabs.forEach((tabNum) => {
      if (tabNum > 1) {
        const option = document.createElement("option");
        option.value = `tab${tabNum}Content`;
        option.textContent = `Tab ${tabNum}`;
        select.appendChild(option);
      }
    });
  } else {
    selector.style.display = "none";
  }
}

function closeTab(tabNumber) {
  // Don't allow closing Tab 1
  if (tabNumber === 1) {
    return;
  }

  // Check if this tab is currently active
  const button = document.querySelector(`[data-tab="${tabNumber}"]`);
  const content = document.getElementById(`tab${tabNumber}Content`);
  const isActive = button && button.classList.contains("activetab"); // True or False = booleans


  // If closing the active tab, switch to Tab 1 first
  if (isActive) {
    opentab(1); 
  }

  // Remove the tab button
  if (button) {
    button.remove();
  }

  // Remove the tab content
  if (content) {
    content.remove();
  }

  // Remove from active tabs set
  activeTabs.delete(tabNumber);
  tabCount--;
  updateTabSelector();
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  const tab1 = document.querySelector(`[data-tab="1"]`);
  const tab2 = document.querySelector(`[data-tab="2"]`);

  // Attach click handlers to all existing tabs
  document.querySelectorAll("[data-tab]").forEach(btn => {
    const tabNumber = parseInt(btn.dataset.tab);
    attachTabClick(btn, tabNumber);
    enableTabRenaming(btn);
  });
});

function enableTabRenaming(button) {
  button.addEventListener("dblclick", () => {
    const label = button.querySelector(".tab-label");
    const newName = prompt("Rename this tab:", label.textContent);

    if (newName){
      label.textContent = newName;
    }
  }
    );
}



// handles tab clicking and stops bugs
function attachTabClick(button, tabNumber) {
  button.addEventListener("click", (e) => {
    if (e.target.classList.contains("xbutton")) return;

    opentab(parseInt(tabNumber))
  }
  );
}

