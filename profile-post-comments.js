const profilePosts =
document.getElementById("profilePostList");


profilePosts.addEventListener(
"click",
function(event) {


    const clickedButton =
    event.target;


    if (
        clickedButton.classList.contains(
            "profileCommentButton"
        )
    ) {


        const post =
        clickedButton.closest(
            ".profilePost"
        );


        if (!post) {

            return;

        }


        const existingCommentBox =
        post.querySelector(
            ".profileCommentBox"
        );


        if (existingCommentBox) {

            return;

        }


        const commentBox =
        document.createElement("div");


        commentBox.className =
        "profileCommentBox";


        commentBox.innerHTML = `

            <br>

            <textarea
                class="profileCommentInput"
                placeholder="Write a comment..."
            ></textarea>

            <br><br>

            <button
                class="profileAddCommentButton"
            >
                Comment
            </button>

            <div
                class="profileCommentList"
            ></div>

        `;


        post.appendChild(
            commentBox
        );


        return;

    }



    if (
        clickedButton.classList.contains(
            "profileAddCommentButton"
        )
    ) {


        const commentBox =
        clickedButton.closest(
            ".profileCommentBox"
        );


        if (!commentBox) {

            return;

        }


        const commentInput =
        commentBox.querySelector(
            ".profileCommentInput"
        );


        const commentList =
        commentBox.querySelector(
            ".profileCommentList"
        );


        const commentText =
        commentInput.value.trim();


        if (
            commentText === ""
        ) {

            return;

        }


        let profileName =
        "Display Name";


        const savedProfile =
        localStorage.getItem(
            "roleverseProfile"
        );


        if (savedProfile) {

            try {

                const profileData =
                JSON.parse(savedProfile);


                if (profileData.displayName) {

                    profileName =
                    profileData.displayName;

                }

            } catch (error) {

                profileName =
                "Display Name";

            }

        }


        const newComment =
        document.createElement("div");


        newComment.className =
        "profileComment";


        newComment.innerHTML = `

            <p>

                <strong>
                    ${profileName}
                </strong>

                <br>

                ${commentText}

            </p>


            <button
                class="profileCommentReactionButton"
            >
                React
            </button>


            <div
                class="profileCommentReactionPicker"
                style="display: none;"
            >

                <button
                    class="profileCommentReaction"
                    data-reaction="heart"
                >
                    &#x2764;&#xFE0F;
                </button>

                <button
                    class="profileCommentReaction"
                    data-reaction="laugh"
                >
                    &#x1F602;
                </button>

                <button
                    class="profileCommentReaction"
                    data-reaction="wow"
                >
                    &#x1F62E;
                </button>

                <button
                    class="profileCommentReaction"
                    data-reaction="sad"
                >
                    &#x1F622;
                </button>

                <button
                    class="profileCommentReaction"
                    data-reaction="angry"
                >
                    &#x1F621;
                </button>

            </div>


            <p
                class="profileCommentReactionCount"
            >

                &#x2764;&#xFE0F; 0

                &nbsp;&nbsp;&nbsp;

                &#x1F602; 0

                &nbsp;&nbsp;&nbsp;

                &#x1F62E; 0

                &nbsp;&nbsp;&nbsp;

                &#x1F622; 0

                &nbsp;&nbsp;&nbsp;

                &#x1F621; 0

            </p>

        `;


        commentList.appendChild(
            newComment
        );


        commentInput.value = "";

    }

});