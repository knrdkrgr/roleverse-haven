// =========================================
// HOME REPLY OPTIONS
// =========================================

const HOME_REPLY_OPTIONS_PROFILE_KEY =
    "roleverseProfile";


// =========================================
// GET CURRENT PROFILE
// =========================================

function getCurrentReplyProfile() {

    const savedProfile =
        localStorage.getItem(
            HOME_REPLY_OPTIONS_PROFILE_KEY
        );


    if (!savedProfile) {

        return {
            displayName: "Display Name"
        };

    }


    try {

        const profile =
            JSON.parse(
                savedProfile
            );


        return {
            displayName:
                profile.displayName ||
                "Display Name"
        };

    } catch (error) {

        return {
            displayName: "Display Name"
        };

    }

}


// =========================================
// GET REPLIES
// =========================================

function getReplyOptionsStorage() {

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
            "Could not load replies:",
            error
        );


        return {};

    }

}


// =========================================
// SAVE REPLIES
// =========================================

function saveReplyOptionsStorage(
    replies
) {

    try {

        localStorage.setItem(
            HOME_COMMENT_REPLIES_STORAGE_KEY,
            JSON.stringify(
                replies
            )
        );

    } catch (error) {

        console.error(
            "Could not save replies:",
            error
        );

    }

}


// =========================================
// CREATE OPTIONS UI
// =========================================

function createReplyOptionsUI(
    reply,
    postId,
    commentId,
    replyId
) {

    if (!reply) {

        return null;

    }


    // =====================================
    // GET HEADER
    // =====================================

    const header =
        reply.querySelector(
            ".homeCommentReplyHeader"
        );


    if (!header) {

        return null;

    }


    // =====================================
    // PREVENT DUPLICATES
    // =====================================
    // IMPORTANT:
    // .homeReplyOptions is inside the header,
    // NOT directly inside the reply.

    const existingOptions =
        header.querySelector(
            ":scope > .homeReplyOptions"
        );


    if (existingOptions) {

        return existingOptions;

    }


    // =====================================
    // OPTIONS WRAPPER
    // =====================================

    const options =
        document.createElement(
            "div"
        );


    options.className =
        "homeReplyOptions";


    // =====================================
    // THREE DOT BUTTON
    // =====================================

    const optionsButton =
        document.createElement(
            "button"
        );


    optionsButton.type =
        "button";


    optionsButton.className =
        "homeReplyOptionsButton";


    optionsButton.textContent =
        "•••";


    optionsButton.setAttribute(
        "aria-label",
        "Reply options"
    );


    // =====================================
    // MENU
    // =====================================

    const menu =
        document.createElement(
            "div"
        );


    menu.className =
        "homeReplyOptionsMenu";


    menu.style.display =
        "none";


    // =====================================
    // EDIT
    // =====================================

    const editOption =
        document.createElement(
            "button"
        );


    editOption.type =
        "button";


    editOption.className =
        "homeReplyOption";


    editOption.dataset.action =
        "edit";


    editOption.textContent =
        "Edit";


    // =====================================
    // DELETE
    // =====================================

    const deleteOption =
        document.createElement(
            "button"
        );


    deleteOption.type =
        "button";


    deleteOption.className =
        "homeReplyOption";


    deleteOption.dataset.action =
        "delete";


    deleteOption.textContent =
        "Delete";


    menu.appendChild(
        editOption
    );


    menu.appendChild(
        deleteOption
    );


    options.appendChild(
        optionsButton
    );


    options.appendChild(
        menu
    );


    // =====================================
    // ADD TO HEADER
    // =====================================

    header.appendChild(
        options
    );


    // =====================================
    // TOGGLE MENU
    // =====================================

    optionsButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();


            document
                .querySelectorAll(
                    ".homeReplyOptionsMenu"
                )
                .forEach(
                    function(otherMenu) {

                        if (
                            otherMenu !==
                            menu
                        ) {

                            otherMenu.style.display =
                                "none";

                        }

                    }
                );


            const isOpen =
                menu.style.display ===
                "flex";


            menu.style.display =
                isOpen
                    ? "none"
                    : "flex";

        }
    );


    // =====================================
    // EDIT
    // =====================================

    editOption.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();


            menu.style.display =
                "none";


            const textElement =
                reply.querySelector(
                    ".homeCommentReplyText"
                );


            if (!textElement) {

                return;

            }


            const currentReplies =
                getReplyOptionsStorage();


            const targetReplies =
                (
                    currentReplies[postId] &&
                    currentReplies[postId][commentId]
                ) || [];


            const targetReply =
                targetReplies.find(
                    function(item) {

                        return (
                            String(item.id) ===
                            String(replyId)
                        );

                    }
                );


            if (!targetReply) {

                return;

            }


            // =================================
            // EDIT BOX
            // =================================

            const editBox =
                document.createElement(
                    "div"
                );


            editBox.className =
                "homeReplyEditBox";


            const input =
                document.createElement(
                    "textarea"
                );


            input.className =
                "homeReplyEditInput";


            input.value =
                targetReply.text;


            input.rows =
                3;


            const editActions =
                document.createElement(
                    "div"
                );


            editActions.className =
                "homeReplyEditActions";


            const cancelButton =
                document.createElement(
                    "button"
                );


            cancelButton.type =
                "button";


            cancelButton.className =
                "homeReplyEditCancel";


            cancelButton.textContent =
                "Cancel";


            const saveButton =
                document.createElement(
                    "button"
                );


            saveButton.type =
                "button";


            saveButton.className =
                "homeReplyEditSave";


            saveButton.textContent =
                "Save";


            editActions.appendChild(
                cancelButton
            );


            editActions.appendChild(
                saveButton
            );


            editBox.appendChild(
                input
            );


            editBox.appendChild(
                editActions
            );


            textElement.replaceWith(
                editBox
            );


            input.focus();


            // =================================
            // CANCEL
            // =================================

            cancelButton.addEventListener(
                "click",
                function() {

                    renderReplyAfterOptionChange(
                        reply
                    );

                }
            );


            // =================================
            // SAVE
            // =================================

            saveButton.addEventListener(
                "click",
                function() {

                    const newText =
                        input.value.trim();


                    if (!newText) {

                        return;

                    }


                    const latestReplies =
                        getReplyOptionsStorage();


                    const latestTargetReplies =
                        (
                            latestReplies[postId] &&
                            latestReplies[postId][commentId]
                        ) || [];


                    const latestReply =
                        latestTargetReplies.find(
                            function(item) {

                                return (
                                    String(item.id) ===
                                    String(replyId)
                                );

                            }
                        );


                    if (!latestReply) {

                        return;

                    }


                    latestReply.text =
                        newText;


                    latestReply.updatedAt =
                        new Date().toISOString();


                    saveReplyOptionsStorage(
                        latestReplies
                    );


                    renderReplyAfterOptionChange(
                        reply
                    );

                }
            );


            // =================================
            // ENTER TO SAVE
            // SHIFT + ENTER = NEW LINE
            // =================================

            input.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();


                        saveButton.click();

                    }

                }
            );

        }
    );


    // =====================================
    // DELETE
    // =====================================

    deleteOption.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();


            menu.style.display =
                "none";


            const shouldDelete =
                confirm(
                    "Delete this reply?"
                );


            if (!shouldDelete) {

                return;

            }


            const currentReplies =
                getReplyOptionsStorage();


            if (
                !currentReplies[postId] ||
                !currentReplies[postId][commentId]
            ) {

                return;

            }


            currentReplies[
                postId
            ][
                commentId
            ] =
                currentReplies[
                    postId
                ][
                    commentId
                ].filter(
                    function(item) {

                        return (
                            String(item.id) !==
                            String(replyId)
                        );

                    }
                );


            saveReplyOptionsStorage(
                currentReplies
            );


            reply.remove();

        }
    );


    return options;

}


