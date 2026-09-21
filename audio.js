/* =========================================================
   KEMBARA PETARA
   audio.js

   Sistem Audio:
   - Text-to-Speech Bahasa Melayu
   - Pilih suara ms-MY terbaik yang tersedia
   - Kelajuan bacaan mesra murid
   - Elak audio bertindih
   - Speech Recognition Bahasa Melayu
   - Start / Stop microphone
   - Live transcript
   - Interim transcript
   - Final transcript
   - Normalisasi teks
========================================================= */


/* =========================================================
   1. AUDIO STATE
========================================================= */

const petaraAudio = {

    /* TTS */

    speechSupported:
        "speechSynthesis" in window,

    voices: [],

    malayVoice: null,

    isSpeaking: false,

    currentUtterance: null,


    /* STT */

    recognitionSupported: false,

    recognition: null,

    isListening: false,

    shouldProcessResult: false,

    finalTranscript: "",

    interimTranscript: "",

    accumulatedTranscript: "",

    recognitionMode: "normal",

    onResultCallback: null,

    onLiveCallback: null,

    onEndCallback: null,

    onErrorCallback: null

};


/* =========================================================
   2. SPEECH RECOGNITION SUPPORT
========================================================= */

const SpeechRecognitionAPI =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognitionAPI) {

    petaraAudio.recognitionSupported =
        true;

}


/* =========================================================
   3. LOAD BROWSER VOICES
========================================================= */

function loadMalayVoices() {

    if (!petaraAudio.speechSupported) {

        console.warn(
            "Speech Synthesis tidak disokong."
        );

        return;

    }


    const voices =
        window.speechSynthesis.getVoices();


    petaraAudio.voices =
        voices;


    if (!voices.length) {

        return;

    }


    /*
       Cari suara Bahasa Melayu.

       Keutamaan:
       1. ms-MY
       2. mana-mana ms
       3. voice yang mempunyai perkataan Malay
       4. fallback kepada default browser
    */


    let selectedVoice = null;


    /* Exact ms-MY */

    selectedVoice =
        voices.find(
            voice => {

                return (
                    voice.lang &&
                    voice.lang
                        .toLowerCase() ===
                        "ms-my"
                );

            }
        );


    /* Any Malay ms voice */

    if (!selectedVoice) {

        selectedVoice =
            voices.find(
                voice => {

                    return (
                        voice.lang &&
                        voice.lang
                            .toLowerCase()
                            .startsWith("ms")
                    );

                }
            );

    }


    /* Voice name contains Malay */

    if (!selectedVoice) {

        selectedVoice =
            voices.find(
                voice => {

                    const voiceName =
                        voice.name
                            .toLowerCase();


                    return (
                        voiceName.includes(
                            "malay"
                        ) ||
                        voiceName.includes(
                            "melayu"
                        )
                    );

                }
            );

    }


    petaraAudio.malayVoice =
        selectedVoice;


    if (selectedVoice) {

        console.log(
            "Suara PeTara:",
            selectedVoice.name,
            selectedVoice.lang
        );

    }
    else {

        console.warn(
            "Suara khusus Bahasa Melayu tidak ditemui. " +
            "Browser akan menggunakan suara lalai."
        );

    }

}


/* =========================================================
   4. VOICES CHANGED
========================================================= */

/*
   Chrome kadang-kadang tidak menyediakan
   voice list dengan serta-merta.

   Jadi kita load sekali sekarang dan sekali
   lagi apabila voiceschanged berlaku.
*/

if (petaraAudio.speechSupported) {

    loadMalayVoices();


    window.speechSynthesis.addEventListener(
        "voiceschanged",
        loadMalayVoices
    );

}


/* =========================================================
   5. SPEAK MALAY
========================================================= */

/*
   Fungsi utama yang akan digunakan
   oleh seluruh game.

   Contoh:

   speakMalay(
       "Aiman pergi memancing bersama ayahnya."
   );
*/

