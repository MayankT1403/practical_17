document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    
    // Fetch the GitHub profile data
    fetchGitHubProfile(username);
});

function fetchGitHubProfile(username) {
    const apiUrl = `https://api.github.com/users/${username}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            displayProfileInfo(data);
            fetchGitHubRepos(username);
            fetchGitHubFollowers(username);
        })
        .catch(error => {
            document.getElementById('profile-info').innerHTML = `<p>${error.message}</p>`;
        });
}

function fetchGitHubRepos(username) {
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayRepositories(data);
        });
}

function fetchGitHubFollowers(username) {
    const apiUrl = `https://api.github.com/users/${username}/followers`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayFollowers(data);
        });
}

function displayProfileInfo(data) {
    const profileInfoDiv = document.getElementById('profile-info');
    
    const profileHTML = `
        <div class="profile">
            <img src="${data.avatar_url}" alt="${data.name}'s Avatar">
            <div>
                <h2>${data.name || 'N/A'} (${data.login})</h2>
                <p>Followers: ${data.followers}</p>
                <p>Public Repositories: ${data.public_repos}</p>
                <p>Location: ${data.location || 'N/A'}</p>
                <p>Company: ${data.company || 'N/A'}</p>
            </div>
        </div>
        <div class="repositories" id="repositories">
            <h3>Repositories:</h3>
        </div>
        <div class="followers" id="followers">
            <h3>Followers:</h3>
        </div>
    `;
    
    profileInfoDiv.innerHTML = profileHTML;
}

function displayRepositories(repos) {
    const reposDiv = document.getElementById('repositories');
    reposDiv.innerHTML += repos.map(repo => `
        <p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>
    `).join('');
}

function displayFollowers(followers) {
    const followersDiv = document.getElementById('followers');
    followersDiv.innerHTML += followers.map(follower => `
        <p><a href="${follower.html_url}" target="_blank">
            <img src="${follower.avatar_url}" alt="${follower.login}" width="50" height="50">
            ${follower.login}
        </a></p>
    `).join('');
}
