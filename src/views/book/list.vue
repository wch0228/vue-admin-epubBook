<template>
  <div class="app-container">
    <el-input
      v-model="listQuery.title"
      placeholder="书名"
      style="width: 200px"
      class="filter-item"
      clearable
      @keyup.enter.native="handleFilter"
      @clear="handleFilter"
      @blur="handleFilter"
    />
    <el-input
      v-model="listQuery.author"
      placeholder="作者"
      style="width: 200px"
      class="filter-item"
      clearable
      @keyup.enter.native="handleFilter"
      @clear="handleFilter"
      @blur="handleFilter"
    />
    <el-select
      v-model="listQuery.category"
      placeholder="分类"
      clearable
      class="filter-item"
      @change="handleFilter"
    >
      <el-option
        v-for="item in categoryList"
        :key="item.value"
        :label="item.label + '(' + item.num + ')'"
        :value="item.label"
      />
    </el-select>
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="handleFilter"
    >
      查询
    </el-button>
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-edit"
      style="margin-left: 5px"
      @click="handleCreate"
    >
      新增
    </el-button>
    <el-checkbox
      v-model="showCover"
      class="filter-item"
      style="margin-left: 5px"
      @change="changeShowCover"
    >
      显示封面
    </el-checkbox>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      empty-text="暂无数据"
      border
      fit
      highlight-current-row
      style="margin-top: 15px"
      :default-sort="defaultSor"
      @sort-change="sortChange"
    >
      <!-- sort-change当表格的排序条件发生变化的时候会触发该事件 -->
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column label="书名" width="150" align="center">
        <template slot-scope="{ row: { titleWrapper } }">
          <span v-html="titleWrapper"></span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150" align="center">
        <template slot-scope="{ row: { authorWrapper } }">
          <span v-html="authorWrapper"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="出版社"
        prop="publisher"
        width="150"
        align="center"
      />
      <el-table-column
        label="分类"
        prop="categoryText"
        width="100"
        align="center"
      />
      <el-table-column label="语言" prop="language" align="center" />
      <el-table-column v-if="showCover" label="封面" width="150" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.cover" target="_blank">
            <img :src="scope.row.cover" style="width: 120px; height: 180px" />
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="文件名"
        prop="fileName"
        width="100"
        align="center"
      />
      <el-table-column
        label="文件路径"
        prop="filePath"
        width="100"
        align="center"
      >
        <!-- 获取路径，如果没有使用过滤器定义路径 -->
        <template slot-scope="{ row: { filePath } }">
          <span>{{ filePath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="封面路径"
        prop="coverPath"
        width="100"
        align="center"
      >
        <!-- 获取路径，如果没有使用过滤器定义路径 -->
        <template slot-scope="{ row: { coverPath } }">
          <span>{{ coverPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="解压路径"
        prop="unzipPath"
        width="100"
        align="center"
      >
        <!-- 获取路径，如果没有使用过滤器定义路径 -->
        <template slot-scope="{ row: { unzipPath } }">
          <span>{{ unzipPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上传人"
        prop="createUser"
        width="100"
        align="center"
      >
        <!-- 获取路径，如果没有使用过滤器定义路径 -->
        <template slot-scope="{ row: { createUser } }">
          <span>{{ createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        prop="createDt"
        width="100"
        align="center"
      >
        <!-- 获取路径，如果没有使用过滤器定义路径,上传时间是时间戳，需要转 -->
        <template slot-scope="{ row: { createDt } }">
          <span>{{ createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          />
          <el-button
            type="text"
            icon="el-icon-delete"
            style="color: #f56c6c"
            @click="handleDelete(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- page为当前页数，limit为每页显示的条目个数 pagination为当page、limit发生改变触发-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />
  </div>
</template>

<script>
import Pagination from '../../components/Pagination'
import waves from '../../directive/waves'
import { getCategory, listBook, deleteBook } from '../../api/book'
import { parseTime } from '../../utils/index'
export default {
  components: { Pagination },
  // 引入框架中的指令，注册指令并使用指令（v-waves）
  directives: { waves },
  // 过滤器
  filters: {
    valueFilter(value) {
      return value || '无'
    },
    // parseTime为框架内置时间戳处理方法
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}') : '无'
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      listQuery: {},
      showCover: false,
      categoryList: [],
      list: [],
      total: 0,
      defaultSor: {}
    }
  },
  created() {
    this.parseQuery()
  },
  // 页面加载好操作
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      const newQuery = Object.assign({}, to.query)
      const oldQuery = Object.assign({}, from.query)
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        this.getList()
      }
    }
    next()
  },
  methods: {
    parseQuery() {
      const query = Object.assign({}, this.$route.query)
      let sort = '+id'
      const listQuery = {
        page: 1,
        pageSize: 20,
        sort
        // 默认生序排序sort
      }
      if (query) {
        query.page && (query.page = +query.page)
        query.pageSize && (query.pageSize = +query.pageSize)
        query.sort && (sort = query.sort)
      }
      // 判断升序还是降序
      const sortSymbol = sort[0]
      const sortColumn = sort.slice(1, sort.length)
      // console.log(sortSymbol, sortColumn)
      this.defaultSor = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'
      }
      // 把query,listQuery注入到this.listQuery中
      this.listQuery = { ...listQuery, ...query }
    },
    wrapperKeyword(k, v) {
      function highlight(value) {
        return `<span style="color:#1890ff">${value}</span>`
      }
      if (!this.listQuery[k]) {
        return v
      } else {
        // 正则'ig'i表示不区分大小写，g表示gobal全局
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
      }
    },
    getList() {
      this.listLoading = true
      listBook(this.listQuery).then(response => {
        const { list, count } = response.data
        this.list = list
        this.total = count
        // console.log(this.list)
        this.listLoading = false
        // 搜索关键字高亮
        this.list.forEach(book => {
          book.titleWrapper = this.wrapperKeyword('title', book.title)
          book.authorWrapper = this.wrapperKeyword('author', book.author)
        })
      })
    },
    // api/book.js新建getCategory接口
    getCategoryList() {
      getCategory().then(response => {
        this.categoryList = response.data
        // console.log(this.categoryList)
      })
    },
    refresh() {
      this.$router.push({
        path: '/book/list',
        query: this.listQuery
      })
    },
    handleFilter() {
      // console.log('handleFiter', this.listQuery)
      this.listQuery.page = 1
      this.refresh()
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    handleUpdate(row) {
      // console.log(row)
      this.$router.push(`/book/edit/${row.fileName}`)
    },
    handleDelete(row) {
      // console.log(row)
      this.$confirm('此操作将永久删除改电子书，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBook(row.fileName).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    changeShowCover(value) {
      this.showCover = value
      // console.log(this.showCover)
    },
    // 排序功能
    sortChange(data) {
      // console.log('sortChange', data)
      const { prop, order } = data
      this.sortBy(prop, order)
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    }
  }
}
</script>

