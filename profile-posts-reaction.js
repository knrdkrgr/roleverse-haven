const profilePosts =
document.getElementById("profilePostList");

const reactionEmojis = {


heart: "&#x2764;&#xFE0F;",
laugh: "&#x1F602;",
wow: "&#x1F62E;",
sad: "&#x1F622;",
angry: "&#x1F621;"


};

profilePosts.addEventListener("click", function(event) {


const reactionButton =
    event.target.closest(
        ".profileReactionButton"
    );


if (reactionButton) {

    const post =
        reactionButton.closest(
            ".profilePost"
        );


    const picker =
        post.querySelector(
            ".profileReactionPicker"
        );


    if (
        picker.style.display === "block"
    ) {

        picker.style.display = "none";

    } else {

        picker.style.display = "block";

    }


    return;

}


const reaction =
    event.target.closest(
        ".profileReaction"
    );


if (!reaction) {

    return;

}


const post =
    reaction.closest(
        ".profilePost"
    );


const reactionCount =
    post.querySelector(
        ".profileReactionCount"
    );


const newReaction =
    reaction.dataset.reaction;


if (!post.reactionCounts) {

    post.reactionCounts = {

        heart: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0

    };

    post.selectedReaction = null;

}


if (
    post.selectedReaction === newReaction
) {

    post.reactionCounts[newReaction]--;

    post.selectedReaction = null;


    post.querySelector(
        ".profileReactionButton"
    ).innerHTML = "React";


} else {


    if (
        post.selectedReaction !== null
    ) {

        post.reactionCounts[
            post.selectedReaction
        ]--;

    }


    post.reactionCounts[newReaction]++;

    post.selectedReaction =
        newReaction;


    post.querySelector(
        ".profileReactionButton"
    ).innerHTML =
        reactionEmojis[newReaction];

}


reactionCount.innerHTML =

    reactionEmojis.heart +
    " " +
    post.reactionCounts.heart +

    "&nbsp;&nbsp;&nbsp;" +

    reactionEmojis.laugh +
    " " +
    post.reactionCounts.laugh +

    "&nbsp;&nbsp;&nbsp;" +

    reactionEmojis.wow +
    " " +
    post.reactionCounts.wow +

    "&nbsp;&nbsp;&nbsp;" +

    reactionEmojis.sad +
    " " +
    post.reactionCounts.sad +

    "&nbsp;&nbsp;&nbsp;" +

    reactionEmojis.angry +
    " " +
    post.reactionCounts.angry;


post.querySelector(
    ".profileReactionPicker"
).style.display = "none";


});