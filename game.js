/* =========================================================
   KEMBARA PETARA
   game.js

   Sistem utama:
   - Start game
   - Nama pemain
   - Avatar
   - Movement 4 arah
   - Keyboard controls
   - Mobile D-Pad
   - Camera follow
   - Checkpoint detection
   - Checkpoint interaction
   - HUD
   - Restart
========================================================= */


/* =========================================================
   1. GAME STATE
========================================================= */

const game = {

    studentName: "",

    selectedAvatar: "1",

    score: 0,

    completedCheckpoints: [],

    currentCheckpoint: 0,

    nearbyCheckpoint: null,

    gameStarted: false,

    movementEnabled: true,

    tutorialPlayed: false,

    worldWidth: 2200,

    worldHeight: 1600,

    player: {

        x: 1080,

        y: 1370,

        width: 60,

        height: 70,

        speed: 4.2

    },

    keys: {

        up: false,

        down: false,

        left: false,

        right: false

    }

};


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const startScreen =
    document.getElementById("start-screen");

const gameScreen =
    document.getElementById("game-screen");

const victoryScreen =
    document.getElementById("victory-screen");


const playerNameInput =
    document.getElementById("player-name");

const nameError =
    document.getElementById("name-error");

const startButton =
    document.getElementById("start-button");


const avatarOptions =
    document.querySelectorAll(".avatar-option");


const hudAvatar =
    document.getElementById("hud-avatar");

const hudPlayerName =
    document.getElementById("hud-player-name");

const scoreValue =
    document.getElementById("score-value");

const checkpointValue =
    document.getElementById("checkpoint-value");

const checkpointStars =
    document.getElementById("checkpoint-stars");


const gameViewport =
    document.getElementById("game-viewport");

const gameWorld =
    document.getElementById("game-world");


const playerElement =
    document.getElementById("player");

const playerSprite =
    document.getElementById("player-sprite");

const playerNameLabel =
    document.getElementById("player-name-label");


const interactionPrompt =
    document.getElementById("interaction-prompt");

const interactionTitle =
    document.getElementById("interaction-title");

const mobileInteractionButton =
    document.getElementById("mobile-interaction-button");


const missionOverlay =
    document.getElementById("mission-overlay");

const missionPanel =
    document.getElementById("mission-panel");

const missionTitle =
    document.getElementById("mission-title");

const missionIcon =
    document.getElementById("mission-icon");

const missionContent =
    document.getElementById("mission-content");

const closeMissionButton =
    document.getElementById("close-mission");


const restartButton =
    document.getElementById("restart-button");


const rotateScreen =
    document.getElementById("rotate-screen");


/* =========================================================
   3. AVATAR DATA
========================================================= */

const avatarData = {

    "1": "🧑",

    "2": "👧",

    "3": "👦"

};


/* =========================================================
   4. CHECKPOINT DATA
========================================================= */

const checkpointData = {

    1: {

        element:
            document.getElementById("checkpoint-1"),

        title:
            "Misi 1",

        missionTitle:
            "Dengar dan Pilih Gambar",

        icon:
            "🎧"

    },

    2: {

        element:
            document.getElementById("checkpoint-2"),

        title:
            "Dapur PeTara",

        missionTitle:
            "Dengar dan Lakukan",

        icon:
            "🍳"

    },

    3: {

        element:
            document.getElementById("checkpoint-3"),

        title:
            "Jambatan PeTara",

        missionTitle:
            "Dengar dan Jawab",

        icon:
            "🌉"

    },

    4: {

        element:
            document.getElementById("checkpoint-4"),

        title:
            "Kedai Pak Ali",

        missionTitle:
            "Misi Kedai Pak Ali",

        icon:
            "🏪"

    },

    5: {

        element:
            document.getElementById("checkpoint-5"),

        title:
            "Gerbang PeTara",

        missionTitle:
            "Dengar dan Ulang",

        icon:
            "✨"

    }

};


/* =========================================================
   5. AVATAR SELECTION
========================================================= */

avatarOptions.forEach(option => {

    option.addEventListener(
        "click",
        function () {

            avatarOptions.forEach(item => {

                item.classList.remove("selected");

            });


            this.classList.add("selected");


            game.selectedAvatar =
                this.dataset.avatar;

        }
    );

});


