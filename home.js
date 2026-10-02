// =========================================
// HOME PROFILE DATA
// =========================================

let homeProfile = {
    displayName: "Display Name",
    profilePicture: "",
    followers: 0
};

let homeFriendData = {
    friends: []
};


// =========================================
// LOAD PROFILE
// =========================================

const homeSavedProfile =
    localStorage.getItem("roleverseProfile");

if (homeSavedProfile) {

    try {

        const parsedHomeProfile =
            JSON.parse(homeSavedProfile);

        if (
            parsedHomeProfile &&
            typeof parsedHomeProfile === "object"
        ) {

            homeProfile = {
                ...homeProfile,
                ...parsedHomeProfile
            };

        }

    } catch (error) {

        console.error(
            "Could not load home profile:",
            error
        );

    }

}


// =========================================
// LOAD FRIEND DATA
// =========================================

const homeSavedFriendData =
    localStorage.getItem("roleverseFriendData");

if (homeSavedFriendData) {

    try {

        const parsedFriendData =
            JSON.parse(homeSavedFriendData);

        if (
            parsedFriendData &&
            typeof parsedFriendData === "object"
        ) {

            homeFriendData = {
                ...homeFriendData,
                ...parsedFriendData
            };

        }

    } catch (error) {

        console.error(
            "Could not load friend data:",
            error
        );

    }

}


// =========================================
// UPDATE PROFILE INFORMATION
// =========================================

const homeProfileName =
    document.getElementById("homeProfileName");

const composerName =
    document.getElementById("composerName");

const homeFriendCount =
    document.getElementById("homeFriendCount");

const homeFollowerCount =
    document.getElementById("homeFollowerCount");

const homeProfileAvatar =
    document.getElementById("homeProfileAvatar");

const composerAvatar =
    document.getElementById("composerAvatar");


if (homeProfileName) {

    homeProfileName.textContent =
        homeProfile.displayName;

}


if (composerName) {

    composerName.textContent =
        homeProfile.displayName;

}


if (homeFriendCount) {

    homeFriendCount.textContent =
        Array.isArray(homeFriendData.friends)
            ? homeFriendData.friends.length
            : 0;

}


if (homeFollowerCount) {

    homeFollowerCount.textContent =
        homeProfile.followers || 0;

}


// =========================================
// PROFILE AVATARS
// =========================================

if (
    homeProfileAvatar &&
    homeProfile.profilePicture
) {

    homeProfileAvatar.innerHTML = "";

    const image =
        document.createElement("img");

    image.src =
        homeProfile.profilePicture;

    image.alt =
        "Profile Picture";

    image.className =
        "homeProfileAvatarImage";

    homeProfileAvatar.appendChild(
        image
    );

}


if (
    composerAvatar &&
    homeProfile.profilePicture
) {

    composerAvatar.innerHTML = "";

    const image =
        document.createElement("img");

    image.src =
        homeProfile.profilePicture;

    image.alt =
        "Profile Picture";

    image.className =
        "composerAvatarImage";

    composerAvatar.appendChild(
        image
    );

}


// =========================================
// POST STORAGE
// =========================================

const HOME_POST_STORAGE_KEY =
    "roleverseHomePosts";


// Images are stored in IndexedDB instead of
// localStorage.
// localStorage is kept only for small post metadata.

const HOME_IMAGE_DB_NAME =
    "RoleverseHavenDB";

const HOME_IMAGE_STORE_NAME =
    "homePostImages";

const HOME_IMAGE_DB_VERSION =
    1;


function getSavedPosts() {

    const savedPosts =
        localStorage.getItem(
            HOME_POST_STORAGE_KEY
        );

    if (!savedPosts) {

        return [];

    }

    try {

        const parsedPosts =
            JSON.parse(savedPosts);

        return Array.isArray(parsedPosts)
            ? parsedPosts
            : [];

    } catch (error) {

        console.error(
            "Could not load saved posts:",
            error
        );

        return [];

    }

}


function savePosts(posts) {

    try {

        localStorage.setItem(
            HOME_POST_STORAGE_KEY,
            JSON.stringify(posts)
        );

    } catch (error) {

        console.error(
            "Could not save posts:",
            error
        );

        return false;

    }

    return true;

}


// =========================================
// OPEN IMAGE DATABASE
// =========================================

