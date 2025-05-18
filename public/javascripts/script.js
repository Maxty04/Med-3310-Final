window.onload = function () {

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

    //Searching for terms in posts
    const searchForm = document.getElementById('search_form');
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const searchField = document.getElementById('search_field');
        const value = searchField.value;
        console.log(value);

        const response = await fetch('/posts?search=' + value);
        const posts = await response.json();
        // Clear posts.
        // Use JS to to create new post elements with json.
    });

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

//adds clickability to posts
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {

        post.addEventListener('click', () => {
    playClickSound();
    showModal(post);
});

    // closes popup wndow
    modalCloseBtn.addEventListener('click', () => {
    playClickSound();
    modal.style.display = 'none';
});

    modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        playClickSound();
        modal.style.display = 'none';
    }
});

});
    
};
