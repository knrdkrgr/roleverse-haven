// =========================================
// ROLEVERSE HAVEN
// NOTIFICATION SYSTEM
// =========================================


// =========================================
// CREATE A NEW NOTIFICATION
// =========================================

function createNotification(
    notificationOrText,
    details = {}
) {

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


    // =====================================
    // BACKWARD COMPATIBILITY
    // =====================================

    let notification;


    if (
        typeof notificationOrText ===
        "string"
    ) {

        notification = {

            id:
                Date.now(),

            text:
                notificationOrText,

            time:
                "Just now",

            timestamp:
                Date.now(),

            read:
                false

        };

    } else {

        notification = {

            id:
                Date.now(),

            type:
                details.type ||
                notificationOrText.type ||
                "general",

            actorName:
                details.actorName ||
                notificationOrText.actorName ||
                "Someone",

            actorPicture:
                details.actorPicture ||
                notificationOrText.actorPicture ||
                "",

            text:
                details.text ||
                notificationOrText.text ||
                "",

            context:
                details.context ||
                notificationOrText.context ||
                "",

            contextType:
                details.contextType ||
                notificationOrText.contextType ||
                "",

            reaction:
                details.reaction ||
                notificationOrText.reaction ||
                "",

            time:
                "Just now",

            timestamp:
                Date.now(),

            read:
                false

        };

    }


    notifications.unshift(
        notification
    );


    localStorage.setItem(
        "roleverseNotifications",
        JSON.stringify(
            notifications
        )
    );

}