function openHomeImageDB() {

    return new Promise(
        function(resolve, reject) {

            const request =
                indexedDB.open(
                    HOME_IMAGE_DB_NAME,
                    HOME_IMAGE_DB_VERSION
                );


            request.onupgradeneeded =
                function(event) {

                    const database =
                        event.target.result;


                    if (
                        !database.objectStoreNames.contains(
                            HOME_IMAGE_STORE_NAME
                        )
                    ) {

                        database.createObjectStore(
                            HOME_IMAGE_STORE_NAME,
                            {
                                keyPath: "id"
                            }
                        );

                    }

                };


            request.onsuccess =
                function() {

                    resolve(
                        request.result
                    );

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }
    );

}


// =========================================
// CREATE IMAGE ID
// =========================================

function createHomeImageId() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {

        return (
            "home-image-" +
            window.crypto.randomUUID()
        );

    }


    return (
        "home-image-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2)
    );

}


// =========================================
// SAVE IMAGE TO INDEXEDDB
// =========================================

function saveHomeImage(blob) {

    return openHomeImageDB()
        .then(
            function(database) {

                return new Promise(
                    function(resolve, reject) {

                        const id =
                            createHomeImageId();

                        const transaction =
                            database.transaction(
                                [HOME_IMAGE_STORE_NAME],
                                "readwrite"
                            );

                        const store =
                            transaction.objectStore(
                                HOME_IMAGE_STORE_NAME
                            );


                        store.put({
                            id: id,
                            blob: blob
                        });


                        transaction.oncomplete =
                            function() {

                                database.close();

                                resolve(id);

                            };


                        transaction.onerror =
                            function() {

                                database.close();

                                reject(
                                    transaction.error
                                );

                            };

                    }
                );

            }
        );

}


// =========================================
// GET IMAGE FROM INDEXEDDB
// =========================================

function getHomeImageBlob(imageId) {

    return openHomeImageDB()
        .then(
            function(database) {

                return new Promise(
                    function(resolve, reject) {

                        const transaction =
                            database.transaction(
                                [HOME_IMAGE_STORE_NAME],
                                "readonly"
                            );

                        const store =
                            transaction.objectStore(
                                HOME_IMAGE_STORE_NAME
                            );

                        const request =
                            store.get(imageId);


                        request.onsuccess =
                            function() {

                                database.close();

                                resolve(
                                    request.result
                                        ? request.result.blob
                                        : null
                                );

                            };


                        request.onerror =
                            function() {

                                database.close();

                                reject(
                                    request.error
                                );

                            };

                    }
                );

            }
        );

}


// =========================================
// CONVERT OLD DATA URL TO BLOB
// =========================================

function dataURLToBlob(dataURL) {

    return fetch(dataURL)
        .then(
            function(response) {

                return response.blob();

            }
        );

}


// =========================================
// MIGRATE OLD POST IMAGES
// =========================================

async function migrateLegacyPostImages(posts) {

    if (
        !Array.isArray(posts) ||
        posts.length === 0
    ) {

        return posts;

    }


    let changed = false;


    for (const post of posts) {

        if (
            !post ||
            typeof post !== "object"
        ) {

            continue;

        }


        // -----------------------------------------
        // MIGRATE OLD BASE64 POST IMAGES
        // -----------------------------------------

        if (
            Array.isArray(post.images) &&
            post.images.length > 0
        ) {

            const remainingImages = [];


            if (!Array.isArray(post.imageIds)) {

                post.imageIds = [];

            }


            for (const imageSource of post.images) {

                if (
                    typeof imageSource === "string" &&
                    imageSource.startsWith("data:")
                ) {

                    try {

                        const blob =
                            await dataURLToBlob(
                                imageSource
                            );


                        const imageId =
                            await saveHomeImage(
                                blob
                            );


                        post.imageIds.push(
                            imageId
                        );


                        changed = true;

                    } catch (error) {

                        console.error(
                            "Could not migrate legacy post image:",
                            error
                        );


                        remainingImages.push(
                            imageSource
                        );

                    }

                } else {

                    remainingImages.push(
                        imageSource
                    );

                }

            }


            post.images =
                remainingImages;

        }


        // -----------------------------------------
        // REMOVE LARGE BASE64 PROFILE PICTURE
        // -----------------------------------------

        if (
            typeof post.profilePicture === "string" &&
            post.profilePicture.startsWith("data:")
        ) {

            post.profilePicture = "";

            changed = true;

        }


        // -----------------------------------------
        // MAKE SURE IMAGE IDS EXISTS
        // -----------------------------------------

        if (!Array.isArray(post.imageIds)) {

            post.imageIds = [];

            changed = true;

        }

    }


    if (changed) {

        const saved =
            savePosts(posts);


        if (!saved) {

            console.warn(
                "Post image migration completed, but the updated metadata could not be saved."
            );

        }

    }


    return posts;

}


