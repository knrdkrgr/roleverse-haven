// =========================================
// HOME COMMENT REPLIES
// =========================================

const HOME_COMMENT_REPLIES_STORAGE_KEY =
    "roleverseHomeCommentReplies";


// =========================================
// PROFILE
// =========================================

let replyProfile = {
    displayName: "Display Name",
    profilePicture: ""
};


function loadReplyProfile() {

    const savedReplyProfile =
        localStorage.getItem(
            "roleverseProfile"
        );


    if (!savedReplyProfile) {
        return;
    }


    try {

        const profile =
            JSON.parse(
                savedReplyProfile
            );


        replyProfile.displayName =
            profile.displayName ||
            "Display Name";


        replyProfile.profilePicture =
            profile.profilePicture ||
            "";

    } catch (error) {

        console.error(
            "Could not load reply profile:",
            error
        );

    }

}


loadReplyProfile();


// =========================================
// STORAGE
// =========================================

function getCommentReplies() {

    const saved =
        localStorage.getItem(
            HOME_COMMENT_REPLIES_STORAGE_KEY
        );


    if (!saved) {
        return {};
    }


    try {

        const parsed =
            JSON.parse(
                saved
            );


        if (
            typeof parsed !== "object" ||
            parsed === null
        ) {

            return {};

        }


        return parsed;

    } catch (error) {

        console.error(
            "Could not load comment replies:",
            error
        );


        return {};

    }

}


function saveCommentReplies(
    replies
) {

    try {

        localStorage.setItem(
            HOME_COMMENT_REPLIES_STORAGE_KEY,
            JSON.stringify(replies)
        );

    } catch (error) {

        console.error(
            "Could not save comment replies:",
            error
        );

    }

}


// =========================================
// TIME
// =========================================

function formatReplyTime(
    createdAt
) {

    if (!createdAt) {
        return "Just now";
    }


    const now =
        new Date();


    const created =
        new Date(
            createdAt
        );


    if (
        Number.isNaN(
            created.getTime()
        )
    ) {

        return "Just now";

    }


    const difference =
        Math.floor(
            (
                now.getTime() -
                created.getTime()
            ) / 1000
        );


    if (difference < 60) {
        return "Just now";
    }


    const minutes =
        Math.floor(
            difference / 60
        );


    if (minutes < 60) {

        return (
            minutes +
            (
                minutes === 1
                    ? " minute ago"
                    : " minutes ago"
            )
        );

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return (
            hours +
            (
                hours === 1
                    ? " hour ago"
                    : " hours ago"
            )
        );

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days === 1) {
        return "Yesterday";
    }


    if (days < 7) {

        return (
            days +
            " days ago"
        );

    }


    return created.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// =========================================
// GET REPLY TARGET
// =========================================

function getReplyTargetData(
    comment
) {

    if (!comment) {
        return null;
    }


    const post =
        comment.closest(
            ".homePost"
        );


    if (!post) {

        console.error(
            "Reply error: parent post not found."
        );

        return null;

    }


    const postId =
        post.dataset.postId;


    const commentId =
        comment.dataset.commentId;


    if (!postId) {

        console.error(
            "Reply error: post ID is missing."
        );

        return null;

    }


    if (!commentId) {

        console.error(
            "Reply error: comment ID is missing."
        );

        return null;

    }


    return {
        post: post,
        postId: postId,
        commentId: commentId
    };

}


// =========================================
// CREATE REPLY AREA
// ONLY ON .homeComment
// =========================================

function addReplyArea(
    comment
) {

    if (!comment) {
        return;
    }


    if (
        !comment.classList.contains(
            "homeComment"
        )
    ) {

        return;

    }


    if (
        comment.querySelector(
            ":scope > .homeCommentReplyArea"
        )
    ) {

        return;

    }


    const replyArea =
        document.createElement(
            "div"
        );


    replyArea.className =
        "homeCommentReplyArea";


    const replyButton =
        document.createElement(
            "button"
        );


    replyButton.type =
        "button";


    replyButton.className =
        "homeCommentReplyButton";


    replyButton.textContent =
        "Reply";


    const replyForm =
        document.createElement(
            "div"
        );


    replyForm.className =
        "homeCommentReplyForm";


    replyForm.style.display =
        "none";


    const replyInput =
        document.createElement(
            "textarea"
        );


    replyInput.className =
        "homeCommentReplyInput";


    replyInput.placeholder =
        "Write a reply...";


    replyInput.rows =
        2;


    const replyActions =
        document.createElement(
            "div"
        );


    replyActions.className =
        "homeCommentReplyFormActions";


    const cancelButton =
        document.createElement(
            "button"
        );


    cancelButton.type =
        "button";


    cancelButton.className =
        "homeCommentReplyCancel";


    cancelButton.textContent =
        "Cancel";


    const submitButton =
        document.createElement(
            "button"
        );


    submitButton.type =
        "button";


    submitButton.className =
        "homeCommentReplySubmit";


    submitButton.textContent =
        "Reply";


    replyActions.appendChild(
        cancelButton
    );


    replyActions.appendChild(
        submitButton
    );


    replyForm.appendChild(
        replyInput
    );


    replyForm.appendChild(
        replyActions
    );


    replyArea.appendChild(
        replyForm
    );


    // =====================================
    // PLACE REPLY BUTTON
    // =====================================

    const combinedActions =
        comment.querySelector(
            ".homeCommentCombinedActions"
        );


    if (combinedActions) {

        const commentOptions =
            combinedActions.querySelector(
                ".homeCommentOptions"
            );


        if (commentOptions) {

            combinedActions.insertBefore(
                replyButton,
                commentOptions
            );

        } else {

            combinedActions.appendChild(
                replyButton
            );

        }

    } else {

        const reactionArea =
            comment.querySelector(
                ".homeCommentReactionArea"
            );


        if (reactionArea) {

            reactionArea.insertAdjacentElement(
                "afterend",
                replyButton
            );

        } else {

            const commentText =
                comment.querySelector(
                    ".homeCommentText"
                );


            if (commentText) {

                commentText.insertAdjacentElement(
                    "afterend",
                    replyButton
                );

            } else {

                comment.appendChild(
                    replyButton
                );

            }

        }

    }


    // =====================================
    // PLACE REPLY FORM
    // =====================================

    if (combinedActions) {

        combinedActions.insertAdjacentElement(
            "afterend",
            replyArea
        );

    } else {

        replyButton.insertAdjacentElement(
            "afterend",
            replyArea
        );

    }


    // =====================================
    // OPEN REPLY FORM
    // =====================================

    replyButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();


            replyForm.style.display =
                "block";


            replyInput.focus();

        }
    );


    // =====================================
    // CANCEL
    // =====================================

    cancelButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();


            replyInput.value =
                "";


            replyForm.style.display =
                "none";

        }
    );


    // =====================================
    // SUBMIT BUTTON
    // =====================================

    submitButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();


            createReply(
                comment,
                replyInput
            );

        }
    );


    // =====================================
    // ENTER TO SUBMIT
    // SHIFT + ENTER = NEW LINE
    // =====================================

    replyInput.addEventListener(
        "keydown",
        function(event) {

            event.stopPropagation();


            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();


                createReply(
                    comment,
                    replyInput
                );

            }

        }
    );

}


