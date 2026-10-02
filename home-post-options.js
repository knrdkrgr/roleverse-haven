// =========================================
// HOME POST OPTIONS
// =========================================

function setupHomePostOptions(post) {

    if (!post) {
        return;
    }

    if (post.querySelector(".homePostOptions")) {
        return;
    }

    const editButton =
        post.querySelector(".homeEditButton");

    const deleteButton =
        post.querySelector(".homeDeleteButton");

    if (!editButton && !deleteButton) {
        return;
    }

    // Hide the original Edit/Delete buttons
    if (editButton) {
        editButton.style.display = "none";
    }

    if (deleteButton) {
        deleteButton.style.display = "none";
    }

    // =====================================
    // OPTIONS WRAPPER
    // =====================================

    const options =
        document.createElement("div");

    options.className =
        "homePostOptions";

    // =====================================
    // THREE DOT BUTTON
    // =====================================

    const optionsButton =
        document.createElement("button");

    optionsButton.type = "button";

    optionsButton.className =
        "homePostOptionsButton";

    optionsButton.textContent =
        "•••";

    optionsButton.setAttribute(
        "aria-label",
        "Post options"
    );

    // =====================================
    // OPTIONS MENU
    // =====================================

    const menu =
        document.createElement("div");

    menu.className =
        "homePostOptionsMenu";

    menu.style.display = "none";

    // =====================================
    // EDIT
    // =====================================

    if (editButton) {

        const editOption =
            document.createElement("button");

        editOption.type = "button";

        editOption.className =
            "homePostOption";

        editOption.dataset.action =
            "edit";

        editOption.textContent =
            "Edit";

        editOption.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                menu.style.display = "none";

                editButton.click();

            }
        );

        menu.appendChild(
            editOption
        );
    }

    // =====================================
    // DELETE
    // =====================================

    if (deleteButton) {

        const deleteOption =
            document.createElement("button");

        deleteOption.type = "button";

        deleteOption.className =
            "homePostOption";

        deleteOption.dataset.action =
            "delete";

        deleteOption.textContent =
            "Delete";

        deleteOption.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                menu.style.display = "none";

                deleteButton.click();

            }
        );

        menu.appendChild(
            deleteOption
        );
    }

    // =====================================
    // BUILD
    // =====================================

    options.appendChild(
        optionsButton
    );

    options.appendChild(
        menu
    );

    // =====================================
    // PUT ••• AT FAR RIGHT OF HEADER
    // =====================================

    const postHeader =
        post.querySelector(".homePostHeader");

    if (postHeader) {

        postHeader.appendChild(
            options
        );

    }

    // =====================================
    // TOGGLE MENU
    // =====================================

    optionsButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            document
                .querySelectorAll(
                    ".homePostOptionsMenu"
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
                ).display === "none";

            menu.style.display =
                isHidden
                    ? "flex"
                    : "none";

        }
    );
}


// =========================================
// CLOSE MENUS WHEN CLICKING OUTSIDE
// =========================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.closest(
                ".homePostOptions"
            )
        ) {
            return;
        }

        document
            .querySelectorAll(
                ".homePostOptionsMenu"
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
// INITIALIZE EXISTING POSTS
// =========================================

function initializeHomePostOptions() {

    document
        .querySelectorAll(".homePost")
        .forEach(
            function(post) {

                setupHomePostOptions(
                    post
                );

            }
        );

}


// =========================================
// WATCH FOR NEW POSTS
// =========================================

const homePostOptionsObserver =
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
                                    "homePost"
                                )
                            ) {

                                setupHomePostOptions(
                                    node
                                );

                            }

                            if (
                                node.querySelectorAll
                            ) {

                                node
                                    .querySelectorAll(
                                        ".homePost"
                                    )
                                    .forEach(
                                        function(post) {

                                            setupHomePostOptions(
                                                post
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

homePostOptionsObserver.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);


// =========================================
// START
// =========================================

initializeHomePostOptions();