const editProfileButton =
document.getElementById("editProfileButton");

const profileName =
document.getElementById("profileName");

const profileBio =
document.getElementById("profileBio");

const profileDescription =
document.getElementById("profileDescription");

const profilePicture =
document.getElementById("profilePicture");

const profilePictureInput =
document.getElementById("profilePictureInput");

const profilePictureViewerButton =
document.getElementById("profilePictureViewerButton");

const profilePictureViewer =
document.getElementById("profilePictureViewer");

const profilePictureViewerImage =
document.getElementById("profilePictureViewerImage");

const closeProfilePictureViewer =
document.getElementById("closeProfilePictureViewer");

const profileCover =
document.getElementById("profileCover");

const coverPhotoInput =
document.getElementById("coverPhotoInput");

const coverAdjustControls =
document.getElementById("coverAdjustControls");

const coverPositionInput =
document.getElementById("coverPositionInput");

const coverSaveButton =
document.getElementById("coverSaveButton");

const coverCancelButton =
document.getElementById("coverCancelButton");

const addFriendButton =
document.getElementById("addFriendButton");

const friendCount =
document.getElementById("friendCount");

const followButton =
document.getElementById("followButton");

const followerCount =
document.getElementById("followerCount");

// =========================================
// DEFAULT PROFILE DATA
// =========================================

let profileData = {


displayName: "Display Name",

bio: "Roleplayer | Writer | Character enthusiast",

description:
    "A short introduction about this roleplayer will appear here.",

profilePicture: "",

coverPhoto: "",

coverPosition: 50,

followers: 0,

following: 0,

isFollowing: false


};

// =========================================
// FRIEND DATA
// KEPT SEPARATE FROM PROFILE DATA
// =========================================

let friendData = {


friends: 0,

friendStatus: "none"


};

// =========================================
// TEMPORARY COVER POSITION
// =========================================

let temporaryCoverPosition = 50;

// =========================================
// LOAD SAVED PROFILE DATA
// =========================================

const savedProfile =
localStorage.getItem("roleverseProfile");

if (savedProfile) {


try {

    const savedData =
        JSON.parse(savedProfile);


    // =====================================
    // TEXT PROFILE DATA
    // =====================================

    if (
        typeof savedData.displayName === "string"
    ) {

        profileData.displayName =
            savedData.displayName;

    }


    if (
        typeof savedData.bio === "string"
    ) {

        profileData.bio =
            savedData.bio;

    }


    if (
        typeof savedData.description === "string"
    ) {

        profileData.description =
            savedData.description;

    }


    // =====================================
    // PROFILE PICTURE
    // =====================================

    if (
        typeof savedData.profilePicture === "string"
    ) {

        profileData.profilePicture =
            savedData.profilePicture;

    }


    // =====================================
    // COVER PHOTO
    // =====================================

    if (
        typeof savedData.coverPhoto === "string"
    ) {

        profileData.coverPhoto =
            savedData.coverPhoto;

    }


    // =====================================
    // COVER POSITION
    // =====================================

    if (
        typeof savedData.coverPosition === "number"
    ) {

        profileData.coverPosition =
            savedData.coverPosition;

    }


    // =====================================
    // FOLLOWERS / FOLLOWING
    // =====================================

    if (
        typeof savedData.followers === "number"
    ) {

        profileData.followers =
            savedData.followers;

    }


    if (
        typeof savedData.following === "number"
    ) {

        profileData.following =
            savedData.following;

    }


    // =====================================
    // FOLLOWING STATE
    // =====================================

    if (
        typeof savedData.isFollowing === "boolean"
    ) {

        profileData.isFollowing =
            savedData.isFollowing;

    }

} catch (error) {

    console.error(
        "Could not load saved profile data:",
        error
    );

}


}

// =========================================
// LOAD FRIEND DATA
// =========================================

const savedFriendData =
localStorage.getItem("roleverseFriendData");

if (savedFriendData) {


try {

    const savedFriends =
        JSON.parse(savedFriendData);


    if (
        typeof savedFriends.friends === "number"
    ) {

        friendData.friends =
            savedFriends.friends;

    }


    if (
        savedFriends.friendStatus === "none" ||
        savedFriends.friendStatus === "pending" ||
        savedFriends.friendStatus === "friends"
    ) {

        friendData.friendStatus =
            savedFriends.friendStatus;

    }

} catch (error) {

    console.error(
        "Could not load saved friend data:",
        error
    );

}


}

// =========================================
// DISPLAY PROFILE
// =========================================

