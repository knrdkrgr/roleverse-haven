// =========================================
// HOME REPLY REACTIONS
// =========================================

const HOME_REPLY_REACTIONS_STORAGE_KEY =
    "roleverseHomeReplyReactions";


const HOME_REPLY_REACTION_TYPES = [
    "❤️",
    "😂",
    "😮",
    "😢",
    "😡"
];


// =========================================
// PROFILE
// =========================================

let homeReplyReactionProfile =
    "Display Name";


const savedHomeReplyProfile =
    localStorage.getItem(
        "roleverseProfile"
    );


if (savedHomeReplyProfile) {

    try {

        const profile =
            JSON.parse(
                savedHomeReplyProfile
            );


        homeReplyReactionProfile =
            profile.displayName ||
            "Display Name";

    } catch (error) {

        console.error(
            "Could not load reply reaction profile:",
            error
        );

    }

}


// =========================================
// STORAGE
// =========================================

function getHomeReplyReactionStorage() {

    const saved =
        localStorage.getItem(
            HOME_REPLY_REACTIONS_STORAGE_KEY
        );


    if (!saved) {

        return {};

    }


    try {

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "Could not load reply reactions:",
            error
        );

        return {};

    }

}


function saveHomeReplyReactionStorage(
    data
) {

    localStorage.setItem(
        HOME_REPLY_REACTIONS_STORAGE_KEY,
        JSON.stringify(data)
    );

}


// =========================================
// DEFAULT DATA
// =========================================

function createHomeReplyReactionData() {

    return {

        counts: {
            "❤️": 0,
            "😂": 0,
            "😮": 0,
            "😢": 0,
            "😡": 0
        },

        users: {}

    };

}


// =========================================
// GET REPLY DATA
// =========================================

function getHomeReplyReactionData(
    postId,
    commentId,
    replyId
) {

    const storage =
        getHomeReplyReactionStorage();


    if (!storage[postId]) {

        storage[postId] =
            {};

    }


    if (!storage[postId][commentId]) {

        storage[postId][commentId] =
            {};

    }


    if (
        !storage[
            postId
        ][
            commentId
        ][
            replyId
        ]
    ) {

        storage[
            postId
        ][
            commentId
        ][
            replyId
        ] =
            createHomeReplyReactionData();

    }


    return storage[
        postId
    ][
        commentId
    ][
        replyId
    ];

}


// =========================================
// CREATE REACTION UI
// =========================================

function initializeReplyReaction(
    reply
) {

    if (!reply) {

        return;

    }


    if (
        !reply.classList.contains(
            "homeCommentReply"
        )
    ) {

        return;

    }


    if (
        reply.querySelector(
            ".homeReplyReactionArea"
        )
    ) {

        return;

    }


    const reactionArea =
        document.createElement(
            "div"
        );


    reactionArea.className =
        "homeReplyReactionArea";


    // =====================================
    // REACT BUTTON
    // =====================================

    const reactButton =
        document.createElement(
            "button"
        );


    reactButton.type =
        "button";


    reactButton.className =
        "homeReplyReactionButton";


    reactButton.textContent =
        "React";


    // =====================================
    // SUMMARY
    // =====================================

    const summary =
        document.createElement(
            "span"
        );


    summary.className =
        "homeReplyReactionSummary";


    summary.style.display =
        "none";


    // =====================================
    // PICKER
    // =====================================

    const picker =
        document.createElement(
            "div"
        );


    picker.className =
        "homeReplyReactionPicker";


    picker.style.display =
        "none";


    HOME_REPLY_REACTION_TYPES.forEach(
        function(reaction) {

            const reactionButton =
                document.createElement(
                    "button"
                );


            reactionButton.type =
                "button";


            reactionButton.className =
                "homeReplyReaction";


            reactionButton.dataset.reaction =
                reaction;


            reactionButton.textContent =
                reaction;


            picker.appendChild(
                reactionButton
            );

        }
    );


    // =====================================
    // BUILD
    // =====================================

    reactionArea.appendChild(
        reactButton
    );


    reactionArea.appendChild(
        summary
    );


    reactionArea.appendChild(
        picker
    );


    // =====================================
    // PUT UNDER REPLY TEXT
    // =====================================

    const replyText =
        reply.querySelector(
            ".homeCommentReplyText"
        );


    if (replyText) {

        replyText.insertAdjacentElement(
            "afterend",
            reactionArea
        );

    } else {

        reply.appendChild(
            reactionArea
        );

    }


    updateReplyReactionDisplay(
        reply
    );

}


// =========================================
// UPDATE DISPLAY
// =========================================

