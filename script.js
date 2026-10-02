const reactionButton = document.getElementById("reactionButton");
const reactionPicker = document.getElementById("reactionPicker");
const reactionCount = document.getElementById("reactionCount");
const reactions = document.querySelectorAll(".reaction");

let reactionCounts = {
    "❤️": 8,
    "😂": 3,
    "😮": 2,
    "😢": 1,
    "😡": 0
};

let selectedReaction = null;

reactionButton.addEventListener("click", function() {

    if (reactionPicker.style.display === "none") {
        reactionPicker.style.display = "block";
    } else {
        reactionPicker.style.display = "none";
    }

});

reactions.forEach(function(reaction) {

    reaction.addEventListener("click", function() {

        const newReaction = reaction.dataset.reaction;

        if (selectedReaction === newReaction) {

            reactionCounts[newReaction]--;

            selectedReaction = null;

            reactionButton.textContent = "React";

        } else {

            if (selectedReaction !== null) {
                reactionCounts[selectedReaction]--;
            }

            reactionCounts[newReaction]++;

            selectedReaction = newReaction;

            reactionButton.textContent = newReaction;

        }

        reactionPicker.style.display = "none";

        reactionCount.textContent =
            "❤️ " + reactionCounts["❤️"] + "   " +
            "😂 " + reactionCounts["😂"] + "   " +
            "😮 " + reactionCounts["😮"] + "   " +
            "😢 " + reactionCounts["😢"] + "   " +
            "😡 " + reactionCounts["😡"];

    });

});

const commentInput = document.getElementById("commentInput");
const commentButton = document.getElementById("commentButton");
const commentList = document.getElementById("commentList");

commentButton.addEventListener("click", function() {

    const commentText = commentInput.value.trim();

    if (commentText === "") {
        return;
    }

    const newComment = document.createElement("section");

    newComment.className = "comment";

    newComment.innerHTML = `
        <p>
            <strong>You</strong>
        </p>

        <p>
            ${commentText}
        </p>

        <button class="commentReactionButton">React</button>

        <div class="commentReactionPicker" style="display: none;">

            <button class="commentReaction" data-reaction="❤️">❤️</button>
            <button class="commentReaction" data-reaction="😂">😂</button>
            <button class="commentReaction" data-reaction="😮">😮</button>
            <button class="commentReaction" data-reaction="😢">😢</button>
            <button class="commentReaction" data-reaction="😡">😡</button>

        </div>

        <p class="commentReactionCount">
            ❤️ 0 &nbsp;
            😂 0 &nbsp;
            😮 0 &nbsp;
            😢 0 &nbsp;
            😡 0
        </p>
    `;

    commentList.appendChild(newComment);

    commentInput.value = "";

});

const commentReactionButtons = document.querySelectorAll(".commentReactionButton");

commentReactionButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const picker = button.nextElementSibling;

        if (picker.style.display === "none") {
            picker.style.display = "block";
        } else {
            picker.style.display = "none";
        }

    });

});

const commentReactionData = new WeakMap();

document.querySelectorAll(".comment").forEach(function(comment) {

    const counts = {
        "❤️": 2,
        "😂": 1,
        "😮": 0,
        "😢": 0,
        "😡": 0
    };

    let selectedReaction = null;

    commentReactionData.set(comment, {
        counts: counts,
        selectedReaction: selectedReaction
    });

    const reactions = comment.querySelectorAll(".commentReaction");
    const reactionCount = comment.querySelector(".commentReactionCount");
    const picker = comment.querySelector(".commentReactionPicker");
    const button = comment.querySelector(".commentReactionButton");

    reactions.forEach(function(reaction) {

        reaction.addEventListener("click", function() {

            const newReaction = reaction.dataset.reaction;

            if (selectedReaction === newReaction) {

                counts[newReaction]--;

                selectedReaction = null;

                button.textContent = "React";

            } else {

                if (selectedReaction !== null) {
                    counts[selectedReaction]--;
                }

                counts[newReaction]++;

                selectedReaction = newReaction;

                button.textContent = newReaction;

            }

            reactionCount.textContent =
                "❤️ " + counts["❤️"] + "   " +
                "😂 " + counts["😂"] + "   " +
                "😮 " + counts["😮"] + "   " +
                "😢 " + counts["😢"] + "   " +
                "😡 " + counts["😡"];

            picker.style.display = "none";

        });

    });

});

commentList.addEventListener("click", function(event) {

    if (!event.target.classList.contains("commentReactionButton")) {
        return;
    }

    const button = event.target;
    const comment = button.closest(".comment");

    const picker = comment.querySelector(".commentReactionPicker");

    if (picker.style.display === "none") {
        picker.style.display = "block";
    } else {
        picker.style.display = "none";
    }

});

commentList.addEventListener("click", function(event) {

    if (!event.target.classList.contains("commentReaction")) {
        return;
    }

    const reaction = event.target;
    const comment = reaction.closest(".comment");

    const reactionCount = comment.querySelector(".commentReactionCount");

    if (!comment.reactionCounts) {

        comment.reactionCounts = {
            "❤️": 0,
            "😂": 0,
            "😮": 0,
            "😢": 0,
            "😡": 0
        };

        comment.selectedReaction = null;

    }

    const newReaction = reaction.dataset.reaction;

    if (comment.selectedReaction === newReaction) {

        comment.reactionCounts[newReaction]--;

        comment.selectedReaction = null;

    } else {

        if (comment.selectedReaction !== null) {
            comment.reactionCounts[comment.selectedReaction]--;
        }

        comment.reactionCounts[newReaction]++;

        comment.selectedReaction = newReaction;

    }

    reactionCount.textContent =
        "❤️ " + comment.reactionCounts["❤️"] + "   " +
        "😂 " + comment.reactionCounts["😂"] + "   " +
        "😮 " + comment.reactionCounts["😮"] + "   " +
        "😢 " + comment.reactionCounts["😢"] + "   " +
        "😡 " + comment.reactionCounts["😡"];

    comment.querySelector(".commentReactionPicker").style.display = "none";

});

const postInput = document.getElementById("postInput");
const postButton = document.getElementById("postButton");
const postList = document.getElementById("postList");

postButton.addEventListener("click", function() {

    const postText = postInput.value.trim();

    if (postText === "") {
        return;
    }

    const newPost = document.createElement("section");

    newPost.innerHTML = `
        <h3>You</h3>

        <p>
            ${postText}
        </p>

        <button>React</button>
        <button>Comment</button>
        <button>Share</button>
    `;

    postList.prepend(newPost);

    postInput.value = "";

});