function displayProfile() {


// =====================================
// NAME
// =====================================

if (profileName) {

    profileName.textContent =
        profileData.displayName;

}


// =====================================
// BIO
// =====================================

if (profileBio) {

    profileBio.textContent =
        profileData.bio;

}


// =====================================
// DESCRIPTION
// =====================================

if (profileDescription) {

    profileDescription.textContent =
        profileData.description;

}


// =====================================
// FRIEND COUNT
// =====================================

if (friendCount) {

    friendCount.textContent =
        friendData.friends;

}


// =====================================
// FOLLOWER COUNT
// =====================================

if (followerCount) {

    followerCount.textContent =
        profileData.followers;

}


// =====================================
// FOLLOWING COUNT
// =====================================

const followingCount =
    document.getElementById("followingCount");


if (followingCount) {

    followingCount.textContent =
        profileData.following;

}


// =====================================
// FRIEND BUTTON
// =====================================

if (addFriendButton) {

    addFriendButton.classList.remove(
        "friendActive"
    );


    if (
        friendData.friendStatus === "friends"
    ) {

        addFriendButton.textContent =
            "Friends";

        addFriendButton.classList.add(
            "friendActive"
        );

    } else if (
        friendData.friendStatus === "pending"
    ) {

        addFriendButton.textContent =
            "Friend Request Sent";

    } else {

        addFriendButton.textContent =
            "Add Friend";

    }

}


// =====================================
// FOLLOW BUTTON
// =====================================

if (followButton) {

    if (profileData.isFollowing) {

        followButton.textContent =
            "Following";

    } else {

        followButton.textContent =
            "Follow";

    }

}


// =====================================
// PROFILE PICTURE
// =====================================

if (profilePicture) {

    if (
        profileData.profilePicture &&
        profileData.profilePicture.length > 0
    ) {

        profilePicture.src =
            profileData.profilePicture;

        profilePicture.style.display =
            "block";

    } else {

        profilePicture.removeAttribute(
            "src"
        );

    }

}


// =====================================
// COVER PHOTO
// =====================================

if (profileCover) {

    if (
        profileData.coverPhoto &&
        profileData.coverPhoto.length > 0
    ) {

        profileCover.style.backgroundImage =
            `url("${profileData.coverPhoto}")`;

        profileCover.style.backgroundSize =
            "cover";

        profileCover.style.backgroundPosition =
            `${profileData.coverPosition}% center`;

    } else {

        profileCover.style.backgroundImage =
            "linear-gradient(135deg, #e9e9e9, #f6f6f6)";

        profileCover.style.backgroundSize =
            "cover";

        profileCover.style.backgroundPosition =
            "center";

    }

}


// =====================================
// COVER SLIDER
// =====================================

if (coverPositionInput) {

    coverPositionInput.value =
        profileData.coverPosition;

}


}

// =========================================
// SAVE PROFILE DATA
// =========================================

function saveProfile() {


try {

    localStorage.setItem(
        "roleverseProfile",
        JSON.stringify(profileData)
    );

    return true;

} catch (error) {

    console.error(
        "Could not save profile data:",
        error
    );

    return false;

}


}

// =========================================
// SAVE FRIEND DATA
// =========================================

function saveFriendData() {


try {

    localStorage.setItem(
        "roleverseFriendData",
        JSON.stringify(friendData)
    );

    return true;

} catch (error) {

    console.error(
        "Could not save friend data:",
        error
    );

    return false;

}


}

// =========================================
// INITIAL DISPLAY
// =========================================

displayProfile();

// =========================================
// EDIT PROFILE
// =========================================

if (editProfileButton) {


editProfileButton.addEventListener(
    "click",
    function() {

        const newDisplayName =
            prompt(
                "Enter your Display Name:",
                profileData.displayName
            );


        if (newDisplayName === null) {

            return;

        }


        const newBio =
            prompt(
                "Enter your short bio:",
                profileData.bio
            );


        if (newBio === null) {

            return;

        }


        const newDescription =
            prompt(
                "Tell people about yourself:",
                profileData.description
            );


        if (newDescription === null) {

            return;

        }


        if (
            newDisplayName.trim() !== ""
        ) {

            profileData.displayName =
                newDisplayName.trim();

        }


        if (
            newBio.trim() !== ""
        ) {

            profileData.bio =
                newBio.trim();

        }


        if (
            newDescription.trim() !== ""
        ) {

            profileData.description =
                newDescription.trim();

        }


        displayProfile();

        saveProfile();

    }
);


}

// =========================================
// CHANGE PROFILE PICTURE
// =========================================