/* =========================================================
   6. START BUTTON
========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


/* Allow ENTER from name input */

playerNameInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            startGame();

        }

    }
);


/* =========================================================
   7. START GAME
========================================================= */

function startGame() {

    const name =
        playerNameInput.value.trim();


    /* Name validation */

    if (!name) {

        nameError.classList.remove("hidden");

        playerNameInput.focus();

        return;

    }


    nameError.classList.add("hidden");


    game.studentName = name;

    game.gameStarted = true;

    game.movementEnabled = true;


    /* Set avatar */

    const avatar =
        avatarData[game.selectedAvatar] || "🧑";


    playerSprite.textContent =
        avatar;

    hudAvatar.textContent =
        avatar;


    /* Set player name */

    playerNameLabel.textContent =
        name;

    hudPlayerName.textContent =
        name;


    /* Switch screens */

    startScreen.classList.add("hidden");

    startScreen.classList.remove("active");

    victoryScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    gameScreen.classList.add("active");


    /* Reset player */

    game.player.x = 1080;

    game.player.y = 1370;


    updatePlayerPosition();

    updateHUD();

    updateOrientationWarning();


    /*
       Wait a little so the player can see
       the world before tutorial starts.
    */

    setTimeout(
        function () {

            startTutorial();

        },
        700
    );

}


/* =========================================================
   8. MINI TUTORIAL
========================================================= */

function startTutorial() {

    if (game.tutorialPlayed) {

        return;

    }


    game.tutorialPlayed = true;

    game.movementEnabled = false;


    const tutorialText =
        `Hai, ${game.studentName}! ` +
        `Selamat datang ke dunia PeTara! ` +
        `Bergerak ke hadapan dan selesaikan lima misi. ` +
        `Mari mulakan pengembaraan!`;


    /*
       audio.js will later contain speakMalay().
       For now we check whether it exists.
    */

    if (typeof speakMalay === "function") {

        speakMalay(tutorialText);

    }


    showTutorialPanel(tutorialText);

}


/* =========================================================
   9. TUTORIAL PANEL
========================================================= */

function showTutorialPanel(text) {

    missionIcon.textContent =
        "🧙";

    missionTitle.textContent =
        "Penjaga PeTara";


    missionContent.innerHTML = `

        <div style="
            text-align:center;
            padding:10px 5px;
        ">

            <div style="
                font-size:64px;
                margin-bottom:12px;
            ">
                🧙
            </div>

            <p style="
                font-size:17px;
                line-height:1.7;
                margin-bottom:20px;
            ">
                ${text}
            </p>

            <div style="
                background:rgba(255,255,255,0.08);
                border-radius:12px;
                padding:14px;
                margin-bottom:18px;
            ">

                <strong>
                    Cara Bergerak
                </strong>

                <div style="
                    margin-top:10px;
                    line-height:1.8;
                ">

                    ⬆ W / ↑ &nbsp;&nbsp;

                    ⬇ S / ↓

                    <br>

                    ⬅ A / ← &nbsp;&nbsp;

                    ➡ D / →

                </div>

            </div>

            <button
                id="tutorial-start-button"
                class="primary-button"
            >
                ✨ MULA JELAJAH
            </button>

        </div>

    `;


    missionOverlay.classList.remove("hidden");


    const tutorialButton =
        document.getElementById(
            "tutorial-start-button"
        );


    tutorialButton.addEventListener(
        "click",
        function () {

            closeMission();

        }
    );

}


/* =========================================================
   10. KEYBOARD DOWN
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (!game.gameStarted) {

            return;

        }


        const key =
            event.key.toLowerCase();


        /* Prevent browser scrolling */

        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                " "
            ].includes(key)
        ) {

            event.preventDefault();

        }


        if (
            key === "w" ||
            key === "arrowup"
        ) {

            game.keys.up = true;

        }


        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            game.keys.down = true;

        }


        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            game.keys.left = true;

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            game.keys.right = true;

        }


        /*
           E = interact with checkpoint
        */

        if (key === "e") {

            interactWithCheckpoint();

        }

    }
);


/* =========================================================
   11. KEYBOARD UP
========================================================= */

