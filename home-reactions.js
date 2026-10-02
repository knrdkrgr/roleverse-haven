// =========================================
// HOME POSTS CONTAINER
// =========================================

const homePosts =
    document.getElementById("postList");


// =========================================
// REACTION STORAGE
// =========================================

const HOME_REACTION_STORAGE_KEY =
    "roleverseHomeReactions";


function getSavedReactions() {

    const savedReactions =
        localStorage.getItem(
            HOME_REACTION_STORAGE_KEY
        );


    if (!savedReactions) {

        return {};

    }


    try {

        const parsedReactions =
            JSON.parse(savedReactions);


        if (
            typeof parsedReactions !== "object" ||
            parsedReactions === null
        ) {

            return {};

        }


        return parsedReactions;

    } catch (error) {

        console.error(
            "Could not load saved reactions:",
            error
        );

        return {};

    }

}


function saveReactions(
    reactions
) {

    try {

        localStorage.setItem(
            HOME_REACTION_STORAGE_KEY,
            JSON.stringify(reactions)
        );

    } catch (error) {

        console.error(
            "Could not save reactions:",
            error
        );

    }

}


// =========================================
// DEFAULT REACTION COUNTS
// =========================================

function createDefaultReactionCounts() {

    return {

        "👍": 0,

        "❤️": 0,

        "😂": 0,

        "😮": 0,

        "😢": 0,

        "😡": 0

    };

}


// =========================================
// REACTION ORDER
// =========================================

const REACTION_TYPES = [

    "👍",

    "❤️",

    "😂",

    "😮",

    "😢",

    "😡"

];


// =========================================
// REACTION LABELS
// =========================================

const REACTION_LABELS = {

    "👍": "Like",

    "❤️": "Love",

    "😂": "Haha",

    "😮": "Wow",

    "😢": "Sad",

    "😡": "Angry"

};


// =========================================
// REACTION KEY → EMOJI
// =========================================

const REACTION_MAP = {

    like: "👍",

    love: "❤️",

    haha: "😂",

    wow: "😮",

    sad: "😢",

    angry: "😡"

};


// =========================================
// UPDATE REACTION DISPLAY
// =========================================

function updateReactionDisplay(
    post,
    reactionData
) {

    if (!post) {

        return;

    }


    const reactionCount =
        post.querySelector(
            ".homeReactionCount"
        );


    const reactionButton =
        post.querySelector(
            ".homeReactionButton"
        );


    const counts =
        reactionData.counts ||
        createDefaultReactionCounts();


    // =====================================
    // UPDATE MAIN REACTION BUTTON
    // =====================================

    if (reactionButton) {

        const selectedReaction =
            reactionData.selectedReaction;


        const icon =
            selectedReaction ||
            "👍";


        const label =
            selectedReaction
                ? (
                    REACTION_LABELS[
                        selectedReaction
                    ] ||
                    "Like"
                )
                : "Like";


        const iconElement =
            reactionButton.querySelector(
                ".homeReactionIcon"
            );


        const textElement =
            reactionButton.querySelector(
                ".homeReactionText"
            );


        // =================================
        // UPDATE ICON
        // =================================

        if (iconElement) {

            iconElement.textContent =
                icon;

        }


        // =================================
        // UPDATE TEXT
        // =================================

        if (textElement) {

            textElement.textContent =
                label;

        }


        // =================================
        // FALLBACK
        // =================================

        if (
            !iconElement &&
            !textElement
        ) {

            reactionButton.textContent =
                icon +
                " " +
                label;

        }

    }


    // =====================================
    // UPDATE REACTION COUNT
    // =====================================

    if (!reactionCount) {

        return;

    }


    const activeReactions =
        REACTION_TYPES.filter(
            function(reaction) {

                return (
                    typeof counts[reaction] ===
                        "number" &&
                    counts[reaction] > 0
                );

            }
        );


    // =====================================
    // CALCULATE TOTAL
    // =====================================

    let totalReactions =
        0;


    REACTION_TYPES.forEach(
        function(reaction) {

            if (
                typeof counts[reaction] ===
                "number"
            ) {

                totalReactions +=
                    counts[reaction];

            }

        }
    );


    // =====================================
    // DISPLAY SUMMARY
    // =====================================

    if (
        totalReactions === 0
    ) {

        reactionCount.textContent =
            "";

        reactionCount.style.display =
            "none";

    } else {

        reactionCount.textContent =
            activeReactions.join(" ") +
            " " +
            totalReactions;

        reactionCount.style.display =
            "inline-block";

    }

}


// =========================================
// GET POST REACTION DATA
// =========================================