// =========================================
// CREATE IMAGE FROM UPLOADED FILE
// =========================================

async function createHomeImageFromFile(file) {

    if (!file) {

        return null;

    }


    try {

        const imageId =
            await saveHomeImage(file);

        return imageId;

    } catch (error) {

        console.error(
            "Could not save uploaded image:",
            error
        );

        return null;

    }

}


// =========================================
// LOAD IMAGE FROM INDEXEDDB
// =========================================

async function loadHomeImageIntoElement(
    imageElement,
    imageId
) {

    if (
        !imageElement ||
        !imageId
    ) {

        return;

    }


    try {

        const blob =
            await getHomeImageBlob(
                imageId
            );


        if (!blob) {

            console.warn(
                "Could not find stored home image:",
                imageId
            );

            return;

        }


        const objectURL =
            URL.createObjectURL(blob);


        imageElement.src =
            objectURL;


        imageElement.addEventListener(
            "load",
            function() {

                URL.revokeObjectURL(
                    objectURL
                );

            },
            {
                once: true
            }
        );


    } catch (error) {

        console.error(
            "Could not load home image:",
            error
        );

    }

}


// =========================================
// FORMAT RELATIVE TIME
// =========================================

function formatRelativeTime(timestamp) {

    if (!timestamp) {

        return "";

    }


    const now =
        Date.now();

    const postTime =
        new Date(timestamp).getTime();


    if (Number.isNaN(postTime)) {

        return "";

    }


    const difference =
        Math.max(
            0,
            now - postTime
        );


    const seconds =
        Math.floor(
            difference / 1000
        );


    if (seconds < 60) {

        return "Just now";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return (
            minutes +
            "m"
        );

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return (
            hours +
            "h"
        );

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return (
            days +
            "d"
        );

    }


    const weeks =
        Math.floor(
            days / 7
        );


    if (weeks < 5) {

        return (
            weeks +
            "w"
        );

    }


    const months =
        Math.floor(
            days / 30
        );


    if (months < 12) {

        return (
            months +
            "mo"
        );

    }


    const years =
        Math.floor(
            days / 365
        );


    return (
        years +
        "y"
    );

}


// =========================================
// CREATE POST ELEMENT
// =========================================

