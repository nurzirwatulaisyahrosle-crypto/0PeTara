/* =========================================================
   KEMBARA PETARA
   checkpoints.js

   CHECKPOINT 1
   Dengar dan Pilih Gambar

   CHECKPOINT 2
   Dengar dan Lakukan

   CHECKPOINT 3
   Dengar dan Jawab

   CHECKPOINT 4
   Misi Kedai Pak Ali

   CHECKPOINT 5
   Dengar dan Ulang
========================================================= */


/* =========================================================
   1. CHECKPOINT STATE
========================================================= */

const missionState = {

    checkpoint: 0,

    activity: 0,

    scoredActivities: new Set(),

    cp2DraggedObject: null,

    cp4Step: 0,

    cp5Sentence: 0

};


/* =========================================================
   2. LOAD CHECKPOINT
========================================================= */

function loadCheckpoint(number) {

    missionState.checkpoint = number;

    missionState.activity = 0;


    switch (number) {

        case 1:
            loadCheckpoint1();
            break;

        case 2:
            loadCheckpoint2();
            break;

        case 3:
            loadCheckpoint3();
            break;

        case 4:
            loadCheckpoint4();
            break;

        case 5:
            loadCheckpoint5();
            break;

    }

}


/* =========================================================
   3. COMMON HELPERS
========================================================= */

function missionButton(
    id,
    text
) {

    return `
        <button
            id="${id}"
            class="mission-action-button"
        >
            ${text}
        </button>
    `;

}


function scoreActivity(key) {

    if (
        missionState
            .scoredActivities
            .has(key)
    ) {

        return;

    }


    missionState
        .scoredActivities
        .add(key);


    addScore(10);

}


/* =========================================================
   4. FEEDBACK
========================================================= */

function showMissionFeedback({

    correct = true,

    title,

    message,

    score = "",

    buttonText = "TERUSKAN",

    onContinue

}) {

    const overlay =
        document.getElementById(
            "feedback-overlay"
        );


    const card =
        document.getElementById(
            "feedback-card"
        );


    const icon =
        document.getElementById(
            "feedback-icon"
        );


    const titleElement =
        document.getElementById(
            "feedback-title"
        );


    const messageElement =
        document.getElementById(
            "feedback-message"
        );


    const scoreElement =
        document.getElementById(
            "feedback-score"
        );


    const button =
        document.getElementById(
            "feedback-button"
        );


    icon.textContent =
        correct
            ? "⭐"
            : "💡";


    titleElement.textContent =
        title ||
        (
            correct
                ? "HEBAT!"
                : "CUBA LAGI!"
        );


    messageElement.textContent =
        message;


    if (score) {

        scoreElement.textContent =
            score;


        scoreElement.classList.remove(
            "hidden"
        );

    }
    else {

        scoreElement.classList.add(
            "hidden"
        );

    }


    button.textContent =
        buttonText;


    /*
       Remove previous button handler
       by cloning the button.
    */

    const newButton =
        button.cloneNode(true);


    button.replaceWith(
        newButton
    );


    newButton.addEventListener(
        "click",
        function () {

            overlay.classList.add(
                "hidden"
            );


            if (
                typeof onContinue ===
                "function"
            ) {

                onContinue();

            }

        }
    );


    overlay.classList.remove(
        "hidden"
    );


    if (!correct) {

        card.animate(
            [
                {
                    transform:
                        "translateX(0)"
                },

                {
                    transform:
                        "translateX(-10px)"
                },

                {
                    transform:
                        "translateX(10px)"
                },

                {
                    transform:
                        "translateX(-6px)"
                },

                {
                    transform:
                        "translateX(0)"
                }
            ],
            {
                duration: 350
            }
        );

    }

}


/* =========================================================
   5. CHECKPOINT COMPLETION
========================================================= */

function finishCurrentCheckpoint(
    number
) {

    completeCheckpoint(
        number
    );


    missionOverlay.classList.add(
        "hidden"
    );


    game.movementEnabled =
        true;


    game.nearbyCheckpoint =
        null;


    hideInteractionPrompt();


    resetMovementKeys();

}


/* =========================================================
   CHECKPOINT 1
========================================================= */


/* =========================================================
   6. CP1 DATA
========================================================= */

