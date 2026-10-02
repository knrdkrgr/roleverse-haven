// =========================================
// COMMENT & REPLY REACTIONS
// =========================================


// =========================================
// REACTION EMOJIS
// =========================================

const commentReactionEmojis = {

    heart: "\u2764\uFE0F",
    laugh: "\uD83D\uDE02",
    wow: "\uD83D\uDE2E",
    sad: "\uD83D\uDE22",
    angry: "\uD83D\uDE21"

};


// =========================================
// CREATE REACTION PICKER
// =========================================

function createCommentReactionPicker() {

    const picker =
        document.createElement("div");


    picker.className =
        "profileCommentReactionPicker";


    Object.keys(commentReactionEmojis).forEach(
        function(reactionName) {

            const reactionButton =
                document.createElement("button");


            reactionButton.type =
                "button";


            reactionButton.className =
                "profileCommentReaction";


            reactionButton.dataset.reaction =
                reactionName;


            reactionButton.textContent =
                commentReactionEmojis[reactionName];


            picker.appendChild(
                reactionButton
            );

        }
    );


    picker.style.display =
        "none";


    return picker;

}


// =========================================
// GET / CREATE REACTION DATA
// =========================================

function ensureCommentReactionData(target) {

    if (!target.reactionCounts) {

        target.reactionCounts = {

            heart: 0,
            laugh: 0,
            wow: 0,
            sad: 0,
            angry: 0

        };

    }


    if (
        typeof target.selectedReaction ===
        "undefined"
    ) {

        target.selectedReaction =
            null;

    }

}


// =========================================
// UPDATE REACTION COUNT DISPLAY
// =========================================

function updateCommentReactionCount(target) {

    const reactionCount =
        target.querySelector(
            ".profileCommentReactionCount"
        );


    if (!reactionCount) {

        return;

    }


    reactionCount.innerHTML =

        commentReactionEmojis.heart +
        " " +
        target.reactionCounts.heart +

        "&nbsp;&nbsp;&nbsp;" +

        commentReactionEmojis.laugh +
        " " +
        target.reactionCounts.laugh +

        "&nbsp;&nbsp;&nbsp;" +

        commentReactionEmojis.wow +
        " " +
        target.reactionCounts.wow +

        "&nbsp;&nbsp;&nbsp;" +

        commentReactionEmojis.sad +
        " " +
        target.reactionCounts.sad +

        "&nbsp;&nbsp;&nbsp;" +

        commentReactionEmojis.angry +
        " " +
        target.reactionCounts.angry;

}


// =========================================
// UPDATE MAIN REACTION BUTTON
// =========================================

function updateCommentReactionButton(target) {

    const button =
        target.querySelector(
            ".profileCommentReactionButton"
        );


    if (!button) {

        return;

    }


    // No reaction = React
    if (
        !target.selectedReaction
    ) {

        button.textContent =
            "React";

        return;

    }


    // Selected reaction = emoji only
    button.textContent =
        commentReactionEmojis[
            target.selectedReaction
        ] || "React";

}


// =========================================
// SAVE REACTION STATE
// =========================================

function saveCommentReactionState(target) {

    /*
     * profile-reaction-persistence.js
     * provides saveReactionState().
     *
     * Use it when available so comment/reply
     * reactions remain synchronized with the
     * saved Profile post data.
     */

    if (
        typeof saveReactionState ===
        "function"
    ) {

        saveReactionState(target);

    }

}


// =========================================
// HANDLE COMMENT & REPLY REACTIONS
// =========================================

document.addEventListener(
    "click",
    function(event) {


        // =====================================
        // REACTION BUTTON
        // =====================================

        const reactionButton =
            event.target.closest(
                ".profileCommentReactionButton"
            );


        if (reactionButton) {

            const target =
                reactionButton.closest(
                    ".profileReply, .profileComment"
                );


            if (!target) {

                return;

            }


            ensureCommentReactionData(
                target
            );


            let picker =
                reactionButton.parentElement.querySelector(
                    ".profileCommentReactionPicker"
                );


            if (!picker) {

                picker =
                    createCommentReactionPicker();


                reactionButton.parentElement.appendChild(
                    picker
                );

            }


            if (
                picker.style.display ===
                "none"
            ) {

                picker.style.display =
                    "flex";

            } else {

                picker.style.display =
                    "none";

            }


            return;

        }


        // =====================================
        // REACTION CHOICE
        // =====================================

        const reaction =
            event.target.closest(
                ".profileCommentReaction"
            );


        if (!reaction) {

            return;

        }


        const target =
            reaction.closest(
                ".profileReply, .profileComment"
            );


        if (!target) {

            return;

        }


        const newReaction =
            reaction.dataset.reaction;


        if (!newReaction) {

            return;

        }


        ensureCommentReactionData(
            target
        );


        // =====================================
        // SAME REACTION = UNDO
        // =====================================

        if (
            target.selectedReaction ===
            newReaction
        ) {

            target.reactionCounts[
                newReaction
            ]--;


            if (
                target.reactionCounts[
                    newReaction
                ] < 0
            ) {

                target.reactionCounts[
                    newReaction
                ] = 0;

            }


            // Completely remove user's reaction
            target.selectedReaction =
                null;

        }


        // =====================================
        // DIFFERENT REACTION = CHANGE
        // =====================================

        else {

            /*
             * If the user already reacted,
             * remove the old reaction first.
             */

            if (
                target.selectedReaction !==
                null
            ) {

                const oldReaction =
                    target.selectedReaction;


                target.reactionCounts[
                    oldReaction
                ]--;


                if (
                    target.reactionCounts[
                        oldReaction
                    ] < 0
                ) {

                    target.reactionCounts[
                        oldReaction
                    ] = 0;

                }

            }


            /*
             * Add the new reaction.
             */

            target.reactionCounts[
                newReaction
            ]++;


            target.selectedReaction =
                newReaction;

        }


        // =====================================
        // UPDATE UI
        // =====================================

        updateCommentReactionButton(
            target
        );


        updateCommentReactionCount(
            target
        );


        // =====================================
        // SAVE
        // =====================================

        saveCommentReactionState(
            target
        );


        // =====================================
        // CLOSE PICKER
        // =====================================

        const picker =
            reaction.closest(
                ".profileCommentReactionPicker"
            );


        if (picker) {

            picker.style.display =
                "none";

        }

    }
);