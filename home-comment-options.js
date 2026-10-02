// =========================================
// HOME COMMENT OPTIONS
// =========================================

function initializeCommentOptions() {

    document
        .querySelectorAll(".homeComment")
        .forEach(function(comment) {

            addCommentOptions(comment);

        });

}


// =========================================
// ADD OPTIONS MENU
// =========================================

function addCommentOptions(comment) {

    if (!comment) {

        return;

    }


    // Don't add it twice
    if (
        comment.querySelector(
            ".homeCommentOptions"
        )
    ) {

        return;

    }


    const existingActions =
        comment.querySelector(
            ".homeCommentActions"
        );


    // Only comments with Edit/Delete
    // should receive the options menu
    if (!existingActions) {

        return;

    }


    // =====================================
    // OPTIONS CONTAINER
    // =====================================

    const optionsContainer =
        document.createElement("div");


    optionsContainer.className =
        "homeCommentOptions";


    // =====================================
    // THREE-DOT BUTTON
    // =====================================

    const optionsButton =
        document.createElement("button");


    optionsButton.type =
        "button";


    optionsButton.className =
        "homeCommentOptionsButton";


    optionsButton.setAttribute(
        "aria-label",
        "Comment options"
    );


    optionsButton.setAttribute(
        "title",
        "Comment options"
    );


    optionsButton.textContent =
        "•••";


    // =====================================
    // MENU
    // =====================================

    const menu =
        document.createElement("div");


    menu.className =
        "homeCommentOptionsMenu";


    menu.style.display =
        "none";


    // =====================================
    // EDIT BUTTON
    // =====================================

    const editButton =
        document.createElement("button");


    editButton.type =
        "button";


    editButton.className =
        "homeCommentOption";


    editButton.dataset.action =
        "edit";


    editButton.textContent =
        "Edit";


    // =====================================
    // DELETE BUTTON
    // =====================================

    const deleteButton =
        document.createElement("button");


    deleteButton.type =
        "button";


    deleteButton.className =
        "homeCommentOption";


    deleteButton.dataset.action =
        "delete";


    deleteButton.textContent =
        "Delete";


    // =====================================
    // BUILD MENU
    // =====================================

    menu.appendChild(
        editButton
    );


    menu.appendChild(
        deleteButton
    );


    optionsContainer.appendChild(
        optionsButton
    );


    optionsContainer.appendChild(
        menu
    );


    // =====================================
    // HIDE OLD VISIBLE ACTIONS
    // =====================================

    existingActions.style.display =
        "none";


    // =====================================
    // FIND COMMENT ACTION ROW
    // =====================================

    const combinedActions =
        comment.querySelector(
            ".homeCommentCombinedActions"
        );


    // =====================================
    // PLACE THREE-DOT BUTTON
    // =====================================

    if (combinedActions) {

        combinedActions.appendChild(
            optionsContainer
        );

    } else {

        comment.appendChild(
            optionsContainer
        );

    }

}


// =========================================
// THREE-DOT BUTTON
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".homeCommentOptionsButton"
            );


        if (!button) {

            return;

        }


        const container =
            button.closest(
                ".homeCommentOptions"
            );


        if (!container) {

            return;

        }


        const menu =
            container.querySelector(
                ".homeCommentOptionsMenu"
            );


        if (!menu) {

            return;

        }


        // Close all other menus
        document
            .querySelectorAll(
                ".homeCommentOptionsMenu"
            )
            .forEach(
                function(otherMenu) {

                    if (
                        otherMenu !== menu
                    ) {

                        otherMenu.style.display =
                            "none";

                    }

                }
            );


        const isHidden =
            window.getComputedStyle(
                menu
            ).display ===
            "none";


        if (isHidden) {

            menu.style.display =
                "flex";

        } else {

            menu.style.display =
                "none";

        }

    }
);


// =========================================
// EDIT / DELETE MENU ACTIONS
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const option =
            event.target.closest(
                ".homeCommentOption"
            );


        if (!option) {

            return;

        }


        const comment =
            option.closest(
                ".homeComment"
            );


        if (!comment) {

            return;

        }


        const action =
            option.dataset.action;


        const oldActions =
            comment.querySelector(
                ".homeCommentActions"
            );


        if (!oldActions) {

            return;

        }


        // =====================================
        // EDIT
        // =====================================

        if (
            action ===
            "edit"
        ) {

            const editButton =
                oldActions.querySelector(
                    '[data-action="edit"]'
                );


            if (editButton) {

                editButton.click();

            }

        }


        // =====================================
        // DELETE
        // =====================================

        if (
            action ===
            "delete"
        ) {

            const deleteButton =
                oldActions.querySelector(
                    '[data-action="delete"]'
                );


            if (deleteButton) {

                deleteButton.click();

            }

        }


        // Close menu
        const menu =
            option.closest(
                ".homeCommentOptionsMenu"
            );


        if (menu) {

            menu.style.display =
                "none";

        }

    }
);


// =========================================
// CLOSE MENU OUTSIDE
// =========================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                ".homeCommentOptions"
            )
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".homeCommentOptionsMenu"
            )
            .forEach(
                function(menu) {

                    menu.style.display =
                        "none";

                }
            );

    }
);


// =========================================
// WATCH FOR NEW COMMENTS
// =========================================

const commentOptionsObserver =
    new MutationObserver(
        function(mutations) {

            mutations.forEach(
                function(mutation) {

                    mutation.addedNodes.forEach(
                        function(node) {

                            if (
                                node.nodeType !==
                                Node.ELEMENT_NODE
                            ) {

                                return;

                            }


                            if (
                                node.classList &&
                                node.classList.contains(
                                    "homeComment"
                                )
                            ) {

                                addCommentOptions(
                                    node
                                );

                            }


                            if (
                                node.querySelectorAll
                            ) {

                                const newComments =
                                    node.querySelectorAll(
                                        ".homeComment"
                                    );


                                newComments.forEach(
                                    function(comment) {

                                        addCommentOptions(
                                            comment
                                        );

                                    }
                                );

                            }

                        }
                    );

                }
            );

        }
    );


commentOptionsObserver.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);


// =========================================
// INITIALIZE
// =========================================

initializeCommentOptions();