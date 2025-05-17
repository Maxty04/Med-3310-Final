window.onload = function () {
    //Edit button code
    const editButtons = document.querySelectorAll('.edit_content_button');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // 1. Get parent element
            const parentElement =event.currentTarget.parentElement;
            // console.log(parentElement.querySelector('.content_text').innerText);
            const text = (parentElement.querySelector('.content_text').innerText);

            // 2. convert the <p> into an <input>
            const inputElement = document.createElement('input');
            inputElement.value = text;
            
            //Creates field to input change to text
            parentElement.appendChild(inputElement);
            //Allows the changes to be saved
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';

            const id = parentElement.getAttribute('data-id');
            // console.log(id);
            saveButton.addEventListener('click', async () => {
                const body = JSON.stringify({
                    content: inputElement.value,
                })
                const response = await fetch("/posts/" + id, {
                    method: "PUT",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: body,
                });
            })
            parentElement.appendChild(saveButton);
        })
    })

    //Delete button code
    const deleteButtons = document.querySelectorAll('.delete_button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const response = await fetch("/posts/" + id, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
            });

            //Refreshes page so the user can see updates once this function runs.
            location.reload();
        })
    })

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
        })

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
    })

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
    })
};