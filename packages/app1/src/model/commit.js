// const fs = require('fs');

export default class commit {
	constructor(id, data, public_key, committer, commit_name, note, tag) {
        // 注意这里的name是提交的名字，不是用户名，用户名直接通过私钥识别？
		this.id = id
		this.committer = committer
        this.name = commit_name
        var d = new Date();
		this.time = d.getTime()
		this.tag = tag
		this.public_key= public_key
		this.data = data
		this.note = note
        // this.data_hash = hash.update(data).digest('hex');
        // this.time_hash = hash.update(time).digest('hex');
        // this.committer_hash = hash.update(committer).digest('hex');
        // this.all_hash = hash.update(all_hash).digest('hex');
	}

}
