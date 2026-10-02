// =========================================
// PROFILE REACTION PERSISTENCE
// =========================================


// =========================================
// REACTION DATA
// =========================================

function createReactionData() {

    return {

        heart: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0,
        selected: null

    };

}


// =========================================
// REACTION EMOJIS
// =========================================

const profileReactionEmojis = {

    heart: "❤️",
    laugh: "😂",
    wow: "😮",
    sad: "😢",
    angry: "😡"

};


// =========================================
// REACTION ORDER
// =========================================

const profileReactionOrder = [

    "heart",
    "laugh",
    "wow",
    "sad",
    "angry"

];


// =========================================
// MAKE SURE REACTION DATA EXISTS
// =========================================

function ensureReactionData(item) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return;

    }


    if (
        !item.reactions ||
        typeof item.reactions !== "object" ||
        Array.isArray(item.reactions)
    ) {

        item.reactions =
            createReactionData();

        return;

    }


    // =====================================
    // SUPPORT OLD COUNTS FORMAT
    // =====================================

    if (
        item.reactions.counts &&
        typeof item.reactions.counts === "object"
    ) {

        profileReactionOrder.forEach(
            function(reactionName) {

                item.reactions[reactionName] =
                    Number(
                        item.reactions.counts[
                            reactionName
                        ]
                    ) || 0;

            }
        );

        delete item.reactions.counts;

    }


    profileReactionOrder.forEach(
        function(reactionName) {

            item.reactions[reactionName] =
                Number(
                    item.reactions[reactionName]
                ) || 0;

        }
    );


    if (
        typeof item.reactions.selected ===
        "undefined"
    ) {

        item.reactions.selected =
            null;

    }

}


// =========================================
// FIND POST
// =========================================

function findPostData(
    postElement
) {

    if (!postElement) {
        return null;
    }

    const postId =
        postElement.dataset.postId;


    return profilePosts.find(
        function(postData) {

            return (
                String(postData.id) ===
                String(postId)
            );

        }
    ) || null;

}


// =========================================
// FIND COMMENT
// =========================================

function findCommentData(
    postData,
    commentElement
) {

    if (
        !postData ||
        !commentElement
    ) {

        return null;

    }


    const commentId =
        commentElement.dataset.commentId;


    if (
        !Array.isArray(
            postData.comments
        )
    ) {

        return null;

    }


    return postData.comments.find(
        function(commentData) {

            return (
                String(commentData.id) ===
                String(commentId)
            );

        }
    ) || null;

}


// =========================================
// FIND REPLY
// =========================================

function findReplyData(
    commentData,
    replyElement
) {

    if (
        !commentData ||
        !replyElement
    ) {

        return null;

    }


    const replyId =
        replyElement.dataset.replyId;


    if (
        !Array.isArray(
            commentData.replies
        )
    ) {

        return null;

    }


    return commentData.replies.find(
        function(replyData) {

            return (
                String(replyData.id) ===
                String(replyId)
            );

        }
    ) || null;

}


// =========================================
// SAVE ALL POSTS
// =========================================

function saveReactionPosts() {

    try {

        localStorage.setItem(
            "roleverseProfilePosts",
            JSON.stringify(
                profilePosts
            )
        );

    } catch (error) {

        console.error(
            "Could not save reaction state:",
            error
        );

    }

}


// =========================================
// GET CURRENT REACTION STATE
// =========================================

function getTargetReactionState(
    target
) {

    if (!target) {

        return createReactionData();

    }


    if (
        target.reactionCounts
    ) {

        return {

            heart:
                Number(
                    target.reactionCounts.heart
                ) || 0,

            laugh:
                Number(
                    target.reactionCounts.laugh
                ) || 0,

            wow:
                Number(
                    target.reactionCounts.wow
                ) || 0,

            sad:
                Number(
                    target.reactionCounts.sad
                ) || 0,

            angry:
                Number(
                    target.reactionCounts.angry
                ) || 0,

            selected:
                target.selectedReaction ||
                null

        };

    }


    return createReactionData();

}


// =========================================
// SAVE REACTION STATE
// =========================================

function saveReactionState(
    target
) {

    if (!target) {

        return;

    }


    const postElement =
        target.closest(
            ".profilePost"
        );


    if (!postElement) {

        return;

    }


    const postData =
        findPostData(
            postElement
        );


    if (!postData) {

        return;

    }


    const state =
        getTargetReactionState(
            target
        );


    const replyElement =
        target.closest(
            ".profileReply"
        );


    if (replyElement) {

        const commentElement =
            replyElement.closest(
                ".profileComment"
            );


        if (!commentElement) {

            return;

        }


        const commentData =
            findCommentData(
                postData,
                commentElement
            );


        if (!commentData) {

            return;

        }


        const replyData =
            findReplyData(
                commentData,
                replyElement
            );


        if (!replyData) {

            return;

        }


        ensureReactionData(
            replyData
        );


        replyData.reactions =
            state;


        saveReactionPosts();

        return;

    }


    const commentElement =
        target.closest(
            ".profileComment"
        );


    if (commentElement) {

        const commentData =
            findCommentData(
                postData,
                commentElement
            );


        if (!commentData) {

            return;

        }


        ensureReactionData(
            commentData
        );


        commentData.reactions =
            state;


        saveReactionPosts();

        return;

    }


    ensureReactionData(
        postData
    );


    postData.reactions =
        state;


    saveReactionPosts();

}


// =========================================
// UPDATE REACTION COUNT
// =========================================