function getPostReactionData(
    post,
    savedReactions
) {

    if (!post) {

        return {

            counts:
                createDefaultReactionCounts(),

            selectedReaction:
                null

        };

    }


    const postId =
        post.dataset.postId;


    if (!postId) {

        return {

            counts:
                createDefaultReactionCounts(),

            selectedReaction:
                null

        };

    }


    if (
        !savedReactions[postId]
    ) {

        savedReactions[postId] = {

            counts:
                createDefaultReactionCounts(),

            selectedReaction:
                null

        };

    }


    if (
        !savedReactions[postId].counts
    ) {

        savedReactions[postId].counts =
            createDefaultReactionCounts();

    }


    // =====================================
    // MAKE SURE ALL SIX REACTIONS EXIST
    // =====================================

    REACTION_TYPES.forEach(
        function(reaction) {

            if (
                typeof savedReactions[postId]
                    .counts[reaction] !==
                "number"
            ) {

                savedReactions[postId]
                    .counts[reaction] =
                    0;

            }

        }
    );


    if (
        typeof savedReactions[postId]
            .selectedReaction ===
        "undefined"
    ) {

        savedReactions[postId]
            .selectedReaction =
            null;

    }


    return savedReactions[postId];

}


// =========================================
// LOAD REACTIONS ON PAGE LOAD
// =========================================

function loadSavedReactions() {

    const postsContainer =
        document.getElementById("postList");


    if (!postsContainer) {

        console.warn(
            "Reaction system: #postList was not found yet."
        );

        return;

    }


    const savedReactions =
        getSavedReactions();


    const posts =
        postsContainer.querySelectorAll(
            ".homePost"
        );


    posts.forEach(
        function(post) {

            const reactionData =
                getPostReactionData(
                    post,
                    savedReactions
                );


            updateReactionDisplay(
                post,
                reactionData
            );

        }
    );


    saveReactions(
        savedReactions
    );

}


// =========================================
// REACTION EVENT SYSTEM
// =========================================

function setupReactionEvents() {

    const postsContainer =
        document.getElementById("postList");


    if (!postsContainer) {

        console.warn(
            "Reaction system: #postList was not found for event setup."
        );

        return;

    }


    // =====================================
    // OPEN / CLOSE REACTION PICKER
    // =====================================

    postsContainer.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".homeReactionButton"
                );


            if (!button) {

                return;

            }


            const post =
                button.closest(
                    ".homePost"
                );


            if (!post) {

                return;

            }


            const picker =
                post.querySelector(
                    ".homeReactionPicker"
                );


            if (!picker) {

                console.warn(
                    "Reaction picker not found for this post."
                );

                return;

            }


            const computedStyle =
                window.getComputedStyle(
                    picker
                );


            const isHidden =
                computedStyle.display ===
                "none";


            if (isHidden) {

                picker.style.display =
                    "flex";

            } else {

                picker.style.display =
                    "none";

            }

        }
    );


    // =====================================
    // SELECT REACTION
    // =====================================

    postsContainer.addEventListener(
        "click",
        function(event) {

            const reaction =
                event.target.closest(
                    ".homeReactionPicker button[data-reaction]"
                );


            if (!reaction) {

                return;

            }


            const post =
                reaction.closest(
                    ".homePost"
                );


            if (!post) {

                return;

            }


            const postId =
                post.dataset.postId;


            if (!postId) {

                return;

            }


            const reactionKey =
                reaction.dataset.reaction;


            if (!reactionKey) {

                return;

            }


            const reactionEmoji =
                REACTION_MAP[
                    reactionKey
                ];


            if (!reactionEmoji) {

                return;

            }


            const savedReactions =
                getSavedReactions();


            const reactionData =
                getPostReactionData(
                    post,
                    savedReactions
                );


            // =================================
            // SAME REACTION = REMOVE
            // =================================

            if (
                reactionData.selectedReaction ===
                reactionEmoji
            ) {

                if (
                    reactionData.counts[
                        reactionEmoji
                    ] > 0
                ) {

                    reactionData.counts[
                        reactionEmoji
                    ]--;

                }


                reactionData.selectedReaction =
                    null;

            }


            // =================================
            // DIFFERENT REACTION = CHANGE
            // =================================

            else {

                // =============================
                // REMOVE PREVIOUS REACTION
                // =============================

                if (
                    reactionData.selectedReaction
                ) {

                    const previousReaction =
                        reactionData.selectedReaction;


                    if (
                        typeof reactionData.counts[
                            previousReaction
                        ] === "number" &&
                        reactionData.counts[
                            previousReaction
                        ] > 0
                    ) {

                        reactionData.counts[
                            previousReaction
                        ]--;

                    }

                }


                // =============================
                // ADD NEW REACTION
                // =============================

                if (
                    typeof reactionData.counts[
                        reactionEmoji
                    ] !== "number"
                ) {

                    reactionData.counts[
                        reactionEmoji
                    ] = 0;

                }


                reactionData.counts[
                    reactionEmoji
                ]++;


                reactionData.selectedReaction =
                    reactionEmoji;

            }


            // =================================
            // SAVE
            // =================================

            savedReactions[postId] =
                reactionData;


            saveReactions(
                savedReactions
            );


            // =================================
            // UPDATE MAIN BUTTON
            // =================================

            updateReactionDisplay(
                post,
                reactionData
            );


            // =================================
            // CLOSE PICKER
            // =================================

            const picker =
                post.querySelector(
                    ".homeReactionPicker"
                );


            if (picker) {

                picker.style.display =
                    "none";

            }

        }
    );

}


// =========================================
// INITIALIZE
// =========================================

function initializeReactionSystem() {

    loadSavedReactions();

    setupReactionEvents();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeReactionSystem
    );

} else {

    initializeReactionSystem();

}