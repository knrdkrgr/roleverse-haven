// =========================================
// ROLEVERSE HAVEN
// NOTIFICATIONS
// =========================================


// =========================================
// ELEMENTS
// =========================================

const notificationList =
    document.getElementById(
        "notificationList"
    );


const noNotificationsMessage =
    document.getElementById(
        "noNotificationsMessage"
    );


const markAllReadButton =
    document.getElementById(
        "markAllReadButton"
    );


// =========================================
// LOAD SAVED NOTIFICATIONS
// =========================================

let notifications = [];


const savedNotifications =
    localStorage.getItem(
        "roleverseNotifications"
    );


if (savedNotifications) {

    try {

        notifications =
            JSON.parse(
                savedNotifications
            );

    } catch (error) {

        notifications = [];

    }

}


// =========================================
// SAVE NOTIFICATIONS
// =========================================

function saveNotifications() {

    localStorage.setItem(
        "roleverseNotifications",
        JSON.stringify(
            notifications
        )
    );

}


// =========================================
// RELATIVE TIME
// =========================================

function getRelativeNotificationTime(
    notification
) {

    if (
        !notification.timestamp
    ) {

        return (
            notification.time ||
            "Just now"
        );

    }


    const now =
        Date.now();


    const difference =
        Math.max(
            0,
            now -
            Number(
                notification.timestamp
            )
        );


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


    const weeks =
        Math.floor(
            days / 7
        );


    const months =
        Math.floor(
            days / 30
        );


    if (seconds < 60) {

        return "just now";

    }


    if (minutes < 60) {

        return (
            minutes +
            "m"
        );

    }


    if (hours < 24) {

        return (
            hours +
            "h"
        );

    }


    if (days < 7) {

        return (
            days +
            "d"
        );

    }


    if (weeks < 5) {

        return (
            weeks +
            "w"
        );

    }


    if (months < 12) {

        return (
            months +
            "mo"
        );

    }


    return (
        Math.floor(
            days / 365
        ) +
        "y"
    );

}


// =========================================
// NOTIFICATION ICON
// =========================================

function getNotificationIcon(
    notification
) {

    const type =
        notification.type ||
        "general";


    if (
        type === "comment"
    ) {

        return "💬";

    }


    if (
        type === "reply"
    ) {

        return "↩️";

    }


    if (
        type === "reaction"
    ) {

        return (
            notification.reaction ||
            "❤️"
        );

    }


    if (
        type === "like"
    ) {

        return "👍";

    }


    if (
        type === "follow"
    ) {

        return "👤";

    }


    if (
        type === "friend"
    ) {

        return "🤝";

    }


    if (
        type === "mention"
    ) {

        return "@";

    }


    if (
        type === "group"
    ) {

        return "👥";

    }


    return "🔔";

}


// =========================================
// PROFILE AVATAR
// =========================================

function createNotificationAvatar(
    notification
) {

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "notificationAvatar";


    const image =
        document.createElement(
            "img"
        );


    image.className =
        "notificationAvatarImage";


    const fallback =
        document.createElement(
            "span"
        );


    fallback.className =
        "notificationAvatarFallback";


    fallback.textContent =
        "👤";


    if (
        notification.actorPicture
    ) {

        image.src =
            notification.actorPicture;

        image.alt =
            notification.actorName ||
            "Profile Picture";

        avatar.appendChild(
            image
        );

    } else {

        avatar.appendChild(
            fallback
        );

    }


    const icon =
        document.createElement(
            "span"
        );


    icon.className =
        "notificationTypeIcon";


    icon.textContent =
        getNotificationIcon(
            notification
        );


    avatar.appendChild(
        icon
    );


    return avatar;

}


// =========================================
// CREATE NOTIFICATION CONTENT
// =========================================