if (profilePictureInput) {


profilePictureInput.addEventListener(
    "change",
    function() {

        const imageFile =
            profilePictureInput.files[0];


        if (!imageFile) {

            return;

        }


        if (
            !imageFile.type.startsWith("image/")
        ) {

            alert(
                "Please select an image file."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.addEventListener(
            "load",
            function() {

                profileData.profilePicture =
                    reader.result;


                // Display immediately
                displayProfile();


                // Then save
                const saved =
                    saveProfile();


                if (!saved) {

                    console.warn(
                        "The profile picture was displayed, but could not be saved."
                    );

                }

            }
        );


        reader.readAsDataURL(imageFile);

    }
);


}

// =========================================
// PROFILE PICTURE VIEWER
// =========================================

function openProfilePictureViewer() {


if (
    !profileData.profilePicture ||
    !profilePictureViewer ||
    !profilePictureViewerImage
) {

    return;

}


profilePictureViewerImage.src =
    profileData.profilePicture;


profilePictureViewer.classList.add(
    "visible"
);


profilePictureViewer.setAttribute(
    "aria-hidden",
    "false"
);


document.body.classList.add(
    "viewerOpen"
);


}

function closeProfilePictureViewerFunction() {


if (!profilePictureViewer) {

    return;

}


profilePictureViewer.classList.remove(
    "visible"
);


profilePictureViewer.setAttribute(
    "aria-hidden",
    "true"
);


document.body.classList.remove(
    "viewerOpen"
);


}

if (profilePictureViewerButton) {


profilePictureViewerButton.addEventListener(
    "click",
    function() {

        openProfilePictureViewer();

    }
);


}

if (closeProfilePictureViewer) {


closeProfilePictureViewer.addEventListener(
    "click",
    function() {

        closeProfilePictureViewerFunction();

    }
);


}

if (profilePictureViewer) {


profilePictureViewer.addEventListener(
    "click",
    function(event) {

        if (
            event.target === profilePictureViewer
        ) {

            closeProfilePictureViewerFunction();

        }

    }
);


}

document.addEventListener(
"keydown",
function(event) {


    if (
        event.key === "Escape"
    ) {

        closeProfilePictureViewerFunction();

    }

}


);

// =========================================
// CHANGE COVER PHOTO
// =========================================

if (coverPhotoInput) {


coverPhotoInput.addEventListener(
    "change",
    function() {

        const imageFile =
            coverPhotoInput.files[0];


        if (!imageFile) {

            return;

        }


        if (
            !imageFile.type.startsWith("image/")
        ) {

            alert(
                "Please select an image file."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.addEventListener(
            "load",
            function() {

                profileData.coverPhoto =
                    reader.result;


                temporaryCoverPosition =
                    50;


                profileData.coverPosition =
                    50;


                displayProfile();


                if (coverAdjustControls) {

                    coverAdjustControls.classList.add(
                        "visible"
                    );

                }


                const saved =
                    saveProfile();


                if (!saved) {

                    console.warn(
                        "The cover photo was displayed, but could not be saved."
                    );

                }

            }
        );


        reader.readAsDataURL(imageFile);

    }
);


}

// =========================================
// ADJUST COVER PHOTO
// =========================================

if (coverPositionInput) {


coverPositionInput.addEventListener(
    "input",
    function() {

        temporaryCoverPosition =
            Number(
                coverPositionInput.value
            );


        if (profileCover) {

            profileCover.style.backgroundPosition =
                `${temporaryCoverPosition}% center`;

        }

    }
);


}

// =========================================
// SAVE COVER POSITION
// =========================================

if (coverSaveButton) {


coverSaveButton.addEventListener(
    "click",
    function() {

        profileData.coverPosition =
            temporaryCoverPosition;


        displayProfile();

        saveProfile();


        if (coverAdjustControls) {

            coverAdjustControls.classList.remove(
                "visible"
            );

        }

    }
);


}

// =========================================
// CANCEL COVER ADJUSTMENT
// =========================================

if (coverCancelButton) {


coverCancelButton.addEventListener(
    "click",
    function() {

        temporaryCoverPosition =
            profileData.coverPosition;


        displayProfile();


        if (coverAdjustControls) {

            coverAdjustControls.classList.remove(
                "visible"
            );

        }

    }
);


}

// =========================================
// ADD FRIEND
// =========================================

if (addFriendButton) {


addFriendButton.addEventListener(
    "click",
    function() {

        // =================================
        // ALREADY FRIENDS
        // =================================

        if (
            friendData.friendStatus === "friends"
        ) {

            return;

        }


        // =================================
        // CANCEL REQUEST
        // =================================

        if (
            friendData.friendStatus === "pending"
        ) {

            friendData.friendStatus =
                "none";


            displayProfile();

            saveFriendData();

            return;

        }


        // =================================
        // SEND REQUEST
        // =================================

        friendData.friendStatus =
            "pending";


        displayProfile();

        saveFriendData();

    }
);


}

// =========================================
// FOLLOW / UNFOLLOW
// =========================================

if (followButton) {


followButton.addEventListener(
    "click",
    function() {

        if (
            profileData.isFollowing === false
        ) {

            profileData.isFollowing =
                true;

            profileData.followers++;

        } else {

            profileData.isFollowing =
                false;

            profileData.followers--;

        }


        displayProfile();

        saveProfile();

    }
);


}
