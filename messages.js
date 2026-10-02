document.addEventListener(
    "DOMContentLoaded",
    function() {

        // =========================================
        // STORAGE
        // =========================================

        const STORAGE_KEY =
            "roleversemessages";


        // =========================================
        // DEFAULT CONVERSATION DATA
        // =========================================

        const defaultConversations = {

            "roleplayer-one": {

                name:
                    "Roleplayer One",

                status:
                    "Active conversation",

                online:
                    true,

                messages: [

                    {
                        type:
                            "received",

                        text:
                            "Hey! Are you still interested in plotting a fantasy RP?",

                        time:
                            "12:10 PM",

                        reaction:
                            null,

                        seen:
                            true
                    },

                    {
                        type:
                            "sent",

                        text:
                            "Yes! I'm still interested. I actually have a few ideas we could work with.",

                        time:
                            "12:14 PM",

                        reaction:
                            null,

                        deliveryStatus:
                            "seen"
                    },

                    {
                        type:
                            "received",

                        text:
                            "That's perfect. Send them over whenever you're ready!",

                        time:
                            "12:16 PM",

                        reaction:
                            null,

                        seen:
                            true
                    }

                ]

            },


            "roleplayer-two": {

                name:
                    "Roleplayer Two",

                status:
                    "Active conversation",

                online:
                    true,

                messages: [

                    {
                        type:
                            "received",

                        text:
                            "I sent you the character details we discussed!",

                        time:
                            "Yesterday",

                        reaction:
                            null,

                        seen:
                            true
                    },

                    {
                        type:
                            "sent",

                        text:
                            "Got them! I'll look through everything later.",

                        time:
                            "Yesterday",

                        reaction:
                            null,

                        deliveryStatus:
                            "seen"
                    },

                    {
                        type:
                            "received",

                        text:
                            "Sounds good. Let me know what you think.",

                        time:
                            "Yesterday",

                        reaction:
                            null,

                        seen:
                            true
                    }

                ]

            }

        };


        // =========================================
        // LOAD CONVERSATIONS
        // =========================================

        let conversations;


        try {

            const savedConversations =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (savedConversations) {

                conversations =
                    JSON.parse(
                        savedConversations
                    );

            } else {

                conversations =
                    JSON.parse(
                        JSON.stringify(
                            defaultConversations
                        )
                    );

            }

        } catch (error) {

            console.error(
                "Could not load messages:",
                error
            );


            conversations =
                JSON.parse(
                    JSON.stringify(
                        defaultConversations
                    )
                );

        }


        // =========================================
        // SAVE CONVERSATIONS
        // =========================================

        function saveConversations() {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        conversations
                    )
                );

            } catch (error) {

                console.error(
                    "Could not save messages:",
                    error
                );

            }

        }


        // =========================================
        // NORMALIZE OLD DATA
        // =========================================

        let messagesWereUpdated =
            false;


        Object.keys(
            conversations
        ).forEach(
            function(conversationId) {

                const conversation =
                    conversations[
                        conversationId
                    ];


                if (!conversation) {

                    return;

                }


                if (
                    typeof conversation.online !==
                    "boolean"
                ) {

                    conversation.online =
                        true;

                    messagesWereUpdated =
                        true;

                }


                if (
                    !Array.isArray(
                        conversation.messages
                    )
                ) {

                    conversation.messages =
                        [];

                    messagesWereUpdated =
                        true;

                    return;

                }


                conversation.messages.forEach(
                    function(message) {

                        if (!message) {

                            return;

                        }


                        if (
                            !Object.prototype.hasOwnProperty.call(
                                message,
                                "reaction"
                            )
                        ) {

                            message.reaction =
                                null;

                            messagesWereUpdated =
                                true;

                        }


                        if (
                            message.type ===
                            "sent" &&
                            !Object.prototype.hasOwnProperty.call(
                                message,
                                "deliveryStatus"
                            )
                        ) {

                            message.deliveryStatus =
                                "seen";

                            messagesWereUpdated =
                                true;

                        }


                        if (
                            message.type ===
                            "received" &&
                            !Object.prototype.hasOwnProperty.call(
                                message,
                                "seen"
                            )
                        ) {

                            message.seen =
                                true;

                            messagesWereUpdated =
                                true;

                        }

                    }
                );

            }
        );


        if (messagesWereUpdated) {

            saveConversations();

        }


        // =========================================
        // ELEMENTS
        // =========================================

        const conversationList =
            document.getElementById(
                "conversationList"
            );


        const conversationName =
            document.getElementById(
                "conversationName"
            );


        const conversationStatus =
            document.querySelector(
                ".conversationStatus"
            );


        const messageArea =
            document.getElementById(
                "messageArea"
            );


        const searchInput =
            document.getElementById(
                "conversationSearchInput"
            );


        const messageInput =
            document.getElementById(
                "messageInput"
            );


        const sendMessageButton =
            document.getElementById(
                "sendMessageButton"
            );


        const newMessageButton =
            document.getElementById(
                "newMessageButton"
            );


        const conversationOptionsButton =
            document.querySelector(
                ".conversationOptionsButton"
            );


        // =========================================
        // CURRENT CONVERSATION
        // =========================================

        let currentConversationId =
            "roleplayer-two";


        // =========================================
        // TYPING INDICATOR
        // =========================================

        let typingTimeout = null;


        let typingIndicator = null;


        function createTypingIndicator() {

            if (typingIndicator) {

                return;

            }


            typingIndicator =
                document.createElement(
                    "div"
                );


            typingIndicator.className =
                "typingIndicator";


            const typingName =
                document.createElement(
                    "span"
                );


            typingName.className =
                "typingIndicatorName";


            const typingConversation =
                conversations[
                    currentConversationId
                ];


            typingName.textContent =
                typingConversation
                    ? typingConversation.name
                    : "Roleplayer";


            const typingText =
                document.createElement(
                    "span"
                );


            typingText.className =
                "typingIndicatorText";


            typingText.textContent =
                " is typing";


            const typingDots =
                document.createElement(
                    "span"
                );


            typingDots.className =
                "typingDots";


            typingDots.innerHTML =
                "<span></span><span></span><span></span>";


            typingIndicator.appendChild(
                typingName
            );


            typingIndicator.appendChild(
                typingText
            );


            typingIndicator.appendChild(
                typingDots
            );


            messageArea.appendChild(
                typingIndicator
            );

        }


        function showTypingIndicator() {

            const conversation =
                conversations[
                    currentConversationId
                ];


            if (!conversation) {

                return;

            }


            if (!conversation.online) {

                hideTypingIndicator();

                return;

            }


            createTypingIndicator();


            const typingName =
                typingIndicator.querySelector(
                    ".typingIndicatorName"
                );


            typingName.textContent =
                conversation.name;


            typingIndicator.style.display =
                "flex";


            scrollToBottom();

        }


        function hideTypingIndicator() {

            if (typingIndicator) {

                typingIndicator.style.display =
                    "none";

            }


            if (typingTimeout) {

                clearTimeout(
                    typingTimeout
                );

                typingTimeout =
                    null;

            }

        }


        function handleTypingIndicator() {

            if (!messageInput.value.trim()) {

                hideTypingIndicator();

                return;

            }


            const conversation =
                conversations[
                    currentConversationId
                ];


            if (!conversation || !conversation.online) {

                hideTypingIndicator();

                return;

            }


            showTypingIndicator();


            if (typingTimeout) {

                clearTimeout(
                    typingTimeout
                );

            }


            typingTimeout =
                setTimeout(
                    function() {

                        hideTypingIndicator();

                    },
                    1500
                );

        }


        // =========================================
        // GET UNREAD COUNT
        // =========================================

        function getUnreadCount(
            conversationId
        ) {

            const conversation =
                conversations[
                    conversationId
                ];


            if (!conversation) {

                return 0;

            }


            return conversation.messages.filter(
                function(message) {

                    return (
                        message &&
                        message.type ===
                            "received" &&
                        message.seen !==
                            true
                    );

                }
            ).length;

        }


        // =========================================
        // MARK CONVERSATION AS SEEN
        // =========================================

        function markConversationAsSeen(
            conversationId
        ) {

            const conversation =
                conversations[
                    conversationId
                ];


            if (!conversation) {

                return;

            }


            let changed =
                false;


            conversation.messages.forEach(
                function(message) {

                    if (
                        message &&
                        message.type ===
                            "received" &&
                        message.seen !==
                            true
                    ) {

                        message.seen =
                            true;

                        changed =
                            true;

                    }

                }
            );


            if (changed) {

                saveConversations();

            }

        }


        // =========================================
        // GET CONVERSATION ITEMS
        // =========================================

        function getConversationItems() {

            return document.querySelectorAll(
                ".conversationItem"
            );

        }


        // =========================================
        // UPDATE ONLINE STATUS
        // =========================================

        function updateConversationStatus() {

            const conversation =
                conversations[
                    currentConversationId
                ];


            if (!conversation) {

                return;

            }


            conversationStatus.classList.remove(
                "onlineStatus",
                "offlineStatus"
            );


            if (conversation.online) {

                conversationStatus.textContent =
                    "● Online";


                conversationStatus.classList.add(
                    "onlineStatus"
                );

            } else {

                conversationStatus.textContent =
                    "Offline";


                conversationStatus.classList.add(
                    "offlineStatus"
                );

            }

        }


        // =========================================
        // RENDER CONVERSATION LIST
        // =========================================

        function renderConversationList() {

            conversationList.innerHTML =
                "";


            Object.keys(
                conversations
            ).forEach(
                function(conversationId) {

                    createConversationButton(
                        conversationId
                    );

                }
            );

        }


        // =========================================
        // RENDER CONVERSATION
        // =========================================

        function renderConversation(
            conversationId
        ) {

            const conversation =
                conversations[
                    conversationId
                ];


            if (!conversation) {

                return;

            }


            hideTypingIndicator();


            currentConversationId =
                conversationId;


            markConversationAsSeen(
                conversationId
            );


            conversationName.textContent =
                conversation.name;


            updateConversationStatus();


            messageArea.innerHTML =
                "";


            typingIndicator =
                null;


            const date =
                document.createElement(
                    "div"
                );


            date.className =
                "messageDate";


            date.textContent =
                conversationId ===
                "roleplayer-two"
                    ? "Yesterday"
                    : "Today";


            messageArea.appendChild(
                date
            );


            conversation.messages.forEach(
                function(messageData, index) {

                    addMessageToScreen(
                        messageData,
                        index
                    );

                }
            );


            scrollToBottom();

        }


        // =========================================
        // ADD MESSAGE TO SCREEN
        // =========================================

        function addMessageToScreen(
            messageData,
            messageIndex
        ) {

            const message =
                document.createElement(
                    "div"
                );


            message.className =
                "message " +
                messageData.type;


            const bubble =
                document.createElement(
                    "div"
                );


            bubble.className =
                "messageBubble";


            bubble.textContent =
                messageData.text;


            message.appendChild(
                bubble
            );


            const messageMeta =
                document.createElement(
                    "div"
                );


            messageMeta.className =
                "messageMeta";


            const messageTime =
                document.createElement(
                    "span"
                );


            messageTime.className =
                "messageTime";


            messageTime.textContent =
                messageData.time;


            messageMeta.appendChild(
                messageTime
            );


            if (
                messageData.type ===
                "sent"
            ) {

                const deliveryStatus =
                    document.createElement(
                        "span"
                    );


                deliveryStatus.className =
                    "messageDeliveryStatus";


                const status =
                    messageData.deliveryStatus ||
                    "sent";


                if (
                    status ===
                    "seen"
                ) {

                    deliveryStatus.textContent =
                        "✓✓ Seen";

                } else if (
                    status ===
                    "delivered"
                ) {

                    deliveryStatus.textContent =
                        "✓✓ Delivered";

                } else {

                    deliveryStatus.textContent =
                        "✓ Sent";

                }


                messageMeta.appendChild(
                    deliveryStatus
                );

            }


            message.appendChild(
                messageMeta
            );


            const messageActions =
                document.createElement(
                    "div"
                );


            messageActions.className =
                "messageActions";


            const reactionButton =
                document.createElement(
                    "button"
                );


            reactionButton.type =
                "button";


            reactionButton.className =
                "messageReactionButton";


            reactionButton.textContent =
                messageData.reaction ||
                "♡";


            reactionButton.title =
                messageData.reaction
                    ? "Remove reaction"
                    : "React with love";


            if (messageData.reaction) {

                reactionButton.style.background =
                    "#ffe4ec";

            }


            reactionButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    const conversation =
                        conversations[
                            currentConversationId
                        ];


                    if (!conversation) {

                        return;

                    }


                    const currentMessage =
                        conversation.messages[
                            messageIndex
                        ];


                    if (!currentMessage) {

                        return;

                    }


                    if (
                        currentMessage.reaction
                    ) {

                        currentMessage.reaction =
                            null;

                    } else {

                        currentMessage.reaction =
                            "❤️";

                    }


                    saveConversations();


                    renderConversation(
                        currentConversationId
                    );


                    renderConversationList();

                }
            );


            messageActions.appendChild(
                reactionButton
            );


            const optionsButton =
                document.createElement(
                    "button"
                );


            optionsButton.type =
                "button";


            optionsButton.className =
                "messageOptionsButton";


            optionsButton.textContent =
                "•••";


            optionsButton.title =
                "Message options";


            messageActions.appendChild(
                optionsButton
            );


            const optionsMenu =
                document.createElement(
                    "div"
                );


            optionsMenu.className =
                "messageOptionsMenu";


            const editOption =
                document.createElement(
                    "button"
                );


            editOption.type =
                "button";


            editOption.className =
                "messageOption";


            editOption.textContent =
                "Edit";


            editOption.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    optionsMenu.classList.remove(
                        "open"
                    );


                    startEditingMessage(
                        message,
                        messageData,
                        messageIndex
                    );

                }
            );


            optionsMenu.appendChild(
                editOption
            );


            const deleteOption =
                document.createElement(
                    "button"
                );


            deleteOption.type =
                "button";


            deleteOption.className =
                "messageOption deleteOption";


            deleteOption.textContent =
                "Delete";


            deleteOption.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    const confirmed =
                        confirm(
                            "Delete this message?"
                        );


                    if (!confirmed) {

                        return;

                    }


                    const conversation =
                        conversations[
                            currentConversationId
                        ];


                    if (!conversation) {

                        return;

                    }


                    conversation.messages.splice(
                        messageIndex,
                        1
                    );


                    saveConversations();


                    renderConversation(
                        currentConversationId
                    );


                    updateConversationPreview(
                        currentConversationId
                    );


                    renderConversationList();

                }
            );


            optionsMenu.appendChild(
                deleteOption
            );


            const forwardOption =
                document.createElement(
                    "button"
                );


            forwardOption.type =
                "button";


            forwardOption.className =
                "messageOption forwardOption";


            forwardOption.textContent =
                "Forward";


            forwardOption.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    optionsMenu.classList.remove(
                        "open"
                    );


                    openForwardModal(
                        messageData
                    );

                }
            );


            optionsMenu.appendChild(
                forwardOption
            );


            messageActions.appendChild(
                optionsMenu
            );


            optionsButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    document
                        .querySelectorAll(
                            ".messageOptionsMenu.open"
                        )
                        .forEach(
                            function(menu) {

                                if (
                                    menu !==
                                    optionsMenu
                                ) {

                                    menu.classList.remove(
                                        "open"
                                    );

                                }

                            }
                        );


                    optionsMenu.classList.toggle(
                        "open"
                    );

                }
            );


            message.appendChild(
                messageActions
            );


            messageArea.appendChild(
                message
            );

        }


        // =========================================
        // EDIT MESSAGE
        // =========================================

        function startEditingMessage(
            messageElement,
            messageData,
            messageIndex
        ) {

            const bubble =
                messageElement.querySelector(
                    ".messageBubble"
                );


            const messageMeta =
                messageElement.querySelector(
                    ".messageMeta"
                );


            const messageActions =
                messageElement.querySelector(
                    ".messageActions"
                );


            if (!bubble) {

                return;

            }


            const editArea =
                document.createElement(
                    "div"
                );


            editArea.className =
                "messageEditArea";


            const editTextarea =
                document.createElement(
                    "textarea"
                );


            editTextarea.className =
                "messageEditTextarea";


            editTextarea.value =
                messageData.text;


            editArea.appendChild(
                editTextarea
            );


            const editButtons =
                document.createElement(
                    "div"
                );


            editButtons.className =
                "messageEditButtons";


            const saveButton =
                document.createElement(
                    "button"
                );


            saveButton.type =
                "button";


            saveButton.className =
                "messageEditSave";


            saveButton.textContent =
                "Save";


            const cancelButton =
                document.createElement(
                    "button"
                );


            cancelButton.type =
                "button";


            cancelButton.className =
                "messageEditCancel";


            cancelButton.textContent =
                "Cancel";


            editButtons.appendChild(
                saveButton
            );


            editButtons.appendChild(
                cancelButton
            );


            editArea.appendChild(
                editButtons
            );


            bubble.replaceWith(
                editArea
            );


            if (messageMeta) {

                messageMeta.style.display =
                    "none";

            }


            if (messageActions) {

                messageActions.style.display =
                    "none";

            }


            editTextarea.focus();


            editTextarea.setSelectionRange(
                editTextarea.value.length,
                editTextarea.value.length
            );


            saveButton.addEventListener(
                "click",
                function() {

                    const newText =
                        editTextarea.value.trim();


                    if (!newText) {

                        return;

                    }


                    const conversation =
                        conversations[
                            currentConversationId
                        ];


                    if (!conversation) {

                        return;

                    }


                    const currentMessage =
                        conversation.messages[
                            messageIndex
                        ];


                    if (!currentMessage) {

                        return;

                    }


                    currentMessage.text =
                        newText;


                    saveConversations();


                    renderConversation(
                        currentConversationId
                    );


                    updateConversationPreview(
                        currentConversationId
                    );


                    renderConversationList();

                }
            );


            cancelButton.addEventListener(
                "click",
                function() {

                    renderConversation(
                        currentConversationId
                    );

                }
            );


            editTextarea.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key ===
                        "Escape"
                    ) {

                        renderConversation(
                            currentConversationId
                        );

                    }

                }
            );

        }


        // =========================================
        // FORWARD MODAL
        // =========================================

        function openForwardModal(
            messageData
        ) {

            const existingModal =
                document.querySelector(
                    ".forwardModalOverlay"
                );


            if (existingModal) {

                existingModal.remove();

            }


            const overlay =
                document.createElement(
                    "div"
                );


            overlay.className =
                "forwardModalOverlay";


            const modal =
                document.createElement(
                    "div"
                );


            modal.className =
                "forwardModal";


            const modalHeader =
                document.createElement(
                    "div"
                );


            modalHeader.className =
                "forwardModalHeader";


            const modalTitle =
                document.createElement(
                    "h3"
                );


            modalTitle.textContent =
                "Forward Message";


            const closeButton =
                document.createElement(
                    "button"
                );


            closeButton.type =
                "button";


            closeButton.className =
                "forwardModalClose";


            closeButton.textContent =
                "×";


            closeButton.addEventListener(
                "click",
                function() {

                    overlay.remove();

                }
            );


            modalHeader.appendChild(
                modalTitle
            );


            modalHeader.appendChild(
                closeButton
            );


            modal.appendChild(
                modalHeader
            );


            const preview =
                document.createElement(
                    "div"
                );


            preview.className =
                "forwardMessagePreview";


            preview.textContent =
                messageData.text;


            modal.appendChild(
                preview
            );


            const label =
                document.createElement(
                    "p"
                );


            label.className =
                "forwardModalLabel";


            label.textContent =
                "Choose a conversation";


            modal.appendChild(
                label
            );


            const targetList =
                document.createElement(
                    "div"
                );


            targetList.className =
                "forwardConversationList";


            let selectedConversationId =
                null;


            Object.keys(
                conversations
            ).forEach(
                function(conversationId) {

                    if (
                        conversationId ===
                        currentConversationId
                    ) {

                        return;

                    }


                    const conversation =
                        conversations[
                            conversationId
                        ];


                    const targetButton =
                        document.createElement(
                            "button"
                        );


                    targetButton.type =
                        "button";


                    targetButton.className =
                        "forwardConversationItem";


                    const avatar =
                        document.createElement(
                            "div"
                        );


                    avatar.className =
                        "forwardConversationAvatar";


                    avatar.textContent =
                        "👤";


                    const name =
                        document.createElement(
                            "span"
                        );


                    name.textContent =
                        conversation.name;


                    targetButton.appendChild(
                        avatar
                    );


                    targetButton.appendChild(
                        name
                    );


                    targetButton.addEventListener(
                        "click",
                        function() {

                            document
                                .querySelectorAll(
                                    ".forwardConversationItem.selected"
                                )
                                .forEach(
                                    function(item) {

                                        item.classList.remove(
                                            "selected"
                                        );

                                    }
                                );


                            targetButton.classList.add(
                                "selected"
                            );


                            selectedConversationId =
                                conversationId;


                            forwardButton.disabled =
                                false;

                        }
                    );


                    targetList.appendChild(
                        targetButton
                    );

                }
            );


            if (
                targetList.children.length ===
                0
            ) {

                const emptyMessage =
                    document.createElement(
                        "p"
                    );


                emptyMessage.className =
                    "forwardEmptyMessage";


                emptyMessage.textContent =
                    "You don't have another conversation yet.";


                targetList.appendChild(
                    emptyMessage
                );

            }


            modal.appendChild(
                targetList
            );


            const modalFooter =
                document.createElement(
                    "div"
                );


            modalFooter.className =
                "forwardModalFooter";


            const cancelButton =
                document.createElement(
                    "button"
                );


            cancelButton.type =
                "button";


            cancelButton.className =
                "forwardCancelButton";


            cancelButton.textContent =
                "Cancel";


            cancelButton.addEventListener(
                "click",
                function() {

                    overlay.remove();

                }
            );


            const forwardButton =
                document.createElement(
                    "button"
                );


            forwardButton.type =
                "button";


            forwardButton.className =
                "forwardConfirmButton";


            forwardButton.textContent =
                "Forward";


            forwardButton.disabled =
                true;


            forwardButton.addEventListener(
                "click",
                function() {

                    if (
                        !selectedConversationId
                    ) {

                        return;

                    }


                    forwardMessage(
                        messageData,
                        selectedConversationId
                    );


                    overlay.remove();

                }
            );


            modalFooter.appendChild(
                cancelButton
            );


            modalFooter.appendChild(
                forwardButton
            );


            modal.appendChild(
                modalFooter
            );


            overlay.appendChild(
                modal
            );


            document.body.appendChild(
                overlay
            );


            overlay.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        overlay
                    ) {

                        overlay.remove();

                    }

                }
            );

        }


        // =========================================
        // FORWARD MESSAGE
        // =========================================

        function forwardMessage(
            messageData,
            targetConversationId
        ) {

            const targetConversation =
                conversations[
                    targetConversationId
                ];


            if (!targetConversation) {

                return;

            }


            targetConversation.messages.push({

                type:
                    "sent",

                text:
                    messageData.text,

                time:
                    getCurrentTime(),

                reaction:
                    null,

                deliveryStatus:
                    "delivered"

            });


            saveConversations();


            updateConversationPreview(
                targetConversationId
            );


            renderConversationList();


            if (
                targetConversationId ===
                currentConversationId
            ) {

                renderConversation(
                    currentConversationId
                );

            }

        }


        // =========================================
        // CLOSE MESSAGE MENUS
        // =========================================

        document.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".messageOptionsMenu.open"
                    )
                    .forEach(
                        function(menu) {

                            menu.classList.remove(
                                "open"
                            );

                        }
                    );

            }
        );


        // =========================================
        // SCROLL TO BOTTOM
        // =========================================

        function scrollToBottom() {

            messageArea.scrollTop =
                messageArea.scrollHeight;

        }


        // =========================================
        // GET CURRENT TIME
        // =========================================

        function getCurrentTime() {

            const now =
                new Date();


            return now.toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

        }


        // =========================================
        // CREATE CONVERSATION BUTTON
        // =========================================

        function createConversationButton(
            conversationId
        ) {

            const conversation =
                conversations[
                    conversationId
                ];


            if (!conversation) {

                return;

            }


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "conversationItem";


            button.dataset.conversation =
                conversationId;


            if (
                conversationId ===
                currentConversationId
            ) {

                button.classList.add(
                    "active"
                );

            }


            const lastMessage =
                conversation.messages[
                    conversation.messages.length - 1
                ];


            const previewText =
                lastMessage
                    ? lastMessage.text
                    : "No messages yet.";


            const previewTime =
                lastMessage
                    ? lastMessage.time
                    : "";


            const unreadCount =
                getUnreadCount(
                    conversationId
                );


            if (unreadCount > 0) {

                button.classList.add(
                    "hasUnread"
                );

            }


            const avatar =
                document.createElement(
                    "div"
                );


            avatar.className =
                "conversationAvatar";


            avatar.innerHTML =
                "<span>👤</span>";


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "conversationInfo";


            const topRow =
                document.createElement(
                    "div"
                );


            topRow.className =
                "conversationTopRow";


            const name =
                document.createElement(
                    "strong"
                );


            name.textContent =
                conversation.name;


            const rightSide =
                document.createElement(
                    "div"
                );


            rightSide.className =
                "conversationRightSide";


            const time =
                document.createElement(
                    "span"
                );


            time.className =
                "conversationTime";


            time.textContent =
                previewTime;


            rightSide.appendChild(
                time
            );


            if (unreadCount > 0) {

                const unreadBadge =
                    document.createElement(
                        "span"
                    );


                unreadBadge.className =
                    "unreadBadge";


                unreadBadge.textContent =
                    unreadCount > 99
                        ? "99+"
                        : unreadCount;


                rightSide.appendChild(
                    unreadBadge
                );

            }


            topRow.appendChild(
                name
            );


            topRow.appendChild(
                rightSide
            );


            const preview =
                document.createElement(
                    "p"
                );


            preview.textContent =
                previewText;


            info.appendChild(
                topRow
            );


            info.appendChild(
                preview
            );


            button.appendChild(
                avatar
            );


            button.appendChild(
                info
            );


            button.addEventListener(
                "click",
                function() {

                    selectConversation(
                        button
                    );

                }
            );


            conversationList.appendChild(
                button
            );


            return button;

        }


        // =========================================
        // SELECT CONVERSATION
        // =========================================

        function selectConversation(
            item
        ) {

            const conversationId =
                item.dataset.conversation;


            if (!conversationId) {

                return;

            }


            hideTypingIndicator();


            getConversationItems().forEach(
                function(otherItem) {

                    otherItem.classList.remove(
                        "active"
                    );

                }
            );


            item.classList.add(
                "active"
            );


            renderConversation(
                conversationId
            );


            resetMessageInput();


            renderConversationList();

        }


        // =========================================
        // UPDATE CONVERSATION PREVIEW
        // =========================================

        function updateConversationPreview(
            conversationId
        ) {

            const conversation =
                conversations[
                    conversationId
                ];


            if (!conversation) {

                return;

            }


            const item =
                document.querySelector(
                    `.conversationItem[data-conversation="${conversationId}"]`
                );


            if (!item) {

                return;

            }


            const lastMessage =
                conversation.messages[
                    conversation.messages.length - 1
                ];


            const preview =
                item.querySelector(
                    ".conversationInfo p"
                );


            const time =
                item.querySelector(
                    ".conversationTime"
                );


            if (lastMessage) {

                if (preview) {

                    preview.textContent =
                        lastMessage.text;

                }


                if (time) {

                    time.textContent =
                        lastMessage.time;

                }

            } else {

                if (preview) {

                    preview.textContent =
                        "No messages yet.";

                }


                if (time) {

                    time.textContent =
                        "";

                }

            }


            const unreadCount =
                getUnreadCount(
                    conversationId
                );


            if (unreadCount > 0) {

                item.classList.add(
                    "hasUnread"
                );

            } else {

                item.classList.remove(
                    "hasUnread"
                );

            }

        }


        // =========================================
        // RESET MESSAGE INPUT
        // =========================================

        function resetMessageInput() {

            hideTypingIndicator();


            messageInput.value =
                "";


            messageInput.style.height =
                "auto";

        }


        // =========================================
        // AUTO GROW MESSAGE INPUT
        // =========================================

        function autoGrowMessageInput() {

            messageInput.style.height =
                "auto";


            const maxHeight =
                120;


            const newHeight =
                Math.min(
                    messageInput.scrollHeight,
                    maxHeight
                );


            messageInput.style.height =
                newHeight + "px";

        }


        // =========================================
        // SEND MESSAGE
        // =========================================

        function sendMessage() {

            const text =
                messageInput.value;


            if (!text.trim()) {

                return;

            }


            const conversation =
                conversations[
                    currentConversationId
                ];


            if (!conversation) {

                return;

            }


            hideTypingIndicator();


            const currentTime =
                getCurrentTime();


            conversation.messages.push({

                type:
                    "sent",

                text:
                    text,

                time:
                    currentTime,

                reaction:
                    null,

                deliveryStatus:
                    "delivered"

            });


            saveConversations();


            renderConversation(
                currentConversationId
            );


            resetMessageInput();


            updateConversationPreview(
                currentConversationId
            );


            renderConversationList();


            scrollToBottom();


            messageInput.focus();

        }


        // =========================================
        // DELETE CURRENT CONVERSATION
        // =========================================

        function deleteCurrentConversation() {

            const conversation =
                conversations[
                    currentConversationId
                ];


            if (!conversation) {

                return;

            }


            const confirmed =
                confirm(
                    `Delete your conversation with ${conversation.name}?`
                );


            if (!confirmed) {

                return;

            }


            hideTypingIndicator();


            delete conversations[
                currentConversationId
            ];


            saveConversations();


            const remainingIds =
                Object.keys(
                    conversations
                );


            if (
                remainingIds.length === 0
            ) {

                conversationName.textContent =
                    "No conversation";

                conversationStatus.textContent =
                    "Start a new conversation";

                messageArea.innerHTML =
                    "";

                resetMessageInput();

                renderConversationList();

                return;

            }


            currentConversationId =
                remainingIds[0];


            renderConversationList();


            const firstItem =
                document.querySelector(
                    `.conversationItem[data-conversation="${currentConversationId}"]`
                );


            getConversationItems().forEach(
                function(item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            if (firstItem) {

                firstItem.classList.add(
                    "active"
                );

            }


            renderConversation(
                currentConversationId
            );


            resetMessageInput();

        }


        // =========================================
        // SEND BUTTON
        // =========================================

        sendMessageButton.addEventListener(
            "click",
            function() {

                sendMessage();

            }
        );


        // =========================================
        // MESSAGE INPUT
        // =========================================

        messageInput.addEventListener(
            "input",
            function() {

                autoGrowMessageInput();

                handleTypingIndicator();

            }
        );


        // =========================================
        // ENTER TO SEND
        // SHIFT + ENTER = NEW LINE
        // =========================================

        messageInput.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );


        // =========================================
        // SEARCH CONVERSATIONS
        // =========================================

        searchInput.addEventListener(
            "input",
            function() {

                const searchValue =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                getConversationItems().forEach(
                    function(item) {

                        const name =
                            item
                                .querySelector(
                                    ".conversationTopRow strong"
                                )
                                ?.textContent
                                .toLowerCase() ||
                            "";


                        const preview =
                            item
                                .querySelector(
                                    ".conversationInfo p"
                                )
                                ?.textContent
                                .toLowerCase() ||
                            "";


                        const matches =
                            name.includes(
                                searchValue
                            ) ||
                            preview.includes(
                                searchValue
                            );


                        item.style.display =
                            matches
                                ? "flex"
                                : "none";

                    }
                );

            }
        );


        // =========================================
        // NEW MESSAGE
        // =========================================

        newMessageButton.addEventListener(
            "click",
            function() {

                const name =
                    prompt(
                        "Enter the roleplayer's name:"
                    );


                if (!name) {

                    return;

                }


                const trimmedName =
                    name.trim();


                if (!trimmedName) {

                    return;

                }


                const conversationId =
                    "conversation-" +
                    Date.now();


                conversations[
                    conversationId
                ] = {

                    name:
                        trimmedName,

                    status:
                        "New conversation",

                    online:
                        true,

                    messages: []

                };


                saveConversations();


                renderConversationList();


                const newItem =
                    document.querySelector(
                        `.conversationItem[data-conversation="${conversationId}"]`
                    );


                getConversationItems().forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                if (newItem) {

                    newItem.classList.add(
                        "active"
                    );

                }


                renderConversation(
                    conversationId
                );


                resetMessageInput();


                messageInput.focus();

            }
        );


        // =========================================
        // CONVERSATION OPTIONS
        // =========================================

        conversationOptionsButton.addEventListener(
            "click",
            function() {

                deleteCurrentConversation();

            }
        );


        // =========================================
        // INITIAL RENDER
        // =========================================

        renderConversationList();


        renderConversation(
            currentConversationId
        );


        autoGrowMessageInput();

    }
);