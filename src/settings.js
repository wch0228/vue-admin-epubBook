module.exports = {
  title: '小慕读书',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   * 控制右侧控制面版是否显示
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   * 是否显示tagsView(面包屑)
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   * 是否在侧边栏中显示徽标
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
