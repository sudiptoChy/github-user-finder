function fetchData () {
    var userName = document.getElementById('searchedUser').value;
    if (userName.length) {
        showLoading();
    }
    var userUrl = 'https://api.github.com/users/'+userName+'?client_id=c6da00d981c651149a61&client_secret=931fb20f5355cb26fa29c77c36c783c38707be96';
    var repoUrl = 'https://api.github.com/users/'+userName+
        '/repos?client_id=c6da00d981c651149a61&client_secret=931fb20f5355cb26fa29c77c36c783c38707be96&sort=created_at&per_page=5';

    const http = new XMLHttpRequest();
    http.open('GET', userUrl);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            var user = JSON.parse(http.responseText);
            generateUserView(user);

            // Sending another request to get the repositories of that user.
            http.open('GET', repoUrl);
            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    var repos = JSON.parse(http.responseText);
                    if (repos.length) {
                        generateReposView(repos);
                    } else {
                        showNotFoundDialog("repository", "No Repository found for this user!");
                    }
                }
            };
            http.send();
        }
        else if (http.readyState == 4 && http.status != 200) {
            showNotFoundDialog("user", "Wrong username or No User Found!");
        }
    };
    http.send();
}


function generateUserView (user) {
    var profile = document.getElementById('profile');
    profile.innerHTML = `<div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title">${user.name}</h3>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        <img src="${user.avatar_url}" alt="github profile image" class="thumbnail avatar">
                                        <a target="_blank" class="btn btn-primary btn-block" href="${user.html_url}">View Profile</a>
                                    </div>
                                    <div class="col-md-9">
                                        <span class="label label-default">Public Repos: ${user.public_repos}</span>
                                        <span class="label label-primary">Public Gists: ${user.public_gists}</span>
                                        <span class="label label-success">Followers: ${user.followers}</span>
                                        <span class="label label-info">Following: ${user.following}</span>
                                        <br><br>
                                        <ul class="list-group">
                                            <li class="list-group-item">Company: ${user.company}</li>
                                            <li class="list-group-item">Website/Blog: ${user.blog}</li>
                                            <li class="list-group-item">Location: ${user.location}</li>
                                            <li class="list-group-item">Member Since: ${user.created_at}</li>
                                        </ul>
                                    </div>
                                </div>
                                <h3 class="page-header">Latest Repositories</h3>
                                <div id="repos"></div>
                            </div>
                            `;
    removeLoading();
}

function generateReposView (repos) {
    var repoView = document.getElementById('repos');
    var html = '';

    repos.forEach(function (item, index) {
        html += `
            <div class="well">
                <div class="row">
                    <div class="col-md-6">
                        <strong>${item.name}</strong> ${item.description}
                    </div>
                    <div class="col-md-3">
                        <span class="label label-default">Forks: ${item.forks_count}</span>
                        <span class="label label-primary">Watchers: ${item.watchers_count}</span>
                        <span class="label label-success">Stars: ${item.stargazers_count}</span>
                    </div>
                    <div class="col-md-3">
                        <a href="${item.html_url}" target="_blank" class="btn btn-sm btn-default">View</a>
                        <input type="text" value="${item.clone_url}" id="${item.clone_url}" class="clone-url">
                        <button type="button" class="btn btn-sm btn-primary" onclick="copyText('${item.clone_url}')" title="copy to clipboard">Clone</button>
                        <a href="${item.html_url+'/archive/master.zip'}" class="btn btn-sm btn-success">Download</a>
                    </div>
                </div>
            </div>
        `;
    });
    repoView.innerHTML = html;
}

function copyText (id) {
    document.getElementById(id).select();
    document.execCommand("copy");
    alert('Copied to clipboard!');
}

function showNotFoundDialog (type, message) {
    removeLoading();
    var html = '';
    if (type == "user") {
        html = document.getElementById('profile');
        html.innerHTML = '';
    } else {
        html = document.getElementById('repos');
    }
    html.innerHTML = `
            <div class="alert alert-warning">
              <strong>Sorry! </strong> ${message}
            </div>
    `;
}

function showLoading () {
    var html = document.getElementById('loading');
    html.classList.remove('hide');
    console.log('showing loading')
}

function removeLoading () {
    setTimeout(function () {
        var html = document.getElementById('loading');
        html.setAttribute('class', 'hide');
    }, 2000);
}