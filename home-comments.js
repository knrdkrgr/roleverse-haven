let homePostList = null;


// =========================================
// COMMENT STORAGE
// =========================================

const HOME_COMMENT_STORAGE_KEY =
    "roleverseHomeComments";


function getSavedComments() {

    const savedComments =
        localStorage.getItem(
            HOME_COMMENT_STORAGE_KEY
        );


    if (!savedComments) {

        return {};

    }


    try {

        const parsedComments =
            JSON.parse(savedComments);


        if (
            typeof parsedComments !== "object" ||
            parsedComments === null
        ) {

            return {};

        }


        return parsedComments;

    } catch (error) {

        console.error(
            "Could not load saved comments:",
            error
        );

        return {};

    }

}


function saveComments(comments) {

    try {

        // =====================================
        // REMOVE DUPLICATED PROFILE PICTURES
        // FROM EVERY COMMENT BEFORE SAVING
        // =====================================

        const commentsToSave =
            JSON.parse(
                JSON.stringify(
                    comments
                )
            );


        Object.keys(
            commentsToSave
        ).forEach(
            function(postId) {

                const postComments =
                    commentsToSave[postId];


                if (
                    !Array.isArray(
                        postComments
                    )
                ) {

                    return;

                }


                postComments.forEach(
                    function(comment) {

                        if (
                            comment &&
                            typeof comment === "object"
                        ) {

                            delete comment.profilePicture;

                        }

                    }
                );

            }
        );


        localStorage.setItem(
            HOME_COMMENT_STORAGE_KEY,
            JSON.stringify(
                commentsToSave
            )
        );

    } catch (error) {

        console.error(
            "Could not save comments:",
            error
        );

    }

}


// =========================================
// LOAD CURRENT PROFILE
// =========================================

let commentProfile = {

    displayName:
        "Display Name",

    profilePicture:
        ""

};


const commentSavedProfile =
    localStorage.getItem(
        "roleverseProfile"
    );


if (commentSavedProfile) {

    try {

        const commentProfileData =
            JSON.parse(
                commentSavedProfile
            );


        if (
            typeof commentProfileData.displayName ===
            "string" &&
            commentProfileData.displayName.trim() !== ""
        ) {

            commentProfile.displayName =
                commentProfileData.displayName;

        }


        if (
            typeof commentProfileData.profilePicture ===
            "string"
        ) {

            commentProfile.profilePicture =
                commentProfileData.profilePicture;

        }

    } catch (error) {

        console.error(
            "Could not load profile data:",
            error
        );

    }

}


// =========================================
// COMMENT TIMESTAMP FORMATTER
// =========================================