function createPostElement(postData) {

    if (
        !postData ||
        typeof postData !== "object"
    ) {

        return null;

    }


    const post =
        document.createElement("article");


    post.className =
        "homePost";


    post.dataset.postId =
        postData.id || "";


    // =========================================
    // POST HEADER
    // =========================================

    const postHeader =
        document.createElement("div");


    postHeader.className =
        "homePostHeader";


    const postAuthorArea =
        document.createElement("div");


    postAuthorArea.className =
        "homePostAuthorArea";


    const avatar =
        document.createElement("div");


    avatar.className =
        "homePostAvatar";


    const profilePicture =
        postData.profilePicture ||
        homeProfile.profilePicture ||
        "";


    if (profilePicture) {

        const avatarImage =
            document.createElement("img");


        avatarImage.src =
            profilePicture;


        avatarImage.alt =
            "Profile Picture";


        avatarImage.className =
            "homePostAvatarImage";


        avatar.appendChild(
            avatarImage
        );

    }


    const authorDetails =
        document.createElement("div");


    authorDetails.className =
        "homePostAuthorDetails";


    const authorName =
        document.createElement("div");


    authorName.className =
        "homePostAuthorName";


    authorName.textContent =
        postData.displayName ||
        homeProfile.displayName ||
        "Display Name";


    const timestamp =
        document.createElement("div");


    timestamp.className =
        "homePostTimestamp";


    timestamp.dataset.timestamp =
        postData.createdAt || "";


    timestamp.textContent =
        formatRelativeTime(
            postData.createdAt
        );


    authorDetails.appendChild(
        authorName
    );


    authorDetails.appendChild(
        timestamp
    );


    postAuthorArea.appendChild(
        avatar
    );


    postAuthorArea.appendChild(
        authorDetails
    );


    postHeader.appendChild(
        postAuthorArea
    );


    // =========================================
    // POST MENU
    // =========================================

    const postMenu =
        document.createElement("div");


    postMenu.className =
        "homePostMenu";


    const menuButton =
        document.createElement("button");


    menuButton.type =
        "button";


    menuButton.className =
        "homePostMenuButton";


    menuButton.innerHTML =
        "⋯";


    menuButton.setAttribute(
        "aria-label",
        "Post menu"
    );


    postMenu.appendChild(
        menuButton
    );


    postHeader.appendChild(
        postMenu
    );


    post.appendChild(
        postHeader
    );


    // =========================================
    // SHARED POST LABEL
    // =========================================

    if (postData.shared) {

        const sharedLabel =
            document.createElement("div");


        sharedLabel.className =
            "homePostSharedLabel";


        sharedLabel.textContent =
            "Shared a post";


        post.appendChild(
            sharedLabel
        );

    }


    // =========================================
    // POST CONTENT
    // =========================================

    const postContent =
        document.createElement("div");


    postContent.className =
        "homePostContent";


    if (postData.text) {

        const postText =
            document.createElement("div");


        postText.className =
            "homePostText";


        postText.textContent =
            postData.text;


        postContent.appendChild(
            postText
        );

    }


    // =========================================
    // POST IMAGES
    // =========================================

    const imageContainer =
        document.createElement("div");


    imageContainer.className =
        "homePostImages";


    let hasImages = false;


    // -----------------------------------------
    // INDEXEDDB IMAGES
    // -----------------------------------------

    if (
        Array.isArray(postData.imageIds)
    ) {

        postData.imageIds.forEach(
            function(imageId) {

                if (!imageId) {

                    return;

                }


                const imageWrapper =
                    document.createElement("div");


                imageWrapper.className =
                    "homePostImageWrapper";


                const image =
                    document.createElement("img");


                image.className =
                    "homePostImage";


                image.alt =
                    "Post image";


                imageWrapper.appendChild(
                    image
                );


                imageContainer.appendChild(
                    imageWrapper
                );


                hasImages = true;


                loadHomeImageIntoElement(
                    image,
                    imageId
                );

            }
        );

    }


    // -----------------------------------------
    // OLD / NORMAL IMAGE URLS
    // -----------------------------------------

    if (
        Array.isArray(postData.images)
    ) {

        postData.images.forEach(
            function(imageSource) {

                if (
                    !imageSource ||
                    typeof imageSource !== "string"
                ) {

                    return;

                }


                const imageWrapper =
                    document.createElement("div");


                imageWrapper.className =
                    "homePostImageWrapper";


                const image =
                    document.createElement("img");


                image.src =
                    imageSource;


                image.alt =
                    "Post image";


                image.className =
                    "homePostImage";


                imageWrapper.appendChild(
                    image
                );


                imageContainer.appendChild(
                    imageWrapper
                );


                hasImages = true;

            }
        );

    }


    if (hasImages) {

        postContent.appendChild(
            imageContainer
        );

    }


    post.appendChild(
        postContent
    );


    // =========================================
    // POST ACTIONS
    // =========================================

    const postActions =
        document.createElement("div");


    postActions.className =
        "homePostActions";


    // -----------------------------------------
    // REACTION
    // -----------------------------------------

    const reactionButton =
        document.createElement("button");


    reactionButton.type =
        "button";


    reactionButton.className =
        "homePostActionButton homeReactionButton";


    reactionButton.innerHTML =
        `
        <span class="homeReactionIcon">👍</span>
        <span class="homeReactionText">Like</span>
        `;


    reactionButton.setAttribute(
        "aria-label",
        "React to post"
    );


    postActions.appendChild(
        reactionButton
    );


    // -----------------------------------------
    // COMMENT
    // -----------------------------------------

    const commentButton =
        document.createElement("button");


    commentButton.type =
        "button";


    commentButton.className =
        "homePostActionButton homeCommentButton";


    commentButton.innerHTML =
        `
        <span class="homeCommentIcon">💬</span>
        <span>Comment</span>
        `;


    commentButton.setAttribute(
        "aria-label",
        "Comment on post"
    );


    postActions.appendChild(
        commentButton
    );


    // -----------------------------------------
    // SHARE
    // -----------------------------------------

    const shareButton =
        document.createElement("button");


    shareButton.type =
        "button";


    shareButton.className =
        "homePostActionButton homeShareButton";


    shareButton.innerHTML =
        `
        <span class="homeShareIcon">↗</span>
        <span>Share</span>
        `;


    shareButton.setAttribute(
        "aria-label",
        "Share post"
    );


    postActions.appendChild(
        shareButton
    );


    post.appendChild(
        postActions
    );


    // =========================================
    // REACTION PICKER
    // =========================================

    const reactionPicker =
        document.createElement("div");


    reactionPicker.className =
        "homeReactionPicker";


    reactionPicker.innerHTML =
        `
        <button type="button" data-reaction="like">👍</button>
        <button type="button" data-reaction="love">❤️</button>
        <button type="button" data-reaction="haha">😂</button>
        <button type="button" data-reaction="wow">😮</button>
        <button type="button" data-reaction="sad">😢</button>
        <button type="button" data-reaction="angry">😡</button>
        `;


    post.appendChild(
        reactionPicker
    );


    // =========================================
    // STORE POST DATA ON ELEMENT
    // =========================================

    post._postData =
        postData;


    return post;

}


