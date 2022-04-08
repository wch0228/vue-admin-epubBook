<template>
  <el-form
    ref="postForm"
    :model="postForm"
    class="form-container"
    :rules="rules"
  >
    <sticky :class-name="'sub-navbar'">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <!-- <el-button
        :loading="loading"
        type="success"
        style="margin-left=10px"
        @click="submitForm"
        >{{ isEdit ? "编辑电子书" : "新增电子书" }}
      </el-button> -->
      <el-button
        v-loading="loading"
        style="margin-left: 10px"
        type="success"
        @click="submitForm"
      >
        {{ isEdit ? "编辑电子书" : "新增电子书" }}
      </el-button>
    </sticky>
    <div class="datail-container">
      <el-row>
        <!-- 注意事项 -->
        <warning />
        <el-col :span="24">
          <!-- 上传表单控件具体样式 -->
          <ebook-upload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item style="margin-bottom: 40px" prop="title">
            <mdinput
              v-model="postForm.title"
              :maxlength="100"
              name="name"
              required
            >
              书名
            </mdinput>
          </el-form-item>
          <!-- 作者、出版社 -->
          <el-row>
            <el-col :span="12" class="form-item-author">
              <el-form-item
                :label-width="labelWidth"
                prop="author"
                label="作者："
              >
                <el-input
                  v-model="postForm.author"
                  placeholder="作者"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label-width="labelWidth"
                prop="publisher"
                label="出版社："
              >
                <el-input
                  v-model="postForm.publisher"
                  placeholder="出版社"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 语言、根文件 -->
          <el-row>
            <el-col :span="12" class="form-item-author">
              <el-form-item
                :label-width="labelWidth"
                prop="language"
                label="语言："
              >
                <el-input
                  v-model="postForm.language"
                  placeholder="语言"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label-width="labelWidth"
                prop="rootFile"
                label="根文件："
              >
                <el-input
                  v-model="postForm.rootFile"
                  placeholder="根文件"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 文件路径、解压路径 -->
          <el-row>
            <el-col :span="12" class="form-item-author">
              <el-form-item
                :label-width="labelWidth"
                prop="filePath"
                label="文件路径："
              >
                <el-input
                  v-model="postForm.filePath"
                  placeholder="文件路径"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label-width="labelWidth"
                prop="unzipPath"
                label="解压路径："
              >
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="解压路径"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 封面路径、文件名称 -->
          <el-row>
            <el-col :span="12" class="form-item-author">
              <el-form-item
                :label-width="labelWidth"
                prop="coverPath"
                label="封面路径："
              >
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路径"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label-width="labelWidth"
                prop="originalName"
                label="文件名称："
              >
                <el-input
                  v-model="postForm.originalName"
                  placeholder="文件名称"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 封面、目录 -->
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="封面："
                :label-width="labelWidth"
                prop="cover"
              >
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img" />
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="目录：" :label-width="labelWidth">
                <div
                  v-if="
                    postForm.contentsTree && postForm.contentsTree.length > 0
                  "
                  class="contents-wrapper"
                >
                  <el-tree :data="contentsTree" @node-click="onContentClick" />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import sticky from '../../../components/Sticky'
import warning from './Warning.vue'
import ebookUpload from '../../../components/EbookUpload'
import mdinput from '../../../components/MDinput/index.vue'
import { createBook, getBook, updateBook } from '../../../api/book'

// 字段映射
const fields = {
  title: '书名',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}
export default {
  // 父传子组件使用驼峰命名，在html需要用横杆（-）代替
  // 解释https://www.jianshu.com/p/4e4409fa1ded
  components: { mdinput, sticky, warning, ebookUpload },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      // console.log(rule, value)
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + '必须填写'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {},
      fileList: [],
      labelWidth: '120px',
      driver: [],
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const fileName = this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  methods: {
    getBookData(fileName) {
      getBook(fileName).then(response => {
        this.setData(response.data)
      })
    },
    // 绑定事件
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        originalName,
        url,
        contents,
        contentsTree,
        fileName,
        coverPath,
        filePath,
        unzipPath
      } = data
      this.postForm = {
        // 浅拷贝
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        originalName,
        url,
        contents,
        contentsTree,
        fileName,
        coverPath,
        filePath,
        unzipPath
      }
      this.contentsTree = contentsTree
      this.fileList = [{ name: originalName || fileName, url }]
    },
    onUploadSuccess(data) {
      // 获取子组件传过来的data数字赋给新的事件
      // console.log('onUploadSuccess', data)
      this.setData(data)
    },
    onUploadRemove() {
      this.setDefault()
    },
    setDefault() {
      this.contentsTree = []
      this.fileList = []
      this.$refs.postForm.resetFields()
    },
    submitForm() {
      const onSuccess = (response) => {
        const { msg } = response
        this.$notify({
          title: '操作成功',
          message: msg,
          type: 'success',
          duration: 2000
        })
        this.loading = false
        this.$router.push({ path: '/book/list' })
      }

      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => {
          // console.log(valid, fields)
          if (valid) {
            // 拷贝postForm到book
            const book = Object.assign({}, this.postForm)
            // 删除无用的book列表内容
            // delete book.contents
            delete book.contentsTree
            // 在api/book.js创建两接口
            if (!this.isEdit) {
              createBook(book).then(response => {
                onSuccess(response)
                this.setDefault()
              }).catch(() => {
                this.loading = false
              })
            } else {
              updateBook(book).then(response => {
                onSuccess(response)
                // console.log(response)
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    },
    showGuide() {
      console.log('showGuide...')
    },
    onContentClick(data) {
      if (data.text) {
        window.open(data.text)
      }
    }
  }
}
</script>

<style scoped>
.datail-container {
  padding: 40px 50px 20px;
}
.preview-img {
  width: 200px;
  height: 270px;
}
</style>

