// =========================================
// ROLEVERSE HAVEN
// PROFILE HOVER SYSTEM
// =========================================


// =========================================
// PROFILE DATA
// =========================================

function getHoverProfileData() {

    let profile = {

        displayName: "Display Name",

        bio: "Roleplayer | Writer | Character enthusiast",

        description:
            "A short introduction about this roleplayer will appear here.",

        profilePicture: "",

        followers: 0,

        following: 0

    };


    const savedProfile =
        localStorage.getItem("roleverseProfile");


    if (savedProfile) {

        try {

            const savedData =
                JSON.parse(savedProfile);


            if (
                typeof savedData.displayName === "string"
            ) {

                profile.displayName =
                    savedData.displayName;

            }


            if (
                typeof savedData.bio === "string"
            ) {

                profile.bio =
                    savedData.bio;

            }


            if (
                typeof savedData.description === "string"
            ) {

                profile.description =
                    savedData.description;

            }


            if (
                typeof savedData.profilePicture === "string"
            ) {

                profile.profilePicture =
                    savedData.profilePicture;

            }


            if (
                typeof savedData.followers === "number"
            ) {

                profile.followers =
                    savedData.followers;

            }


            if (
                typeof savedData.following === "number"
            ) {

                profile.following =
                    savedData.following;

            }

        } catch (error) {

            console.error(
                "Could not load profile hover data:",
                error
            );

        }

    }


    return profile;

}


// =========================================
// FRIEND DATA
// =========================================

function getHoverFriendData() {

    let friendData = {

        friends: 0

    };


    const savedFriendData =
        localStorage.getItem("roleverseFriendData");


    if (savedFriendData) {

        try {

            const savedData =
                JSON.parse(savedFriendData);


            if (
                typeof savedData.friends === "number"
            ) {

                friendData.friends =
                    savedData.friends;

            }

        } catch (error) {

            console.error(
                "Could not load hover friend data:",
                error
            );

        }

    }


    return friendData;

}


// =========================================
// CREATE HOVER CARD
// =========================================