// =========================================
// POSTS CONTAINER
// =========================================

// IMPORTANT:
// This must match the ID in home.html
// and the reaction/comment systems.

const homePostsContainer =
    document.getElementById("postList");


// =========================================
// LOAD SAVED POSTS
// =========================================

async function loadSavedPosts() {

    if (!homePostsContainer) {

        return;

    }


    let savedPosts =
        getSavedPosts();


    // -----------------------------------------
    // MIGRATE OLD LARGE BASE64 IMAGES
    // -----------------------------------------

    savedPosts =
        await migrateLegacyPostImages(
            savedPosts
        );


    // -----------------------------------------
    // MAKE SURE POSTS HAVE REQUIRED DATA
    // -----------------------------------------

    let postsChanged =
        false;


    savedPosts.forEach(
        function(post) {

            if (
                !post.createdAt
            ) {

                post.createdAt =
                    new Date().toISOString();

                postsChanged =
                    true;

            }


            if (
                !Array.isArray(post.imageIds)
            ) {

                post.imageIds =
                    [];

                postsChanged =
                    true;

            }

        }
    );


    if (postsChanged) {

        savePosts(
            savedPosts
        );

    }


    // -----------------------------------------
    // CLEAR CURRENT POSTS
    // -----------------------------------------

    homePostsContainer.innerHTML =
        "";


    // -----------------------------------------
    // RENDER POSTS
    // -----------------------------------------

    savedPosts.forEach(
        function(postData) {

            const postElement =
                createPostElement(
                    postData
                );


            if (postElement) {

                homePostsContainer.appendChild(
                    postElement
                );

            }

        }
    );


    updatePostTimestamps();

}


// =========================================
// INITIAL LOAD
// =========================================

loadSavedPosts();


// =========================================
// POST COMPOSER ELEMENTS
// =========================================

const postTextInput =
    document.getElementById("postText");

const postImageInput =
    document.getElementById("postImageInput");

const createPostButton =
    document.getElementById("createPostButton");


// =========================================
// SELECTED IMAGE FILES
// =========================================

let selectedPostFiles = [];


// =========================================
// IMAGE INPUT
// =========================================

if (postImageInput) {

    postImageInput.addEventListener(
        "change",
        function(event) {

            selectedPostFiles =
                Array.from(
                    event.target.files || []
                );

        }
    );

}


// =========================================
// CREATE POST
// =========================================