document.addEventListener(
    "keyup",
    function (event) {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            key === "arrowup"
        ) {

            game.keys.up = false;

        }


        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            game.keys.down = false;

        }


        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            game.keys.left = false;

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            game.keys.right = false;

        }

    }
);


/* =========================================================
   12. MOBILE D-PAD
========================================================= */

const dpadButtons =
    document.querySelectorAll(".dpad-button");


dpadButtons.forEach(button => {

    const direction =
        button.dataset.direction;


    /*
       Pointer events support:
       mouse + touch + stylus
    */

    button.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();


            if (!game.movementEnabled) {

                return;

            }


            game.keys[direction] = true;

            button.classList.add("pressed");


            try {

                button.setPointerCapture(
                    event.pointerId
                );

            }
            catch (error) {

                /*
                   Some browsers may not
                   support pointer capture.
                */

            }

        }
    );


    function releaseDirection() {

        game.keys[direction] = false;

        button.classList.remove("pressed");

    }


    button.addEventListener(
        "pointerup",
        releaseDirection
    );


    button.addEventListener(
        "pointercancel",
        releaseDirection
    );


    button.addEventListener(
        "lostpointercapture",
        releaseDirection
    );

});


/* =========================================================
   13. MOBILE INTERACTION
========================================================= */

mobileInteractionButton.addEventListener(
    "click",
    interactWithCheckpoint
);


/* =========================================================
   14. GAME LOOP
========================================================= */

function gameLoop() {

    if (
        game.gameStarted &&
        game.movementEnabled
    ) {

        updateMovement();

        checkNearbyCheckpoint();

    }


    requestAnimationFrame(
        gameLoop
    );

}


/*
   Start the animation loop once.
*/

requestAnimationFrame(
    gameLoop
);


/* =========================================================
   15. PLAYER MOVEMENT
========================================================= */

function updateMovement() {

    let moveX = 0;

    let moveY = 0;


    if (game.keys.up) {

        moveY -= 1;

    }


    if (game.keys.down) {

        moveY += 1;

    }


    if (game.keys.left) {

        moveX -= 1;

    }


    if (game.keys.right) {

        moveX += 1;

    }


    /*
       No movement
    */

    if (
        moveX === 0 &&
        moveY === 0
    ) {

        playerElement.classList.remove(
            "walking"
        );

        return;

    }


    /*
       Normalize diagonal movement.

       Without this, diagonal movement
       would be faster than straight movement.
    */

    if (
        moveX !== 0 &&
        moveY !== 0
    ) {

        const diagonal =
            Math.sqrt(2);

        moveX /= diagonal;

        moveY /= diagonal;

    }


    const newX =
        game.player.x +
        moveX * game.player.speed;


    const newY =
        game.player.y +
        moveY * game.player.speed;


    /*
       Basic world boundaries.
       Collision with objects will be
       expanded later.
    */

    const maxX =
        game.worldWidth -
        game.player.width;


    const maxY =
        game.worldHeight -
        game.player.height;


    game.player.x =
        clamp(
            newX,
            0,
            maxX
        );


    game.player.y =
        clamp(
            newY,
            0,
            maxY
        );


    playerElement.classList.add(
        "walking"
    );


    updatePlayerDirection(
        moveX,
        moveY
    );


    updatePlayerPosition();

}


/* =========================================================
   16. PLAYER DIRECTION
========================================================= */

function updatePlayerDirection(
    moveX,
    moveY
) {

    /*
       Since we are still using emoji placeholders,
       direction is represented with a subtle flip.

       Later, when pixel sprites are added,
       this can switch between sprite frames:
       walk-up
       walk-down
       walk-left
       walk-right
    */


    if (moveX < 0) {

        playerSprite.style.transform =
            "scaleX(-1)";

    }


    if (moveX > 0) {

        playerSprite.style.transform =
            "scaleX(1)";

    }

}


/* =========================================================
   17. UPDATE PLAYER POSITION
========================================================= */

function updatePlayerPosition() {

    playerElement.style.left =
        `${game.player.x}px`;


    playerElement.style.top =
        `${game.player.y}px`;


    updateCamera();

}


/* =========================================================
   18. CAMERA FOLLOW
========================================================= */

