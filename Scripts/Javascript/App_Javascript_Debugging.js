/*
    This file contains debugging tools and shortcuts
*/

function Debugger_Construct() {
  var Debugger = document.createElement('span');
  Debugger.innerHTML = `
    <div class="Debugger_Console" id="Debugger_Console" style="display: none">
			<div class="Debugger_Console_Results" id="Debugger_Console_Text"></div>
			<div class="Debugger_Console_CommandEntry">
				<input class="Debugger_Console_CommandEntry_Input" id="Debugger_Console_CommandEntry_Input"
					placeholder="Enter console command and press Enter"></input>
			</div>
		</div>
  `;
  Debugger.setAttribute("style", "width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 1500; pointer-events: none");
  document.getElementsByTagName("body")[0].appendChild(Debugger);
}

var Debugger_Console_Toggle_Display = false;
var Debugger_Toggle_Outlines = false;

let debugger_keysPressed = {};
document.addEventListener('keydown', (event) => {
  debugger_keysPressed[event.key] = true;

  if (debugger_keysPressed['Alt'] && event.key == '1') {
    if (Debugger_Console_Toggle_Display == false) {
      document.getElementById("Debugger_Console").style.display = "grid";
      Element_Get_ByID("Debugger_Console_CommandEntry_Input").focus();
      Debugger_Console_Toggle_Display = true;
    } else {
      document.getElementById("Debugger_Console").style.display = "none";
      Debugger_Console_Toggle_Display = false;
    }
  }

  if (debugger_keysPressed['Alt'] && event.key == '2') {
    if (Debugger_Toggle_Outlines == false) {
      var stylesheet = document.querySelector(':root');
      stylesheet.style.setProperty("--Debug-ElementOutline", "solid red");
      Debugger_Toggle_Outlines = true;
      console.log("Outlines on");
    } else if (Debugger_Toggle_Outlines == true) {
      var stylesheet = document.querySelector(':root');
      stylesheet.style.setProperty("--Debug-ElementOutline", "none");
      Debugger_Toggle_Outlines = 0;
      console.log("Outlines off");
    }
  }
  if (debugger_keysPressed['Alt'] && event.key == '3') {
    Debugger_PrintCommandHistory();
  }
  
  if (debugger_keysPressed['Alt'] && event.key == '4') {
    if (localStorage.getItem("ERUMAUI_Debugging_PrintInScreen") != null) {
      if (localStorage.getItem("ERUMAUI_Debugging_PrintInScreen") == "true"){
        localStorage.setItem("ERUMAUI_Debugging_PrintInScreen", "false");
        console.log("Console messages will print on the dev tools window on next refresh.");
      } else {
        localStorage.setItem("ERUMAUI_Debugging_PrintInScreen", "true");
        console.log("Console messages will print on the debugger screen on next refresh.");
      }
    } else {
      localStorage.setItem("ERUMAUI_Debugging_PrintInScreen", "true");
      console.log("Console messages will print on the debugger screen on next refresh.");
    }
  }

  if (debugger_keysPressed['ArrowUp']) {
    if (document.getElementById("Debugger_Console_CommandEntry_Input") === document.activeElement) {
      Debugger_CommandHistory_Set_Backwards();
    }
  }
  if (debugger_keysPressed['ArrowDown']) {
    if (document.getElementById("Debugger_Console_CommandEntry_Input") === document.activeElement) {
      Debugger_CommandHistory_Set_Forwards();
    }
  }
});

document.addEventListener('keyup', (event) => {
  delete debugger_keysPressed[event.key];
});

let Debugger_Shortcut_List_Keys = ["Alt + 1", "Alt + 2", "Alt + 3", "Alt + 4", "Up/Down"];
let Debugger_Shortcut_List_Meaning = ["Toggle this screen", "Toggle outlines", "Print Console Command History", "Toggle debug output to this screen", "Traverse Console Command History"];
function Debugger_Generate_Shortcut_List() {
  console.log("========================================");
  console.log("Debugger Keyboard Shortcuts List");
  for (a = 0; a < Debugger_Shortcut_List_Keys.length; a++) {
    console.log(Debugger_Shortcut_List_Keys[a] + " : " + Debugger_Shortcut_List_Meaning[a])
  }
  console.log("========================================");
}