const cp1Questions = [

    {

        audio:
            "Aiman pergi memancing bersama ayahnya. " +
            "Aiman berjaya menangkap seekor ikan. " +
            "Apakah haiwan yang ditangkap oleh Aiman?",

        choices: [

            {
                id: "fish",
                visual: "🐟",
                correct: true
            },

            {
                id: "chicken",
                visual: "🐔",
                correct: false
            },

            {
                id: "cat",
                visual: "🐱",
                correct: false
            }

        ]

    },

    {

        audio:
            "Mei Ling berasa haus selepas bermain di taman. " +
            "Ibunya memberikan segelas susu kepada Mei Ling. " +
            "Apakah minuman yang diberikan oleh ibu?",

        choices: [

            {
                id: "milk",
                visual: "🥛",
                correct: true
            },

            {
                id: "juice",
                visual: "🧃",
                correct: false
            },

            {
                id: "tea",
                visual: "☕",
                correct: false
            }

        ]

    }

];


/* =========================================================
   7. LOAD CP1
========================================================= */

function loadCheckpoint1() {

    missionState.activity = 0;


    missionIcon.textContent =
        "🎧";


    missionTitle.textContent =
        "Dengar dan Pilih Gambar";


    renderCP1Question();

}


/* =========================================================
   8. RENDER CP1
========================================================= */

function renderCP1Question() {

    const index =
        missionState.activity;


    const question =
        cp1Questions[index];


    missionContent.innerHTML = `

        <div class="cp1-container">

            <div style="
                text-align:center;
                margin-bottom:18px;
            ">

                <div style="
                    color:#9fc4dd;
                    font-size:12px;
                    font-weight:900;
                    margin-bottom:6px;
                ">
                    SOALAN ${index + 1}
                    DARIPADA 2
                </div>

                <h3>
                    Dengar dengan teliti.
                </h3>

                <p style="
                    color:#cde4f5;
                    margin-top:6px;
                ">
                    Kemudian pilih gambar
                    yang betul.
                </p>

            </div>


            <div style="
                text-align:center;
                margin-bottom:22px;
            ">

                ${missionButton(
                    "cp1-listen",
                    "🔊 DENGAR"
                )}

            </div>


            <div
                id="cp1-choices"
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(3, 1fr);
                    gap:14px;
                "
            >

                ${question.choices
                    .map(
                        choice => `
                            <button
                                class="
                                    cp1-choice
                                    mission-action-button
                              data-id="${choice.id}"
data-correct="${choice.correct}"
                                "
                                style="
                                    min-height:130px;
                                    font-size:64px;
                                    background:#f7fbff;
                                "
                                aria-label="
                                    Pilihan gambar
                                "
                            >
                                ${choice.visual}
                            </button>
                        `
                    )
                    .join("")}

            </div>

        </div>

    `;


    document
        .getElementById(
            "cp1-listen"
        )
        .addEventListener(
            "click",
            function () {

                speakWithButton(
                    question.audio,
                    this,
                    "🔊 DENGAR"
                );

            }
        );


    document
        .querySelectorAll(
            ".cp1-choice"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const correct =
                            this.dataset
                                .correct ===
                            "true";


                        checkCP1Answer(
                            correct
                        );

                    }
                );

            }
        );

}


/* =========================================================
   9. CP1 ANSWER
========================================================= */

function checkCP1Answer(
    correct
) {

    if (!correct) {

        showMissionFeedback({

            correct: false,

            title:
                "HAMPIR BETUL!",

            message:
                "Dengarkan dengan teliti dan cuba sekali lagi.",

            buttonText:
                "CUBA LAGI"

        });


        return;

    }


    const key =
        `cp1-${missionState.activity}`;


    scoreActivity(key);


    showMissionFeedback({

        correct: true,

        title:
            "HEBAT!",

        message:
            "Jawapan kamu betul!",

        score:
            "+10",

        onContinue:
            function () {

                missionState.activity++;


                if (
                    missionState.activity <
                    cp1Questions.length
                ) {

                    renderCP1Question();

                }
                else {

                    showMissionFeedback({

                        correct: true,

                        title:
                            "MISI 1 SELESAI!",

                        message:
                            "Bagus! Laluan ke Dapur PeTara kini terbuka.",

                        buttonText:
                            "TERUSKAN PENGEMBARAAN",

                        onContinue:
                            function () {

                                finishCurrentCheckpoint(
                                    1
                                );

                            }

                    });

                }

            }

    });

}


