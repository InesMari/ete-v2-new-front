export default {
  name: 'lazySelect',
  props: {
    // v-model 绑定值
    value: {
      type: [String, Number],
      default: ''
    },
    // 所有供应商数据
    data: {
      type: Array,
      default: () => []
    },
    // 选项的标签字段名
    labelKey: {
      type: String,
      default: 'name'
    },
    // 选项的值字段名
    valueKey: {
      type: String,
      default: 'id'
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 下拉框的自定义类名
    popperClass: {
      type: String,
      default: 'lazy-select-dropdown'
    },
    // 每页显示数量
    pageSize: {
      type: Number,
      default: 50
    },
    // 加载函数（可选，用于远程加载）
    loadFn: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      showData: [],
      loading: false,
      searchTimer: null,
      page: 1,
      totalLoaded: 0,
      dropdownVisible: false,
      processedData: [], // 预处理后的数据（value 已提取到第一个位置）
      uniqueClass: '', // 为每个组件生成唯一的类名
      isSearching: false // 是否正在搜索
    }
  },
  mounted() {
    // 生成唯一的类名
    this.uniqueClass = `lazy-select-dropdown-${Math.random().toString(36).substr(2, 9)}`;
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.processData();
          this.initData();
        }
      },
      immediate: true
    },
    value: {
      handler(newVal) {
        if (newVal !== undefined && newVal !== null && newVal !== '') {
          this.$nextTick(() => {
            this.processData();
            this.initData();
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    // 预处理数据：将 value 对应的数据提取到第一个位置
    processData() {
      if (!this.data || this.data.length === 0) {
        this.processedData = [];
        return;
      }

      const currentValue = this.value;
      if (currentValue === undefined || currentValue === null || currentValue === '') {
        this.processedData = [...this.data];
        return;
      }

      // 查找 value 对应的数据索引
      const valueIndex = this.data.findIndex(item => item[this.valueKey] === currentValue);

      if (valueIndex === -1) {
        // 没有找到，直接复制
        this.processedData = [...this.data];
        return;
      }

      // 找到了，提取到第一个位置
      const valueItem = this.data[valueIndex];
      const remainingData = [...this.data];
      remainingData.splice(valueIndex, 1);
      this.processedData = [valueItem, ...remainingData];
    },
    // 初始化数据
    initData() {
      this.page = 1;
      this.totalLoaded = 0;
      this.loadMore(false, '');
    },
    // 加载更多数据
    loadMore(isSearch, keyword) {
      let sourceData = this.processedData;

      // 如果是搜索模式，先过滤数据
      if (isSearch && keyword) {
        sourceData = this.processedData.filter(item =>
          item[this.labelKey] && item[this.labelKey].toLowerCase().includes(keyword.toLowerCase())
        );
      }

      // 如果没有数据，清空 showData
      if (sourceData.length === 0) {
        this.showData = [];
        return;
      }

      // 对数据进行分页
      const start = this.totalLoaded;
      const end = start + this.pageSize;
      const newData = sourceData.slice(start, end);

      if (newData.length > 0) {
        if (this.page === 1) {
          this.showData = newData;
        } else {
          this.showData = [...this.showData, ...newData];
        }
        this.totalLoaded = end;
        this.page++;
      }
    },
    // 远程搜索
    remoteSearchLazy(query) {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      this.searchTimer = setTimeout(() => {
        this.page = 1;
        this.totalLoaded = 0;
        this.isSearching = !!query && query.trim() !== '';

        if (!query || query.trim() === '') {
          this.loadMore(false, '');
        } else {
          this.loadMore(true, query);
        }
      }, 300);
    },
    // 聚焦
    handleFocus() {
      if (this.processedData.length > 0) {
        this.page = 1;
        this.totalLoaded = 0;
        this.loadMore(false, '');
      }
    },
    // 下拉框显示/隐藏
    handleVisibleChange(visible) {
      this.dropdownVisible = visible;

      if (visible) {
        // 下拉框打开时，绑定滚动事件
        this.$nextTick(() => {
          setTimeout(() => {
            // 使用唯一类名找到对应的下拉框
            const dropdown = document.querySelector(`.${this.uniqueClass} .el-select-dropdown__wrap`);
            if (dropdown) {
              dropdown.addEventListener('scroll', this.handleScroll);
            }
          }, 100);
        });
      } else {
        // 下拉框关闭时，移除滚动事件
        const dropdown = document.querySelector(`.${this.uniqueClass} .el-select-dropdown__wrap`);
        if (dropdown) {
          dropdown.removeEventListener('scroll', this.handleScroll);
        }
      }
    },
    // 滚动加载更多
    handleScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      // 滚动到距离底部50px时加载更多
      if (scrollHeight - scrollTop - clientHeight < 50) {
        if (!this.loading && this.totalLoaded < this.processedData.length) {
          this.loading = true;
          setTimeout(() => {
            const select = this.$refs.lazySelect;
            if (select) {
              const query = select.query || '';
              this.loadMore(!!query, query);
            }
            this.loading = false;
          }, 100);
        }
      }
    },
    // 值变化
    handleChange(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    }
  }
}