function updateReplyReactionDisplay(
    reply
) {

    if (!reply) {

        return;

    }


    const comment =
        reply.closest(
            ".homeComment"
        );


    if (!comment) {

        return;

    }


    const post =
        comment.closest(
            ".homePost"
        );


    if (!post) {

        return;

    }


    const postId =
        post.dataset.postId;


    const commentId =
        comment.dataset.commentId;


    const replyId =
        reply.dataset.replyId;


    if (
        !postId ||
        !commentId ||
        !replyId
    ) {

        return;

    }


    const data =
        getHomeReplyReactionData(
            postId,
            commentId,
            replyId
        );


    const button =
        reply.querySelector(
            ".homeReplyReactionButton"
        );


    const summary =
        reply.querySelector(
            ".homeReplyReactionSummary"
        );


    if (!button || !summary) {

        return;

    }


    let total =
        0;


    const activeReactions =
        [];


    HOME_REPLY_REACTION_TYPES.forEach(
        function(reaction) {

            const count =
                data.counts[
                    reaction
                ] || 0;


            if (count > 0) {

                activeReactions.push(
                    reaction
                );


                total +=
                    count;

            }

        }
    );


    if (total === 0) {

        summary.textContent =
            "";

        summary.style.display =
            "none";

    } else {

        summary.textContent =
            activeReactions.join(" ") +
            " " +
            total;

        summary.style.display =
            "inline-flex";

    }


    const currentReaction =
        data.users[
            homeReplyReactionProfile
        ];


    if (currentReaction) {

        button.textContent =
            currentReaction;


        button.classList.add(
            "active"
        );

    } else {

        button.textContent =
            "React";


        button.classList.remove(
            "active"
        );

    }


    reply
        .querySelectorAll(
            ".homeReplyReaction"
        )
        .forEach(
            function(reactionButton) {

                if (
                    reactionButton.dataset.reaction ===
                    currentReaction
                ) {

                    reactionButton.classList.add(
                        "selected"
                    );

                } else {

                    reactionButton.classList.remove(
                        "selected"
                    );

                }

            }
        );

}


// =========================================
// CLICK REACT
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const reactButton =
            event.target.closest(
                ".homeReplyReactionButton"
            );


        if (!reactButton) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const reply =
            reactButton.closest(
                ".homeCommentReply"
            );


        if (!reply) {

            return;

        }


        const picker =
            reply.querySelector(
                ".homeReplyReactionPicker"
            );


        if (!picker) {

            return;

        }


        document
            .querySelectorAll(
                ".homeReplyReactionPicker"
            )
            .forEach(
                function(otherPicker) {

                    if (
                        otherPicker !==
                        picker
                    ) {

                        otherPicker.style.display =
                            "none";

                    }

                }
            );


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

    }
);


// =========================================
// CHOOSE REACTION
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const reactionButton =
            event.target.closest(
                ".homeReplyReaction"
            );


        if (!reactionButton) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const reply =
            reactionButton.closest(
                ".homeCommentReply"
            );


        if (!reply) {

            return;

        }


        const comment =
            reply.closest(
                ".homeComment"
            );


        const post =
            reply.closest(
                ".homePost"
            );


        if (!comment || !post) {

            return;

        }


        const postId =
            post.dataset.postId;


        const commentId =
            comment.dataset.commentId;


        const replyId =
            reply.dataset.replyId;


        const selectedReaction =
            reactionButton.dataset.reaction;


        if (
            !postId ||
            !commentId ||
            !replyId ||
            !selectedReaction
        ) {

            return;

        }


        const storage =
            getHomeReplyReactionStorage();


        if (!storage[postId]) {

            storage[postId] =
                {};

        }


        if (!storage[postId][commentId]) {

            storage[postId][commentId] =
                {};

        }


        if (
            !storage[
                postId
            ][
                commentId
            ][
                replyId
            ]
        ) {

            storage[
                postId
            ][
                commentId
            ][
                replyId
            ] =
                createHomeReplyReactionData();

        }


        const data =
            storage[
                postId
            ][
                commentId
            ][
                replyId
            ];


        const previousReaction =
            data.users[
                homeReplyReactionProfile
            ];


        if (
            previousReaction ===
            selectedReaction
        ) {

            if (
                data.counts[
                    selectedReaction
                ] > 0
            ) {

                data.counts[
                    selectedReaction
                ]--;

            }


            delete data.users[
                homeReplyReactionProfile
            ];

        } else {

            if (
                previousReaction &&
                data.counts[
                    previousReaction
                ] > 0
            ) {

                data.counts[
                    previousReaction
                ]--;

            }


            data.counts[
                selectedReaction
            ]++;


            data.users[
                homeReplyReactionProfile
            ] =
                selectedReaction;

        }


        saveHomeReplyReactionStorage(
            storage
        );


        updateReplyReactionDisplay(
            reply
        );


        const picker =
            reply.querySelector(
                ".homeReplyReactionPicker"
            );


        if (picker) {

            picker.style.display =
                "none";

        }

    }
);


// =========================================
// CLOSE PICKER
// =========================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                ".homeReplyReactionArea"
            )
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".homeReplyReactionPicker"
            )
            .forEach(
                function(picker) {

                    picker.style.display =
                        "none";

                }
            );

    }
);


// =========================================
// INITIALIZE EXISTING REPLIES
// =========================================

function initializeExistingReplyReactions() {

    document
        .querySelectorAll(
            ".homeCommentReply"
        )
        .forEach(
            function(reply) {

                initializeReplyReaction(
                    reply
                );

            }
        );

}


initializeExistingReplyReactions();