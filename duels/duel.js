document.addEventListener("DOMContentLoaded", function () {
  let maxPlayers = 3; // Default maximum players per team
  let totalPlayersAdded = 0;
  let finalTeams = [];
  const clickedPlayers = new Set(); // Set to store clicked players

  function moveToFinalInMatch3(teamElement, playerName) {
    const final = document.querySelector(".final");

    if (final) {
      final.querySelector(".team").textContent = playerName + " 🏆 ";
    }
  }

  function moveToMatch3WithChampionButton(playerElement) {
    const playerButton = playerElement.querySelector("button");
    const playerName = playerButton.textContent;

    if (clickedPlayers.has(playerName)) {
      alert("Player already selected.");
      return;
    }

    const match3 = document.querySelector(".match3");
    const teamsInMatch3 = match3.querySelectorAll(".team");

    for (const teamInMatch3 of teamsInMatch3) {
      if (teamInMatch3.textContent === "") {
        const championButton = document.createElement("button");
        championButton.textContent =
          playerElement.querySelector("button").textContent; // Set content from previous button
        championButton.classList.add("champion-button");
        championButton.addEventListener("click", function () {
          moveToFinalInMatch3(teamInMatch3, playerName);
        });
        teamInMatch3.appendChild(championButton);

        clickedPlayers.add(playerName); // Add player's name to clickedPlayers Set

        break;
      }
    }
  }

  function moveToPlayoff(playerItem) {
    const bracket = document.querySelector(".bracket");
    const match1 = bracket.querySelector(".match1");
    const match2 = bracket.querySelector(".match2");

    const playoffButton = playerItem.querySelector(".playoff-button");
    if (playoffButton) {
      playerItem.removeChild(playoffButton);
    }

    const teamElements = [
      match1.querySelectorAll(".team"),
      match2.querySelectorAll(".team"),
    ];

    let addedToMatch = false;
    for (const teams of teamElements) {
      if (!addedToMatch) {
        const emptyTeam = Array.from(teams).find(
          (team) => team.textContent === ""
        );
        if (emptyTeam) {
          const playerName = playerItem.textContent;

          const finalButton = document.createElement("button");
          finalButton.textContent = playerName;
          finalButton.classList.add("final-button");
          finalButton.addEventListener("click", function () {
            moveToMatch3WithChampionButton(emptyTeam, playerName);
          });

          emptyTeam.textContent = "";

          emptyTeam.appendChild(finalButton);

          const groupList = playerItem.closest(".player-list");
          groupList.removeChild(playerItem);

          addedToMatch = true;
        }
      }
    }

    if (!addedToMatch) {
    }
  }

  function applyPlayers() {
    const playerNameInput = document.getElementById("playerName");
    const playerName = playerNameInput.value.trim();

    if (playerName !== "") {
      const selectedGroup = Math.random() < 0.5 ? "groupA" : "groupB";
      const selectedGroupList = document
        .getElementById(selectedGroup)
        .querySelector(".player-list");

      if (selectedGroupList) {
        if (selectedGroupList.children.length >= maxPlayers) {
          return;
        }

        const existingPlayers = selectedGroupList.querySelectorAll("li");
        for (const existingPlayer of existingPlayers) {
          if (existingPlayer.textContent.trim() === playerName) {
            alert(`Player "${playerName}" already exists in this group.`);
            return;
          }
        }

        const playerItem = document.createElement("li");
        playerItem.textContent = "";

        const dynamicButton = document.createElement("button");
        dynamicButton.textContent = playerName;
        dynamicButton.classList.add("final-button");
        dynamicButton.addEventListener("click", function () {
          moveToPlayoff(playerItem);
        });

        playerItem.appendChild(dynamicButton);
        selectedGroupList.appendChild(playerItem);

        totalPlayersAdded++;

        if (totalPlayersAdded >= maxPlayers * 2) {
          document.getElementById("inputSection").style.display = "none";
        }

        playerNameInput.value = "";
      } else {
        console.error(
          "Error: Could not find the player-list in selected group."
        );
      }
    }
  }

  function showInputField() {
    maxPlayers = parseInt(document.getElementById("playerCount").value);
    document.getElementById("counterSection").style.display = "none";
    document.getElementById("inputSection").style.display = "block";

    const playerNameInput = document.getElementById("playerName");
    playerNameInput.value = "";
    playerNameInput.focus();
  }

  // Handle Enter key press
  document
    .getElementById("playerName")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        applyPlayers();
      }
    });

  // Handle playerCount change
  document
    .getElementById("playerCount")
    .addEventListener("change", function () {
      showInputField();
    });

  // Make functions available in the global scope
  window.applyPlayers = applyPlayers;
  window.showInputField = showInputField;
});
