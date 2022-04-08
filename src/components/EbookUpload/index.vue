<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/epub+zip"
      class="image-upload"
    >
      <i class="el-icon-upload"> </i>
      <div v-if="fileList.length === 0" class="el-upload__text">
        请将电子书拖入<em>点击上传</em>
      </div>
      <div v-else class="el-upload__text">图片已上传</div>
    </el-upload>
    <!--drag是支持拖拽文件，accept="application/epub+zip"是支持的文件，不支持文件就隐藏>-->
  </div>
</template>

<script>
import { getToken } from '../../utils/auth'
export default {
  // filelist与disabled去父组件拿,定义好类型
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },
  computed: {
    headers() {
      return {
        //   获取cookies里的token
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  methods: {
    beforeUpload(file) {
      this.$emit('beforeUpload', file)
    },
    // 给上传组件添加四种方法（el-upload自带的方法）
    onSuccess(response, file) {
      const { code, msg, data } = response
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.$emit('onSuccess', data)
      } else {
        this.$message({
          message: (msg && `上传失败，失败原因:${msg}`) || '上传失败',
          type: 'error'
        })
        this.$emit('onError', file)
      }
    },
    onError(err) {
      const errMsg = err.message && JSON.parse(err.message)
      this.$message({
        message: (errMsg && errMsg.msg && `上传失败，失败原因: ${errMsg.msg}`) || '上传失败',
        type: 'error'
      })
      this.$emit('onError', err)
    },
    onRemove() {
      this.$message({
        message: '电子书删除成功',
        type: 'success'
      })
      this.$emit('onRemove')
    },
    onExceed() {
      this.$message({
        message: '每次只能上传一本电子书',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
