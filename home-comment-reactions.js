// =========================================
// HOME COMMENT REACTIONS
// =========================================

const COMMENT_REACTION_STORAGE_KEY =
    "roleverseHomeCommentReactions";


const COMMENT_REACTIONS = [
    "❤️",
    "😂",
    "😮",
    "😢",
    "😡"
];


// =========================================
// LOAD CURRENT PROFILE
// =========================================

let reactionProfileName =
    "Display Name";


const savedProfile =
    localStorage.getItem(
        "roleverseProfile"
    );


if (savedProfile) {

    try {

        const profile =
            JSON.parse(savedProfile);


        if (
            profile.displayName &&
            profile.displayName.trim() !== ""
        ) {

            reactionProfileName =
                profile.displayName;

        }

    } catch (error) {

        console.error(
            "Could not load reaction profile:",
            error
        );

    }

}


// =========================================
// REACTION STORAGE
// =========================================

function getCommentReactions() {

    const saved =
        localStorage.getItem(
            COMMENT_REACTION_STORAGE_KEY
        );


    if (!saved) {

        return {};

    }


    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not load comment reactions:",
            error
        );

        return {};

    }

}


function saveCommentReactions(
    reactions
) {

    try {

        localStorage.setItem(
            COMMENT_REACTION_STORAGE_KEY,
            JSON.stringify(reactions)
        );

    } catch (error) {

        console.error(
            "Could not save comment reactions:",
            error
        );

    }

}


// =========================================
// CREATE DEFAULT REACTION DATA
// =========================================

