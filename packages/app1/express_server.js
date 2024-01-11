const 
    url = require('url');
    crypto = require('crypto'),
    express = require('express'),
    app = express(),
    formidable = require('formidable'), // 这个需要安装pnpm install formidable
    path = require('path'),
    fs = require('fs'),
    throttle = require('express-throttle-bandwidth')// 这个需要安装pnpm install express-throttle-bandwidth

const
    port = process.env.PORT || 9001,
    folder = path.join(__dirname, 'data')

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
}

app.set('port', port)
app.use(throttle(1024 * 128)) // throttling bandwidth

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/get_commits*', (req, res) => {
    var params = url.parse(req.url, true).query;
    res.write(get_commits(params.user_name));
    res.end();
})

app.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm({multiples: true, keepExtensions: true, uploadDir: folder, maxFieldsSize: 20 * 1024 * 1024})
    //解析客户端传过来的FormData对象
    form.parse(req, (_, fields, files) => {
        console.log('\n-----------')
        console.log('Received:', Object.keys(files))
        res.end() // 这个不能删除，是给前端发送完毕的信号，不然前面传完了但缺会一直转
    })
})

app.post('/submit', (req, res)=> {
    let files = getAllFiles(folder);
    let md5s = [];
    for (let file of files) {
        console.log(getFileMd5(file))
        md5s.push(getFileMd5(file));
    }
    console.log(md5s);
    let data_md5 = add_md5(md5s);
    let data = [];
    req.on('data', chunk => {
        data.push(chunk)  // 将接收到的数据暂时保存起来
    })
    req.on('end', () => {
        let commit_data = JSON.parse(data);
        commit_data.data = data_md5;
        insert_one_commits(commit_data)
        res.write(JSON.stringify(commit_data))
        res.write("数据成功写入");
        res.end();
    })
})


app.listen(port, () => {
    console.log('\nUpload server running on http://localhost:' + port)
})

// 计算所有文件MD5值的函数

function getAllFiles(filePath) {
    let allFilePaths = [];
    if (fs.existsSync(filePath)) {
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            let file = files[i]; // 文件名称（不包含文件路径）
            let currentFilePath = filePath + '\\' + file;
            let stats = fs.lstatSync(currentFilePath);
            if (stats.isDirectory()) {
                allFilePaths = allFilePaths.concat(getAllFiles(currentFilePath));
            } else {
               allFilePaths.push(currentFilePath);
            }
        }
    } else {
        console.warn(`指定的目录${filePath}不存在！`);
    }

    return allFilePaths;
}

function getFileMd5(path) {
    const stream = fs.createReadStream(path);
    const hash = crypto.createHash('md5');
    stream.on('data', chunk => {
        hash.update(chunk, 'utf8');
    });
    stream.on('end', () => {
        const md5 = hash.digest('hex');
        console.log("single")
        return md5;
    });
}

function add_md5(md5s){
    const hash = crypto.createHash('md5');
    for(let md5 of md5s) {
        hash.update(md5, 'utf8');
    }
    return hash.digest('hex');
}

// 提交信息的辅助函数
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

function insert_one_commits(commit_data) {
    let origin_commit_data = get_one_user_commits(commit_data.committer)
    let path = '..\\..\\rpaper_data\\users\\' + commit_data.committer + '\\commits_index.json';
    origin_commit_data.commits_data.push(commit_data);
    fs.writeFileSync(path, JSON.stringify(origin_commit_data));   
}