function updateCamera() {

    if (!game.gameStarted) {

        return;

    }


    const viewportWidth =
        gameViewport.clientWidth;


    const viewportHeight =
        gameViewport.clientHeight;


    /*
       Player centre
    */

    const playerCenterX =
        game.player.x +
        game.player.width / 2;


    const playerCenterY =
        game.player.y +
        game.player.height / 2;


    /*
       Desired camera position
    */

    let cameraX =
        viewportWidth / 2 -
        playerCenterX;


    let cameraY =
        viewportHeight / 2 -
        playerCenterY;


    /*
       Prevent camera from showing
       outside the world.
    */

    const minimumCameraX =
        Math.min(
            0,
            viewportWidth -
            game.worldWidth
        );


    const minimumCameraY =
        Math.min(
            0,
            viewportHeight -
            game.worldHeight
        );


    cameraX =
        clamp(
            cameraX,
            minimumCameraX,
            0
        );


    cameraY =
        clamp(
            cameraY,
            minimumCameraY,
            0
        );


    gameWorld.style.transform =
        `translate3d(
            ${cameraX}px,
            ${cameraY}px,
            0
        )`;

}


/* =========================================================
   19. CHECK NEARBY CHECKPOINT
========================================================= */

function checkNearbyCheckpoint() {

    let closestCheckpoint = null;

    let closestDistance = Infinity;


    const playerCenterX =
        game.player.x +
        game.player.width / 2;


    const playerCenterY =
        game.player.y +
        game.player.height / 2;


    Object.keys(
        checkpointData
    ).forEach(key => {

        const checkpointNumber =
            Number(key);


        const data =
            checkpointData[
                checkpointNumber
            ];


        const element =
            data.element;


        if (!element) {

            return;

        }


        const checkpointCenterX =
            element.offsetLeft +
            element.offsetWidth / 2;


        const checkpointCenterY =
            element.offsetTop +
            element.offsetHeight / 2;


        const distance =
            getDistance(
                playerCenterX,
                playerCenterY,
                checkpointCenterX,
                checkpointCenterY
            );


        /*
           Interaction radius.
           Fairly generous for young learners.
        */

        if (
            distance < 145 &&
            distance < closestDistance
        ) {

            closestDistance =
                distance;

            closestCheckpoint =
                checkpointNumber;

        }

    });


    game.nearbyCheckpoint =
        closestCheckpoint;


    if (closestCheckpoint) {

        showInteractionPrompt(
            closestCheckpoint
        );

    }
    else {

        hideInteractionPrompt();

    }

}


/* =========================================================
   20. SHOW INTERACTION PROMPT
========================================================= */

function showInteractionPrompt(
    checkpointNumber
) {

    const data =
        checkpointData[
            checkpointNumber
        ];


    if (!data) {

        return;

    }


    interactionPrompt.classList.remove(
        "hidden"
    );


    const isUnlocked =
        isCheckpointUnlocked(
            checkpointNumber
        );


    const isCompleted =
        game.completedCheckpoints.includes(
            checkpointNumber
        );


    if (isCompleted) {

        interactionTitle.textContent =
            "MISI TELAH SELESAI ⭐";


        mobileInteractionButton.textContent =
            "SELESAI";

        mobileInteractionButton.disabled =
            true;

        return;

    }


    if (!isUnlocked) {

        interactionTitle.textContent =
            "MISI TERKUNCI 🔒";


        mobileInteractionButton.textContent =
            "TERKUNCI";

        mobileInteractionButton.disabled =
            true;

        return;

    }


    interactionTitle.textContent =
        "MISI TERSEDIA!";


    mobileInteractionButton.textContent =
        "MULA MISI";

    mobileInteractionButton.disabled =
        false;

}


/* =========================================================
   21. HIDE INTERACTION PROMPT
========================================================= */

function hideInteractionPrompt() {

    interactionPrompt.classList.add(
        "hidden"
    );


    mobileInteractionButton.disabled =
        false;

}


/* =========================================================
   22. CHECKPOINT UNLOCK LOGIC
========================================================= */