/* =========================================================
   CHECKPOINT 2
========================================================= */


/* =========================================================
   10. CP2 DATA
========================================================= */

const cp2Activities = [

    {

        instruction:
            "Ambil pisau. Potong ikan.",

        source:
            "knife",

        target:
            "fish",

        success:
            "Hebat! Kamu mengikut arahan dengan betul!"

    },

    {

        instruction:
            "Ambil sudu. Masukkan sudu ke dalam mangkuk.",

        source:
            "spoon",

        target:
            "bowl",

        success:
            "Bagus! Arahan berjaya dilakukan!"

    }

];


/* =========================================================
   11. CP2 OBJECTS
========================================================= */

const kitchenObjects = [

    {
        id: "fish",
        visual: "🐟"
    },

    {
        id: "knife",
        visual: "🔪"
    },

    {
        id: "spoon",
        visual: "🥄"
    },

    {
        id: "fork",
        visual: "🍴"
    },

    {
        id: "bowl",
        visual: "🥣"
    },

    {
        id: "plate",
        visual: "🍽️"
    },

    {
        id: "vegetable",
        visual: "🥬"
    },

    {
        id: "tomato",
        visual: "🍅"
    }

];


/* =========================================================
   12. LOAD CP2
========================================================= */

function loadCheckpoint2() {

    missionState.activity = 0;


    missionIcon.textContent =
        "🍳";


    missionTitle.textContent =
        "Dengar dan Lakukan";


    renderCP2();

}


/* =========================================================
   13. RENDER CP2
========================================================= */

function renderCP2() {

    const activity =
        cp2Activities[
            missionState.activity
        ];


    missionContent.innerHTML = `

        <div>

            <div style="
                text-align:center;
                margin-bottom:15px;
            ">

                <div style="
                    color:#9fc4dd;
                    font-size:12px;
                    font-weight:900;
                ">
                    ARAHAN
                    ${missionState.activity + 1}
                    DARIPADA 2
                </div>

                <p style="
                    margin-top:7px;
                    color:#d8edfb;
                ">
                    Dengar arahan.
                    Kemudian gerakkan objek
                    yang betul.
                </p>

                <div style="
                    margin-top:12px;
                ">

                    ${missionButton(
                        "cp2-listen",
                        "🔊 DENGAR ARAHAN"
                    )}

                </div>

            </div>


            <div
                id="kitchen-area"
                style="
                    min-height:300px;
                    padding:18px;
                    display:grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap:12px;
                    background:#d89b56;
                    border:5px solid #9b6135;
                    border-radius:18px;
                "
            >

                ${kitchenObjects
                    .map(
                        object => `
                            <div
                                class="kitchen-object"
                                data-object="
                                    ${object.id}
                                "
                                style="
                                    min-height:100px;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    background:
                                        rgba(
                                            255,
                                            255,
                                            255,
                                            0.75
                                        );
                                    border:
                                        3px solid
                                        rgba(
                                            84,
                                            52,
                                            30,
                                            0.4
                                        );
                                    border-radius:13px;
                                    font-size:52px;
                                    touch-action:none;
                                    cursor:grab;
                                "
                            >
                                ${object.visual}
                            </div>
                        `
                    )
                    .join("")}

            </div>

        </div>

    `;


    document
        .getElementById(
            "cp2-listen"
        )
        .addEventListener(
            "click",
            function () {

                speakWithButton(
                    activity.instruction,
                    this,
                    "🔊 DENGAR ARAHAN"
                );

            }
        );


    setupCP2Drag();

}


/* =========================================================
   14. CP2 POINTER DRAG
========================================================= */

function setupCP2Drag() {

    const objects =
        document.querySelectorAll(
            ".kitchen-object"
        );


    objects.forEach(
        object => {

            object.addEventListener(
                "pointerdown",
                startKitchenDrag
            );

        }
    );

}


/* =========================================================
   15. START CP2 DRAG
========================================================= */