function createReactionData() {

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
// GET REACTION DATA
// =========================================

function getReactionData(
    postId,
    commentId
) {

    const allReactions =
        getCommentReactions();


    if (
        !allReactions[postId]
    ) {

        allReactions[postId] =
            {};

    }


    if (
        !allReactions[postId][commentId]
    ) {

        allReactions[postId][commentId] =
            createReactionData();

    }


    const data =
        allReactions[postId][commentId];


    if (
        !data.counts ||
        typeof data.counts !== "object"
    ) {

        data.counts = {

            "❤️": 0,

            "😂": 0,

            "😮": 0,

            "😢": 0,

            "😡": 0

        };

    }


    COMMENT_REACTIONS.forEach(
        function(reaction) {

            if (
                typeof data.counts[reaction] !==
                "number"
            ) {

                data.counts[reaction] =
                    0;

            }

        }
    );


    if (
        !data.users ||
        typeof data.users !== "object"
    ) {

        data.users = {};

    }


    return data;

}


// =========================================
// CREATE REACTION UI
// =========================================

function addReactionUI(
    comment
) {

    if (!comment) {

        return;

    }


    if (
        comment.querySelector(
            ".homeCommentReactionArea"
        )
    ) {

        return;

    }


    const reactionArea =
        document.createElement(
            "div"
        );


    reactionArea.className =
        "homeCommentReactionArea";


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
        "homeCommentReactionButton";


    reactButton.textContent =
        "React";


    // =====================================
    // REACTION SUMMARY
    // =====================================

    const summary =
        document.createElement(
            "span"
        );


    summary.className =
        "homeCommentReactionSummary";


    summary.style.display =
        "none";


    // =====================================
    // REACTION PICKER
    // =====================================

    const picker =
        document.createElement(
            "div"
        );


    picker.className =
        "homeCommentReactionPicker";


    picker.style.display =
        "none";


    COMMENT_REACTIONS.forEach(
        function(reaction) {

            const reactionButton =
                document.createElement(
                    "button"
                );


            reactionButton.type =
                "button";


            reactionButton.className =
                "homeCommentReaction";


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
    // ASSEMBLE REACTION AREA
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
    // FIND COMMENT TEXT
    // =====================================

    const commentText =
        comment.querySelector(
            ".homeCommentText"
        );


    // =====================================
    // FIND EDIT / DELETE
    // =====================================

    const actions =
        comment.querySelector(
            ".homeCommentActions"
        );


    // =====================================
    // CREATE ONE SHARED ACTION ROW
    // =====================================

    const actionRow =
        document.createElement(
            "div"
        );


    actionRow.className =
        "homeCommentCombinedActions";


    // =====================================
    // PLACE REACTION AREA IN ROW
    // =====================================

    actionRow.appendChild(
        reactionArea
    );


    // =====================================
    // MOVE EDIT / DELETE INTO SAME ROW
    // =====================================

    if (actions) {

        actionRow.appendChild(
            actions
        );

    }


    // =====================================
    // PLACE WHOLE ROW AFTER COMMENT TEXT
    // =====================================

    if (commentText) {

        commentText.insertAdjacentElement(
            "afterend",
            actionRow
        );

    } else {

        comment.appendChild(
            actionRow
        );

    }


    // =====================================
    // FORCE SAME ROW
    // =====================================

    actionRow.style.display =
        "flex";

    actionRow.style.alignItems =
        "center";

    actionRow.style.gap =
        "4px";

    actionRow.style.marginTop =
        "7px";


    reactionArea.style.margin =
        "0";


    reactionArea.style.minHeight =
        "28px";


    if (actions) {

        actions.style.margin =
            "0";

        actions.style.display =
            "flex";

        actions.style.alignItems =
            "center";

        actions.style.gap =
            "10px";

    }


    // =====================================
    // UPDATE DISPLAY
    // =====================================

    updateReactionUI(
        comment
    );

}


// =========================================
// UPDATE REACTION UI
// =========================================

function updateReactionUI(
    comment
) {

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


    if (
        !postId ||
        !commentId
    ) {

        return;

    }


    const data =
        getReactionData(
            postId,
            commentId
        );


    const button =
        comment.querySelector(
            ".homeCommentReactionButton"
        );


    const summary =
        comment.querySelector(
            ".homeCommentReactionSummary"
        );


    if (
        !button ||
        !summary
    ) {

        return;

    }


    // =====================================
    // REACTION SUMMARY
    // =====================================

    const activeReactions =
        COMMENT_REACTIONS.filter(
            function(reaction) {

                return (
                    data.counts[reaction] >
                    0
                );

            }
        );


    if (
        activeReactions.length ===
        0
    ) {

        summary.textContent =
            "";

        summary.style.display =
            "none";

    } else {

        let totalCount =
            0;


        activeReactions.forEach(
            function(reaction) {

                totalCount +=
                    data.counts[reaction];

            }
        );


        summary.textContent =
            activeReactions.join(" ") +
            " " +
            totalCount;


        summary.style.display =
            "inline-flex";

    }


    // =====================================
    // CURRENT USER REACTION
    // =====================================

    const currentReaction =
        data.users[
            reactionProfileName
        ];


    if (currentReaction) {

        button.textContent =
            currentReaction +
            " Reacted";


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


    // =====================================
    // SELECTED REACTION
    // =====================================

    const pickerButtons =
        comment.querySelectorAll(
            ".homeCommentReaction"
        );


    pickerButtons.forEach(
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
// REACT BUTTON CLICK
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const reactButton =
            event.target.closest(
                ".homeCommentReactionButton"
            );


        if (!reactButton) {

            return;

        }


        const comment =
            reactButton.closest(
                ".homeComment"
            );


        if (!comment) {

            return;

        }


        const picker =
            comment.querySelector(
                ".homeCommentReactionPicker"
            );


        if (!picker) {

            return;

        }


        document
            .querySelectorAll(
                ".homeCommentReactionPicker"
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


        const isHidden =
            window.getComputedStyle(
                picker
            ).display ===
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


// =========================================
// SELECT REACTION
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const reactionButton =
            event.target.closest(
                ".homeCommentReaction"
            );


        if (!reactionButton) {

            return;

        }


        const comment =
            reactionButton.closest(
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


        const selectedReaction =
            reactionButton.dataset.reaction;


        if (
            !postId ||
            !commentId ||
            !selectedReaction
        ) {

            return;

        }


        const allReactions =
            getCommentReactions();


        if (
            !allReactions[postId]
        ) {

            allReactions[postId] =
                {};

        }


        if (
            !allReactions[postId][commentId]
        ) {

            allReactions[postId][commentId] =
                createReactionData();

        }


        const data =
            allReactions[postId][commentId];


        const previousReaction =
            data.users[
                reactionProfileName
            ];


        // =====================================
        // REMOVE SAME REACTION
        // =====================================

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
                reactionProfileName
            ];

        }

        // =====================================
        // CHANGE / ADD REACTION
        // =====================================

        else {

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
                reactionProfileName
            ] =
                selectedReaction;

        }


        saveCommentReactions(
            allReactions
        );


        updateReactionUI(
            comment
        );


        const picker =
            comment.querySelector(
                ".homeCommentReactionPicker"
            );


        if (picker) {

            picker.style.display =
                "none";

        }

    }
);


// =========================================
// CLOSE PICKER OUTSIDE
// =========================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                ".homeCommentReactionArea"
            )
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".homeCommentReactionPicker"
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
// INITIALIZE COMMENTS
// =========================================

function initializeCommentReactions() {

    document
        .querySelectorAll(
            ".homeComment"
        )
        .forEach(
            function(comment) {

                addReactionUI(
                    comment
                );

            }
        );

}


// =========================================
// WATCH FOR NEW COMMENTS
// =========================================

const commentReactionObserver =
    new MutationObserver(
        function(mutations) {

            mutations.forEach(
                function(mutation) {

                    mutation.addedNodes.forEach(
                        function(node) {

                            if (
                                node.nodeType !==
                                Node.ELEMENT_NODE
                            ) {

                                return;

                            }


                            if (
                                node.classList &&
                                node.classList.contains(
                                    "homeComment"
                                )
                            ) {

                                addReactionUI(
                                    node
                                );

                            }


                            if (
                                node.querySelectorAll
                            ) {

                                const newComments =
                                    node.querySelectorAll(
                                        ".homeComment"
                                    );


                                newComments.forEach(
                                    function(comment) {

                                        addReactionUI(
                                            comment
                                        );

                                    }
                                );

                            }

                        }
                    );

                }
            );

        }
    );


commentReactionObserver.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);


// =========================================
// INITIALIZE
// =========================================

initializeCommentReactions();