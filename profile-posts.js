// =========================================
// ROLEVERSE HAVEN — PROFILE POSTS
// =========================================

const profilePostInput = document.getElementById("profilePostInput");
const profilePostImage = document.getElementById("profilePostImage");
const profilePostButton = document.getElementById("profilePostButton");
const profilePostList = document.getElementById("profilePostList");

const profilePostReactionEmojis = {
    heart: "❤️",
    laugh: "😂",
    wow: "😮",
    sad: "😢",
    angry: "😡"
};

const profilePostReactionOrder = [
    "heart",
    "laugh",
    "wow",
    "sad",
    "angry"
];

// =========================================
// PROFILE POST MENU FIX
// =========================================

(function injectProfilePostMenuStyle() {

    if (document.getElementById("profilePostMenuForceStyle")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "profilePostMenuForceStyle";

    style.textContent = `
        .profilePost.homePost .homePostMenuDropdown {
            display: none !important;
        }

        .profilePost.homePost .homePostMenuDropdown.visible {
            display: flex !important;
        }
    `;

    document.head.appendChild(style);

})();

// =========================================
// NOTIFICATION HELPER
// =========================================

function createProfileNotification(
    type,
    text,
    context
) {

    if (
        typeof createNotification !==
        "function"
    ) {
        console.warn(
            "Notification system is not available."
        );

        return;
    }

    const profile =
        getCurrentProfile();

    createNotification({
        type: type,
        actorName:
            profile.displayName ||
            "Someone",
        actorPicture:
            profile.profilePicture ||
            "",
        text: text,
        context:
            context || "",
        contextType: "profile-post"
    });

}

// =========================================
// REACTION DATA
// =========================================

function createProfileReactionData() {
    return {
        heart: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0,
        selected: null
    };
}

function normalizeProfilePost(post) {

    if (!post || typeof post !== "object") {
        return null;
    }

    if (!post.id) {
        post.id =
            "profile-post-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2);
    }

    if (
        typeof post.timestamp !== "number" ||
        !Number.isFinite(post.timestamp)
    ) {
        post.timestamp = Date.now();
    }

    if (
        !post.reactions ||
        typeof post.reactions !== "object"
    ) {
        post.reactions =
            createProfileReactionData();
    }

    profilePostReactionOrder.forEach(function(reaction) {
        if (
            typeof post.reactions[reaction] !==
            "number"
        ) {
            post.reactions[reaction] = 0;
        }
    });

    if (
        typeof post.reactions.selected ===
        "undefined"
    ) {
        post.reactions.selected = null;
    }

    if (!Array.isArray(post.comments)) {
        post.comments = [];
    }

    return post;
}

function loadProfilePosts() {
    try {
        const savedPosts =
            localStorage.getItem(
                "roleverseProfilePosts"
            );

        if (!savedPosts) {
            return [];
        }

        const parsedPosts =
            JSON.parse(savedPosts);

        if (!Array.isArray(parsedPosts)) {
            return [];
        }

        return parsedPosts
            .map(normalizeProfilePost)
            .filter(Boolean);

    } catch (error) {
        console.error(
            "Could not load profile posts:",
            error
        );

        return [];
    }
}

let profilePosts =
    loadProfilePosts();

function saveProfilePosts() {
    try {
        localStorage.setItem(
            "roleverseProfilePosts",
            JSON.stringify(profilePosts)
        );
    } catch (error) {
        console.error(
            "Could not save profile posts:",
            error
        );
    }
}

function getCurrentProfile() {
    try {
        const savedProfile =
            localStorage.getItem(
                "roleverseProfile"
            );

        if (savedProfile) {
            return JSON.parse(savedProfile);
        }
    } catch (error) {
        console.error(
            "Could not load profile:",
            error
        );
    }

    return {
        displayName: "Display Name",
        profilePicture: ""
    };
}

function formatProfilePostTime(timestamp) {
    if (
        typeof timestamp !== "number" ||
        !Number.isFinite(timestamp)
    ) {
        return "Just now";
    }

    const now = Date.now();

    let difference =
        Math.floor(
            (now - timestamp) / 1000
        );

    if (difference < 0) {
        difference = 0;
    }

    if (difference < 10) {
        return "Just now";
    }

    if (difference < 60) {
        return difference + "s";
    }

    const minutes =
        Math.floor(
            difference / 60
        );

    if (minutes < 60) {
        return minutes + "m";
    }

    const hours =
        Math.floor(
            minutes / 60
        );

    if (hours < 24) {
        return hours + "h";
    }

    const days =
        Math.floor(
            hours / 24
        );

    if (days < 7) {
        return days + "d";
    }

    const weeks =
        Math.floor(
            days / 7
        );

    if (weeks < 4) {
        return weeks + "w";
    }

    return new Date(timestamp)
        .toLocaleDateString();
}

function refreshProfilePostTimes() {
    if (!profilePostList) {
        return;
    }

    const posts =
        profilePostList.querySelectorAll(
            ".profilePost"
        );

    posts.forEach(function(postElement) {
        const postId =
            postElement.dataset.postId;

        if (!postId) {
            return;
        }

        const post =
            profilePosts.find(function(item) {
                return (
                    String(item.id) ===
                    String(postId)
                );
            });

        if (!post) {
            return;
        }

        const timestampElement =
            postElement.querySelector(
                ".homePostTimestamp"
            );

        if (!timestampElement) {
            return;
        }

        timestampElement.textContent =
            formatProfilePostTime(
                post.timestamp
            );
    });
}

setInterval(
    refreshProfilePostTimes,
    10000
);

function escapeProfilePostHTML(value) {
    if (
        value === null ||
        typeof value === "undefined"
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateProfileReactionCount(
    postElement,
    reactions
) {
    const countElement =
        postElement.querySelector(
            ".profileReactionCount"
        );

    if (!countElement) {
        return;
    }

    const visibleReactions =
        profilePostReactionOrder.filter(
            function(reaction) {
                return (
                    reactions[reaction] > 0
                );
            }
        );

    if (
        visibleReactions.length === 0
    ) {
        countElement.innerHTML = "";
        countElement.style.display =
            "none";
        return;
    }

    countElement.innerHTML =
        visibleReactions
            .map(function(reaction) {
                return (
                    profilePostReactionEmojis[
                        reaction
                    ] +
                    " " +
                    reactions[reaction]
                );
            })
            .join(
                "&nbsp;&nbsp;&nbsp;"
            );

    countElement.style.display =
        "block";
}

function updateProfileReactionButton(
    postElement,
    selectedReaction
) {
    const button =
        postElement.querySelector(
            ".profileReactionButton"
        );

    if (!button) {
        return;
    }

    if (!selectedReaction) {
        button.textContent =
            "React";
        return;
    }

    button.textContent =
        profilePostReactionEmojis[
            selectedReaction
        ] || "React";
}

function closeProfilePostReactionPicker(
    postElement
) {
    const picker =
        postElement.querySelector(
            ".profileReactionPicker"
        );

    if (!picker) {
        return;
    }

    picker.classList.remove(
        "visible"
    );

    picker.style.display =
        "none";
}

function openProfilePostReactionPicker(
    postElement
) {
    const picker =
        postElement.querySelector(
            ".profileReactionPicker"
        );

    if (!picker) {
        return;
    }

    picker.classList.add(
        "visible"
    );

    picker.style.display =
        "flex";

    picker.style.bottom =
        "calc(100% - 1px)";
}

function setupProfileReactionHover(
    postElement
) {
    const reactionArea =
        postElement.querySelector(
            ".profileReactionArea"
        );

    if (!reactionArea) {
        return;
    }

    reactionArea.addEventListener(
        "mouseenter",
        function() {
            openProfilePostReactionPicker(
                postElement
            );
        }
    );

    reactionArea.addEventListener(
        "mouseleave",
        function() {
            closeProfilePostReactionPicker(
                postElement
            );
        }
    );
}

function handleProfilePostReaction(
    postElement,
    reactionName
) {
    const postId =
        postElement.dataset.postId;

    if (
        !postId ||
        !reactionName
    ) {
        return;
    }

    const post =
        profilePosts.find(
            function(item) {
                return (
                    String(item.id) ===
                    String(postId)
                );
            }
        );

    if (!post) {
        return;
    }

    if (
        !post.reactions ||
        typeof post.reactions !==
        "object"
    ) {
        post.reactions =
            createProfileReactionData();
    }

    const currentReaction =
        post.reactions.selected;

    if (
        currentReaction ===
        reactionName
    ) {
        if (
            post.reactions[
                reactionName
            ] > 0
        ) {
            post.reactions[
                reactionName
            ]--;
        }

        post.reactions.selected =
            null;

    } else {
        if (
            currentReaction &&
            post.reactions[
                currentReaction
            ] > 0
        ) {
            post.reactions[
                currentReaction
            ]--;
        }

        post.reactions[
            reactionName
        ]++;

        post.reactions.selected =
            reactionName;
    }

    saveProfilePosts();

    updateProfileReactionButton(
        postElement,
        post.reactions.selected
    );

    updateProfileReactionCount(
        postElement,
        post.reactions
    );

    closeProfilePostReactionPicker(
        postElement
    );

    if (
        typeof restoreAllReactions ===
        "function"
    ) {
        setTimeout(
            function() {
                restoreAllReactions();
            },
            10
        );
    }
}

function createCommentReactionData() {
    return {
        heart: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0,
        selected: null
    };
}

function updateCommentReactionCount(
    element,
    reactions
) {
    if (
        !element ||
        !reactions
    ) {
        return;
    }

    const visible =
        profilePostReactionOrder.filter(
            function(reaction) {
                return (
                    reactions[reaction] >
                    0
                );
            }
        );

    if (
        visible.length === 0
    ) {
        element.innerHTML = "";
        return;
    }

    element.innerHTML =
        visible
            .map(function(reaction) {
                return (
                    profilePostReactionEmojis[
                        reaction
                    ] +
                    " " +
                    reactions[reaction]
                );
            })
            .join(
                "&nbsp;&nbsp;&nbsp;"
            );
}

function createProfileCommentHTML(
    comment
) {
    if (!comment) {
        return "";
    }

    if (!comment.id) {
        comment.id =
            "profile-comment-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2);
    }

    if (!comment.reactions) {
        comment.reactions =
            createCommentReactionData();
    }

    if (
        !Array.isArray(
            comment.replies
        )
    ) {
        comment.replies = [];
    }

    const profile =
        getCurrentProfile();

    const safeName =
        escapeProfilePostHTML(
            profile.displayName ||
            "Display Name"
        );

    const safeText =
        escapeProfilePostHTML(
            comment.text || ""
        );

    const commentElement =
        document.createElement(
            "div"
        );

    commentElement.className =
        "profileComment";

    commentElement.dataset.commentId =
        comment.id;

    commentElement.innerHTML = `
        <div class="profileCommentBody">
            <strong class="profileCommentAuthor">
                ${safeName}
            </strong>

            <div class="profileCommentText">
                ${safeText}
            </div>

            <div class="profileCommentActions">
                <button
                    type="button"
                    class="profileCommentReactionButton"
                >
                    ${
                        comment.reactions.selected
                            ? profilePostReactionEmojis[
                                comment.reactions.selected
                            ]
                            : "React"
                    }
                </button>

                <span
                    class="profileCommentReactionCount"
                ></span>

                <button
                    type="button"
                    class="profileCommentReplyButton"
                >
                    Reply
                </button>

                <button
                    type="button"
                    class="profileCommentEditButton"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="profileCommentDeleteButton"
                >
                    Delete
                </button>
            </div>

            <div class="profileCommentReplies"></div>
        </div>
    `;

    updateCommentReactionCount(
        commentElement.querySelector(
            ".profileCommentReactionCount"
        ),
        comment.reactions
    );

    renderProfileReplies(
        commentElement,
        comment
    );

    return commentElement;
}

function renderProfileReplies(
    commentElement,
    comment
) {
    const container =
        commentElement.querySelector(
            ".profileCommentReplies"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !Array.isArray(
            comment.replies
        )
    ) {
        return;
    }

    comment.replies.forEach(
        function(reply) {
            if (!reply.reactions) {
                reply.reactions =
                    createCommentReactionData();
            }

            if (!reply.id) {
                reply.id =
                    "profile-reply-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .slice(2);
            }

            const profile =
                getCurrentProfile();

            const safeName =
                escapeProfilePostHTML(
                    profile.displayName ||
                    "Display Name"
                );

            const safeText =
                escapeProfilePostHTML(
                    reply.text || ""
                );

            const replyElement =
                document.createElement(
                    "div"
                );

            replyElement.className =
                "profileReply";

            replyElement.dataset.replyId =
                reply.id;

            replyElement.innerHTML = `
                <div class="profileReplyBody">
                    <strong class="profileReplyAuthor">
                        ${safeName}
                    </strong>

                    <div class="profileReplyText">
                        ${safeText}
                    </div>

                    <div class="profileReplyActions">
                        <button
                            type="button"
                            class="profileCommentReactionButton"
                        >
                            ${
                                reply.reactions.selected
                                    ? profilePostReactionEmojis[
                                        reply.reactions.selected
                                    ]
                                    : "React"
                            }
                        </button>

                        <span
                            class="profileCommentReactionCount"
                        ></span>

                        <button
                            type="button"
                            class="profileReplyEditButton"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="profileReplyDeleteButton"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            `;

            updateCommentReactionCount(
                replyElement.querySelector(
                    ".profileCommentReactionCount"
                ),
                reply.reactions
            );

            container.appendChild(
                replyElement
            );
        }
    );
}

function closeAllProfilePostMenus() {
    document
        .querySelectorAll(
            ".homePostMenuDropdown"
        )
        .forEach(
            function(menu) {
                menu.classList.remove(
                    "visible"
                );

                menu.style.setProperty(
                    "display",
                    "none",
                    "important"
                );
            }
        );
}

function setupProfilePostMenu(
    postElement
) {
    const menuButton =
        postElement.querySelector(
            ".homePostMenuButton"
        );

    const menu =
        postElement.querySelector(
            ".homePostMenuDropdown"
        );

    if (
        !menuButton ||
        !menu
    ) {
        return;
    }

    menu.classList.remove(
        "visible"
    );

    menu.style.setProperty(
        "display",
        "none",
        "important"
    );

    menuButton.addEventListener(
        "click",
        function(event) {
            event.preventDefault();
            event.stopPropagation();

            const isVisible =
                menu.classList.contains(
                    "visible"
                );

            closeAllProfilePostMenus();

            if (!isVisible) {
                menu.classList.add(
                    "visible"
                );

                menu.style.setProperty(
                    "display",
                    "flex",
                    "important"
                );
            }
        }
    );

    menu.addEventListener(
        "click",
        function(event) {
            event.stopPropagation();
        }
    );
}

function createProfilePostElement(
    post
) {
    const profile =
        getCurrentProfile();

    const postElement =
        document.createElement(
            "article"
        );

    postElement.className =
        "profilePost homePost";

    postElement.dataset.postId =
        post.id;

    const displayName =
        profile.displayName ||
        "Display Name";

    const profilePicture =
        profile.profilePicture ||
        "";

    const safeDisplayName =
        escapeProfilePostHTML(
            displayName
        );

    const safeText =
        escapeProfilePostHTML(
            post.text || ""
        );

    let imageHTML = "";

    if (post.image) {
        imageHTML = `
            <div class="homePostImageWrapper">
                <img
                    src="${post.image}"
                    class="homePostImage"
                    alt="Post image"
                >
            </div>
        `;
    }

    postElement.innerHTML = `
        <div class="homePostHeader">
            <div class="homePostAuthorArea">
                <div class="homePostAvatar">
                    ${
                        profilePicture
                            ? `
                                <img
                                    src="${profilePicture}"
                                    alt="${safeDisplayName}"
                                >
                              `
                            : `
                                <span>
                                    ${safeDisplayName
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                              `
                    }
                </div>

                <div class="homePostAuthorDetails">
                    <div class="homePostAuthorName">
                        ${safeDisplayName}
                    </div>

                    <div class="homePostTimestamp">
                        ${formatProfilePostTime(
                            post.timestamp
                        )}
                    </div>
                </div>
            </div>

            <div class="homePostMenu">
                <button
                    type="button"
                    class="homePostMenuButton"
                    aria-label="Post options"
                >
                    ⋯
                </button>

                <div
                    class="homePostMenuDropdown"
                >
                    <button
                        type="button"
                        class="profileEditPostButton"
                    >
                        Edit post
                    </button>

                    <button
                        type="button"
                        class="profileDeletePostButton"
                    >
                        Delete post
                    </button>
                </div>
            </div>
        </div>

        <!-- PROFILE-ONLY CONTENT -->
        <div class="profilePostContent">
            ${
                safeText
                    ? `
                        <div class="profilePostText">
                            ${safeText}
                        </div>
                      `
                    : ""
            }

            ${imageHTML}
        </div>

        <div
            class="homePostReactionSummary"
            style="display: none;"
        >
            <span
                class="profileReactionCount"
            ></span>
        </div>

        <div class="homePostActions">
            <div class="profileReactionArea">
                <button
                    type="button"
                    class="
                        homePostActionButton
                        homeReactionButton
                        profileReactionButton
                    "
                >
                    React
                </button>

                <div
                    class="
                        homeReactionPicker
                        profileReactionPicker
                    "
                >
                    <button
                        type="button"
                        data-reaction="heart"
                        aria-label="Heart"
                    >
                        ❤️
                    </button>

                    <button
                        type="button"
                        data-reaction="laugh"
                        aria-label="Laugh"
                    >
                        😂
                    </button>

                    <button
                        type="button"
                        data-reaction="wow"
                        aria-label="Wow"
                    >
                        😮
                    </button>

                    <button
                        type="button"
                        data-reaction="sad"
                        aria-label="Sad"
                    >
                        😢
                    </button>

                    <button
                        type="button"
                        data-reaction="angry"
                        aria-label="Angry"
                    >
                        😡
                    </button>
                </div>
            </div>

            <button
                type="button"
                class="
                    homePostActionButton
                    homeCommentButton
                    profileCommentButton
            "
            >
                💬 Comment
            </button>

            <button
                type="button"
                class="
                    homePostActionButton
                    homeShareButton
                    profileShareButton
                "
            >
                ↗ Share
            </button>
        </div>

        <div
            class="profilePostComments"
            style="display: none;"
        ></div>
    `;

    const reactionButton =
        postElement.querySelector(
            ".profileReactionButton"
        );

    const reactionPicker =
        postElement.querySelector(
            ".profileReactionPicker"
        );

    if (reactionButton) {
        reactionButton.addEventListener(
            "click",
            function(event) {
                event.preventDefault();
                event.stopPropagation();
            }
        );
    }

    if (reactionPicker) {
        reactionPicker.addEventListener(
            "click",
            function(event) {
                const selectedButton =
                    event.target.closest(
                        "button[data-reaction]"
                    );

                if (!selectedButton) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                handleProfilePostReaction(
                    postElement,
                    selectedButton.dataset.reaction
                );
            }
        );
    }

    setupProfileReactionHover(
        postElement
    );

    setupProfilePostMenu(
        postElement
    );

    const editButton =
        postElement.querySelector(
            ".profileEditPostButton"
        );

    if (editButton) {
        editButton.addEventListener(
            "click",
            function(event) {
                event.stopPropagation();

                const newText =
                    prompt(
                        "Edit your post:",
                        post.text || ""
                    );

                if (
                    newText === null
                ) {
                    return;
                }

                post.text =
                    newText.trim();

                saveProfilePosts();

                displaySavedPosts();
            }
        );
    }

    const deleteButton =
        postElement.querySelector(
            ".profileDeletePostButton"
        );

    if (deleteButton) {
        deleteButton.addEventListener(
            "click",
            function(event) {
                event.stopPropagation();

                const confirmed =
                    confirm(
                        "Delete this post?"
                    );

                if (!confirmed) {
                    return;
                }

                profilePosts =
                    profilePosts.filter(
                        function(item) {
                            return (
                                String(
                                    item.id
                                ) !==
                                String(
                                    post.id
                                )
                            );
                        }
                    );

                saveProfilePosts();

                displaySavedPosts();
            }
        );
    }

    const commentButton =
        postElement.querySelector(
            ".profileCommentButton"
        );

    if (commentButton) {
        commentButton.addEventListener(
            "click",
            function() {
                let composer =
                    postElement.querySelector(
                        ".profileCommentComposer"
                    );

                if (composer) {
                    composer.remove();
                    return;
                }

                composer =
                    document.createElement(
                        "div"
                    );

                composer.className =
                    "profileCommentComposer";

                composer.innerHTML = `
                    <input
                        type="text"
                        class="profileCommentInput"
                        placeholder="Write a comment..."
                    >

                    <button
                        type="button"
                        class="profileCommentSubmitButton"
                    >
                        Post
                    </button>
                `;

                const commentsContainer =
                    postElement.querySelector(
                        ".profilePostComments"
                    );

                commentsContainer.style.display =
                    "block";

                commentsContainer.appendChild(
                    composer
                );

                const input =
                    composer.querySelector(
                        ".profileCommentInput"
                    );

                input.focus();

                composer
                    .querySelector(
                        ".profileCommentSubmitButton"
                    )
                    .addEventListener(
                        "click",
                        function() {
                            const text =
                                input.value.trim();

                            if (!text) {
                                return;
                            }

                            post.comments.push({
                                id:
                                    "profile-comment-" +
                                    Date.now() +
                                    "-" +
                                    Math.random()
                                        .toString(36)
                                        .slice(2),
                                text: text,
                                reactions:
                                    createCommentReactionData(),
                                replies: [],
                                timestamp:
                                    Date.now()
                            });

                            saveProfilePosts();

                            createProfileNotification(
                                "comment",
                                "commented on your post.",
                                post.text
                                    ? `"${post.text.slice(0, 80)}${post.text.length > 80 ? "..." : ""}"`
                                    : ""
                            );

                            displaySavedPosts();
                        }
                    );
            }
        );
    }

    const shareButton =
        postElement.querySelector(
            ".profileShareButton"
        );

    if (shareButton) {
        shareButton.addEventListener(
            "click",
            function() {
                if (
                    typeof sharePost ===
                    "function"
                ) {
                    sharePost(post);
                    return;
                }

                alert(
                    "Post sharing is available."
                );
            }
        );
    }

    renderProfileComments(
        postElement,
        post
    );

    updateProfileReactionButton(
        postElement,
        post.reactions.selected
    );

    updateProfileReactionCount(
        postElement,
        post.reactions
    );

    return postElement;
}

function renderProfileComments(
    postElement,
    post
) {
    const container =
        postElement.querySelector(
            ".profilePostComments"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !Array.isArray(
            post.comments
        )
    ) {
        return;
    }

    if (post.comments.length === 0) {
        return;
    }

    post.comments.forEach(
        function(comment) {
            const commentElement =
                createProfileCommentHTML(
                    comment
                );

            container.appendChild(
                commentElement
            );
        }
    );
}

document.addEventListener(
    "click",
    function(event) {

        const comment =
            event.target.closest(
                ".profileComment"
            );

        const reply =
            event.target.closest(
                ".profileReply"
            );

        if (
            !comment &&
            !reply
        ) {
            return;
        }

        const replyButton =
            event.target.closest(
                ".profileCommentReplyButton"
            );

        if (
            replyButton &&
            comment
        ) {
            const postElement =
                comment.closest(
                    ".profilePost"
                );

            if (!postElement) {
                return;
            }

            const post =
                profilePosts.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                postElement.dataset.postId
                            )
                        );
                    }
                );

            if (!post) {
                return;
            }

            const commentData =
                post.comments.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                comment.dataset.commentId
                            )
                        );
                    }
                );

            if (!commentData) {
                return;
            }

            let composer =
                comment.querySelector(
                    ".profileReplyComposer"
                );

            if (composer) {
                composer.remove();
                return;
            }

            composer =
                document.createElement(
                    "div"
                );

            composer.className =
                "profileReplyComposer";

            composer.innerHTML = `
                <input
                    type="text"
                    class="profileReplyInput"
                    placeholder="Write a reply..."
                >

                <button
                    type="button"
                    class="profileReplySubmitButton"
                >
                    Reply
                </button>
            `;

            comment.appendChild(
                composer
            );

            const input =
                composer.querySelector(
                    ".profileReplyInput"
                );

            input.focus();

            composer
                .querySelector(
                    ".profileReplySubmitButton"
                )
                .addEventListener(
                    "click",
                    function() {
                        const text =
                            input.value.trim();

                        if (!text) {
                            return;
                        }

                        commentData.replies.push({
                            id:
                                "profile-reply-" +
                                Date.now() +
                                "-" +
                                Math.random()
                                    .toString(36)
                                    .slice(2),
                            text: text,
                            reactions:
                                createCommentReactionData(),
                            timestamp:
                                Date.now()
                        });

                        saveProfilePosts();

                        createProfileNotification(
                            "reply",
                            "replied to your comment.",
                            commentData.text
                                ? `"${commentData.text.slice(0, 80)}${commentData.text.length > 80 ? "..." : ""}"`
                                : ""
                        );

                        displaySavedPosts();
                    }
                );

            return;
        }

        const editCommentButton =
            event.target.closest(
                ".profileCommentEditButton"
            );

        if (
            editCommentButton &&
            comment
        ) {
            const postElement =
                comment.closest(
                    ".profilePost"
                );

            if (!postElement) {
                return;
            }

            const post =
                profilePosts.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                postElement.dataset.postId
                            )
                        );
                    }
                );

            if (!post) {
                return;
            }

            const commentData =
                post.comments.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                comment.dataset.commentId
                            )
                        );
                    }
                );

            if (!commentData) {
                return;
            }

            const newText =
                prompt(
                    "Edit your comment:",
                    commentData.text || ""
                );

            if (
                newText === null
            ) {
                return;
            }

            commentData.text =
                newText.trim();

            saveProfilePosts();

            displaySavedPosts();

            return;
        }

        const deleteCommentButton =
            event.target.closest(
                ".profileCommentDeleteButton"
            );

        if (
            deleteCommentButton &&
            comment
        ) {
            const postElement =
                comment.closest(
                    ".profilePost"
                );

            if (!postElement) {
                return;
            }

            const post =
                profilePosts.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                postElement.dataset.postId
                            )
                        );
                    }
                );

            if (!post) {
                return;
            }

            const confirmed =
                confirm(
                    "Delete this comment?"
                );

            if (!confirmed) {
                return;
            }

            post.comments =
                post.comments.filter(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) !==
                            String(
                                comment.dataset.commentId
                            )
                        );
                    }
                );

            saveProfilePosts();

            displaySavedPosts();

            return;
        }

        const editReplyButton =
            event.target.closest(
                ".profileReplyEditButton"
            );

        if (
            editReplyButton &&
            reply
        ) {
            const postElement =
                reply.closest(
                    ".profilePost"
                );

            const commentElement =
                reply.closest(
                    ".profileComment"
                );

            if (
                !postElement ||
                !commentElement
            ) {
                return;
            }

            const post =
                profilePosts.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                postElement.dataset.postId
                            )
                        );
                    }
                );

            if (!post) {
                return;
            }

            const commentData =
                post.comments.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                commentElement.dataset.commentId
                            )
                        );
                    }
                );

            if (!commentData) {
                return;
            }

            const replyData =
                commentData.replies.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                reply.dataset.replyId
                            )
                        );
                    }
                );

            if (!replyData) {
                return;
            }

            const newText =
                prompt(
                    "Edit your reply:",
                    replyData.text || ""
                );

            if (
                newText === null
            ) {
                return;
            }

            replyData.text =
                newText.trim();

            saveProfilePosts();

            displaySavedPosts();

            return;
        }

        const deleteReplyButton =
            event.target.closest(
                ".profileReplyDeleteButton"
            );

        if (
            deleteReplyButton &&
            reply
        ) {
            const postElement =
                reply.closest(
                    ".profilePost"
                );

            const commentElement =
                reply.closest(
                    ".profileComment"
                );

            if (
                !postElement ||
                !commentElement
            ) {
                return;
            }

            const post =
                profilePosts.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                postElement.dataset.postId
                            )
                        );
                    }
                );

            if (!post) {
                return;
            }

            const commentData =
                post.comments.find(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                commentElement.dataset.commentId
                            )
                        );
                    }
                );

            if (!commentData) {
                return;
            }

            const confirmed =
                confirm(
                    "Delete this reply?"
                );

            if (!confirmed) {
                return;
            }

            commentData.replies =
                commentData.replies.filter(
                    function(item) {
                        return (
                            String(
                                item.id
                            ) !==
                            String(
                                reply.dataset.replyId
                            )
                        );
                    }
                );

            saveProfilePosts();

            displaySavedPosts();

            return;
        }
    }
);