function speakMalay(
    text,
    options = {}
) {

    return new Promise(
        (resolve, reject) => {

            if (
                !petaraAudio.speechSupported
            ) {

                console.warn(
                    "Text-to-Speech tidak tersedia."
                );

                reject(
                    new Error(
                        "Speech synthesis unsupported"
                    )
                );

                return;

            }


            if (!text) {

                resolve();

                return;

            }


            /*
               Jangan benarkan dua audio
               bercakap serentak.
            */

            stopSpeaking();


            const utterance =
                new SpeechSynthesisUtterance(
                    text
                );


            utterance.lang =
                "ms-MY";


            /*
               Sedikit perlahan daripada
               kelajuan normal.

               Sesuai untuk murid Tahap 1.
            */

            utterance.rate =
                options.rate ?? 0.82;


            utterance.pitch =
                options.pitch ?? 1.0;


            utterance.volume =
                options.volume ?? 1.0;


            /*
               Gunakan Malay voice jika
               browser menyediakannya.
            */

            if (
                petaraAudio.malayVoice
            ) {

                utterance.voice =
                    petaraAudio.malayVoice;

            }


            petaraAudio.currentUtterance =
                utterance;


            petaraAudio.isSpeaking =
                true;


            utterance.onstart =
                function () {

                    petaraAudio.isSpeaking =
                        true;


                    if (
                        typeof options.onStart ===
                        "function"
                    ) {

                        options.onStart();

                    }

                };


            utterance.onend =
                function () {

                    petaraAudio.isSpeaking =
                        false;


                    petaraAudio.currentUtterance =
                        null;


                    if (
                        typeof options.onEnd ===
                        "function"
                    ) {

                        options.onEnd();

                    }


                    resolve();

                };


            utterance.onerror =
                function (event) {

                    petaraAudio.isSpeaking =
                        false;


                    petaraAudio.currentUtterance =
                        null;


                    /*
                       "canceled" is normal if
                       another audio is played.
                    */

                    if (
                        event.error !==
                        "canceled"
                    ) {

                        console.warn(
                            "TTS error:",
                            event.error
                        );

                    }


                    if (
                        typeof options.onError ===
                        "function"
                    ) {

                        options.onError(
                            event
                        );

                    }


                    resolve();

                };


            /*
               Small Chrome workaround.

               Resume synthesis before speak.
            */

            window.speechSynthesis.resume();


            window.speechSynthesis.speak(
                utterance
            );

        }
    );

}


/* =========================================================
   6. STOP SPEAKING
========================================================= */

function stopSpeaking() {

    if (
        !petaraAudio.speechSupported
    ) {

        return;

    }


    if (
        window.speechSynthesis.speaking ||
        window.speechSynthesis.pending
    ) {

        window.speechSynthesis.cancel();

    }


    petaraAudio.isSpeaking =
        false;


    petaraAudio.currentUtterance =
        null;

}


/* =========================================================
   7. SPEAK BUTTON HELPER
========================================================= */

/*
   Fungsi ini digunakan untuk button
   seperti:

   🔊 DENGAR
   🔊 DENGAR SOALAN
   🔊 DENGAR AYAT

   Ia automatik tukar tulisan button
   semasa audio sedang dimainkan.
*/

async function speakWithButton(
    text,
    button,
    normalText = "🔊 DENGAR"
) {

    if (!button) {

        await speakMalay(text);

        return;

    }


    if (petaraAudio.isSpeaking) {

        stopSpeaking();

        button.disabled =
            false;

        button.textContent =
            normalText;

        return;

    }


    const oldText =
        button.textContent;


    button.disabled =
        true;


    button.textContent =
        "🔊 SEDANG BERCAKAP...";


    try {

        await speakMalay(
            text,
            {

                onEnd:
                    function () {

                        button.disabled =
                            false;


                        button.textContent =
                            normalText;

                    },

                onError:
                    function () {

                        button.disabled =
                            false;


                        button.textContent =
                            normalText;

                    }

            }
        );

    }
    catch (error) {

        console.warn(
            error
        );


        button.disabled =
            false;


        button.textContent =
            oldText ||
            normalText;

    }

}


/* =========================================================
   8. CREATE SPEECH RECOGNITION
========================================================= */