// =========================================
// CREATE REPLY
// =========================================

function createReply(
    comment,
    input
) {

    if (!comment || !input) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) {

        input.focus();

        return;

    }


    // =====================================
    // GET TARGET
    // =====================================

    const target =
        getReplyTargetData(
            comment
        );


    if (!target) {
        return;
    }


    const postId =
        target.postId;


    const commentId =
        target.commentId;


    // =====================================
    // LOAD STORAGE
    // =====================================

    const allReplies =
        getCommentReplies();


    if (!allReplies[postId]) {

        allReplies[postId] =
            {};

    }


    if (
        !Array.isArray(
            allReplies[postId][commentId]
        )
    ) {

        allReplies[postId][commentId] =
            [];

    }


    // =====================================
    // CREATE REPLY
    // =====================================

    const replyData = {

        id:
            Date.now().toString() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8),

        displayName:
            replyProfile.displayName,

        profilePicture:
            replyProfile.profilePicture,

        text:
            text,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            null

    };


    // =====================================
    // SAVE REPLY
    // =====================================

    allReplies[postId][commentId].push(
        replyData
    );


    saveCommentReplies(
        allReplies
    );


    // =====================================
    // CLEAR FORM
    // =====================================

    input.value =
        "";


    const form =
        input.closest(
            ".homeCommentReplyForm"
        );


    if (form) {

        form.style.display =
            "none";

    }


    // =====================================
    // RENDER IMMEDIATELY
    // =====================================

    renderReplies(
        comment
    );

}


// =========================================
// CREATE REPLY ELEMENT
// =========================================

function createReplyElement(
    replyData
) {

    const reply =
        document.createElement(
            "div"
        );


    reply.className =
        "homeCommentReply";


    reply.dataset.replyId =
        replyData.id;


    // =====================================
    // AVATAR
    // =====================================

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "homeCommentReplyAvatar";


    if (
        replyData.profilePicture
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.className =
            "homeCommentReplyAvatarImage";


        image.src =
            replyData.profilePicture;


        image.alt =
            "";


        avatar.appendChild(
            image
        );

    } else {

        avatar.textContent =
            "👤";

    }


    // =====================================
    // CONTENT
    // =====================================

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "homeCommentReplyContent";


    // =====================================
    // HEADER
    // =====================================

    const header =
        document.createElement(
            "div"
        );


    header.className =
        "homeCommentReplyHeader";


    const name =
        document.createElement(
            "span"
        );


    name.className =
        "homeCommentReplyAuthor";


    name.textContent =
        replyData.displayName;


    const time =
        document.createElement(
            "span"
        );


    time.className =
        "homeCommentReplyTime";


    time.dataset.timestamp =
        replyData.createdAt || "";


    time.textContent =
        formatReplyTime(
            replyData.createdAt
        );


    header.appendChild(
        name
    );


    header.appendChild(
        time
    );


    // =====================================
    // TEXT
    // =====================================

    const text =
        document.createElement(
            "div"
        );


    text.className =
        "homeCommentReplyText";


    text.textContent =
        replyData.text;


    // =====================================
    // ASSEMBLE
    // =====================================

    content.appendChild(
        header
    );


    content.appendChild(
        text
    );


    reply.appendChild(
        avatar
    );


    reply.appendChild(
        content
    );


    return reply;

}