if (createPostButton) {

    createPostButton.addEventListener(
        "click",
        async function() {

            const text =
                postTextInput
                    ? postTextInput.value.trim()
                    : "";


            // -----------------------------------------
            // CHECK IF THERE IS CONTENT
            // -----------------------------------------

            if (
                !text &&
                selectedPostFiles.length === 0
            ) {

                return;

            }


            // -----------------------------------------
            // DISABLE BUTTON WHILE SAVING
            // -----------------------------------------

            createPostButton.disabled =
                true;


            try {

                const imageIds =
                    [];


                // -----------------------------------------
                // SAVE UPLOADED IMAGES
                // -----------------------------------------

                for (
                    const file of selectedPostFiles
                ) {

                    if (!file) {

                        continue;

                    }


                    const imageId =
                        await createHomeImageFromFile(
                            file
                        );


                    if (imageId) {

                        imageIds.push(
                            imageId
                        );

                    }

                }


                // -----------------------------------------
                // CREATE POST
                // -----------------------------------------

                finishCreatingPost(
                    text,
                    imageIds
                );


            } catch (error) {

                console.error(
                    "Could not create post:",
                    error
                );

            } finally {

                createPostButton.disabled =
                    false;

            }

        }
    );

}


// =========================================
// FINISH CREATING POST
// =========================================

function finishCreatingPost(
    text,
    imageIds
) {

    const currentProfilePicture =
        homeProfile.profilePicture || "";


    // -----------------------------------------
    // DO NOT DUPLICATE LARGE BASE64 PROFILE
    // PICTURE INSIDE EVERY POST
    // -----------------------------------------

    let storedProfilePicture =
        currentProfilePicture;


    if (
        typeof storedProfilePicture === "string" &&
        storedProfilePicture.startsWith("data:")
    ) {

        storedProfilePicture =
            "";

    }


    const newPost = {

        id:
            Date.now().toString(),

        displayName:
            homeProfile.displayName ||
            "Display Name",

        profilePicture:
            storedProfilePicture,

        text:
            text || "",

        images:
            [],

        imageIds:
            Array.isArray(imageIds)
                ? imageIds
                : [],

        createdAt:
            new Date().toISOString(),

        shared:
            false

    };


    // -----------------------------------------
    // SAVE POST METADATA
    // -----------------------------------------

    const saved =
        savePosts([
            ...getSavedPosts(),
            newPost
        ]);


    if (!saved) {

        console.error(
            "Post could not be saved because localStorage quota was exceeded."
        );

        return;

    }


    // -----------------------------------------
    // ADD TO FEED
    // -----------------------------------------

    if (homePostsContainer) {

        const postElement =
            createPostElement(
                newPost
            );


        if (postElement) {

            homePostsContainer.prepend(
                postElement
            );

        }

    }


    // -----------------------------------------
    // CLEAR COMPOSER
    // -----------------------------------------

    if (postTextInput) {

        postTextInput.value =
            "";

    }


    selectedPostFiles =
        [];


    if (postImageInput) {

        postImageInput.value =
            "";

    }


    updatePostTimestamps();

}


// =========================================
// POST MENU BUTTON
// =========================================

if (homePostsContainer) {

    homePostsContainer.addEventListener(
        "click",
        function(event) {

            const menuButton =
                event.target.closest(
                    ".homePostMenuButton"
                );


            if (!menuButton) {

                return;

            }


            const post =
                menuButton.closest(
                    ".homePost"
                );


            if (!post) {

                return;

            }


            const existingMenu =
                post.querySelector(
                    ".homePostMenuDropdown"
                );


            if (existingMenu) {

                existingMenu.remove();

                return;

            }


            const menu =
                document.createElement("div");


            menu.className =
                "homePostMenuDropdown";


            menu.innerHTML =
                `
                <button type="button" class="homeEditPostButton">
                    Edit post
                </button>

                <button type="button" class="homeDeletePostButton">
                    Delete post
                </button>
                `;


            const postMenu =
                post.querySelector(
                    ".homePostMenu"
                );


            if (postMenu) {

                postMenu.appendChild(
                    menu
                );

            }

        }
    );

}


// =========================================
// EDIT / DELETE / SHARE
// =========================================