function createSpeechRecognition() {

    if (
        !petaraAudio.recognitionSupported
    ) {

        return null;

    }


    const recognition =
        new SpeechRecognitionAPI();


    recognition.lang =
        "ms-MY";


    /*
       We want live transcript.
    */

    recognition.interimResults =
        true;


    /*
       Continuous helps us accumulate
       longer CP5 sentences.
    */

    recognition.continuous =
        true;


    recognition.maxAlternatives =
        1;


    /* =====================================================
       ON START
    ===================================================== */

    recognition.onstart =
        function () {

            petaraAudio.isListening =
                true;


            showMicrophoneOverlay();

        };


    /* =====================================================
       ON RESULT
    ===================================================== */

    recognition.onresult =
        function (event) {

            let newFinalText = "";

            let currentInterimText = "";


            for (
                let i =
                    event.resultIndex;

                i <
                    event.results.length;

                i++
            ) {

                const transcript =
                    event.results[i][0]
                        .transcript;


                if (
                    event.results[i]
                        .isFinal
                ) {

                    newFinalText +=
                        transcript + " ";

                }
                else {

                    currentInterimText +=
                        transcript;

                }

            }


            /*
               Add only NEW final text.

               This is important for CP5.
               Previously detected words
               remain visible.
            */

            if (
                newFinalText.trim()
            ) {

                petaraAudio.finalTranscript +=
                    " " +
                    newFinalText.trim();


                petaraAudio.finalTranscript =
                    cleanSpaces(
                        petaraAudio
                            .finalTranscript
                    );

            }


            petaraAudio.interimTranscript =
                currentInterimText.trim();


            /*
               Build visible transcript:
               final + current interim
            */

            petaraAudio.accumulatedTranscript =
                cleanSpaces(
                    [
                        petaraAudio
                            .finalTranscript,

                        petaraAudio
                            .interimTranscript
                    ]
                        .filter(Boolean)
                        .join(" ")
                );


            updateLiveTranscript(
                petaraAudio
                    .accumulatedTranscript
            );


            /*
               Optional callback.

               checkpoints.js can use this
               for CP5 live checking.
            */

            if (
                typeof
                    petaraAudio
                        .onLiveCallback ===
                "function"
            ) {

                petaraAudio
                    .onLiveCallback(
                        petaraAudio
                            .accumulatedTranscript
                    );

            }

        };


    /* =====================================================
       ON ERROR
    ===================================================== */

    recognition.onerror =
        function (event) {

            console.warn(
                "Speech Recognition error:",
                event.error
            );


            /*
               aborted is normally caused
               by us calling stop().
            */

            if (
                event.error ===
                "aborted"
            ) {

                return;

            }


            if (
                event.error ===
                "not-allowed" ||
                event.error ===
                "service-not-allowed"
            ) {

                hideMicrophoneOverlay();


                showAudioMessage(
                    "🎙️ Mikrofon Tidak Dibenarkan",
                    "Benarkan akses mikrofon pada pelayar untuk menggunakan aktiviti bertutur."
                );

            }


            if (
                event.error ===
                "no-speech"
            ) {

                /*
                   Do not treat this as a
                   serious error.
                */

                console.log(
                    "Tiada suara dikesan."
                );

            }


            if (
                typeof
                    petaraAudio
                        .onErrorCallback ===
                "function"
            ) {

                petaraAudio
                    .onErrorCallback(
                        event.error
                    );

            }

        };


    /* =====================================================
       ON END
    ===================================================== */

    recognition.onend =
        function () {

            petaraAudio.isListening =
                false;


            hideMicrophoneOverlay();


            const finalResult =
                cleanSpaces(
                    petaraAudio
                        .accumulatedTranscript
                );


            /*
               Only process if the session
               was meant to be checked.
            */

            if (
                petaraAudio
                    .shouldProcessResult
            ) {

                if (
                    typeof
                        petaraAudio
                            .onResultCallback ===
                    "function"
                ) {

                    petaraAudio
                        .onResultCallback(
                            finalResult
                        );

                }

            }


            if (
                typeof
                    petaraAudio
                        .onEndCallback ===
                "function"
            ) {

                petaraAudio
                    .onEndCallback(
                        finalResult
                    );

            }


            petaraAudio
                .shouldProcessResult =
                false;

        };


    return recognition;

}


/* =========================================================
   9. INITIALISE RECOGNITION
========================================================= */

if (
    petaraAudio.recognitionSupported
) {

    petaraAudio.recognition =
        createSpeechRecognition();

}


/* =========================================================
   10. START LISTENING
========================================================= */

/*
   Usage example:

   startListening({

       mode: "keyword",

       onResult: function(text) {
           console.log(text);
       }

   });
*/

function startListening(
    options = {}
) {

    /*
       Browser unsupported
    */

    if (
        !petaraAudio
            .recognitionSupported
    ) {

        showSpeechUnsupported();

        return false;

    }


    /*
       Already listening
    */

    if (
        petaraAudio.isListening
    ) {

        return false;

    }


    /*
       Stop TTS before microphone starts.
       This prevents the game audio itself
       from being recognised as an answer.
    */

    stopSpeaking();


    /*
       Reset transcript for new recording.
    */

    petaraAudio.finalTranscript =
        "";

    petaraAudio.interimTranscript =
        "";

    petaraAudio.accumulatedTranscript =
        "";


    petaraAudio.recognitionMode =
        options.mode ||
        "normal";


    petaraAudio.onResultCallback =
        options.onResult ||
        null;


    petaraAudio.onLiveCallback =
        options.onLive ||
        null;


    petaraAudio.onEndCallback =
        options.onEnd ||
        null;


    petaraAudio.onErrorCallback =
        options.onError ||
        null;


    petaraAudio.shouldProcessResult =
        true;


    updateLiveTranscript("");


    try {

        petaraAudio
            .recognition
            .start();


        return true;

    }
    catch (error) {

        console.warn(
            "Tidak dapat memulakan mikrofon:",
            error
        );


        return false;

    }

}