function startKitchenDrag(
    event
) {

    event.preventDefault();


    const original =
        event.currentTarget;


    const objectId =
        original.dataset.object;


    const activity =
        cp2Activities[
            missionState.activity
        ];


    /*
       We still allow distractors
       to be dragged.
    */


    const rect =
        original.getBoundingClientRect();


    const clone =
        original.cloneNode(true);


    clone.id =
        "cp2-drag-clone";


    clone.style.position =
        "fixed";


    clone.style.left =
        `${rect.left}px`;


    clone.style.top =
        `${rect.top}px`;


    clone.style.width =
        `${rect.width}px`;


    clone.style.height =
        `${rect.height}px`;


    clone.style.zIndex =
        "2000";


    clone.style.pointerEvents =
        "none";


    clone.style.opacity =
        "0.92";


    clone.style.transform =
        "scale(1.08)";


    document.body.appendChild(
        clone
    );


    original.style.opacity =
        "0.35";


    const offsetX =
        event.clientX -
        rect.left;


    const offsetY =
        event.clientY -
        rect.top;


    function move(event) {

        clone.style.left =
            `${event.clientX - offsetX}px`;


        clone.style.top =
            `${event.clientY - offsetY}px`;

    }


    function end(event) {

        document.removeEventListener(
            "pointermove",
            move
        );


        document.removeEventListener(
            "pointerup",
            end
        );


        const dropElement =
            document.elementFromPoint(
                event.clientX,
                event.clientY
            );


        const target =
            dropElement
                ? dropElement.closest(
                    ".kitchen-object"
                )
                : null;


        const targetId =
            target
                ? target.dataset.object
                : null;


        clone.remove();


        original.style.opacity =
            "1";


        const correct =
            (
                objectId ===
                activity.source
            ) &&
            (
                targetId ===
                activity.target
            );


        if (correct) {

            const key =
                `cp2-${missionState.activity}`;


            scoreActivity(key);


            showMissionFeedback({

                correct: true,

                title:
                    "HEBAT!",

                message:
                    activity.success,

                score:
                    "+10",

                onContinue:
                    function () {

                        missionState.activity++;


                        if (
                            missionState.activity <
                            cp2Activities.length
                        ) {

                            renderCP2();

                        }
                        else {

                            showMissionFeedback({

                                correct: true,

                                title:
                                    "MISI 2 SELESAI!",

                                message:
                                    "Bagus! Laluan ke Jambatan PeTara kini terbuka.",

                                buttonText:
                                    "TERUSKAN PENGEMBARAAN",

                                onContinue:
                                    function () {

                                        finishCurrentCheckpoint(
                                            2
                                        );

                                    }

                            });

                        }

                    }

            });

        }
        else {

            showMissionFeedback({

                correct: false,

                title:
                    "CUBA LAGI!",

                message:
                    "Objek itu belum tepat. Dengarkan arahan sekali lagi.",

                buttonText:
                    "CUBA LAGI"

            });

        }

    }


    document.addEventListener(
        "pointermove",
        move
    );


    document.addEventListener(
        "pointerup",
        end,
        {
            once: true
        }
    );

}


/* =========================================================
   CHECKPOINT 3
========================================================= */


/* =========================================================
   16. CP3 DATA
========================================================= */

const cp3Activities = [

    {

        audio:
            "Pada waktu pagi, Aiman pergi ke sekolah. " +
            "Dia pergi ke sekolah dengan menaiki bas. " +
            "Aiman tiba di sekolah pada pukul tujuh. " +
            "Aiman pergi ke sekolah dengan menaiki apa?",

        keywords:
            [
                "bas"
            ]

    },

    {

        audio:
            "Siti pergi ke pasar bersama ibunya. " +
            "Ibu membeli ikan dan sayur. " +
            "Siti membantu ibunya membawa barang. " +
            "Ibu membeli apa?",

        keywords:
            [
                "ikan",
                "sayur"
            ]

    }

];


/* =========================================================
   17. LOAD CP3
========================================================= */

function loadCheckpoint3() {

    missionState.activity = 0;


    missionIcon.textContent =
        "🎙️";


    missionTitle.textContent =
        "Dengar dan Jawab";


    renderCP3();

}


/* =========================================================
   18. RENDER CP3
========================================================= */