// =========================================
// SETUP REPLY OPTIONS
// =========================================

function setupReplyOptions(
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


    // =====================================
    // GET TARGET
    // =====================================

    const post =
        reply.closest(
            ".homePost"
        );


    const comment =
        reply.closest(
            ".homeComment"
        );


    if (!post || !comment) {

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


    // =====================================
    // GET STORAGE
    // =====================================

    const allReplies =
        getReplyOptionsStorage();


    const replies =
        (
            allReplies[postId] &&
            allReplies[postId][commentId]
        ) || [];


    const replyData =
        replies.find(
            function(item) {

                return (
                    String(item.id) ===
                    String(replyId)
                );

            }
        );


    if (!replyData) {

        console.warn(
            "Reply options: reply data not found.",
            {
                postId: postId,
                commentId: commentId,
                replyId: replyId
            }
        );


        return;

    }


    // =====================================
    // CHECK OWNERSHIP
    // =====================================

    const currentProfile =
        getCurrentReplyProfile();


    if (
        String(replyData.displayName).trim() !==
        String(currentProfile.displayName).trim()
    ) {

        return;

    }


    // =====================================
    // CREATE OPTIONS
    // =====================================

    createReplyOptionsUI(
        reply,
        postId,
        commentId,
        replyId
    );

}


// =========================================
// RE-RENDER SINGLE REPLY
// =========================================

function renderReplyAfterOptionChange(
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
        reply.closest(
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


    const allReplies =
        getReplyOptionsStorage();


    const replies =
        (
            allReplies[postId] &&
            allReplies[postId][commentId]
        ) || [];


    const replyData =
        replies.find(
            function(item) {

                return (
                    String(item.id) ===
                    String(replyId)
                );

            }
        );


    if (!replyData) {

        return;

    }


    const newReply =
        createReplyElement(
            replyData
        );


    reply.replaceWith(
        newReply
    );


    // =====================================
    // RE-ADD REACTIONS
    // =====================================

    if (
        typeof initializeReplyReaction ===
        "function"
    ) {

        initializeReplyReaction(
            newReply
        );

    }


    // =====================================
    // RE-ADD OPTIONS
    // =====================================

    setupReplyOptions(
        newReply
    );

}


// =========================================
// CLOSE MENUS WHEN CLICKING OUTSIDE
// =========================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                ".homeReplyOptions"
            )
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".homeReplyOptionsMenu"
            )
            .forEach(
                function(menu) {

                    menu.style.display =
                        "none";

                }
            );

    }
);


// =========================================
// INITIALIZE EXISTING REPLIES
// =========================================

function initializeReplyOptions() {

    document
        .querySelectorAll(
            ".homeCommentReply"
        )
        .forEach(
            function(reply) {

                setupReplyOptions(
                    reply
                );

            }
        );

}


initializeReplyOptions();