/* =========================================================
   11. STOP LISTENING
========================================================= */

function stopListening() {

    if (
        !petaraAudio
            .recognitionSupported
    ) {

        return;

    }


    if (
        !petaraAudio.isListening
    ) {

        return;

    }


    try {

        petaraAudio
            .recognition
            .stop();

    }
    catch (error) {

        console.warn(
            "Tidak dapat menghentikan mikrofon:",
            error
        );

    }

}


/* =========================================================
   12. CANCEL LISTENING
========================================================= */

/*
   Difference:

   stopListening()
   = process student's answer.

   cancelListening()
   = close microphone without checking.
*/

function cancelListening() {

    if (
        !petaraAudio
            .recognitionSupported
    ) {

        return;

    }


    petaraAudio.shouldProcessResult =
        false;


    if (
        petaraAudio.isListening
    ) {

        try {

            petaraAudio
                .recognition
                .abort();

        }
        catch (error) {

            console.warn(
                error
            );

        }

    }


    hideMicrophoneOverlay();

}


/* =========================================================
   13. TOGGLE LISTENING
========================================================= */

/*
   Useful for one-button recording:

   First press:
   🎙️ RAKAM SUARA

   Second press:
   🔴 BERHENTI
*/

function toggleListening(
    options = {}
) {

    if (
        petaraAudio.isListening
    ) {

        stopListening();

        return "stopping";

    }


    const started =
        startListening(
            options
        );


    if (started) {

        return "started";

    }


    return "failed";

}


/* =========================================================
   14. MICROPHONE OVERLAY
========================================================= */

function showMicrophoneOverlay() {

    const overlay =
        document.getElementById(
            "microphone-overlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.remove(
        "hidden"
    );

}


/* =========================================================
   15. HIDE MICROPHONE OVERLAY
========================================================= */

function hideMicrophoneOverlay() {

    const overlay =
        document.getElementById(
            "microphone-overlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.add(
        "hidden"
    );

}


/* =========================================================
   16. LIVE TRANSCRIPT
========================================================= */

function updateLiveTranscript(
    text
) {

    const transcriptElement =
        document.getElementById(
            "live-transcript"
        );


    if (!transcriptElement) {

        return;

    }


    if (!text) {

        transcriptElement.textContent =
            "Mulakan bercakap...";

        return;

    }


    transcriptElement.textContent =
        text;

}


/* =========================================================
   17. NORMALIZE SPEECH TEXT
========================================================= */

/*
   Converts:

   "Aiman Naik BAS!"

   into:

   "aiman naik bas"
*/