function renderCP3() {

    const activity =
        cp3Activities[
            missionState.activity
        ];


    missionContent.innerHTML = `

        <div style="
            text-align:center;
        ">

            <div style="
                color:#9fc4dd;
                font-size:12px;
                font-weight:900;
                margin-bottom:10px;
            ">
                SOALAN
                ${missionState.activity + 1}
                DARIPADA 2
            </div>


            <div style="
                font-size:72px;
                margin-bottom:10px;
            ">
                🎧
            </div>


            <h3>
                Dengar soalan.
            </h3>


            <p style="
                color:#cde4f5;
                margin-top:8px;
                margin-bottom:18px;
            ">
                Kemudian jawab menggunakan
                suara kamu.
            </p>


            <div>

                ${missionButton(
                    "cp3-listen",
                    "🔊 DENGAR SOALAN"
                )}


                ${missionButton(
                    "cp3-record",
                    "🎙️ RAKAM SUARA"
                )}

            </div>


            <div
                id="cp3-status"
                style="
                    min-height:30px;
                    margin-top:16px;
                    color:#9fdcff;
                    font-weight:bold;
                "
            >
            </div>

        </div>

    `;


    document
        .getElementById(
            "cp3-listen"
        )
        .addEventListener(
            "click",
            function () {

                speakWithButton(
                    activity.audio,
                    this,
                    "🔊 DENGAR SOALAN"
                );

            }
        );


    document
        .getElementById(
            "cp3-record"
        )
        .addEventListener(
            "click",
            function () {

                handleCP3Recording(
                    this
                );

            }
        );

}


/* =========================================================
   19. CP3 RECORDING
========================================================= */

function handleCP3Recording(
    button
) {

    if (
        petaraAudio.isListening
    ) {

        button.textContent =
            "⏳ MEMERIKSA JAWAPAN...";


        button.disabled =
            true;


        stopListening();

        return;

    }


    const activity =
        cp3Activities[
            missionState.activity
        ];


    const started =
        startListening({

            mode:
                "keyword",

            onResult:
                function (
                    transcript
                ) {

                    button.disabled =
                        false;


                    button.textContent =
                        "🎙️ RAKAM SUARA";


                    checkCP3Speech(
                        transcript,
                        activity
                    );

                },

            onError:
                function () {

                    button.disabled =
                        false;


                    button.textContent =
                        "🎙️ RAKAM SUARA";

                }

        });


    if (started) {

        button.textContent =
            "🔴 TEKAN UNTUK BERHENTI";

    }

}


/* =========================================================
   20. CP3 CHECK SPEECH
========================================================= */

function checkCP3Speech(
    transcript,
    activity
) {

    let correct = false;


    if (
        activity.keywords.length === 1
    ) {

        correct =
            containsKeyword(
                transcript,
                activity.keywords[0]
            );

    }
    else {

        correct =
            containsAllKeywords(
                transcript,
                activity.keywords
            );

    }


    if (!correct) {

        showMissionFeedback({

            correct: false,

            title:
                "HAMPIR BETUL!",

            message:
                "Dengarkan soalan sekali lagi dan cuba jawab dengan jelas.",

            buttonText:
                "CUBA LAGI"

        });


        return;

    }


    const key =
        `cp3-${missionState.activity}`;


    scoreActivity(key);


    showMissionFeedback({

        correct: true,

        title:
            "BAGUS!",

        message:
            "Jawapan kamu berjaya dikesan!",

        score:
            "+10",

        onContinue:
            function () {

                missionState.activity++;


                if (
                    missionState.activity <
                    cp3Activities.length
                ) {

                    renderCP3();

                }
                else {

                    showMissionFeedback({

                        correct: true,

                        title:
                            "MISI 3 SELESAI!",

                        message:
                            "Hebat! Laluan ke Pekan PeTara kini terbuka.",

                        buttonText:
                            "TERUSKAN PENGEMBARAAN",

                        onContinue:
                            function () {

                                finishCurrentCheckpoint(
                                    3
                                );

                            }

                    });

                }

            }

    });

}


/* =========================================================
   CHECKPOINT 4
========================================================= */


/* =========================================================
   21. CP4 DATA
========================================================= */

const cp4Conversation = [

    {

        npc:
            "Hai! Boleh kamu bantu saya?",

        acceptedAny:
            [
                "ya",
                "boleh",
                "bantu"
            ]

    },

    {

        npc:
            "Terima kasih. Tolong belikan saya tiga barang di kedai runcit Pak Ali. Saya perlukan cuka, kicap dan garam.",

        acceptedAny:
            [
                "baik",
                "boleh",
                "beli"
            ]

    },

    {

        npc:
            "Apakah tiga barang yang saya perlukan tadi?",

        requiredAll:
            [
                "cuka",
                "kicap",
                "garam"
            ]

    }

];