function isCheckpointUnlocked(
    checkpointNumber
) {

    /*
       CP1 is always unlocked.
    */

    if (checkpointNumber === 1) {

        return true;

    }


    /*
       CP2 requires CP1,
       CP3 requires CP2,
       etc.
    */

    return game.completedCheckpoints.includes(
        checkpointNumber - 1
    );

}


/* =========================================================
   23. INTERACT WITH CHECKPOINT
========================================================= */

function interactWithCheckpoint() {

    if (!game.movementEnabled) {

        return;

    }


    const checkpointNumber =
        game.nearbyCheckpoint;


    if (!checkpointNumber) {

        return;

    }


    /*
       Already completed
    */

    if (
        game.completedCheckpoints.includes(
            checkpointNumber
        )
    ) {

        showSimpleMessage(
            "⭐ Misi Selesai",
            "Kamu sudah menyelesaikan misi ini."
        );

        return;

    }


    /*
       Locked checkpoint
    */

    if (
        !isCheckpointUnlocked(
            checkpointNumber
        )
    ) {

        showSimpleMessage(
            "🔒 Misi Terkunci",
            "Selesaikan misi sebelumnya dahulu!"
        );

        return;

    }


    openCheckpoint(
        checkpointNumber
    );

}


/* =========================================================
   24. OPEN CHECKPOINT
========================================================= */

function openCheckpoint(
    checkpointNumber
) {

    const data =
        checkpointData[
            checkpointNumber
        ];


    if (!data) {

        return;

    }


    game.currentCheckpoint =
        checkpointNumber;


    game.movementEnabled =
        false;


    resetMovementKeys();


    missionIcon.textContent =
        data.icon;


    missionTitle.textContent =
        data.missionTitle;


    /*
       checkpoints.js will later contain:
       loadCheckpoint(number)

       Until then we display a temporary panel.
    */

    if (
        typeof loadCheckpoint ===
        "function"
    ) {

        loadCheckpoint(
            checkpointNumber
        );

    }
    else {

        missionContent.innerHTML = `

            <div style="
                text-align:center;
                padding:20px;
            ">

                <div style="
                    font-size:55px;
                    margin-bottom:12px;
                ">
                    ${data.icon}
                </div>

                <h3>
                    ${data.title}
                </h3>

                <p style="
                    margin-top:10px;
                    color:#cfe8f7;
                ">
                    Kandungan misi akan dimasukkan
                    dalam checkpoints.js.
                </p>

            </div>

        `;

    }


    missionOverlay.classList.remove(
        "hidden"
    );

}


/* =========================================================
   25. CLOSE MISSION
========================================================= */

closeMissionButton.addEventListener(
    "click",
    closeMission
);


function closeMission() {

    missionOverlay.classList.add(
        "hidden"
    );


    game.movementEnabled =
        true;


    resetMovementKeys();


    /*
       Stop speech if browser TTS
       is currently speaking.
    */

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }

}


/* =========================================================
   26. SIMPLE MESSAGE
========================================================= */

function showSimpleMessage(
    title,
    message
) {

    game.movementEnabled =
        false;


    resetMovementKeys();


    missionIcon.textContent =
        "💡";


    missionTitle.textContent =
        title;


    missionContent.innerHTML = `

        <div style="
            text-align:center;
            padding:18px 5px;
        ">

            <p style="
                font-size:17px;
                line-height:1.6;
                margin-bottom:18px;
            ">
                ${message}
            </p>

            <button
                id="simple-message-button"
                class="primary-button"
            >
                BAIK
            </button>

        </div>

    `;


    missionOverlay.classList.remove(
        "hidden"
    );


    document
        .getElementById(
            "simple-message-button"
        )
        .addEventListener(
            "click",
            closeMission
        );

}


/* =========================================================
   27. COMPLETE CHECKPOINT
========================================================= */

/*
   checkpoints.js will call this function
   when all activities in a checkpoint
   are completed.
*/

function completeCheckpoint(
    checkpointNumber
) {

    if (
        game.completedCheckpoints.includes(
            checkpointNumber
        )
    ) {

        return;

    }


    game.completedCheckpoints.push(
        checkpointNumber
    );


    /*
       Keep checkpoints in order.
    */

    game.completedCheckpoints.sort(
        (a, b) => a - b
    );


    updateCheckpointVisuals();

    updateHUD();


    /*
       All 5 completed
    */

    if (
        game.completedCheckpoints.length >= 5
    ) {

        setTimeout(
            showVictoryScreen,
            1000
        );

    }

}


