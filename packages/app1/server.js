const http = require('http');
const url = require('url');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 9001;

// GET方法用到的读取函数
function get_one_user_commits(user_name) {
    let path = '..\\..\\rpaper_data\\users\\' + user_name + '\\commits_index.json';
    let result = fs.readFileSync(path).toString();
    return JSON.parse(result);
}

function get_commits(user_name) {
    let users_list = [];
    if (user_name == "all_commits") {
        let users_list_path = '..\\..\\rpaper_data\\users\\user_list.json';
        users_list = fs.readFileSync(users_list_path).toString();
        users_list = JSON.parse(users_list).users_list;
    }
    else {
        let user = {
            "user_name": user_name
        }
        users_list.push(user);
        console.log(users_list[0]);
    }
    let all_commits = [];
    for (let i = 0; i < users_list.length; i++) {
        let user_commits = get_one_user_commits(users_list[i].user_name);
        for (let j = 0; j < user_commits.commits_data.length; j++) {
            all_commits.push(user_commits.commits_data[j]);
        }
    }
    return JSON.stringify(all_commits).toString();
}

// POST 方法用到的写入的函数
function insert_one_commits(commit_data) {
    let origin_commit_data = get_one_user_commits(commit_data.committer)
    let path = '..\\..\\rpaper_data\\users\\' + commit_data.committer + '\\commits_index.json';
    origin_commit_data.commits_data.push(commit_data);
    fs.writeFileSync(path, JSON.stringify(origin_commit_data));   
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    //告诉浏览器支持这些方式,这个是实现跨域访问资源的设置
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT')
    res.setHeader('Content-Type', 'text/plain');

    if (req.method == 'POST') {
        let data = []
        req.on('data', chunk => {
            data.push(chunk)  // 将接收到的数据暂时保存起来
        })
        req.on('end', () => {
            let commit_data = JSON.parse(data);
            insert_one_commits(commit_data)
            res.write(JSON.stringify(commit_data))
            res.write("数据成功写入");
            res.end();
        })
    }
    else if (req.method == 'GET') {
        var params = url.parse(req.url, true).query;
        res.write(get_commits(params.user_name));
        res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