// =========================================
// GET / CREATE REPLY CONTAINER
// =========================================

function getReplyContainer(
    comment
) {

    if (!comment) {
        return null;
    }


    // First try direct child.
    let container =
        comment.querySelector(
            ":scope > .homeCommentReplies"
        );


    if (container) {
        return container;
    }


    // Fallback in case another existing
    // structure has placed it deeper.
    container =
        comment.querySelector(
            ".homeCommentReplies"
        );


    if (container) {
        return container;
    }


    // =====================================
    // CREATE CONTAINER
    // =====================================

    container =
        document.createElement(
            "div"
        );


    container.className =
        "homeCommentReplies";


    // Put replies after the reply area.
    const replyArea =
        comment.querySelector(
            ":scope > .homeCommentReplyArea"
        );


    if (replyArea) {

        replyArea.insertAdjacentElement(
            "afterend",
            container
        );

    } else {

        // Fallback: append to comment.
        comment.appendChild(
            container
        );

    }


    return container;

}


// =========================================
// RENDER REPLIES
// =========================================

function renderReplies(
    comment
) {

    if (!comment) {
        return;
    }


    const target =
        getReplyTargetData(
            comment
        );


    if (!target) {
        return;
    }


    const postId =
        target.postId;


    const commentId =
        target.commentId;


    const allReplies =
        getCommentReplies();


    const replies =
        (
            allReplies[postId] &&
            allReplies[postId][commentId]
        ) || [];


    // =====================================
    // GET CONTAINER
    // =====================================

    const repliesContainer =
        getReplyContainer(
            comment
        );


    if (!repliesContainer) {

        console.error(
            "Reply error: could not create reply container.",
            {
                postId: postId,
                commentId: commentId
            }
        );

        return;

    }


    // =====================================
    // SHOW CONTAINER
    // =====================================

    repliesContainer.style.display =
        "block";


    repliesContainer.style.visibility =
        "visible";


    repliesContainer.style.opacity =
        "1";


    // =====================================
    // CLEAR CURRENT RENDER
    // =====================================

    repliesContainer.innerHTML =
        "";


    // =====================================
    // ADD REPLIES
    // =====================================

    replies.forEach(
        function(replyData) {

            const replyElement =
                createReplyElement(
                    replyData
                );


            repliesContainer.appendChild(
                replyElement
            );


            // ================================
            // REPLY REACTIONS
            // ================================

            if (
                typeof initializeReplyReaction ===
                "function"
            ) {

                initializeReplyReaction(
                    replyElement
                );

            }


            // ================================
            // REPLY OPTIONS
            // ================================

            if (
                typeof setupReplyOptions ===
                "function"
            ) {

                setupReplyOptions(
                    replyElement
                );

            }

        }
    );


    // =====================================
    // REMOVE EMPTY CONTAINER
    // =====================================

    if (
        replies.length === 0
    ) {

        repliesContainer.remove();

    }

}


// =========================================
// LOAD EXISTING REPLIES
// =========================================

function loadExistingReplies() {

    document
        .querySelectorAll(
            ".homeComment"
        )
        .forEach(
            function(comment) {

                addReplyArea(
                    comment
                );


                renderReplies(
                    comment
                );

            }
        );

}


// =========================================
// WATCH FOR NEW COMMENTS
// =========================================

const replyObserver =
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


                            // =========================
                            // DIRECT COMMENT
                            // =========================

                            if (
                                node.classList &&
                                node.classList.contains(
                                    "homeComment"
                                )
                            ) {

                                addReplyArea(
                                    node
                                );


                                renderReplies(
                                    node
                                );

                            }


                            // =========================
                            // NESTED COMMENTS
                            // =========================

                            if (
                                node.querySelectorAll
                            ) {

                                node
                                    .querySelectorAll(
                                        ".homeComment"
                                    )
                                    .forEach(
                                        function(comment) {

                                            addReplyArea(
                                                comment
                                            );


                                            renderReplies(
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


replyObserver.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);


// =========================================
// INITIALIZE
// =========================================

loadExistingReplies();