/* =========================================================
   28. UNLOCK VISUALS
========================================================= */

function updateCheckpointVisuals() {

    Object.keys(
        checkpointData
    ).forEach(key => {

        const checkpointNumber =
            Number(key);


        const data =
            checkpointData[
                checkpointNumber
            ];


        const element =
            data.element;


        if (!element) {

            return;

        }


        const unlocked =
            isCheckpointUnlocked(
                checkpointNumber
            );


        const completed =
            game.completedCheckpoints.includes(
                checkpointNumber
            );


        element.classList.toggle(
            "locked",
            !unlocked
        );


        element.classList.toggle(
            "unlocked",
            unlocked
        );


        element.classList.toggle(
            "completed",
            completed
        );


        const lock =
            element.querySelector(
                ".checkpoint-lock"
            );


        if (lock) {

            if (unlocked) {

                lock.style.display =
                    "none";

            }
            else {

                lock.style.display =
                    "";

            }

        }


        /*
           Add glow to newly unlocked
           checkpoints.
        */

        if (
            unlocked &&
            !completed &&
            !element.querySelector(
                ".checkpoint-glow"
            )
        ) {

            const glow =
                document.createElement(
                    "div"
                );


            glow.className =
                "checkpoint-glow";


            element.prepend(
                glow
            );

        }

    });

}


/* =========================================================
   29. SCORE
========================================================= */

function addScore(
    amount = 10
) {

    game.score += amount;


    updateHUD();


    /*
       Small HUD animation.
    */

    scoreValue.animate(
        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.45)"
            },

            {
                transform:
                    "scale(1)"
            }
        ],
        {
            duration: 400,

            easing: "ease-out"
        }
    );

}


/* =========================================================
   30. UPDATE HUD
========================================================= */

function updateHUD() {

    scoreValue.textContent =
        game.score;


    checkpointValue.textContent =
        game.completedCheckpoints.length;


    /*
       Update stars.
    */

    const stars =
        checkpointStars.querySelectorAll(
            "span"
        );


    stars.forEach(
        (star, index) => {

            if (
                index <
                game.completedCheckpoints.length
            ) {

                star.textContent =
                    "⭐";

            }
            else {

                star.textContent =
                    "☆";

            }

        }
    );

}


/* =========================================================
   31. RESET MOVEMENT KEYS
========================================================= */

function resetMovementKeys() {

    game.keys.up = false;

    game.keys.down = false;

    game.keys.left = false;

    game.keys.right = false;


    playerElement.classList.remove(
        "walking"
    );


    dpadButtons.forEach(
        button => {

            button.classList.remove(
                "pressed"
            );

        }
    );

}


/* =========================================================
   32. VICTORY SCREEN
========================================================= */

function showVictoryScreen() {

    game.movementEnabled =
        false;


    resetMovementKeys();


    missionOverlay.classList.add(
        "hidden"
    );


    gameScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.remove(
        "active"
    );


    victoryScreen.classList.remove(
        "hidden"
    );


    victoryScreen.classList.add(
        "active"
    );


    document.getElementById(
        "result-name"
    ).textContent =
        game.studentName;


    document.getElementById(
        "result-score"
    ).textContent =
        game.score;


    createConfetti();

}


/* =========================================================
   33. CONFETTI
========================================================= */

function createConfetti() {

    const container =
        document.getElementById(
            "confetti-container"
        );


    container.innerHTML = "";


    /*
       We use random HSL colours so
       no external assets are required.
    */

    for (
        let i = 0;
        i < 60;
        i++
    ) {

        const confetti =
            document.createElement(
                "div"
            );


        confetti.className =
            "confetti";


        confetti.style.left =
            `${Math.random() * 100}%`;


        confetti.style.backgroundColor =
            `hsl(
                ${Math.random() * 360},
                85%,
                60%
            )`;


        confetti.style.animationDelay =
            `${Math.random() * 2}s`;


        confetti.style.animationDuration =
            `${3 + Math.random() * 2}s`;


        container.appendChild(
            confetti
        );

    }

}


