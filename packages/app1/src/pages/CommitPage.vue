<template>
  <div class="q-pa-md">
    <q-uploader
      url="http://localhost:9001/upload"
      label="Custom header"
      multiple 
    >
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
            <q-tooltip>Clear All</q-tooltip>
          </q-btn>
          <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles"  round dense flat >
            <q-tooltip>Remove Uploaded Files</q-tooltip>
          </q-btn>
          <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
          <div class="col">
            <div class="q-uploader__title">Upload your files</div>
            <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
          </div>
          <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
            <q-uploader-add-trigger />
            <q-tooltip>Pick Files</q-tooltip>
          </q-btn>
          <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
            <q-tooltip>Upload Files</q-tooltip>
          </q-btn>

          <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
            <q-tooltip>Abort Upload</q-tooltip>
          </q-btn>
        </div>
      </template>
    </q-uploader>
  </div>

  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="name" 
        label="提交名称"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '请输入作品名称']"
      />

      <div>
        <div>选择本次提交的tag: {{ tag }}</div>
        <div>
          <input type="checkbox" id="tag0" value="作业" v-model="tag">
          <label for="jack">作业</label>

          <input type="checkbox" id="tag1" value="学术论文" v-model="tag">
          <label for="john">学术论文</label>

          <input type="checkbox" id="tag2" value="作业小论文" v-model="tag">
          <label for="mike">作业小论文</label>

          <input type="checkbox" id="tag3" value="报告" v-model="tag">
          <label for="mike">报告</label>
        </div>
      </div>
      <q-editor
        v-model="note"
        :toolbar="[
          ['bold', 'italic', 'strike', 'underline'],
        ]"
        ref="editorRef"
      />
      <!-- 用这段代码获取editorRef内容 -->
      <!-- const textContent = editorRef.value.getContentEl().innerText; -->

      <q-toggle v-model="accept" label="我接受使用此作业/论文发布平台的使用协议" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>

    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import axios from 'axios';
import SparkMD5 from "spark-md5";
import commit from '../model/commit';
import { user } from 'stores/user_logined.js';

const current_user = new user();

export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      $q: useQuasar(),
      progressText: '0%',
      accept: false,
      note: "",
      data: null,
      name: "请填写作品名称",
      tag: [],
      md5: "****",
    }
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件处理器绑定
  methods: {
    compute_md5: function (event) {
      var _this = this;
      var fileReader = new FileReader();
      var spark = new SparkMD5.ArrayBuffer();
      console.log(event.target.files[0]);

      console.log(11);
      // 获取文件二进制数据
      for (var i = 0; i < event.target.files.length; i++) {
        fileReader.readAsArrayBuffer(event.target.files[i]);
        fileReader.onload = function (e) {
          spark.append(e.target.result);
          var md5 = spark.end();
          _this.md5 = md5;
        };
      }
    },
    // 生成一个Id编号
    generateId(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    onSubmit() {
      alert("信息已上传");
      let baseurl = 'http://127.0.1:9001/';
      let cm = new commit(this.generateId(1, 1000), this.md5, current_user.public, current_user.user_name, this.name, this.note, this.tag);
      let update_commit = JSON.stringify(cm).toString();
      axios({
        method: 'post',//请求方法
        data: update_commit,
        url: baseurl + "submit",
      }).then(res => {
        console.log('请求成功,发送数据：');
        console.log(update_commit);
        console.log(res.data);
      }).catch((error) => {
        console.log('请求失败：');
        console.log(error);
      });
    }
  },
}
</script>
