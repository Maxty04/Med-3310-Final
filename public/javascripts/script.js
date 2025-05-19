window.onload = function () {

    //Audio to play when opening on post
    const clickSound = document.getElementById('clickSound');
    function playClickSound() {
        if (clickSound) {
            clickSound.pause();
            clickSound.currentTime = 0;
            clickSound.play().catch((err) => console.log("Audio play failed:", err));
        } else {
            console.log("Audio element not found.");
        }
    }
    //Audio to close posts
    const closeSound = document.getElementById('closeSound');
    function playCloseSound() {
        if (closeSound) {
            closeSound.pause();
            closeSound.currentTime = 0;
            closeSound.play().catch((err) => console.log("Audio play failed:", err));
        } else {
            console.log("Audio element not found.");
        }
    }

    //Creating new posts
    const newPostForm = document.getElementById('new_post_form');
    newPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Submitting new post");

        const body = JSON.stringify({
            console: document.getElementById('console_field').value,
            title: document.getElementById('title_field').value,
            content: document.getElementById('content_field').value,
            createdAt: new Date(),
            //HARDCODED, change later for new authors
            authorId: '6827d5941b1e57f194f78002',
        });

        console.log(body);

        const response = await fetch("/posts", {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: body,
        });
        //Refreshes page so the user can see updates once this function runs.
        location.reload();
    });

    //Searching for posts
    const searchForm = document.getElementById('search_form');
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const searchField = document.getElementById('search_field');
        const value = searchField.value;
        console.log("Searching for:", value);

        //Using encodeURIComponent so there's no errors if a user manually types in console.
        const response = await fetch('/posts?search=' + encodeURIComponent(value));
        const posts = await response.json();

        //Clearing all existing posts
        const gameRack = document.querySelector('.gameRack');
        gameRack.innerHTML = '';

        posts.forEach(post => {
            const author = post.author?.[0]?.username || 'Unknown';
            const createdAt = new Date(post.createdAt).toLocaleString();

            const postCart = document.createElement('div');
            postCart.classList.add('post');
            postCart.dataset.id = post._id;

            postCart.innerHTML = `
                <h4>${post.console}</h4>
                <h5>${post.title}</h5>
                <p class="content" data-id="${post._id}" style="display:none;">
                    <span class="content_text">${post.content}</span>
                </p>
                <div class="post-footer">
                    <p>Posted on ${createdAt}</p>
                    <p class="author">By <b>${author}</b></p>
                </div>
            `;

            // Add click listener to each new post
            postCart.addEventListener('click', () => {
                playClickSound();
                showModal(postCart);
            });

            gameRack.appendChild(postCart);
        });
    });
    //Resets Search/Shows all posts
    const resetButton = document.getElementById('reset_search_btn');
    resetButton.addEventListener('click', async () => {
        //Clears selection
        document.getElementById('search_field').selectedIndex = 0;

        //Fetch all posts again
        const response = await fetch('/posts');
        const posts = await response.json();

        //Updates
        updatePosts(posts);
    });
    //Function for updating posts when clicking the All Posts button
    function updatePosts(posts) {
        const gameSection = document.querySelector('.gameRack');
        gameSection.innerHTML = ''; //Clears posts

        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post';
            div.dataset.id = post._id;

            div.innerHTML = `
                <h4>${post.console}</h4>
                <h5>${post.title}</h5>
                <p class="content" data-id="${post._id}" style="display:none;">
                    <span class="content_text">${post.content}</span>
                </p>
                <div class="post-footer">
                    <p>Posted on ${new Date(post.createdAt).toLocaleString()}</p>
                    <p class="author">By <b>${(post.author[0]?.username || 'Unknown')}</b></p>
                </div>
            `;

            //Once again making posts clickable
            div.addEventListener('click', () => {
                playClickSound();
                showModal(div);
            });

            gameSection.appendChild(div);
        });
    }

    // Modal elements for popup window
    const modal = document.getElementById('postModal');
    const modalContentWrapper = modal.querySelector('div');
    modalContentWrapper.style.textAlign = 'center';

    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalConsole = document.getElementById('modalConsole');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalDate = document.getElementById('modalDate');
    const modalAuthor = document.getElementById('modalAuthor');

    // Show modal function
    function showModal(postElement) {
        modalConsole.textContent = postElement.querySelector('h4').textContent;
        modalTitle.textContent = postElement.querySelector('h5').textContent;
        modalContent.textContent = postElement.querySelector('.content_text').textContent;
        const authorElement = postElement.querySelector('.author');
        modalAuthor.textContent = authorElement ? authorElement.textContent : '';

        modal.style.display = 'flex';
    }

    //Adding clickability to posts
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        post.addEventListener('click', () => {
            playClickSound();
            showModal(post);
        });

        // closes popup wndow
        modalCloseBtn.addEventListener('click', () => {
        playCloseSound();
        modal.style.display = 'none';
        });


        modal.addEventListener('click', (event) => {
        if (event.target === modal) {
        playCloseSound();
        modal.style.display = 'none';
        }
    });


    });
    
};