if (homePostsContainer) {

    homePostsContainer.addEventListener(
        "click",
        function(event) {

            // =========================================
            // EDIT POST
            // =========================================

            const editButton =
                event.target.closest(
                    ".homeEditPostButton"
                );


            if (editButton) {

                const postElement =
                    editButton.closest(
                        ".homePost"
                    );


                if (!postElement) {

                    return;

                }


                const postId =
                    postElement.dataset.postId;


                const posts =
                    getSavedPosts();


                const postData =
                    posts.find(
                        function(post) {

                            return (
                                String(post.id) ===
                                String(postId)
                            );

                        }
                    );


                if (!postData) {

                    return;

                }


                const newText =
                    window.prompt(
                        "Edit your post:",
                        postData.text || ""
                    );


                if (
                    newText === null
                ) {

                    return;

                }


                postData.text =
                    newText.trim();


                const saved =
                    savePosts(
                        posts
                    );


                if (!saved) {

                    return;

                }


                const textElement =
                    postElement.querySelector(
                        ".homePostText"
                    );


                if (textElement) {

                    textElement.textContent =
                        postData.text;

                }


                const menu =
                    postElement.querySelector(
                        ".homePostMenuDropdown"
                    );


                if (menu) {

                    menu.remove();

                }


                return;

            }


            // =========================================
            // DELETE POST
            // =========================================

            const deleteButton =
                event.target.closest(
                    ".homeDeletePostButton"
                );


            if (deleteButton) {

                const postElement =
                    deleteButton.closest(
                        ".homePost"
                    );


                if (!postElement) {

                    return;

                }


                const postId =
                    postElement.dataset.postId;


                const confirmed =
                    window.confirm(
                        "Are you sure you want to delete this post?"
                    );


                if (!confirmed) {

                    return;

                }


                const posts =
                    getSavedPosts();


                const remainingPosts =
                    posts.filter(
                        function(post) {

                            return (
                                String(post.id) !==
                                String(postId)
                            );

                        }
                    );


                const saved =
                    savePosts(
                        remainingPosts
                    );


                if (!saved) {

                    return;

                }


                postElement.remove();


                return;

            }


            // =========================================
            // SHARE POST
            // =========================================

            const shareButton =
                event.target.closest(
                    ".homeShareButton"
                );


            if (shareButton) {

                const postElement =
                    shareButton.closest(
                        ".homePost"
                    );


                if (!postElement) {

                    return;

                }


                const originalPostData =
                    postElement._postData;


                if (!originalPostData) {

                    return;

                }


                const sharedPost = {

                    id:
                        Date.now().toString(),

                    displayName:
                        homeProfile.displayName ||
                        "Display Name",

                    profilePicture:
                        (
                            typeof homeProfile.profilePicture === "string" &&
                            homeProfile.profilePicture.startsWith("data:")
                        )
                            ? ""
                            : (
                                homeProfile.profilePicture ||
                                ""
                            ),

                    text:
                        originalPostData.text ||
                        "",

                    images:
                        Array.isArray(
                            originalPostData.images
                        )
                            ? [
                                ...originalPostData.images
                            ]
                            : [],

                    imageIds:
                        Array.isArray(
                            originalPostData.imageIds
                        )
                            ? [
                                ...originalPostData.imageIds
                            ]
                            : [],

                    createdAt:
                        new Date().toISOString(),

                    shared:
                        true

                };


                const posts =
                    getSavedPosts();


                const saved =
                    savePosts([
                        sharedPost,
                        ...posts
                    ]);


                if (!saved) {

                    console.error(
                        "Could not share post because localStorage quota was exceeded."
                    );

                    return;

                }


                const sharedPostElement =
                    createPostElement(
                        sharedPost
                    );


                if (
                    sharedPostElement &&
                    homePostsContainer
                ) {

                    homePostsContainer.prepend(
                        sharedPostElement
                    );

                }


                return;

            }

        }
    );

}


// =========================================
// CLOSE POST MENUS WHEN CLICKING OUTSIDE
// =========================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                ".homePostMenuButton"
            )
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".homePostMenuDropdown"
            )
            .forEach(
                function(menu) {

                    menu.remove();

                }
            );

    }
);


// =========================================
// UPDATE POST TIMESTAMPS
// =========================================

function updatePostTimestamps() {

    document
        .querySelectorAll(
            ".homePostTimestamp"
        )
        .forEach(
            function(timestampElement) {

                const timestamp =
                    timestampElement.dataset.timestamp;


                if (!timestamp) {

                    return;

                }


                timestampElement.textContent =
                    formatRelativeTime(
                        timestamp
                    );

            }
        );

}


setInterval(
    updatePostTimestamps,
    60000
);