function createNotificationContent(
    notification
) {

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "notificationContent";


    const text =
        document.createElement(
            "div"
        );


    text.className =
        "notificationText"
        ;


    // =====================================
    // NEW DETAILED FORMAT
    // =====================================

    if (
        notification.actorName &&
        notification.text
    ) {

        const actor =
            document.createElement(
                "strong"
            );


        actor.textContent =
            notification.actorName;


        text.appendChild(
            actor
        );


        const message =
            document.createTextNode(
                " " +
                notification.text
            );


        text.appendChild(
            message
        );


        if (
            notification.context
        ) {

            const context =
                document.createElement(
                    "span"
                );


            context.className =
                "notificationContext";


            context.textContent =
                " " +
                notification.context;


            text.appendChild(
                context
            );

        }

    } else {

        // =================================
        // OLD NOTIFICATION FORMAT
        // =================================

        text.textContent =
            notification.text ||
            "You have a new notification.";

    }


    const time =
        document.createElement(
            "div"
        );


    time.className =
        "notificationTime";


    time.textContent =
        getRelativeNotificationTime(
            notification
        );


    content.appendChild(
        text
    );


    content.appendChild(
        time
    );


    return content;

}


// =========================================
// OPTION BUTTON
// =========================================

function createNotificationOptions(
    notificationElement,
    notification
) {

    const optionsWrapper =
        document.createElement(
            "div"
        );


    optionsWrapper.className =
        "notificationOptions";


    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "notificationOptionsButton";


    button.setAttribute(
        "aria-label",
        "Notification options"
    );


    button.textContent =
        "•••";


    button.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            // Mark this notification as read
            notification.read =
                true;


            saveNotifications();


            notificationElement.classList.remove(
                "unread"
            );

        }
    );


    optionsWrapper.appendChild(
        button
    );


    return optionsWrapper;

}


// =========================================
// DISPLAY NOTIFICATIONS
// =========================================

function displayNotifications() {

    notificationList.innerHTML =
        "";


    if (
        notifications.length === 0
    ) {

        noNotificationsMessage.style.display =
            "block";

        return;

    }


    noNotificationsMessage.style.display =
        "none";


    notifications.forEach(
        function(notification) {

            const notificationElement =
                document.createElement(
                    "article"
                );


            notificationElement.className =
                "notification";


            if (
                !notification.read
            ) {

                notificationElement.classList.add(
                    "unread"
                );

            }


            notificationElement.dataset.notificationId =
                notification.id;


            // =================================
            // NOTIFICATION INNER LAYOUT
            // =================================

            const notificationInner =
                document.createElement(
                    "div"
                );


            notificationInner.className =
                "notificationInner";


            const avatar =
                createNotificationAvatar(
                    notification
                );


            const content =
                createNotificationContent(
                    notification
                );


            const options =
                createNotificationOptions(
                    notificationElement,
                    notification
                );


            notificationInner.appendChild(
                avatar
            );


            notificationInner.appendChild(
                content
            );


            notificationInner.appendChild(
                options
            );


            notificationElement.appendChild(
                notificationInner
            );


            // =================================
            // CLICK = MARK AS READ
            // =================================

            notificationElement.addEventListener(
                "click",
                function() {

                    const notificationData =
                        notifications.find(
                            function(item) {

                                return (
                                    item.id ===
                                    notification.id
                                );

                            }
                        );


                    if (
                        !notificationData
                    ) {

                        return;

                    }


                    notificationData.read =
                        true;


                    saveNotifications();


                    notificationElement.classList.remove(
                        "unread"
                    );

                }
            );


            notificationList.appendChild(
                notificationElement
            );

        }
    );

}


// =========================================
// MARK ALL AS READ
// =========================================

markAllReadButton.addEventListener(
    "click",
    function() {

        notifications.forEach(
            function(notification) {

                notification.read =
                    true;

            }
        );


        saveNotifications();


        displayNotifications();

    }
);


// =========================================
// DISPLAY
// =========================================

displayNotifications();