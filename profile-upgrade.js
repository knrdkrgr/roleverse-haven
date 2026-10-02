// =========================================
// ROLEVERSE HAVEN
// PROFILE PAGE UPGRADE
// =========================================


// =========================================
// PROFILE DATA
// =========================================

function getProfileUpgradeData() {

    const defaultProfile = {

        displayName: "Display Name",

        bio:
            "Roleplayer | Writer | Character enthusiast",

        description:
            "A short introduction about this roleplayer will appear here.",

        followers: 0,

        following: 0

    };


    const savedProfile =
        localStorage.getItem("roleverseProfile");


    if (!savedProfile) {

        return defaultProfile;

    }


    try {

        const savedData =
            JSON.parse(savedProfile);


        return {

            ...defaultProfile,

            ...savedData

        };

    } catch (error) {

        console.error(
            "Could not load profile upgrade data:",
            error
        );


        return defaultProfile;

    }

}


// =========================================
// FRIEND DATA
// =========================================

function getProfileUpgradeFriendData() {

    const defaultFriends = {

        friends: 0

    };


    const savedFriends =
        localStorage.getItem("roleverseFriendData");


    if (!savedFriends) {

        return defaultFriends;

    }


    try {

        const parsedFriends =
            JSON.parse(savedFriends);


        return {

            ...defaultFriends,

            ...parsedFriends

        };

    } catch (error) {

        console.error(
            "Could not load friend data:",
            error
        );


        return defaultFriends;

    }

}


// =========================================
// TAB SYSTEM
// =========================================

const profileTabs =
    document.querySelectorAll(
        ".profileTab"
    );


const profileTabPanels =
    document.querySelectorAll(
        ".profileTabPanel"
    );


function activateProfileTab(tabName) {

    profileTabs.forEach(
        function(tab) {

            const isActive =
                tab.dataset.tab === tabName;


            tab.classList.toggle(
                "active",
                isActive
            );


            tab.setAttribute(
                "aria-selected",
                isActive
                    ? "true"
                    : "false"
            );

        }
    );


    profileTabPanels.forEach(
        function(panel) {

            const isActive =
                panel.dataset.panel === tabName;


            panel.classList.toggle(
                "active",
                isActive
            );

        }
    );


    if (
        window.history &&
        window.history.replaceState
    ) {

        window.history.replaceState(
            null,
            "",
            `#${tabName}`
        );

    }

}


// =========================================
// TAB CLICK
// =========================================

profileTabs.forEach(
    function(tab) {

        tab.addEventListener(
            "click",
            function() {

                const tabName =
                    tab.dataset.tab;


                if (!tabName) {

                    return;

                }


                activateProfileTab(
                    tabName
                );

            }
        );

    }
);


// =========================================
// KEYBOARD TAB SUPPORT
// =========================================

profileTabs.forEach(
    function(tab) {

        tab.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key !== "ArrowRight" &&
                    event.key !== "ArrowLeft"
                ) {

                    return;

                }


                event.preventDefault();


                const tabs =
                    Array.from(
                        profileTabs
                    );


                const currentIndex =
                    tabs.indexOf(tab);


                let nextIndex;


                if (
                    event.key === "ArrowRight"
                ) {

                    nextIndex =
                        currentIndex + 1;

                } else {

                    nextIndex =
                        currentIndex - 1;

                }


                if (
                    nextIndex < 0
                ) {

                    nextIndex =
                        tabs.length - 1;

                }


                if (
                    nextIndex >= tabs.length
                ) {

                    nextIndex = 0;

                }


                const nextTab =
                    tabs[nextIndex];


                if (nextTab) {

                    nextTab.focus();

                    activateProfileTab(
                        nextTab.dataset.tab
                    );

                }

            }
        );

    }
);


// =========================================
// LOAD TAB FROM URL HASH
// =========================================

function loadProfileTabFromHash() {

    const hash =
        window.location.hash.replace(
            "#",
            ""
        );


    const validTab =
        Array.from(
            profileTabs
        ).some(
            function(tab) {

                return (
                    tab.dataset.tab === hash
                );

            }
        );


    if (validTab) {

        activateProfileTab(
            hash
        );

    } else {

        activateProfileTab(
            "posts"
        );

    }

}


// =========================================
// UPDATE ABOUT SECTION
// =========================================

function updateAboutSection() {

    const profile =
        getProfileUpgradeData();


    const friends =
        getProfileUpgradeFriendData();


    const aboutBio =
        document.getElementById(
            "aboutBio"
        );


    const aboutDescription =
        document.getElementById(
            "aboutDescription"
        );


    const aboutFriends =
        document.getElementById(
            "aboutFriendCount"
        );


    const aboutFollowers =
        document.getElementById(
            "aboutFollowerCount"
        );


    const aboutFollowing =
        document.getElementById(
            "aboutFollowingCount"
        );


    if (aboutBio) {

        aboutBio.textContent =
            profile.bio;

    }


    if (aboutDescription) {

        aboutDescription.textContent =
            profile.description;

    }


    if (aboutFriends) {

        aboutFriends.textContent =
            friends.friends;

    }


    if (aboutFollowers) {

        aboutFollowers.textContent =
            profile.followers;

    }


    if (aboutFollowing) {

        aboutFollowing.textContent =
            profile.following;

    }

}


// =========================================
// CHARACTER PREVIEW
// =========================================
//
// This is intentionally just a foundation
// for now.
//
// The actual character system will come
// later.
//

function initializeCharacterPreview() {

    const characterEmptyState =
        document.getElementById(
            "profileCharacterEmptyState"
        );


    if (!characterEmptyState) {

        return;

    }


    characterEmptyState.innerHTML = `

        <div class="characterEmptyIcon">
            ✦
        </div>

        <h3>
            No characters yet
        </h3>

        <p>
            Create your first character and
            they'll appear on your profile.
        </p>

        <a
            href="characters.html"
            class="characterCreateLink"
        >
            Create a Character
        </a>

    `;

}


// =========================================
// PROFILE NAME
// =========================================

function updateProfileIdentity() {

    const profile =
        getProfileUpgradeData();


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileBio =
        document.getElementById(
            "profileBio"
        );


    if (profileName) {

        profileName.textContent =
            profile.displayName;

    }


    if (profileBio) {

        profileBio.textContent =
            profile.bio;

    }

}


// =========================================
// INITIALIZE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateProfileIdentity();

        updateAboutSection();

        initializeCharacterPreview();

        loadProfileTabFromHash();

    }
);


// =========================================
// UPDATE WHEN HASH CHANGES
// =========================================

window.addEventListener(
    "hashchange",
    function() {

        loadProfileTabFromHash();

    }
);