function createProfileHoverCard() {

    const existingCard =
        document.getElementById(
            "roleverseProfileHoverCard"
        );


    if (existingCard) {

        return existingCard;

    }


    const card =
        document.createElement("div");


    card.id =
        "roleverseProfileHoverCard";


    card.className =
        "roleverseProfileHoverCard";


    card.setAttribute(
        "aria-hidden",
        "true"
    );


    card.innerHTML = `

        <div class="profileHoverCardInner">

            <div class="profileHoverAvatarWrapper">

                <div class="profileHoverAvatar">

                    <span
                        class="profileHoverAvatarFallback"
                    >
                        👤
                    </span>

                    <img
                        class="profileHoverAvatarImage"
                        alt="Profile Picture"
                    >

                </div>

            </div>


            <div class="profileHoverInformation">

                <div
                    class="profileHoverName"
                >
                    Display Name
                </div>


                <div
                    class="profileHoverBio"
                >
                    Roleplayer | Writer | Character enthusiast
                </div>


                <div
                    class="profileHoverStats"
                >

                    <span>

                        <strong
                            class="profileHoverFriendCount"
                        >
                            0
                        </strong>

                        Friends

                    </span>


                    <span>

                        <strong
                            class="profileHoverFollowerCount"
                        >
                            0
                        </strong>

                        Followers

                    </span>

                </div>


                <button
                    type="button"
                    class="profileHoverViewButton"
                >
                    View Profile
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(card);


    return card;

}


// =========================================
// UPDATE HOVER CARD
// =========================================

function updateProfileHoverCard() {

    const card =
        createProfileHoverCard();


    const profile =
        getHoverProfileData();


    const friendData =
        getHoverFriendData();


    const nameElement =
        card.querySelector(
            ".profileHoverName"
        );


    const bioElement =
        card.querySelector(
            ".profileHoverBio"
        );


    const friendCount =
        card.querySelector(
            ".profileHoverFriendCount"
        );


    const followerCount =
        card.querySelector(
            ".profileHoverFollowerCount"
        );


    const avatarImage =
        card.querySelector(
            ".profileHoverAvatarImage"
        );


    const avatarFallback =
        card.querySelector(
            ".profileHoverAvatarFallback"
        );


    if (nameElement) {

        nameElement.textContent =
            profile.displayName;

    }


    if (bioElement) {

        bioElement.textContent =
            profile.bio;

    }


    if (friendCount) {

        friendCount.textContent =
            friendData.friends;

    }


    if (followerCount) {

        followerCount.textContent =
            profile.followers;

    }


    if (
        avatarImage &&
        avatarFallback
    ) {

        if (
            profile.profilePicture &&
            profile.profilePicture.length > 0
        ) {

            avatarImage.src =
                profile.profilePicture;

            avatarImage.style.display =
                "block";

            avatarFallback.style.display =
                "none";

        } else {

            avatarImage.removeAttribute(
                "src"
            );

            avatarImage.style.display =
                "none";

            avatarFallback.style.display =
                "flex";

        }

    }

}


// =========================================
// POSITION HOVER CARD
// =========================================

function positionProfileHoverCard(target) {

    const card =
        document.getElementById(
            "roleverseProfileHoverCard"
        );


    if (!card || !target) {

        return;

    }


    const rect =
        target.getBoundingClientRect();


    const cardWidth =
        320;


    const gap =
        10;


    let left =
        rect.left;


    let top =
        rect.bottom + gap;


    if (
        left + cardWidth >
        window.innerWidth - 16
    ) {

        left =
            window.innerWidth -
            cardWidth -
            16;

    }


    if (left < 16) {

        left = 16;

    }


    // =====================================
    // IF THERE IS NOT ENOUGH SPACE BELOW
    // =====================================

    const estimatedCardHeight =
        250;


    if (
        top + estimatedCardHeight >
        window.innerHeight - 16
    ) {

        top =
            rect.top -
            estimatedCardHeight -
            gap;

    }


    if (top < 16) {

        top = 16;

    }


    card.style.left =
        `${left}px`;


    card.style.top =
        `${top}px`;

}


// =========================================
// SHOW HOVER CARD
// =========================================

let hoverShowTimer =
    null;


let hoverHideTimer =
    null;


function showProfileHoverCard(target) {

    clearTimeout(
        hoverHideTimer
    );


    clearTimeout(
        hoverShowTimer
    );


    hoverShowTimer =
        setTimeout(
            function() {

                updateProfileHoverCard();

                positionProfileHoverCard(
                    target
                );


                const card =
                    document.getElementById(
                        "roleverseProfileHoverCard"
                    );


                if (!card) {

                    return;

                }


                card.classList.add(
                    "visible"
                );


                card.setAttribute(
                    "aria-hidden",
                    "false"
                );

            },
            350
        );

}


// =========================================
// HIDE HOVER CARD
// =========================================

function hideProfileHoverCard() {

    clearTimeout(
        hoverShowTimer
    );


    clearTimeout(
        hoverHideTimer
    );


    hoverHideTimer =
        setTimeout(
            function() {

                const card =
                    document.getElementById(
                        "roleverseProfileHoverCard"
                    );


                if (!card) {

                    return;

                }


                card.classList.remove(
                    "visible"
                );


                card.setAttribute(
                    "aria-hidden",
                    "true"
                );

            },
            180
        );

}


// =========================================
// PROFILE NAME SELECTORS
// =========================================
//
// These are existing elements from the
// current Roleverse Haven pages.
//
// We do not modify home.js.
//

function isProfileNameElement(element) {

    if (!element) {

        return false;

    }


    return (
        element.matches(
            ".homePostAuthorName"
        ) ||

        element.matches(
            "#profileName"
        ) ||

        element.matches(
            "#homeProfileName"
        ) ||

        element.matches(
            "#composerName"
        )
    );

}


// =========================================
// PROFILE NAME ENHANCEMENT
// =========================================

function enhanceProfileName(element) {

    if (!element) {

        return;

    }


    if (
        element.dataset.profileHoverReady ===
        "true"
    ) {

        return;

    }


    element.dataset.profileHoverReady =
        "true";


    element.classList.add(
        "profileNameLink"
    );


    element.setAttribute(
        "role",
        "link"
    );


    element.setAttribute(
        "tabindex",
        "0"
    );

}


// =========================================
// MOUSE ENTER
// =========================================

document.addEventListener(
    "mouseover",
    function(event) {

        const target =
            event.target.closest(
                ".homePostAuthorName, #profileName, #homeProfileName, #composerName"
            );


        if (!target) {

            return;

        }


        enhanceProfileName(target);


        showProfileHoverCard(
            target
        );

    }
);


// =========================================
// MOUSE LEAVE
// =========================================

document.addEventListener(
    "mouseout",
    function(event) {

        const target =
            event.target.closest(
                ".homePostAuthorName, #profileName, #homeProfileName, #composerName"
            );


        if (!target) {

            return;

        }


        const relatedTarget =
            event.relatedTarget;


        if (
            relatedTarget &&
            target.contains(
                relatedTarget
            )
        ) {

            return;

        }


        hideProfileHoverCard();

    }
);


// =========================================
// HOVER CARD MOUSE ENTER
// =========================================

document.addEventListener(
    "mouseover",
    function(event) {

        const card =
            event.target.closest(
                "#roleverseProfileHoverCard"
            );


        if (!card) {

            return;

        }


        clearTimeout(
            hoverHideTimer
        );

    }
);


// =========================================
// HOVER CARD MOUSE LEAVE
// =========================================

document.addEventListener(
    "mouseout",
    function(event) {

        const card =
            event.target.closest(
                "#roleverseProfileHoverCard"
            );


        if (!card) {

            return;

        }


        const relatedTarget =
            event.relatedTarget;


        if (
            relatedTarget &&
            card.contains(
                relatedTarget
            )
        ) {

            return;

        }


        hideProfileHoverCard();

    }
);


// =========================================
// CLICK PROFILE NAME
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const target =
            event.target.closest(
                ".homePostAuthorName, #profileName, #homeProfileName, #composerName"
            );


        if (!target) {

            return;

        }


        window.location.href =
            "profile.html";

    }
);


// =========================================
// KEYBOARD ACCESS
// =========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !== "Enter" &&
            event.key !== " "
        ) {

            return;

        }


        const target =
            event.target.closest(
                ".homePostAuthorName, #profileName, #homeProfileName, #composerName"
            );


        if (!target) {

            return;

        }


        event.preventDefault();


        window.location.href =
            "profile.html";

    }
);


// =========================================
// VIEW PROFILE BUTTON
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".profileHoverViewButton"
            );


        if (!button) {

            return;

        }


        window.location.href =
            "profile.html";

    }
);


// =========================================
// KEEP CARD INSIDE VIEWPORT
// =========================================

window.addEventListener(
    "resize",
    function() {

        const card =
            document.getElementById(
                "roleverseProfileHoverCard"
            );


        if (!card) {

            return;

        }


        if (
            !card.classList.contains(
                "visible"
            )
        ) {

            return;

        }


        card.classList.remove(
            "visible"
        );

    }
);


// =========================================
// INITIALIZE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        createProfileHoverCard();

    }
);