function formatCommentTime(
    timestamp
) {

    if (!timestamp) {

        return "Just now";

    }


    const createdAt =
        new Date(timestamp);

    const now =
        new Date();


    if (
        Number.isNaN(
            createdAt.getTime()
        )
    ) {

        return "Just now";

    }


    const difference =
        now.getTime() -
        createdAt.getTime();


    const seconds =
        Math.floor(
            difference / 1000
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const hours =
        Math.floor(
            minutes / 60
        );


    const days =
        Math.floor(
            hours / 24
        );


    if (seconds < 60) {

        return "Just now";

    }


    if (minutes < 60) {

        return (
            minutes +
            " minute" +
            (minutes === 1 ? "" : "s") +
            " ago"
        );

    }


    if (hours < 24) {

        return (
            hours +
            " hour" +
            (hours === 1 ? "" : "s") +
            " ago"
        );

    }


    if (days === 1) {

        return "Yesterday";

    }


    if (days < 7) {

        return (
            days +
            " day" +
            (days === 1 ? "" : "s") +
            " ago"
        );

    }


    return createdAt.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// =========================================
// CHECK IF COMMENT BELONGS TO CURRENT USER
// =========================================

function isOwnComment(
    commentData
) {

    if (!commentData) {

        return false;

    }


    return (
        commentData.displayName ===
        commentProfile.displayName
    );

}


// =========================================
// UPDATE COMMENT BUTTON
// =========================================

function updateCommentButton(
    post
) {

    if (!post) {

        return;

    }


    const commentButton =
        post.querySelector(
            ".homeCommentButton"
        );


    if (!commentButton) {

        return;

    }


    const postId =
        post.dataset.postId;


    if (!postId) {

        return;

    }


    const savedComments =
        getSavedComments();


    const postComments =
        savedComments[postId];


    let commentCount =
        0;


    if (
        Array.isArray(postComments)
    ) {

        commentCount =
            postComments.length;

    }


    commentButton.textContent =
        "Comment (" +
        commentCount +
        ")";

}


// =========================================
// CREATE COMMENT ACTION BUTTON
// =========================================

function createCommentActionButton(
    text,
    action
) {

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.className =
        "homeCommentActionButton";


    button.dataset.action =
        action;


    button.textContent =
        text;


    return button;

}


// =========================================
// CREATE COMMENT ELEMENT
// =========================================

function createCommentElement(
    commentData
) {

    const comment =
        document.createElement("div");


    comment.className =
        "homeComment";


    comment.dataset.commentId =
        commentData.id;


    // =====================================
    // COMMENT HEADER
    // =====================================

    const commentHeader =
        document.createElement("div");


    commentHeader.className =
        "homeCommentHeader";


    const avatar =
        document.createElement("div");


    avatar.className =
        "homeCommentAvatar";


    // =====================================
    // USE CURRENT PROFILE PICTURE
    // =====================================

    if (
        commentData.profilePicture &&
        commentData.profilePicture.length > 0
    ) {

        const image =
            document.createElement("img");


        image.src =
            commentData.profilePicture;


        image.alt =
            "Profile Picture";


        image.className =
            "homeCommentAvatarImage";


        avatar.appendChild(
            image
        );

    } else if (
        commentData.displayName ===
        commentProfile.displayName &&
        commentProfile.profilePicture
    ) {

        const image =
            document.createElement("img");


        image.src =
            commentProfile.profilePicture;


        image.alt =
            "Profile Picture";


        image.className =
            "homeCommentAvatarImage";


        avatar.appendChild(
            image
        );

    } else {

        avatar.textContent =
            "👤";

    }


    const authorInfo =
        document.createElement("div");


    authorInfo.className =
        "homeCommentAuthorInfo";


    const author =
        document.createElement("strong");


    author.className =
        "homeCommentAuthor";


    author.textContent =
        commentData.displayName;


    const time =
        document.createElement("span");


    time.className =
        "homeCommentTime";


    time.dataset.timestamp =
        commentData.createdAt || "";


    time.textContent =
        formatCommentTime(
            commentData.createdAt
        );


    authorInfo.appendChild(
        author
    );


    authorInfo.appendChild(
        time
    );


    commentHeader.appendChild(
        avatar
    );


    commentHeader.appendChild(
        authorInfo
    );


    // =====================================
    // COMMENT TEXT
    // =====================================

    const commentText =
        document.createElement("p");


    commentText.className =
        "homeCommentText";


    commentText.textContent =
        commentData.text;


    // =====================================
    // COMMENT ACTIONS
    // =====================================

    if (
        isOwnComment(commentData)
    ) {

        const actionContainer =
            document.createElement("div");


        actionContainer.className =
            "homeCommentActions";


        const editButton =
            createCommentActionButton(
                "Edit",
                "edit"
            );


        const deleteButton =
            createCommentActionButton(
                "Delete",
                "delete"
            );


        actionContainer.appendChild(
            editButton
        );


        actionContainer.appendChild(
            deleteButton
        );


        comment.appendChild(
            actionContainer
        );

    }


    // =====================================
    // ASSEMBLE
    // =====================================

    comment.appendChild(
        commentHeader
    );


    comment.appendChild(
        commentText
    );


    return comment;

}


// =========================================
// EDIT COMMENT
// =========================================

function editComment(
    commentElement
) {

    if (!commentElement) {

        return;

    }


    const post =
        commentElement.closest(
            ".homePost"
        );


    if (!post) {

        return;

    }


    const postId =
        post.dataset.postId;


    const commentId =
        commentElement.dataset.commentId;


    if (!postId || !commentId) {

        return;

    }


    const savedComments =
        getSavedComments();


    const postComments =
        savedComments[postId];


    if (
        !Array.isArray(postComments)
    ) {

        return;

    }


    const commentData =
        postComments.find(
            function(comment) {

                return (
                    comment.id ===
                    commentId
                );

            }
        );


    if (!commentData) {

        return;

    }


    if (
        !isOwnComment(commentData)
    ) {

        return;

    }


    const existingText =
        commentData.text;


    const existingTextElement =
        commentElement.querySelector(
            ".homeCommentText"
        );


    const actionContainer =
        commentElement.querySelector(
            ".homeCommentActions"
        );


    if (!existingTextElement) {

        return;

    }


    // =====================================
    // CREATE EDIT AREA
    // =====================================

    const editContainer =
        document.createElement("div");


    editContainer.className =
        "homeCommentEditBox";


    const editInput =
        document.createElement("textarea");


    editInput.className =
        "homeCommentEditInput";


    editInput.value =
        existingText;


    editInput.rows =
        3;


    const editButtons =
        document.createElement("div");


    editButtons.className =
        "homeCommentEditActions";


    const saveButton =
        document.createElement("button");


    saveButton.type =
        "button";


    saveButton.className =
        "homeCommentEditSave";


    saveButton.textContent =
        "Save";


    const cancelButton =
        document.createElement("button");


    cancelButton.type =
        "button";


    cancelButton.className =
        "homeCommentEditCancel";


    cancelButton.textContent =
        "Cancel";


    editButtons.appendChild(
        saveButton
    );


    editButtons.appendChild(
        cancelButton
    );


    editContainer.appendChild(
        editInput
    );


    editContainer.appendChild(
        editButtons
    );


    existingTextElement.replaceWith(
        editContainer
    );


    if (actionContainer) {

        actionContainer.style.display =
            "none";

    }


    editInput.focus();


    editInput.setSelectionRange(
        editInput.value.length,
        editInput.value.length
    );


    // =====================================
    // SAVE EDIT
    // =====================================

    saveButton.addEventListener(
        "click",
        function() {

            const updatedText =
                editInput.value.trim();


            if (
                updatedText === ""
            ) {

                editInput.focus();

                return;

            }


            const latestComments =
                getSavedComments();


            const latestPostComments =
                latestComments[postId];


            if (
                !Array.isArray(
                    latestPostComments
                )
            ) {

                return;

            }


            const latestComment =
                latestPostComments.find(
                    function(comment) {

                        return (
                            comment.id ===
                            commentId
                        );

                    }
                );


            if (!latestComment) {

                return;

            }


            latestComment.text =
                updatedText;


            latestComment.updatedAt =
                new Date().toISOString();


            saveComments(
                latestComments
            );


            const refreshedComment =
                createCommentElement(
                    latestComment
                );


            commentElement.replaceWith(
                refreshedComment
            );

        }
    );


    // =====================================
    // CANCEL EDIT
    // =====================================

    cancelButton.addEventListener(
        "click",
        function() {

            const refreshedComment =
                createCommentElement(
                    commentData
                );


            commentElement.replaceWith(
                refreshedComment
            );

        }
    );

}


// =========================================
// DELETE COMMENT
// =========================================

function deleteComment(
    commentElement
) {

    if (!commentElement) {

        return;

    }


    const post =
        commentElement.closest(
            ".homePost"
        );


    if (!post) {

        return;

    }


    const postId =
        post.dataset.postId;


    const commentId =
        commentElement.dataset.commentId;


    if (!postId || !commentId) {

        return;

    }


    const savedComments =
        getSavedComments();


    const postComments =
        savedComments[postId];


    if (
        !Array.isArray(postComments)
    ) {

        return;

    }


    const commentData =
        postComments.find(
            function(comment) {

                return (
                    comment.id ===
                    commentId
                );

            }
        );


    if (!commentData) {

        return;

    }


    if (
        !isOwnComment(commentData)
    ) {

        return;

    }


    const shouldDelete =
        window.confirm(
            "Delete this comment?"
        );


    if (!shouldDelete) {

        return;

    }


    savedComments[postId] =
        postComments.filter(
            function(comment) {

                return (
                    comment.id !==
                    commentId
                );

            }
        );


    saveComments(
        savedComments
    );


    commentElement.remove();


    updateCommentButton(
        post
    );

}


// =========================================
// LOAD COMMENTS FOR POST
// =========================================

function loadCommentsForPost(
    post
) {

    if (!post) {

        return;

    }


    const postId =
        post.dataset.postId;


    if (!postId) {

        return;

    }


    const commentList =
        post.querySelector(
            ".homeCommentList"
        );


    if (!commentList) {

        return;

    }


    const savedComments =
        getSavedComments();


    const postComments =
        savedComments[postId];


    if (
        !Array.isArray(postComments)
    ) {

        updateCommentButton(
            post
        );

        return;

    }


    commentList.innerHTML =
        "";


    postComments.forEach(
        function(commentData) {

            // =================================
            // MIGRATE OLD COMMENTS
            // =================================

            if (!commentData.createdAt) {

                commentData.createdAt =
                    new Date().toISOString();

            }


            const commentElement =
                createCommentElement(
                    commentData
                );


            commentList.appendChild(
                commentElement
            );

        }
    );


    // =====================================
    // SAVE AFTER MIGRATION
    // This also removes old duplicated
    // profile pictures.
    // =====================================

    saveComments(
        savedComments
    );


    updateCommentButton(
        post
    );

}


// =========================================
// OPEN COMMENT BOX
// =========================================

function openCommentBox(
    post
) {

    if (!post) {

        return;

    }


    let commentBox =
        post.querySelector(
            ".homeCommentBox"
        );


    if (commentBox) {

        commentBox.style.display =
            "block";


        loadCommentsForPost(
            post
        );


        const existingInput =
            commentBox.querySelector(
                ".homeCommentInput"
            );


        if (existingInput) {

            existingInput.focus();

        }


        return;

    }


    commentBox =
        document.createElement(
            "div"
        );


    commentBox.className =
        "homeCommentBox";


    const commentInput =
        document.createElement(
            "textarea"
        );


    commentInput.className =
        "homeCommentInput";


    commentInput.placeholder =
        "Write a comment...";


    const addCommentButton =
        document.createElement(
            "button"
        );


    addCommentButton.type =
        "button";


    addCommentButton.className =
        "homeAddCommentButton";


    addCommentButton.textContent =
        "Comment";


    const commentList =
        document.createElement(
            "div"
        );


    commentList.className =
        "homeCommentList";


    commentBox.appendChild(
        commentInput
    );


    commentBox.appendChild(
        addCommentButton
    );


    commentBox.appendChild(
        commentList
    );


    post.appendChild(
        commentBox
    );


    loadCommentsForPost(
        post
    );


    commentInput.focus();

}


// =========================================
// SETUP COMMENT EVENTS
// =========================================

function setupCommentEvents() {

    homePostList =
        document.getElementById(
            "postList"
        );


    if (!homePostList) {

        console.warn(
            "Comment system: #postList was not found yet."
        );

        return;

    }


    // =====================================
    // COMMENT BUTTON
    // =====================================

    homePostList.addEventListener(
        "click",
        function(event) {

            const commentButton =
                event.target.closest(
                    ".homeCommentButton"
                );


            if (!commentButton) {

                return;

            }


            const post =
                commentButton.closest(
                    ".homePost"
                );


            if (!post) {

                return;

            }


            openCommentBox(
                post
            );

        }
    );


    // =====================================
    // COMMENT ACTIONS
    // =====================================

    homePostList.addEventListener(
        "click",
        function(event) {

            const actionButton =
                event.target.closest(
                    ".homeCommentActionButton"
                );


            if (!actionButton) {

                return;

            }


            const commentElement =
                actionButton.closest(
                    ".homeComment"
                );


            if (!commentElement) {

                return;

            }


            const action =
                actionButton.dataset.action;


            if (
                action === "edit"
            ) {

                editComment(
                    commentElement
                );

            }


            if (
                action === "delete"
            ) {

                deleteComment(
                    commentElement
                );

            }

        }
    );


    // =====================================
    // ADD COMMENT
    // =====================================

    homePostList.addEventListener(
        "click",
        function(event) {

            const addCommentButton =
                event.target.closest(
                    ".homeAddCommentButton"
                );


            if (!addCommentButton) {

                return;

            }


            const commentBox =
                addCommentButton.closest(
                    ".homeCommentBox"
                );


            if (!commentBox) {

                return;

            }


            const post =
                addCommentButton.closest(
                    ".homePost"
                );


            if (!post) {

                return;

            }


            const commentInput =
                commentBox.querySelector(
                    ".homeCommentInput"
                );


            const commentList =
                commentBox.querySelector(
                    ".homeCommentList"
                );


            if (
                !commentInput ||
                !commentList
            ) {

                return;

            }


            const commentText =
                commentInput.value.trim();


            if (
                commentText === ""
            ) {

                return;

            }


            const postId =
                post.dataset.postId;


            if (!postId) {

                return;

            }


            // =================================
            // CREATE COMMENT
            // =================================

            const newComment = {

                id:
                    Date.now().toString(),

                displayName:
                    commentProfile.displayName,

                text:
                    commentText,

                createdAt:
                    new Date().toISOString()

            };


            // =================================
            // LOAD COMMENTS
            // =================================

            const savedComments =
                getSavedComments();


            if (
                !Array.isArray(
                    savedComments[postId]
                )
            ) {

                savedComments[postId] =
                    [];

            }


            savedComments[postId].push(
                newComment
            );


            saveComments(
                savedComments
            );


            // =================================
            // DISPLAY COMMENT
            // =================================

            const commentElement =
                createCommentElement(
                    newComment
                );


            commentList.appendChild(
                commentElement
            );


            // =================================
            // UPDATE COUNT
            // =================================

            updateCommentButton(
                post
            );


            commentInput.value =
                "";


            commentInput.focus();

        }
    );


    // =====================================
    // ENTER KEY SUPPORT
    // =====================================

    homePostList.addEventListener(
        "keydown",
        function(event) {

            if (
                !event.target.classList.contains(
                    "homeCommentInput"
                )
            ) {

                return;

            }


            if (
                event.key !== "Enter" ||
                event.shiftKey
            ) {

                return;

            }


            event.preventDefault();


            const commentBox =
                event.target.closest(
                    ".homeCommentBox"
                );


            if (!commentBox) {

                return;

            }


            const addCommentButton =
                commentBox.querySelector(
                    ".homeAddCommentButton"
                );


            if (addCommentButton) {

                addCommentButton.click();

            }

        }
    );

}


// =========================================
// UPDATE COMMENT TIMESTAMPS
// =========================================

function updateCommentTimestamps() {

    const timestamps =
        document.querySelectorAll(
            ".homeCommentTime"
        );


    timestamps.forEach(
        function(timestampElement) {

            const timestamp =
                timestampElement.dataset.timestamp;


            if (!timestamp) {

                return;

            }


            timestampElement.textContent =
                formatCommentTime(
                    timestamp
                );

        }
    );

}


// =========================================
// UPDATE ALL COMMENT COUNTS
// =========================================

function updateAllCommentCounts() {

    const postsContainer =
        document.getElementById(
            "postList"
        );


    if (!postsContainer) {

        return;

    }


    const posts =
        postsContainer.querySelectorAll(
            ".homePost"
        );


    posts.forEach(
        function(post) {

            updateCommentButton(
                post
            );

        }
    );

}


// =========================================
// INITIALIZE COMMENT SYSTEM
// =========================================

function initializeCommentSystem() {

    setupCommentEvents();

    updateAllCommentCounts();

}


// =========================================
// WAIT FOR DOM
// =========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCommentSystem
    );

} else {

    initializeCommentSystem();

}


// =========================================
// UPDATE TIMESTAMPS EVERY MINUTE
// =========================================

setInterval(
    updateCommentTimestamps,
    60000
);