function normalizeSpeechText(
    text
) {

    if (!text) {

        return "";

    }


    return text

        .toLowerCase()

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[.,!?;:"'()[\]{}]/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();

}


/* =========================================================
   18. CLEAN SPACES
========================================================= */

function cleanSpaces(
    text
) {

    return String(
        text || ""
    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =========================================================
   19. CHECK ONE KEYWORD
========================================================= */

/*
   Example:

   containsKeyword(
       "Aiman naik bas",
       "bas"
   )

   => true
*/

function containsKeyword(
    transcript,
    keyword
) {

    const normalizedTranscript =
        normalizeSpeechText(
            transcript
        );


    const normalizedKeyword =
        normalizeSpeechText(
            keyword
        );


    if (
        !normalizedTranscript ||
        !normalizedKeyword
    ) {

        return false;

    }


    const words =
        normalizedTranscript.split(
            " "
        );


    return words.includes(
        normalizedKeyword
    );

}


/* =========================================================
   20. CHECK ANY KEYWORD
========================================================= */

/*
   Example CP4:

   containsAnyKeyword(
       transcript,
       ["ya", "boleh", "bantu"]
   )
*/

function containsAnyKeyword(
    transcript,
    keywords
) {

    return keywords.some(
        keyword => {

            return containsKeyword(
                transcript,
                keyword
            );

        }
    );

}


/* =========================================================
   21. CHECK ALL KEYWORDS
========================================================= */

/*
   Example CP3:

   containsAllKeywords(
       transcript,
       ["ikan", "sayur"]
   )

   Both must exist.
*/

function containsAllKeywords(
    transcript,
    keywords
) {

    return keywords.every(
        keyword => {

            return containsKeyword(
                transcript,
                keyword
            );

        }
    );

}


/* =========================================================
   22. CHECK COMPLETE SENTENCE WORDS
========================================================= */

/*
   CP5 uses this.

   Student does not have to match
   punctuation or capital letters.

   Example:

   target:
   Saya suka membaca buku cerita.

   Student:
   saya suka membaca buku cerita

   => true
*/

function containsTargetSentenceWords(
    transcript,
    targetSentence
) {

    const spoken =
        normalizeSpeechText(
            transcript
        );


    const target =
        normalizeSpeechText(
            targetSentence
        );


    if (
        !spoken ||
        !target
    ) {

        return false;

    }


    const spokenWords =
        spoken.split(" ");


    const targetWords =
        target.split(" ");


    /*
       Check that every target word exists.

       For CP5 this allows small STT
       punctuation/capitalisation differences.
    */

    return targetWords.every(
        word => {

            return spokenWords.includes(
                word
            );

        }
    );

}


/* =========================================================
   23. SENTENCE MATCH SCORE
========================================================= */

/*
   Returns percentage of target words
   detected.

   Useful for feedback.

   Example:
   5 target words
   4 detected
   => 80
*/

function getSentenceMatchPercentage(
    transcript,
    targetSentence
) {

    const spoken =
        normalizeSpeechText(
            transcript
        );


    const target =
        normalizeSpeechText(
            targetSentence
        );


    if (
        !spoken ||
        !target
    ) {

        return 0;

    }


    const spokenWords =
        spoken.split(" ");


    const targetWords =
        target.split(" ");


    let matched =
        0;


    targetWords.forEach(
        word => {

            if (
                spokenWords.includes(
                    word
                )
            ) {

                matched++;

            }

        }
    );


    return Math.round(
        (
            matched /
            targetWords.length
        ) * 100
    );

}


/* =========================================================
   24. SPEECH UNSUPPORTED MESSAGE
========================================================= */

function showSpeechUnsupported() {

    showAudioMessage(
        "🎙️ Mikrofon Tidak Tersedia",
        "Pengecaman suara tidak tersedia pada pelayar ini. Cuba gunakan pelayar yang menyokong fungsi mikrofon."
    );

}


/* =========================================================
   25. AUDIO MESSAGE
========================================================= */

function showAudioMessage(
    title,
    message
) {

    /*
       Use game.js message system
       if available.
    */

    if (
        typeof showSimpleMessage ===
        "function"
    ) {

        showSimpleMessage(
            title,
            message
        );

        return;

    }


    /*
       Fallback only if game.js
       is unavailable.
    */

    console.warn(
        title,
        message
    );

}


/* =========================================================
   26. MICROPHONE PERMISSION TEST
========================================================= */

/*
   Optional helper.

   We can call this before CP3 if needed.
*/

async function requestMicrophonePermission() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
            .getUserMedia
    ) {

        return false;

    }


    try {

        const stream =
            await navigator
                .mediaDevices
                .getUserMedia(
                    {
                        audio: true
                    }
                );


        /*
           Permission obtained.
           Stop the temporary stream.
        */

        stream
            .getTracks()
            .forEach(
                track => {

                    track.stop();

                }
            );


        return true;

    }
    catch (error) {

        console.warn(
            "Microphone permission:",
            error
        );


        return false;

    }

}


/* =========================================================
   27. STOP AUDIO WHEN TAB IS HIDDEN
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.hidden
        ) {

            stopSpeaking();

            cancelListening();

        }

    }
);


/* =========================================================
   28. STOP AUDIO BEFORE PAGE CLOSE
========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        stopSpeaking();

        cancelListening();

    }
);


/* =========================================================
   29. AUDIO INITIALIZATION
========================================================= */

function initializeAudio() {

    console.log(
        "Kembara PeTara Audio"
    );


    console.log(
        "TTS:",
        petaraAudio.speechSupported
            ? "Disokong"
            : "Tidak disokong"
    );


    console.log(
        "STT:",
        petaraAudio
            .recognitionSupported
            ? "Disokong"
            : "Tidak disokong"
    );


    if (
        petaraAudio.speechSupported
    ) {

        loadMalayVoices();

    }

}


initializeAudio();