document.addEventListener(
    "click",
    function() {
        closeAllProfilePostMenus();
    }
);

function displaySavedPosts() {
    if (!profilePostList) {
        return;
    }

    profilePostList.innerHTML = "";

    if (
        profilePosts.length === 0
    ) {
        return;
    }

    profilePosts.forEach(
        function(post) {
            const postElement =
                createProfilePostElement(
                    post
                );

            profilePostList.appendChild(
                postElement
            );
        }
    );

    if (
        typeof restoreAllReactions ===
        "function"
    ) {
        setTimeout(
            function() {
                restoreAllReactions();
            },
            50
        );
    }

    refreshProfilePostTimes();
}

function createProfilePost() {
    if (!profilePostInput) {
        return;
    }

    const text =
        profilePostInput.value.trim();

    const imageFile =
        profilePostImage &&
        profilePostImage.files
            ? profilePostImage.files[0]
            : null;

    if (
        !text &&
        !imageFile
    ) {
        return;
    }

    function finishCreatingPost(
        imageData
    ) {
        const newPost =
            normalizeProfilePost({
                id:
                    "profile-post-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .slice(2),
                text: text,
                image:
                    imageData || "",
                timestamp:
                    Date.now(),
                reactions:
                    createProfileReactionData(),
                comments: []
            });

        profilePosts.unshift(
            newPost
        );

        saveProfilePosts();

        profilePostInput.value = "";

        if (profilePostImage) {
            profilePostImage.value = "";
        }

        displaySavedPosts();
    }

    if (imageFile) {
        const reader =
            new FileReader();

        reader.onload =
            function(event) {
                finishCreatingPost(
                    event.target.result
                );
            };

        reader.onerror =
            function(error) {
                console.error(
                    "Could not read profile post image:",
                    error
                );
            };

        reader.readAsDataURL(
            imageFile
        );
    } else {
        finishCreatingPost("");
    }
}

if (profilePostButton) {
    profilePostButton.addEventListener(
        "click",
        createProfilePost
    );
}

if (profilePostInput) {
    profilePostInput.addEventListener(
        "keydown",
        function(event) {
            if (
                event.key === "Enter" &&
                (
                    event.ctrlKey ||
                    event.metaKey
                )
            ) {
                event.preventDefault();
                createProfilePost();
            }
        }
    );
}

displaySavedPosts();