/* =========================================================
   34. RESTART
========================================================= */

restartButton.addEventListener(
    "click",
    restartGame
);


function restartGame() {

    /*
       Reset state
    */

    game.studentName = "";

    game.score = 0;

    game.completedCheckpoints = [];

    game.currentCheckpoint = 0;

    game.nearbyCheckpoint = null;

    game.gameStarted = false;

    game.movementEnabled = true;

    game.tutorialPlayed = false;


    game.player.x = 1080;

    game.player.y = 1370;


    resetMovementKeys();


    /*
       Reset input
    */

    playerNameInput.value = "";


    /*
       Reset checkpoint visuals
    */

    Object.keys(
        checkpointData
    ).forEach(key => {

        const number =
            Number(key);


        const element =
            checkpointData[
                number
            ].element;


        if (!element) {

            return;

        }


        element.classList.remove(
            "completed"
        );


        if (number === 1) {

            element.classList.remove(
                "locked"
            );

            element.classList.add(
                "unlocked"
            );

        }
        else {

            element.classList.add(
                "locked"
            );

            element.classList.remove(
                "unlocked"
            );

        }

    });


    /*
       Remove extra glows.
    */

    Object.keys(
        checkpointData
    ).forEach(key => {

        const number =
            Number(key);


        if (number === 1) {

            return;

        }


        const element =
            checkpointData[
                number
            ].element;


        if (!element) {

            return;

        }


        const glows =
            element.querySelectorAll(
                ".checkpoint-glow"
            );


        glows.forEach(
            glow => glow.remove()
        );

    });


    /*
       Restore locks.
    */

    document
        .querySelectorAll(
            ".checkpoint-lock"
        )
        .forEach(
            lock => {

                lock.style.display =
                    "";

            }
        );


    updateHUD();


    victoryScreen.classList.add(
        "hidden"
    );


    victoryScreen.classList.remove(
        "active"
    );


    gameScreen.classList.add(
        "hidden"
    );


    startScreen.classList.remove(
        "hidden"
    );


    startScreen.classList.add(
        "active"
    );


    playerNameInput.focus();

}


/* =========================================================
   35. ORIENTATION
========================================================= */

function updateOrientationWarning() {

    /*
       Only show orientation warning
       while the actual game is running.
    */

    if (!game.gameStarted) {

        rotateScreen.classList.add(
            "hidden"
        );

        return;

    }


    const isTouchDevice =
        window.matchMedia(
            "(hover: none), (pointer: coarse)"
        ).matches;


    const isPortrait =
        window.innerHeight >
        window.innerWidth;


    /*
       Mainly intended for phones.
    */

    const smallScreen =
        Math.min(
            window.innerWidth,
            window.innerHeight
        ) < 600;


    if (
        isTouchDevice &&
        isPortrait &&
        smallScreen
    ) {

        rotateScreen.classList.remove(
            "hidden"
        );

        game.movementEnabled =
            false;

    }
    else {

        rotateScreen.classList.add(
            "hidden"
        );


        if (
            missionOverlay.classList.contains(
                "hidden"
            )
        ) {

            game.movementEnabled =
                true;

        }

    }

}


/* =========================================================
   36. WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function () {

        updateCamera();

        updateOrientationWarning();

    }
);


window.addEventListener(
    "orientationchange",
    function () {

        setTimeout(
            function () {

                updateCamera();

                updateOrientationWarning();

            },
            250
        );

    }
);


/* =========================================================
   37. UTILITY - CLAMP
========================================================= */

function clamp(
    value,
    minimum,
    maximum
) {

    return Math.min(
        Math.max(
            value,
            minimum
        ),
        maximum
    );

}


/* =========================================================
   38. UTILITY - DISTANCE
========================================================= */

function getDistance(
    x1,
    y1,
    x2,
    y2
) {

    const deltaX =
        x2 - x1;


    const deltaY =
        y2 - y1;


    return Math.sqrt(
        deltaX * deltaX +
        deltaY * deltaY
    );

}


/* =========================================================
   39. INITIAL SETUP
========================================================= */

function initializeGame() {

    updateHUD();

    updateCheckpointVisuals();

    updateOrientationWarning();

}


initializeGame();