var Debugger_CommandHistory = [];

document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem("ERUMAUI_Debugging_PrintInScreen") != null) {
    if (localStorage.getItem("ERUMAUI_Debugging_PrintInScreen") == "true") {
      console.log("Console messages are printed on the Debugger screen. Press Alt + 1 to toggle it.")
      if (document.getElementById('Debugger_Console_CommandEntry_Input') == null) {
        Debugger_Construct();
      }
      // Create a function to display console messages in a specific HTML element
      var consoleInput = document.getElementById('Debugger_Console_CommandEntry_Input');
      consoleInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          var command = consoleInput.value;
          Debugger_CommandHistory.push(command);
          Debugger_CommandHistory_CurrentIndex = Debugger_CommandHistory.length;
          executeCommand(command);
          consoleInput.value = '';
        }
      });

      function executeCommand(command) {
        // Evaluate and execute the command
        try {
          var result = eval(command);
          if (result !== undefined) {
            console.log(result);
          }
        } catch (error) {
          console.error(error);
        }
      }

      function displayConsoleMessage(message, type) {
        var consoleElement = document.getElementById('Debugger_Console_Text'); // ID of the HTML element where you want to display the console messages
        var messageElement = document.createElement('p');
        messageElement.className = type;
        messageElement.classList.add("Debugger_Console_Text");
        messageElement.textContent = message;
        consoleElement.appendChild(messageElement);
      }

      // Override the default console methods
      console.log = function (message) {
        displayConsoleMessage(message, 'log'); // 'log' class can be styled as needed
      };

      console.warn = function (message) {
        displayConsoleMessage(message, 'warn'); // 'warn' class can be styled as needed
      };

      console.error = function (message) {
        displayConsoleMessage(message, 'error'); // 'error' class can be styled as needed
      };

      Debugger_Generate_Shortcut_List();
    }
  } else {
    localStorage.setItem("ERUMAUI_Debugging_PrintInScreen", "true");
  }
});

function Debugger_PrintCommandHistory() {
  console.log("========================================");
  console.log("Debugger Console Command History");
  console.log("========================================");
  for (a = 0; a < Debugger_CommandHistory.length; a++) {
    console.log(Debugger_CommandHistory[a]);
  }
  console.log("========================================");
}

var Debugger_CommandHistory_CurrentIndex = Debugger_CommandHistory.length;

function Debugger_CommandHistory_Set_Backwards() {
  Debugger_CommandHistory_CurrentIndex--;
  if (Debugger_CommandHistory_CurrentIndex < 0) {
    Debugger_CommandHistory_CurrentIndex = Debugger_CommandHistory.length - 1;
  }
  if (Debugger_CommandHistory.length != 0) {
    document.getElementById("Debugger_Console_CommandEntry_Input").value = Debugger_CommandHistory[Debugger_CommandHistory_CurrentIndex];
  } else {
    document.getElementById("Debugger_Console_CommandEntry_Input").value = "";
    console.log("Command history empty");
  }

}
function Debugger_CommandHistory_Set_Forwards() {
  Debugger_CommandHistory_CurrentIndex++;
  if (Debugger_CommandHistory_CurrentIndex > Debugger_CommandHistory.length - 1) {
    Debugger_CommandHistory_CurrentIndex = 0;
  }
  if (Debugger_CommandHistory.length != 0) {
    document.getElementById("Debugger_Console_CommandEntry_Input").value = Debugger_CommandHistory[Debugger_CommandHistory_CurrentIndex];
  } else {
    document.getElementById("Debugger_Console_CommandEntry_Input").value = "";
    console.log("Command history empty");
  }
}