/* =========================================================
   22. LOAD CP4
========================================================= */

function loadCheckpoint4() {

    missionState.cp4Step = 0;


    missionIcon.textContent =
        "🏪";


    missionTitle.textContent =
        "Misi Kedai Pak Ali";


    renderCP4();

}


/* =========================================================
   23. RENDER CP4
========================================================= */

function renderCP4() {

    const step =
        missionState.cp4Step;


    const conversation =
        cp4Conversation[step];


    missionContent.innerHTML = `

        <div style="
            text-align:center;
        ">

            <div style="
                font-size:68px;
                margin-bottom:8px;
            ">
                👨‍🌾
            </div>


            <div style="
                display:inline-block;
                padding:5px 10px;
                margin-bottom:14px;
                background:#10243b;
                border-radius:8px;
                color:#ffe052;
                font-size:12px;
                font-weight:900;
            ">
                PENDUDUK PEKAN PETARA
            </div>


            <div style="
                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.08
                    );
                border-radius:14px;
                padding:17px;
                margin-bottom:17px;
            ">

                <p style="
                    color:#cde4f5;
                ">
                    Dengarkan perbualan
                    dan jawab menggunakan
                    suara kamu.
                </p>

            </div>


            ${missionButton(
                "cp4-listen",
                "🔊 DENGAR"
            )}


            ${missionButton(
                "cp4-record",
                "🎙️ RAKAM SUARA"
            )}


            <div style="
                margin-top:15px;
                color:#8ecff3;
                font-size:12px;
                font-weight:bold;
            ">
                PERBUALAN
                ${step + 1}
                / 3
            </div>

        </div>

    `;


    document
        .getElementById(
            "cp4-listen"
        )
        .addEventListener(
            "click",
            function () {

                speakWithButton(
                    conversation.npc,
                    this,
                    "🔊 DENGAR"
                );

            }
        );


    document
        .getElementById(
            "cp4-record"
        )
        .addEventListener(
            "click",
            function () {

                handleCP4Recording(
                    this
                );

            }
        );

}


/* =========================================================
   24. CP4 RECORD
========================================================= */

function handleCP4Recording(
    button
) {

    if (
        petaraAudio.isListening
    ) {

        button.disabled =
            true;


        button.textContent =
            "⏳ MEMERIKSA...";


        stopListening();

        return;

    }


    const conversation =
        cp4Conversation[
            missionState.cp4Step
        ];


    const started =
        startListening({

            mode:
                "conversation",

            onResult:
                function (
                    transcript
                ) {

                    button.disabled =
                        false;


                    button.textContent =
                        "🎙️ RAKAM SUARA";


                    checkCP4Speech(
                        transcript,
                        conversation
                    );

                },

            onError:
                function () {

                    button.disabled =
                        false;


                    button.textContent =
                        "🎙️ RAKAM SUARA";

                }

        });


    if (started) {

        button.textContent =
            "🔴 TEKAN UNTUK BERHENTI";

    }

}


/* =========================================================
   25. CP4 CHECK
========================================================= */

function checkCP4Speech(
    transcript,
    conversation
) {

    let correct = false;


    if (
        conversation.acceptedAny
    ) {

        correct =
            containsAnyKeyword(
                transcript,
                conversation.acceptedAny
            );

    }


    if (
        conversation.requiredAll
    ) {

        correct =
            containsAllKeywords(
                transcript,
                conversation.requiredAll
            );

    }


    if (!correct) {

        showMissionFeedback({

            correct: false,

            title:
                "CUBA SEKALI LAGI!",

            message:
                "Dengarkan percakapan dengan teliti dan jawab dengan jelas.",

            buttonText:
                "CUBA LAGI"

        });


        return;

    }


    const key =
        `cp4-${missionState.cp4Step}`;


    scoreActivity(key);


    showMissionFeedback({

        correct: true,

        title:
            "BAGUS!",

        message:
            "Jawapan kamu sesuai!",

        score:
            "+10",

        onContinue:
            function () {

                missionState.cp4Step++;


                if (
                    missionState.cp4Step <
                    cp4Conversation.length
                ) {

                    renderCP4();

                }
                else {

                    finishCP4();

                }

            }

    });

}


/* =========================================================
   26. FINISH CP4
========================================================= */