function updateReactionCount(
    target
) {

    if (!target) {

        return;

    }


    const reactionCount =
        target.querySelector(
            ".profileReactionCount, .profileCommentReactionCount"
        );


    if (!reactionCount) {

        return;

    }


    const counts =
        target.reactionCounts ||
        createReactionData();


    const hasReaction =
        profileReactionOrder.some(
            function(reactionName) {

                return (
                    Number(
                        counts[reactionName]
                    ) > 0
                );

            }
        );


    if (!hasReaction) {

        reactionCount.innerHTML = "";

        reactionCount.style.display =
            "none";

        return;

    }


    reactionCount.innerHTML =

        profileReactionEmojis.heart +
        " " +
        (Number(counts.heart) || 0) +

        "&nbsp;&nbsp;&nbsp;" +

        profileReactionEmojis.laugh +
        " " +
        (Number(counts.laugh) || 0) +

        "&nbsp;&nbsp;&nbsp;" +

        profileReactionEmojis.wow +
        " " +
        (Number(counts.wow) || 0) +

        "&nbsp;&nbsp;&nbsp;" +

        profileReactionEmojis.sad +
        " " +
        (Number(counts.sad) || 0) +

        "&nbsp;&nbsp;&nbsp;" +

        profileReactionEmojis.angry +
        " " +
        (Number(counts.angry) || 0);


    reactionCount.style.display =
        "block";

}


// =========================================
// UPDATE REACTION BUTTON
// =========================================

function updateReactionButton(
    target
) {

    if (!target) {

        return;

    }


    const button =
        target.querySelector(
            ".profileReactionButton, .profileCommentReactionButton"
        );


    if (!button) {

        return;

    }


    if (
        target.selectedReaction
    ) {

        button.textContent =
            profileReactionEmojis[
                target.selectedReaction
            ] || "React";

    } else {

        button.textContent =
            "React";

    }

}


// =========================================
// RESTORE ONE REACTION
// =========================================

function restoreReactionState(
    target,
    savedReactionData
) {

    if (
        !target ||
        !savedReactionData
    ) {

        return;

    }


    // Convert old saved format if needed.
    if (
        savedReactionData.counts &&
        typeof savedReactionData.counts === "object"
    ) {

        savedReactionData = {

            heart:
                Number(
                    savedReactionData.counts.heart
                ) || 0,

            laugh:
                Number(
                    savedReactionData.counts.laugh
                ) || 0,

            wow:
                Number(
                    savedReactionData.counts.wow
                ) || 0,

            sad:
                Number(
                    savedReactionData.counts.sad
                ) || 0,

            angry:
                Number(
                    savedReactionData.counts.angry
                ) || 0,

            selected:
                savedReactionData.selected ||
                null

        };

    }


    target.reactionCounts = {

        heart:
            Number(
                savedReactionData.heart
            ) || 0,

        laugh:
            Number(
                savedReactionData.laugh
            ) || 0,

        wow:
            Number(
                savedReactionData.wow
            ) || 0,

        sad:
            Number(
                savedReactionData.sad
            ) || 0,

        angry:
            Number(
                savedReactionData.angry
            ) || 0

    };


    target.selectedReaction =
        savedReactionData.selected ||
        null;


    updateReactionButton(
        target
    );


    updateReactionCount(
        target
    );

}


// =========================================
// RESTORE ALL REACTIONS
// =========================================

function restoreAllReactions() {

    if (
        !Array.isArray(
            profilePosts
        ) ||
        !profilePostList
    ) {

        return;

    }


    profilePosts.forEach(
        function(postData) {

            ensureReactionData(
                postData
            );


            const postElement =
                profilePostList.querySelector(
                    '.profilePost[data-post-id="' +
                    CSS.escape(String(postData.id)) +
                    '"]'
                );


            if (!postElement) {

                return;

            }


            restoreReactionState(
                postElement,
                postData.reactions
            );


            if (
                !Array.isArray(
                    postData.comments
                )
            ) {

                return;

            }


            postData.comments.forEach(
                function(commentData) {

                    ensureReactionData(
                        commentData
                    );


                    const commentElement =
                        postElement.querySelector(
                            '.profileComment[data-comment-id="' +
                            CSS.escape(String(commentData.id)) +
                            '"]'
                        );


                    if (!commentElement) {

                        return;

                    }


                    restoreReactionState(
                        commentElement,
                        commentData.reactions
                    );


                    if (
                        !Array.isArray(
                            commentData.replies
                        )
                    ) {

                        return;

                    }


                    commentData.replies.forEach(
                        function(replyData) {

                            ensureReactionData(
                                replyData
                            );


                            const replyElement =
                                commentElement.querySelector(
                                    '.profileReply[data-reply-id="' +
                                    CSS.escape(String(replyData.id)) +
                                    '"]'
                                );


                            if (!replyElement) {

                                return;

                            }


                            restoreReactionState(
                                replyElement,
                                replyData.reactions
                            );

                        }
                    );

                }
            );

        }
    );

}


// =========================================
// COMMENT / REPLY REACTION PERSISTENCE
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const reactionChoice =
            event.target.closest(
                ".profileCommentReactionButton"
            );


        if (!reactionChoice) {

            return;

        }


        setTimeout(
            function() {

                const target =
                    reactionChoice.closest(
                        ".profileReply, .profileComment"
                    );


                if (!target) {

                    return;

                }


                saveReactionState(
                    target
                );

            },
            10
        );

    }
);


// =========================================
// INITIAL RESTORE
// =========================================

function startReactionRestore() {

    setTimeout(
        function() {

            restoreAllReactions();

        },
        100
    );

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startReactionRestore
    );

} else {

    startReactionRestore();

}