function finishCP4() {

    missionContent.innerHTML = `

        <div style="
            text-align:center;
            padding:15px;
        ">

            <div style="
                font-size:75px;
                margin-bottom:12px;
            ">
                👨‍🌾✨
            </div>


            <h3 style="
                color:#ffe052;
                margin-bottom:12px;
            ">
                Misi Berjaya!
            </h3>


            <p style="
                font-size:17px;
                line-height:1.7;
                margin-bottom:20px;
            ">
                Terima kasih!
                Sekarang teruskan perjalanan
                kamu ke checkpoint terakhir!
            </p>


            <button
                id="cp4-finish"
                class="primary-button"
            >
                ✨ TERUSKAN
            </button>

        </div>

    `;


    speakMalay(
        "Terima kasih! Sekarang teruskan perjalanan kamu ke checkpoint terakhir!"
    );


    document
        .getElementById(
            "cp4-finish"
        )
        .addEventListener(
            "click",
            function () {

                finishCurrentCheckpoint(
                    4
                );

            }
        );

}


/* =========================================================
   CHECKPOINT 5
========================================================= */


/* =========================================================
   27. CP5 DATA
========================================================= */

const cp5Sentences = [

    {
        text:
            "Saya suka membaca buku cerita."
    },

    {
        text:
            "Kami bermain bola di padang sekolah."
    }

];


/* =========================================================
   28. LOAD CP5
========================================================= */

function loadCheckpoint5() {

    missionState.cp5Sentence = 0;


    missionIcon.textContent =
        "✨";


    missionTitle.textContent =
        "Dengar dan Ulang";


    renderCP5();

}


/* =========================================================
   29. RENDER CP5
========================================================= */

function renderCP5() {

    const index =
        missionState.cp5Sentence;


    const sentence =
        cp5Sentences[index];


    missionContent.innerHTML = `

        <div style="
            text-align:center;
        ">

            <div style="
                color:#9fc4dd;
                font-size:12px;
                font-weight:900;
                margin-bottom:10px;
            ">
                AYAT
                ${index + 1}
                DARIPADA 2
            </div>


            <div style="
                font-size:70px;
                margin-bottom:10px;
            ">
                ✨🎧✨
            </div>


            <h3>
                Dengar dan ulang ayat.
            </h3>


            <p style="
                margin-top:7px;
                color:#cde4f5;
            ">
                Sebut semua perkataan
                dengan jelas.
            </p>


            <div style="
                margin-top:20px;
            ">

                ${missionButton(
                    "cp5-listen",
                    "🔊 DENGAR AYAT"
                )}


                ${missionButton(
                    "cp5-record",
                    "🎙️ RAKAM SUARA"
                )}

            </div>


            <div
                id="cp5-word-progress"
                style="
                    margin-top:20px;
                    padding:15px;
                    background:
                        rgba(
                            255,
                            255,
                            255,
                            0.08
                        );
                    border-radius:12px;
                    min-height:70px;
                "
            >

                ${renderTargetWords(
                    sentence.text,
                    ""
                )}

            </div>

        </div>

    `;


    document
        .getElementById(
            "cp5-listen"
        )
        .addEventListener(
            "click",
            function () {

                speakWithButton(
                    sentence.text,
                    this,
                    "🔊 DENGAR AYAT"
                );

            }
        );


    document
        .getElementById(
            "cp5-record"
        )
        .addEventListener(
            "click",
            function () {

                handleCP5Recording(
                    this,
                    sentence
                );

            }
        );

}


/* =========================================================
   30. CP5 TARGET WORDS
========================================================= */

function renderTargetWords(
    targetSentence,
    transcript
) {

    const target =
        normalizeSpeechText(
            targetSentence
        ).split(" ");


    const spoken =
        normalizeSpeechText(
            transcript
        ).split(" ");


    return target
        .map(
            word => {

                const detected =
                    spoken.includes(
                        word
                    );


                return `
                    <span
                        style="
                            display:inline-block;
                            padding:7px 10px;
                            margin:4px;
                            border-radius:8px;
                            font-weight:900;

                            background:
                                ${
                                    detected
                                        ? "#53c96b"
                                        : "#314c68"
                                };

                            color:#ffffff;

                            border:
                                2px solid
                                ${
                                    detected
                                        ? "#a7ffb8"
                                        : "#55738e"
                                };
                        "
                    >
                        ${word}
                    </span>
                `;

            }
        )
        .join("");

}


/* =========================================================
   31. CP5 RECORDING
========================================================= */

function handleCP5Recording(
    button,
    sentence
) {

    if (
        petaraAudio.isListening
    ) {

        button.disabled =
            true;


        button.textContent =
            "⏳ MEMERIKSA AYAT...";


        stopListening();

        return;

    }


    const started =
        startListening({

            mode:
                "sentence",

            onLive:
                function (
                    transcript
                ) {

                    const progress =
                        document.getElementById(
                            "cp5-word-progress"
                        );


                    if (progress) {

                        progress.innerHTML =
                            renderTargetWords(
                                sentence.text,
                                transcript
                            );

                    }

                },

            onResult:
                function (
                    transcript
                ) {

                    button.disabled =
                        false;


                    button.textContent =
                        "🎙️ RAKAM SUARA";


                    checkCP5Speech(
                        transcript,
                        sentence
                    );

                },

            onError:
                function () {

                    button.disabled =
                        false;


                    button.textContent =
                        "🎙️ RAKAM SUARA";

                }

        });


    if (started) {

        button.textContent =
            "🔴 TEKAN UNTUK BERHENTI";

    }

}


/* =========================================================
   32. CHECK CP5 SPEECH
========================================================= */

function checkCP5Speech(
    transcript,
    sentence
) {

    const correct =
        containsTargetSentenceWords(
            transcript,
            sentence.text
        );


    if (!correct) {

        const percentage =
            getSentenceMatchPercentage(
                transcript,
                sentence.text
            );


        showMissionFeedback({

            correct: false,

            title:
                "HAMPIR BERJAYA!",

            message:
                `Sebahagian ayat berjaya dikesan (${percentage}%). Dengarkan ayat dan cuba sekali lagi.`,

            buttonText:
                "CUBA LAGI",

            onContinue:
                function () {

                    const progress =
                        document.getElementById(
                            "cp5-word-progress"
                        );


                    if (progress) {

                        progress.innerHTML =
                            renderTargetWords(
                                sentence.text,
                                ""
                            );

                    }

                }

        });


        return;

    }


    const key =
        `cp5-${missionState.cp5Sentence}`;


    scoreActivity(key);


    showMissionFeedback({

        correct: true,

        title:
            "HEBAT!",

        message:
            "Kamu berjaya mengulang ayat dengan lengkap!",

        score:
            "+10",

        onContinue:
            function () {

                missionState.cp5Sentence++;


                if (
                    missionState.cp5Sentence <
                    cp5Sentences.length
                ) {

                    renderCP5();

                }
                else {

                    finishCP5();

                }

            }

    });

}


/* =========================================================
   33. FINISH CP5
========================================================= */

function finishCP5() {

    missionContent.innerHTML = `

        <div style="
            text-align:center;
            padding:15px;
        ">

            <div
                id="final-gate-animation"
                style="
                    font-size:90px;
                    margin-bottom:12px;
                "
            >
                ✨🏛️✨
            </div>


            <h2 style="
                color:#ffe052;
                margin-bottom:12px;
            ">
                GERBANG PETARA TERBUKA!
            </h2>


            <p style="
                line-height:1.7;
                color:#e1f3ff;
                margin-bottom:20px;
            ">
                Tahniah!
                Kamu telah menyelesaikan
                semua misi Kembara PeTara.
            </p>


            <button
                id="cp5-finish"
                class="primary-button"
            >
                🏆 TAMATKAN PENGEMBARAAN
            </button>

        </div>

    `;


    /*
       Small gate celebration.
    */

    const gate =
        document.getElementById(
            "final-gate-animation"
        );


    gate.animate(
        [
            {
                transform:
                    "scale(0.8)",
                opacity:
                    0.5
            },

            {
                transform:
                    "scale(1.2)",
                opacity:
                    1
            },

            {
                transform:
                    "scale(1)",
                opacity:
                    1
            }
        ],
        {
            duration:
                900,

            easing:
                "ease-out"
        }
    );


    speakMalay(
        "Tahniah! Gerbang PeTara telah terbuka!"
    );


    document
        .getElementById(
            "cp5-finish"
        )
        .addEventListener(
            "click",
            function () {

                finishCurrentCheckpoint(
                    5
                );

            }
        );

}
